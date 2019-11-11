---
layout: post
title:  "Python3 Django（八）模版详解"
date:  2019-10-21
desc: "python3 服务器开发系列之 Django 开发实战（八）：Django 模版详细介绍"
keywords: "Python3,后台开发,实战,django,MVC,ORM"
categories: [Python]
tags: [python3,后台开发,django]
---
# Django - 模版

Django 中的模版是属于 html 界面的封装，在基本的 html 界面的基础上添加了一些独有的语法和使用方式。本节就让我们来仔细了解一下 Django 中的模版。

## 一、模版定义

Django 中定义了一套自己的模版语言，称为 Django 模版语言（DTL）。DTL规定了如下的语法格式：

- 变量：{{变量}}
- 标签：{% 代码块 %}
- 过滤器：{{变量|过滤器}}
- 注释：{##}

接下来分别介绍：

### 1.变量

Django 中的变量就是从视图中传递过来的上下文字典中的键。Django 会通过该键来查找上下文中的对应的值，然后将值显示到 html 语言中。

变量的使用方式如下所示：

```html

{{ variable }}
```

除了直接输出变量的值，Django还支持使用 . 来进行多级查询

比如：

```html
{{foo.bar}}
```

其在 Django 引擎执行时的查询路径如下：

- 将 foo 作为字典进行查询查询，例如：foo["bar"]
- 将 foo 作为对象，查找对象的属性或方法，例如：foo.bar，注意方法不支持传递参数
- 将 foo 作为列表或者元祖，进行索引查询，例如：foo[bar]
- 都查询不到时，显示空字符串

### 2.标签

模版中的标签用来执行一段代码，格式为：

```py
{% 代码块 %}
```

主要的作用是：

- 在输出中创建文本
- 控制循环或逻辑
- 加载外部信息到模板中供以后的变量使用

#### for标签

for 循环负责处理循环逻辑，基本格式如下：

```py
{ %for ... in ...%}
{ %endfor%}
```

其中在 for 循环中除了可以进行变量的控制，还可以对当前的循环进行一些相应的处理：

- 获取当前的循环次数

```py
{{ forloop.counter }}
```

- 给出的列表为或列表不存在时，执行此处

```py
{ %empty%}
```

#### if标签

if标签用来对逻辑进行判断，基本格式如下：

```py
{ %if ...%}
# 逻辑1
{ %elif ...%}
# 逻辑2
{ %else%}
# 逻辑3
{ %endif%}
```

#### comment标签

comment标签用来在代码中书写注释信息

```py
{ % comment % }
# 多行注释
{ % endcomment % }
```

#### include标签

include标签负责加载模板并以标签内的参数渲染

```py
{ %include "foo/bar.html" % }
```

#### url标签

url：反向解析

```py
{ % url 'name' p1 p2 %}
```

#### csrf_token标签

csrf_token：这个标签用于跨站请求伪造保护

```py
{ % csrf_token %}
```

#### 其余标签

- 布尔标签：and、or，and比or的优先级高
- block、extends：模板继承
- autoescape：HTML转义

### 过滤器

过滤器用来对变量执行相应的高级操作，语法格式为：

```py
{ { 变量|过滤器 }}
```

过滤器使用管道符号 (|) 来使用过滤器，通过使用过滤器可以来改变变量的计算结果

例如

- { { name|lower }}：表示将变量name的值变为小写输出

同时也可以在if标签中使用过滤器结合运算符

```py
if list1|length > 1
```

并且过滤器能够被“串联”，构成过滤器链

```py
name|lower|upper
```

过滤器也可以传递参数，参数使用引号包起来

```py
list|join:", "
```

一些其他的过滤器：

- default：如果一个变量没有被提供，或者值为false或空，则使用默认值，否则使用变量的值

```py
value|default:"什么也没有"
```

- date：根据给定格式对一个date变量格式化

```py
value|date:'Y-m-d'
```

### 注释

单行注释

```py
{#...#}
```

注释可以包含任何模版代码，有效的或者无效的都可以

```py
{# { % if foo % }bar{ % else % } #}
```

而使用 comment 标签可以注释模版中的多行内容

## 二、模版继承

## 三、HTML转义

## 四、CSRF

## 五、总结
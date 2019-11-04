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

## 二、模版继承

## 三、HTML转义

## 四、CSRF

## 五、总结
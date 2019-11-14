---
layout: post
title:  "Python3 Django（八）模版详解"
date:  2019-11-13
desc: "python3 服务器开发系列之 Django 开发实战（八）：Django 模版详细介绍"
keywords: "Python3,后台开发,实战,django,MVC,ORM"
categories: [Python]
tags: [python3,后台开发,django]
---
# Django - 模版

Django 中的模版是属于 html 界面的封装，在基本的 html 界面的基础上添加了一些独有的语法和使用方式。本节就让我们来仔细了解一下 Django 中的模版。

## 一、模版定义

Django 中定义了一套自己的模版语言，称为 Django 模版语言（DTL）。DTL规定了如下的语法格式：

- 变量
- 标签
- 过滤器
- 注释

接下来分别介绍每个语法格式。

### 1.变量

Django 中的变量就是从视图中传递过来的上下文字典中的键。Django 会通过该键来查找上下文中的对应的值，然后将值显示到 html 语言中。

变量的使用方式如下所示：

![2](/assets/images/2019/2019-11/4.jpg)

除了直接输出变量的值，Django还支持使用 **.** （点）来进行多级查询

比如：

![2](/assets/images/2019/2019-11/5.jpg)

其在 Django 引擎执行时的查询路径如下：

- 将 foo 作为字典进行查询查询，例如：foo["bar"]
- 将 foo 作为对象，查找对象的属性或方法，例如：foo.bar，注意方法不支持传递参数
- 将 foo 作为列表或者元祖，进行索引查询，例如：foo[bar]
- 以上都查询不到时，显示空字符串

### 2.标签

模版中的标签用来执行一段代码，格式为：

![2](/assets/images/2019/2019-11/2.jpg)

主要的作用是：

- 在输出中创建文本
- 控制循环或逻辑
- 加载外部信息到模板中供以后的变量使用

#### for标签

for 循环负责处理循环逻辑，基本格式如下：

![2](/assets/images/2019/2019-11/6.jpg)

其中在 for 循环中除了可以进行变量的控制，还可以对当前的循环进行一些相应的处理：

- 获取当前的循环次数

![2](/assets/images/2019/2019-11/7.jpg)

- 给出的列表为或列表不存在时，执行此处

![2](/assets/images/2019/2019-11/8.jpg)

#### if标签

if标签用来对逻辑进行判断，基本格式如下：

![2](/assets/images/2019/2019-11/9.jpg)

#### comment标签

comment标签用来在代码中书写注释信息

![2](/assets/images/2019/2019-11/10.jpg)

#### include标签

include标签负责加载模板并以标签内的参数渲染

![2](/assets/images/2019/2019-11/11.jpg)

#### url标签

url：反向解析，用于配合 url 中的 name 使用

![2](/assets/images/2019/2019-11/12.jpg)

#### csrf_token标签

csrf_token：这个标签用于跨站请求伪造保护

![2](/assets/images/2019/2019-11/3.jpg)

#### 其余标签

- 布尔标签：and、or，and比or的优先级高
- block、extends：模板继承
- autoescape：HTML转义

### 过滤器

过滤器用来对变量执行相应的高级操作，语法格式为：

![2](/assets/images/2019/2019-11/13.jpg)

过滤器使用管道符号 (|) 来使用过滤器，通过使用过滤器可以来改变变量的计算结果

同时也可以在if标签中使用过滤器结合运算符

![2](/assets/images/2019/2019-11/14.jpg)

并且过滤器能够被“串联”，构成过滤器链

![2](/assets/images/2019/2019-11/15.jpg)

过滤器也可以传递参数，参数使用引号包起来

![2](/assets/images/2019/2019-11/16.jpg)

一些其他的过滤器：

- default：如果一个变量没有被提供，或者值为false或空，则使用默认值，否则使用变量的值

![2](/assets/images/2019/2019-11/17.jpg)

- date：根据给定格式对一个date变量格式化

![2](/assets/images/2019/2019-11/18.jpg)

### 注释

单行注释

![2](/assets/images/2019/2019-11/19.jpg)

注释可以包含任何模版代码，有效的或者无效的都可以


而使用 comment 标签可以注释模版中的多行内容

## 二、模版继承

Django 中支持对模版文件的重用，也就是**模版继承**。

对于常见的网站来说，有大量的页面内容是相同。而在创建这些页面的时候便可以考虑将这些重复的文件定义到一个页面中，在其他页面中金金包好这个页面，并对页面中个性化的部分进行重新更改即可，这也就是模版继承。

Django 提供了 block 标签来在页面中实现模版继承操作。通过在父类模版中创建一个 block 标签，然后在子类模版中更新 block 标签中的内容。

而模版之间的继承是通过 extends 标签实现的。

具体的实现步骤如下：

1.定义父类模版 base.html

![2](/assets/images/2019/2019-11/20.jpg)

2.在子类中继承父类模版

![2](/assets/images/2019/2019-11/21.jpg)

3.在子类模版中定义 block 中的内容

![2](/assets/images/2019/2019-11/22.jpg)

### 注意事项

- 如果在模版中使用 extends 标签，它必须是模版中的第一个标签
- 不能在一个模版中定义多个相同名字的 block 标签
- 子模版不必定义全部父模版中的 blocks，如果子模版没有定义block，则使用了父模版中的默认值
- 如果发现在模板中大量的复制内容，那就应该把内容移动到父模板中
- 为了更好的可读性，可以给 endblock 标签起一个名字

## 三、HTML转义

在 Django 的模版中显示一些 js 脚本获取 html 代码的时候会直接按照原本的语言样式进行显示，而不会执行相应的语言，这是因为 Django 会对模版中的变量或者代码块**自动进行转义**。

比如在视图中返回如下的内容到模版中去：

```py
def index(request):
    return render(request, 'temtest/index2.html',
                  {
                      't1': '<h1>hello</h1>'
                  })
```

而在模版中显示 t1 的内容：

![2](/assets/images/2019/2019-11/23.jpg)

则在浏览器页面中显示的结果如下：

```
<h1>hello</h1>
```

这就是 Django 中的自动转义，这样所带来的好处就是保证了一些含有侵入式的危险代码不会破坏系统。

### 会被自动转义的字符

只有如下的字符是会被 Django 自动转义的：

- html转义，就是将包含的html标签输出，而不被解释执行，原因是当显示用户提交字符串时，可能包含一些攻击性的代码，如js脚本

- < 会转换为 \&lt;

- \> 会转换为 \&gt;

- ' (单引号) 会转换为 \&#39;

- " (双引号)会转换为 \&quot;

- & 会转换为 \&amp;

### 关闭转义

当然，也有一些时候我们需要关闭转义，而将一些 html 的语法进行渲染，也就是在一些在线文本编辑的网页中需要看到当前所编辑文本的样式。在 Django 中可以通过如下的方式来实现这样的效果：

- 对于变量使用safe过滤器

![2](/assets/images/2019/2019-11/24.jpg)

- 对于代码块使用 autoescape 标签（标签 autoescape 接受 on 或者 off 参数）

![2](/assets/images/2019/2019-11/25.jpg)

自动转义标签在 base 模板中关闭，在 child 模板中也是关闭的

## 四、CSRF

CSRF 全称为：Cross Site Request Forgery 即跨站请求伪造。也就是：某些恶意网站上包含链接、表单按钮或者JavaScript，它们会利用登录过的用户在浏览器中的认证信息试图在你的网站上完成某些操作，这就是跨站攻击。

Django 中默认启用了防止 CSRF 的中间件：

```py
'django.middleware.csrf.CsrfViewMiddleware'
```

使用的时候只需要在需要进行 CSRF 保护的页面模版中的表单中加入 csrf_token 标签即可。这样，通过当前页面源码在其他地方进行数据提交便会被拦截住。

![2](/assets/images/2019/2019-11/26.jpg)

而如果某些视图不需要保护，则可以在视图上使用装饰器 csrf_exempt，模板中也不需要写标签：

```py
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def csrf2(request):
    uname=request.POST['uname']
    return render(request,'booktest/csrf2.html',{'uname':uname})
```

### 实现原理

查看在启用 CSRF 之后的页面表单源代码，发现多了如下代码：

```html
<input type='hidden' name='csrfmiddlewaretoken' value='nGjAB3Md9ZSb4NmG1sXDolPmh3bR2g59' />
```

通过对请求进行抓包可以发现页面在浏览器中创建了一个名为 csrftoken 的 cookie：

![csrftoken](/assets/images/2019/2019-11/1.png)

当提交请求时，中间件 'django.middleware.csrf.CsrfViewMiddleware' 会对提交的 cookie及隐藏域的内容进行验证，如果失败则返回403错误

但是这种方式并不能防止手动在请求 form 中添加一个 hidden 来伪造 cookie ，所以说 Django 自带的 CSRF 效果并不好。可以考虑使用验证码等高级的 CSRF 防护方法，比如验证码等。
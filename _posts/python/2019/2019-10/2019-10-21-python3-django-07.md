---
layout: post
title:  "Python3 Django（七）视图详解"
date:  2019-10-21
desc: "python3 服务器开发系列之 Django 开发实战（六）：Django 视图详细介绍"
keywords: "Python3,后台开发,实战,django,MVC,ORM"
categories: [Python]
tags: [python3,后台开发,django]
---
# Django - 视图

Django 中的视图是专门用来处理用户的请求并返回响应。

Django 处理请求的过程：

1. 当用户请求页面时，Django 首先使用根 URLconf 模块。这是由项目中的 ROOT_URLCONF 设置的值，但如果传入 HttpRequest 对象具有 urlconf 属性（由中间件设置），则将使用其值代替 ROOT_URLCONF 设置。
2. Django 加载 Python 模块并查找变量 urlpatterns。这应该是一个序列的 django.urls.path()和/或django.urls.re_path()实例。
3. Django 按顺序遍历每个 URL 模式，并在匹配请求的 URL 的第一个模式停止。
4. 一旦其中一个 URL 模式匹配，Django 就会导入并调用给定的视图，这是一个简单的 Python 函数（或基于类的视图）。视图传递以下参数：
    - 一个 HttpRequest 对象。
    - 如果匹配的 URL 模式未返回任何命名组，则正则表达式中的匹配将作为位置参数提供。
    - 关键字参数由路径表达式匹配的任何命名部分组成，或者由 kwargs 参数中指定的任何参数覆盖。django.urls.path()django.urls.re_path()
5. 如果没有URL模式匹配，或者在此过程中的任何点期间引发异常，Django 将调用适当的错误处理视图。

接下来分别从以下几个方面来研究视图内容。

## 一、URLconf

Django 项目是通过项目中的 settings.py 中的 ROOT_URLCONF 来指定项目中根级 url 的配置路径。在该路径下配置项目中对所有从客户端发来的 url 所做的处理。

### 示例

URLconf 文件默认位于项目跟路径下 urls.py 文件中，一个简单的 urls.py 文件内容如下：

```python
"""
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('articles/2003/', views.special_case_2003),
    path('articles/<int:year>/', views.year_archive),
    path('articles/<int:year>/<int:month>/', views.month_archive),
    path('articles/<int:year>/<int:month>/<slug:slug>/', views.article_detail),
]
```
其中：

- urlpatterns 是一个 path() 实例的列表
- path()对象包括：
    - url字段
    - 视图函数
    - 名称name

编写 URLconf 时注意：

- 要从 URL 捕获传递过来的参数的值，需要使用尖括号。
- 捕获的值可以选择转换器类型。例如，用于 <int:name> 捕获整数参数。如果未包含转换器/，则匹配除字符之外的任何字符串。
- 没有必要添加前导斜杠，因为每个URL都有。例如，articles 不是 /articles。
- 每个应用单独设置自己的 urlpattern，并不写在主路径下。
- url地址中所有的元素都是字符串类型的。

示例请求：

- 请求 /articles/2005/03/ 与列表中的第三个条目匹配。Django 会调用该函数。views.month_archive(request, year=2005, month=3)
- /articles/2003/ 将匹配列表中的第一个模式，而不是第二个模式，因为模式是按顺序测试的，第一个是第一个要通过的测试。随意利用订单插入这样的特殊情况。在这里，Django 会调用该函数 views.special_case_2003(request)
- /articles/2003 不匹配任何这些模式，因为每个模式都要求URL以斜杠结尾。
- /articles/2003/03/building-a-django-site/ 将匹配最终模式。Django会调用该函数 。views.article_detail(request, year=2003, month=3, slug="building-a-django-site")

### 路径转换器

默认情况下，以下路径转换器可用：

- str：匹配除路径分隔符之外的任何非空字符串'/'。如果转换器未包含在表达式中，则这是默认值。
- int：匹配零或任何正整数。返回一个 int。
- slug：匹配由 ASCII 字母或数字组成的任何 slug 字符串，以及连字符和下划线字符。例如， building-your-1st-django-site。
- uuid：匹配格式化的 UUID。要防止多个 URL 映射到同一页面，必须包含短划线，并且字母必须为小写。例如，075194d3-6885-417e-a8a8-6c931e272f00。返回一个 UUID 实例。
- path：匹配任何非空字符串，包括路径分隔符 '/'。这允许您匹配完整的URL路径，而不仅仅是URL路径的一部分str。

### 使用正则表达式

上面使用的是指定 url 匹配，但是如果路径和转换器语法不足以定义 URL 模式，则还可以使用正则表达式。为此，只需要使用 **re_path()** 来替换 path()。

在 Python 正则表达式中，命名正则表达式组的语法是 **(?P<name>pattern)** ， name 是所要传递给 view 视图的请求参数的名称，并且 pattern 是要匹配字符串正则表达式。

将前面示例的 URLconf 使用正则表达式重写：

```python
from django.urls import path, re_path

from . import views

urlpatterns = [
    path('articles/2003/', views.special_case_2003),
    re_path(r'^articles/(?P<year>[0-9]{4})/$', views.year_archive),
    re_path(r'^articles/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/$', views.month_archive),
    re_path(r'^articles/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<slug>[\w-]+)/$', views.article_detail),
]
```

但是这种方式和上面的还是有所不同的：

- 匹配的确切网址稍微受限制。例如，年份10000将不再匹配，因为年份整数被限制为恰好四位数。
- 无论正则表达式的匹配类型如何，每个捕获的参数都将作为字符串发送到视图。
- 从使用切换path()到 re_path()反之亦然，特别重要的是要注意视图参数的类型可能会发生变化，因此可能需要调整视图。

### 使用未命名的正则表达式组

除了命名组语法之外，例如 (?P<year>[0-9]{4}) ，还可以使用较短的未命名组，例如 ([0-9]{4}) 这样就是通过位置来确定所要传递给 view 的参数。

但是不特别推荐这种用法，因为它更容易在匹配的预期含义和视图的参数之间意外引入错误。因此建议直接使用命名组的方式。

在任何一种情况下，建议在给定的正则表达式中仅使用一种样式。当两种样式混合使用时，将忽略任何未命名的组，并且只将命名组传递给视图函数。

### 嵌套参数

正则表达式允许嵌套参数，Django 将解析它们并将它们传递给视图。Django 将尝试填充所有外部捕获的参数，忽略任何嵌套捕获的参数。考虑以下 URL 模式，它们可选地采用页面参数：

```python
from django.urls import re_path

urlpatterns = [
    re_path(r'^blog/(page-(\d+)/)?$', blog_articles),                  # bad
    re_path(r'^comments/(?:page-(?P<page_number>\d+)/)?$', comments),  # good
]
```

两种模式都使用嵌套参数并将解析：

- blog/page-2/ 将导致 blog_articles 与两个位置参数匹配：page-2/和2。
- 第二个模式 comments 将匹配 comments/page-2/ ,关键字参数 page_number 设置为2。在这种情况下，外部参数是非捕获参数(?:...)。
- blog_articles 视图需要扭转最外捕获的参数， page-2/ 或者在这种情况下没有参数。
- comments 可与任何参数或值被反转 page_number。

嵌套捕获的参数在视图参数和 URL 之间创建强耦合，如 blog_articles：视图接收 URL（page-2/）的一部分而不是视图感兴趣的值。这种耦合在反转时更加明显，因为反转我们需要传递一段网址而不是页码的视图。

根据经验，只捕获视图需要使用的值，并在正则表达式需要参数但视图忽略它时使用非捕获参数。

### URLconf中搜索的内容

URLconf 将会搜索请求过来的 URL，将其作为普通的Python的字符串。这不包括 GET 或 POST 参数或域名。

例如，在请求中 https://www.example.com/myapp/ ，URLconf 将查找 myapp/。

在请求中 https://www.example.com/myapp/?page=3，URLconf 将查找 myapp/。

URLconf 不查看请求方法。换句话说，所有的请求方法 GET 或者 POST 等将被路由到相同的 URL 指定的视图去处理。

### URL 的反向解析

如果在视图、模版中使用硬编码的链接，在 urlconf 发生变化时，通常难以进行维护。

那么在配置 url 的时候便通过指向 urlconf 的名称，动态生成链接地址。

在视图中进行重定向时便可以用到这里定义的名称。

指定 url 的名称的方式有两种：

- 普通 path 中的 name 属性
- include url配置中的 namespace 属性

```py
# 普通 path
re_path(r'^$', views.index, name='index'),

# include url配置
path(r'booktest/', include('booktest.urls',namespace='booktest')),
```

## 二、视图函数

Django 中的视图函数本质就是一个定义在应用中 views.py 文件中的函数。

视图函数所具有的参数：

- 一个HttpRequest实例
- 通过正则表达式组获取的位置参数
- 通过正则表达式组获得的关键字参数

### Django自带的错误视图

Django 原生自带几个默认视图用于处理 HTTP 错误

#### 404(page not found)视图

当 Django 在检测 URLconf 中的每个正则表达式后没有找到匹配的内容时便会去调用 404 视图

默认的 404 视图将传递 request_path 变量到模版文件中，它是导致错误的URL

使用方法：

- 在 templates 文件夹中创建 404.html 文件，并写入所需显示的内容。
- 将 settings.py 中 DEBUG 设置为 False。

#### 500 (server error) 视图

在视图代码中出现运行时错误时便会报出 500 错误，此时 Django 便会去调用 500 视图

默认的 500 视图不会传递变量给 500.html 模板

使用方法：

- 在 templates 文件夹中创建 500.html 文件，并写入所需显示的内容。
- 将 settings.py 中 DEBUG 设置为 False。

#### 400 (bad request) 视图

当来自客户端的操作错误时便会报出 400 错误，此时 Django 便会去调用 400 视图

使用方法：

- 在 templates 文件夹中创建 400.html 文件，并写入所需显示的内容。
- 将 settings.py 中 DEBUG 设置为 False。

## 三、Request对象

Django 视图函数的第一个参数是 HttpRequest 对象，这是当服务器接收到 http 协议的请求后，根据报文所创建处来的 HttpRequest 对象。

### 对象属性

（以下属性除非特别说明，否则都是只读的）

- path：一个字符串，表示请求的页面的完整路径，不包含域名
- method：一个字符串，表示请求使用的 HTTP 方法，常用值包括：'GET'、'POST'
- encoding：一个字符串，表示提交的数据的编码方式，如果为None则表示使用浏览器的默认设置，一般为utf-8。这个属性是可写的，可以通过修改它来修改访问表单数据使用的编码，接下来对属性的任何访问将使用新的 encoding 值
- GET：一个类似于字典的对象，包含 get 请求方式的所有参数
- POST：一个类似于字典的对象，包含 post 请求方式的所有参数
- FILES：一个类似于字典的对象，包含所有的上传文件
- COOKIES：一个标准的Python字典，包含所有的 cookie，键和值都为字符串
- session：一个既可读又可写的类似于字典的对象，表示当前的会话，只有当Django 启用会话的支持时才可用

### 对象方法

Request对象的方法如下：

- is_ajax()：如果请求是通过 XMLHttpRequest 发起的，则返回True

### QueryDict对象

QueryDict 对象定义在 django.http.QueryDict 中。而 HttpRequest 对象中的属性 GET、POST 都是属于 QueryDict 类型的对象。

与 python 字典不同，QueryDict 类型的对象用来处理同一个键带有多个值的情况（python 字典一个键对应一个值）

方法get()：根据键获取值

- 只能获取键的一个值
- 如果一个键同时拥有多个值，获取最后一个值

```py
dict.get('键',default)
# 或简写为
dict['键']
```

方法getlist()：根据键获取值,将键的值以列表返回，可以获取一个键的多个值

```py
dict.getlist('键',default)
```

### GET 属性

GET 属性是 request 对象的属性，是属于 QueryDict 类型的对象，主要用来存储客户端以 get 请求方式发送过来的数据。是一种类字典类型的数据结构。

一个简单的 get 请求如下：

```
http://www.example.com/test/?a=1&b=2&c=3
```

其中所携带的数据是从 ？之后的数据，按照键值对的方式以 & 进行分割。其中传递的数据都是字符串类型的数据。

接下来简单演示下 Django 处理 get 请求的过程。

首先在 view.py 视图文件中创建几个用于处理 get 请求的函数

```py
def get_test1(request):
    return render(request, 'booktest/gettest1.html')


def get_test2(request):
    a = request.GET['a']
    b = request.GET['b']
    c = request.GET['c']
    content = {'a': a, 'b': b, 'c': c}
    return render(request, 'booktest/gettest2.html', content)


def get_test3(request):
    # 获取一个键对应的多个值，是个list
    a = request.GET.getlist('a')
    context = {'a': a}
    return render(request, 'booktest/gettest3.html', context)
```

然后配置对应的 url 

```py
re_path(r'^gettest1/$', views.get_test1, name='gettest1'),
re_path(r'^gettest2/$', views.get_test2, name='gettest2'),
re_path(r'^gettest3/$', views.get_test3, name='gettest3'),
```

最后在模版中设置对应的 html 页面

gettest1.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<br/>
一个键传递一个值：<a href="/booktest/gettest2/?a=1&b=2&c=3">gettest2</a><br/>
一个键传递多个个值：<a href="/booktest/gettest3/?a=1&a=2&a=3">gettest3</a><br/>
</body>
</html>
```

gettest2.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<br/>
a = {{ a }}<br/>
b = {{ b }}<br/>
c = {{ c }}<br/>
</body>
</html>
```

gettest3.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
a = {{ a }}
</body>
</html>
```

### POST 属性

POST 属性是 request 对象的属性，是属于 QueryDict 类型的对象，主要用来存储客户端 form 表单以 post 请求方式发送过来的数据。是一种类字典类型的数据结构。

接下来简单演示下 Django 处理 get 请求的过程。

首先在 view.py 视图文件中创建几个用于处理 post 请求的函数

```py
def post_test1(request):
    return render(request, 'booktest/posttest1.html')


def post_test2(request):
    if request.POST:
        uname = request.POST['uname']
        ugender = request.POST['ugender']
        uage = request.POST['uage']
        uhobby = request.POST.getlist('uhobby')
        context = {
            'uname': uname,
            'ugender': ugender,
            'uage': uage,
            'uhobby': uhobby
        }
    return render(request, 'booktest/posttest2.html', context)
```

然后配置对应的 url 

```py
re_path(r'^posttest1/$', views.post_test1, name='posttest1'),
re_path(r'^posttest2/$', views.post_test2, name='posttest2'),
```

最后在模版中设置对应的 html 页面

posttest1.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<form method="post" action="/booktest/posttest2/">
    姓名：<input type="text" name="uname"><br/>
    性别：<input type="radio" name="ugender" checked="checked" value="1"> 男
         <input type="radio" name="ugender" value="0"> 女<br/>
    年龄：<input type="date" name="uage"><br/>
    爱好：<br/>
        <input type="checkbox" name="uhobby" value="唱歌">唱歌<br/>
        <input type="checkbox" name="uhobby" value="跳舞">跳舞<br/>
        <input type="checkbox" name="uhobby" value="打游戏">打游戏<br/>
    <input type="submit">
</form>
</body>
</html>
```

posttest2.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
姓名：{{ uname }}<br/>
性别：{{ ugender }}<br/>
年龄：{{ uage }}<br/>
爱好：
{% for hobby in uhobby %}
    {{ hobby }}<br/>
{% endfor %}
</body>
</html>
```

## 四、Response对象

Response 对象是对客户端发送过来的 Request 对象的响应，Django 在 django.http 模块中定义了 HttpResponse 对象的API。

HttpRequest 对象由 Django 自动创建，而 HttpResponse 对象由程序员创建

### 属性

- content：表示返回的内容，字符串类型
- charset：表示response采用的编码字符集，字符串类型
- status_code：响应的HTTP响应状态码
- content-type：指定输出的MIME类型

### 方法

- init ：使用页内容实例化 HttpResponse 对象
- write(content)：以文件的方式写
- flush()：以文件的方式输出缓存区
- set_cookie(key, value='', max_age=None, expires=None)：设置Cookie
    - key、value 都是字符串类型
    - max_age 是一个整数，表示在指定秒数后过期
    - expires是一个 datetime 或 timedelta 对象，会话将在这个指定的日期/时间过期，注意 datetime 和 timedelta 值只有在使用 PickleSerializer 时才可序列化
    - max_age 与 expires 二选一
    - 如果不指定过期时间，则两个星期后过期
    - 注意：cookie 在每次请求服务器时会自动加入到请求头中
- delete_cookie(key)：删除指定的 key 的 Cookie，如果 key 不存在则什么也不发生

### 使用方式

HttpRequest 对象一般包含模版文件信息一起返回，但也可以直接返回相应的文本信息。

#### 使用模版

```py
from django.http import HttpResponse
from django.template import RequestContext, loader

def index(request):
    # 加载模版文件
    t1 = loader.get_template('booktest/index.html')
    # 设置模版内容
    context = RequestContext(request, {'h1': 'hello'})
    # 渲染模版并返回
    return HttpResponse(t1.render(context))
```

上面使用模版的方式写法比较复杂，不符合 python 简洁的特色，因此 django 为上述操作设置了一种简写方式：render

```py
from django.shortcuts import render

def index(request):
    return render(request, 'booktest/index.html', {'h1': 'hello'})
```

#### 不使用模版

```py
from django.http import HttpResponse

def index(request):
    return HttpResponse('你好')
```

### 扩展子类

#### HttpResponseRedirect

HttpResponseRedirect 是 HttpResponse 的子类，作用是用来对请求进行重定向。

```py
from django.http import HttpResponseRedirect

def index(request):
    # 重定向到其他连接
    return HttpResponseRedirect('booktest/test1/')
```

HttpResponseRedirect 比较长。同样，Django 也给他设置了一个简写方式：redirect

```py
from django.shortcuts import redirect

def index(request):
    return redirect('booktest/test1/')
```

#### JsonResponse

用来返回 json 数据，一般用于异步请求

JsonResponse 的默认 Content-Type 为 application/json

```py
from django.http import JsonResponse

def index2(requeset):
    return JsonResponse({'list': 'abc'})
```

## 五、保持Http状态

Http 是一种无状态的协议，而我们在日常的应用交互过程中又希望能够保存用户访问的状态，也就是将用户的信息记录下来。这里就需要用到两种机制：**cookie、session**。

这两种机制本质上都是一个**字典**类型的数据结构，用来将一些数据以键值对的形式保存起来。区别在于保存的位置已经保存的时间。

### cookie

cookie 是 HttpResponse 对象中的的字典类型对象，可以通过如下的方式进行设置：

- set_cookie(key, value='', max_age=None, expires=None)：设置Cookie
    - key、value 都是字符串类型
    - max_age 是一个整数，表示在指定秒数后过期
    - expires是一个 datetime 或 timedelta 对象，会话将在这个指定的日期/时间过期，注意 datetime 和 timedelta 值只有在使用 PickleSerializer 时才可序列化
    - max_age 与 expires 二选一
    - 如果不指定过期时间，则两个星期后过期
    - 注意：cookie 在每次请求服务器时会自动加入到请求头中
- delete_cookie(key)：删除指定的 key 的 Cookie，如果 key 不存在则什么也不发生

而设置的 cookie 会被保存在客户端的浏览器中，当客户端的浏览器要再次向服务器的该接口发送请求是会自动将保存的 cookie 放到请求头中发送过去。

注意：

- cookie 保存时间较短
- 只可以保存一些不重要的信息

而如果需要保存一些重要的信息的时候便需要用到下一个机制：**session**

### session

不像 cookie 保存在客户端的浏览器一样，session 是保存在服务器端的。并且为了指定某一用户特定的 session 会将用户的 sessionid 同时保存到 cookie 当中。这样便可以保证不同的请求者之间不会共享 session 数据，session 数据是与请求者一一对应的。

#### 启用 session

在使用 django-admin startproject 创建的项目会默认启用 session 从而无须手动配置。

如果想要手动配置启用 session 的话：

- 在 settings.py 文件中的 INSTALLED_APPS 列表中添加：

```py
'django.contrib.sessions',
```

- 在 settings.py 文件中的 MIDDLEWARE_CLASSES 列表中添加：

```py
'django.contrib.sessions.middleware.SessionMiddleware',
```

#### 使用 session 保存数据

在启用 session 之后，每个 HttpRequest 对象将具有一个 session 属性，它是一个类字典对象。可以通过如下的方法来修改 session 中保存的数据：

- get(key, default=None)：根据键获取会话的值，key为空时可以设置默认值
- clear()：清除所有会话
- flush()：删除当前的会话数据并删除会话的Cookie
- del request.session['member_id']：删除会话

通过 session 的使用便可以实现用户登录网站之后记录用户的登录状态。

#### 设置 session 过期时间

可以通过 set_expiry(value) 方法来设置 session 的过期时间

- 如果没有指定，则两个星期后过期
- 如果 value 是一个整数，会话将在 value 秒没有活动后过期
- 若果 value 是一个 timedelta 对象，会话将在当前时间加上这个指定的日期/时间过期
- 如果 value 为 0，那么用户会话将在用户的浏览器关闭时过期
- 如果 value 为 None，那么会话永不过期

#### 设置 session 的存储

##### 保存在数据库中

session 默认是存储在数据库中的。

使用 settings.py 中的 SESSION_ENGINE 项来指定 session 的存储位置：

```py
SESSION_ENGINE='django.contrib.sessions.backends.db'
```

这是 django 默认的 session 存储方式，需要添加 django.contrib.sessions 到 INSTALLED_APPS 列表中。并且还得运行 manage.py migrate 迁移到数据库中的，因为 session 是保存在数据库中的，必须先得有数据库表的结构。

##### 保存在缓存中

只存在本地内存中，如果丢失则不能找回，比数据库的方式读写更快

使用 settings.py 中的 SESSION_ENGINE 项来指定 session 的存储位置：

```py
SESSION_ENGINE='django.contrib.sessions.backends.cache'
```

##### 在缓存和数据库中都进行保存

可以将缓存和数据库同时保存，但会优先从本地缓存中获取，如果没有则从数据库中获取

使用 settings.py 中的 SESSION_ENGINE 项来指定 session 的存储位置：

```py
SESSION_ENGINE='django.contrib.sessions.backends.cached_db'
```

##### 保存在 redis 中

Django 中的 session 还支持 **文件、纯cookie、Memcached、Redis** 等方式存储。

下面演示使用 redis 存储

首先安装对应的模块：

```shell
$ pip install django-redis-sessions
```

然后修改 settings 中的配置，增加如下项

```py
SESSION_ENGINE = 'redis_sessions.session'
SESSION_REDIS_HOST = 'localhost'
SESSION_REDIS_PORT = 6379
SESSION_REDIS_DB = 0
SESSION_REDIS_PASSWORD = ''
SESSION_REDIS_PREFIX = 'session'
```

接着就可以将 session 保存到 redis 中了。

## 六、总结

Django 中的视图是作为 MVT 结构中最重要的连接模版和模型的中间层，主要功能是负责对来自客户端的请求进行处理并返回对应的响应。

阅读完本小节之后需要重点掌握以下的内容：

- 配置 urls，将指定 url 与 views 中的函数相对应
- 编写 views 中的请求处理函数
- 熟悉 HttpRequest 对象的基本操作以及数据的接收方式
- 熟悉 HttpResponse 对象的基本操作
- 熟悉 Http 保持连接状态的两种机制
- 了解 session 和 cookie 实现 http 状态保存的机理
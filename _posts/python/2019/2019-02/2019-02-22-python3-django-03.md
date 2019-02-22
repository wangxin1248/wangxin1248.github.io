---
layout: post
title:  "Python3 Django（三）Django 视图与模版"
date:  2019-02-22
desc: "python3 服务器开发系列之 Django 开发实战（三）：Django 视图和模型设置，为网站数据提供一个展示入口和界面"
keywords: "Python3,后台开发,实战,django,服务器,视图,模型"
categories: [Python]
tags: [python3,后台开发,django]
---
# Django 视图

## Django 视图介绍

Django 中的视图是用来负责对来自客户端的请求进行处理的地方。其是作为 Django 中的调度模块的身份存在，一般来自客户端的请求先到达视图 view 中，之后视图根据所要请求的 url 来选择执行相应的逻辑代码。需要用到数据的便由视图去 model 中获取数据，为了将数据美观的显示到客户端界面上，还需要用到模版，这个会在下面介绍。而模版的调用也是由视图来控制的，是由视图将从 model 中获取的数据存入到模版中，也是由视图将模版中的内容进行渲染并返回给客户端浏览器。Django 中 MVT 的简单调用过程如下图所示：

![mvt框架介绍](/assets/images/2019/2019-02/7.png)

## Django 试图设置

在 Django 中进行视图的设置一般按照如下的步骤进行：

### 1.编写视图文件

首先得编写所要显示的视图文件，注意视图文件是一个应用中一个，是在本应用的文件夹下的 views.py 文件中：

![views.py](/assets/images/2019/2019-02/8.png)

views.py 文件主要负责处理的是来自客户端浏览器的请求，对请求作出相应的响应。在这里我们为了演示来完成一个简单的 hello django 页面的展示。

views.py 文件：

```python
# 从 http 模块中引入对应的响应处理类
from django.http import HttpResponse

# Create your views here.
def index(request):
    """
    定义函数来返回所要显示的数据
    :param request:来自浏览器的请求
    :return:返回给浏览器的响应
    """
    # 我们简单的返回一个 hello django 字符串
    return HttpResponse('hello django')

```

这样一个简单的 hello django 视图文件便编写好了。其实可以看到，定义的视图就是一个简单的函数。当请求到来的时候只需调用该函数便可以返回对应的相应信息。

### 2.配置视图访问url

在编写好对应的视图文件之后便需要配置相应的 url 映射，这样在浏览器地址栏中输入对应的 url 来会请求到对应的视图文件中来。

配置项目的 url 是在项目根路径下的 urls.py 中：

![views.py](/assets/images/2019/2019-02/9.png)

这里有三种不同的方式来配置 url：

- Function views

1. Add an import:  from my_app import views
2. Add a URL to urlpatterns:  path('', views.home, name='home')

- Class-based views

1. Add an import:  from other_app.views import Home
2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')

- Including another URLconf

1. Import the include() function: from django.urls import include, path
2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))

这里可以根据项目的具体应用来选择使用哪种 url 配置方式。一般来说：

- Function views 适合于小型项目，请求并不多的情况下使用
- Class-based views 适合于中型项目，将视图定义为类，方便管理
- Including another URLconf 适合于大型项目，为项目中多个应用中的每一个应用来配置一个单独的 url 请求解析文件

接下来我们来看一下具体需要配置哪些内容：

```python
from django.contrib import admin
from django.urls import path

# 该列表中存储了所有的url及其对应的处理视图文件
# 每一条便是一个 url 及其所对应的执行处理函数
urlpatterns = [
    # 默认的站点管理视图配置
    path(r'admin/', admin.site.urls),
    # 首页的视图配置
    path(r'', views.index, name='index'),
]
```

其中可以看到 url 的配置也只是简单的创建一个 path 对象，path 对象需要传入三个参数：

- 第一个参数是所需要匹配的 url 字符串，这里是使用**正则表达式**的匹配方式来匹配的，只需要满足该正则表达式便会去执行相应的视图。
- 第二个参数是 url 所对应的所需要执行的视图，**注意这里是视图的函数名，无需调用**
- 第三个参数是该匹配的名称，可以省略

在配置好 url 以及编写好对应的视图文件之后便可以启动 Django 项目，从浏览器中访问项目的主页。

![项目主页](/assets/images/2019/2019-02/6.png)

# Django 模版

上面所创建的视图只是简单的返回了一个字符串。但是在实际的项目中我们向用户返回的肯定是编写好的 html 文件。而在 Django 中为了完成这部分的内容便需要引出 template 模版。

### 模版介绍

Django 中的模版便是我们所说的 html 文件，只不过在普通的 html 文件中加入了一些 python 代码，这些 python 代码是 Django 特有的写作格式。因此可以说模版是 Django 中的 html 文件。

在 Django 中模版的路径是在项目根路径下的 templates 中：

![templates](/assets/images/2019/2019-02/10.png)

### 模版应用

在 templates 中创建一个和我们创建的应用同名的文件夹，用来存放该应用下的模版文件。我们在该文件夹下创建一个 index.html 作为我们创建的首页模版文件：

![index](/assets/images/2019/2019-02/11.png)

index.html 的内容如下：

```python
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>index</title>
</head>
<body>
hello django
</body>
</html>
```

接下来为了将模版内容显示到视图中去，需要对视图文件做一些处理：

```python
from django.shortcuts import render

# Create your views here.
def index(request):
    """
    定义函数来返回所要显示的数据
    :param request:
    :return:
    """
    # 返回对应的主页模版文件
    return render(request, 'booktest/index.html')
```

在视图文件中直接调用 django.shortcuts 模块下的 render 类来对模版中的文件进行渲染，并将渲染的结果返回给浏览器。

## 总结

目前为止我们已经将一个简单的 Django 项目走了一遍。

从创建项目-》定义模型-》创建视图-》编辑模版-》发布项目

但是，我们仅仅是做了一个 hello world，并没有将模型中所定义的数据在项目中进行传递。所以接下来我们将做完我们所创建的这个项目，使用到模型中数据，并最后将模型中的数据展示到界面中去。
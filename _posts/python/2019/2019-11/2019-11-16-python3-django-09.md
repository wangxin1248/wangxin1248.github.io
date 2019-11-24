---
layout: post
title:  "Python3 Django（九）高级知识"
date:  2019-11-16
desc: "python3 服务器开发系列之 Django 开发实战（九）：Django 高级知识介绍"
keywords: "Python3,后台开发,实战,django,MVC,ORM"
categories: [Python]
tags: [python3,后台开发,django]
---
# Django 高级知识

在学习了 Django 中的模型、视图、模版之后，基本的 Django 知识点就已经学习完毕了。下面还有一些在使用 Django 进行开发时可能会用到的高级知识点，一起来跟着学习一下吧。

## 一、静态文件

在开发一个网站的时候，除了使用 Django 处理一些后台的逻辑操作，还得有一些美观的前端页面进行设计。而在设计前端界面的时候就会用到一些 css、js、图片文件。这些文件都被称之为静态文件（和模版文件想比，模版文件属于动态文件），也就是不会被动态改变的文件。这些文件也要在 Django 项目中进行管理，配合着模版文件向用户返回，接下来介绍下如何在 Django 中使用静态文件。

### 1.配置静态文件设置

Django 在使用静态文件时首先要得在项目中进行配置，之后才能在模版文件中进行使用。这样做的原因一方面是为了统一管理静态文件，另一方面也是为了保护项目中的静态文件，这点接下来会体现到。

首先在项目的 settings.py 中设置 STATIC_URL 和 STATICFILES_DIRS 变量的值：

```py
# 访问项目中静态文件的链接，属于自定义的
STATIC_URL = '/static/'
# 项目中静态文件的真实存放位置，为真实路径
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]
```

其中 STATICFILES_DIRS 便是我们在项目中真实存放静态文件的路径。因此我们首先得在相应的项目根目录下（与 manage.py 同级）创建对应的 static 文件夹，然后在 static 文件夹下创建与应用同名的文件，用来存放该应用所需的静态文件。

```py
mysite/static/myapp/
```

### 2.在模版中使用静态文件

在模版中使用静态文件有两种不同的方式：

- 使用硬编码
- 使用 static 编码

其中，硬编码就是直接指定静态文件的存放路径：

```py
/static/myapp/myexample.jpg
```

而 static 编码就是使用在 setting 文件中设置的 STATIC_URL

```py
\{\% load static from staticfiles \%\}
<img src="\{\% static "myapp/myexample.jpg" \%\}" alt="My image"/>
```

而使用 static 编码的好处在于向外界屏蔽了静态文件的真实存放路径，通过对网页源代码进行检测可以发现，通过设置 STATIC_URL 便可以自定义 static 的值，这样别人就无法通过网页源代码获取到网站上真实存放的静态文件的路径了。

并且使用 static 编码的话在之后的维护网站的静态文件夹时也可以避免修改大量的模版文件。因此建议使用 static 编码的方式来在模版中指定静态文件的文件夹。

## 二、中间件

对于 Django 框架来说，它为我们提供了良好的修改系统框架的机制，也就是中间件。

中间件作为一个轻量级、底层的插件系统，可以介入 Django 的请求和响应处理过程，修改 Django 的输入或输出。

Django 提供的中间件可以允许我们在整个请求处理的各个位置提供处理流程上的修改，Django 所提供的中间件所可以处理的 Django 框架的位置包括：

- url 解析前
- 视图请求前
- 模版请求前
- 响应发起前
- 视图错误后

![](/assets/images/2019/2019-11/27.svg)

从图中可以看出，中间件是一个双向循环结构。使用中间件，便可以干扰整个处理过程，每次请求中都会执行中间件的这个方法。

### 1.中间件的方法

其实使用中间件也就是简单的自定义一个中间件类，然后在这个类中实现如下的一些方法：

- _init _：无需任何参数，服务器响应第一个请求的时候调用一次，用于确定是否启用当前中间件
- process_request(request)：执行视图之前被调用，在每个请求上调用，返回 None 或 HttpResponse 对象
- process_view(request, view_func, view_args, view_kwargs)：调用视图之前被调用，在每个请求上调用，返回 None 或 HttpResponse 对象
- process_template_response(request, response)：在视图刚好执行完毕之后被调用，在每个请求上调用，返回实现了 render 方法的响应对象
- process_response(request, response)：所有响应返回浏览器之前被调用，在每个请求上调用，返回 HttpResponse 对象
- process_exception(request,response,exception)：当视图抛出异常时调用，在每个请求上调用，返回一个 HttpResponse 对象

### 2.中间件的使用

为了使用中间件，首先得自定义一个文件来实现中间件的一些方法。

在 settings.py 文件的同级目录中创建一个 example.py 文件

```py
from django.http import HttpResponse
class MyException():
    def process_exception(request,response, exception):
        return HttpResponse(exception.message)
```

在定义好中间件文件之后还得需要将该中间件注册要项目中。修改 settings.py 文件中的 MIDDLEWARE_CLASSES，加入自己定义的中间件：

```py
MIDDLEWARE_CLASSES = (
    'test1.example.MyException',
    ...
)
```

之后在有视图在执行的过程中发生异常时便会调用该中间件，执行在中间件中定义的 process_exception 方法。

### 3.中间件的应用场景

1、做IP限制

放在中间件类的列表中，阻止某些IP访问了；

2、URL访问过滤

如果用户访问的是login视图（放过）

如果访问其他视图（需要检测是不是有session已经有了放行，没有返回login），这样就省得在 多个视图函数上写装饰器了！

3、缓存

客户端请求来了，中间件去缓存看看有没有数据，有直接返回给用户，没有再去逻辑层执行视图函数

## 三、上传文件

Django 中的静态文件除了可以保存需要在模版中显示的文件之外还可以存储由用户上传上来的文件。

对于用户上传上来的文件 Django 需要在视图中进行接收，使用的是 request.FILES 属性。其中 name 使用的是在 form 表单中 

```html
<input type="file" name="" />
```

中的name。

注意：FILES 只有在请求的方法为 POST 且提交的 \<form> 带有enctype="multipart/form-data" 的情况下才会包含数据。否则 FILES 将为一个空的类似于字典的对象。

对于用户上传的文件可以直接在视图中进行保存处理。当然也可以定义一个模版来保存（最终保存的路径还是在项目路径下）。在使用模型处理上传文件时需要将模型的文件属性定义成 models.ImageField 类型：

```py
pic = models.ImageField(upload_to='cars/')
```

在定义好模型之后，还需要进行一些相应的配置：

- 在项目根目录下的静态文件夹下创建 media 文件夹（图片上传后，会被保存到“/static/media/cars/图片文件”）
- 打开 settings.py 文件，增加 MEDIA_ROOT 项

```py
# 指定媒体文件的路径
MEDIA_ROOT=os.path.join(BASE_DIR,"static/media")
```

## 四、分页处理

当我们通过 Django 的模型从后台查询数据的时候，很有可能会遇到所查询出来的数据非常多的情况。此时，若直接将这些数据交由模版去显示便会将一个页面拉的非常长，为了避免这种情况的发生，Django 便提出了分页 Paginator 对象。

### 1.Paginator

Paginator 对象是用来构造一个分页器的，在 django.core.paginator 模块中，其构造函数格式如下：

```py
# 返回分页对象
# data_list为所要分页显示的列表数据
# page_sum为所要分页后每页所含的数据的个数
Paginator(data_list,page_sum)
```
Paginator 的属性包含：

- count：当前所要分页处理的对象总数
- num_pages：当前页面总数
- page_range：当前的页码列表，从1开始，例如[1, 2, 3, 4]

Paginator 的方法包含：

- page(num)：返回指定页面的 page 对象，下标以1开始，如果提供的页码不存在，抛出 InvalidPage 异常

Paginator 可能产生的异常包含：

- InvalidPage：当向 page() 传入一个无效的页码时抛出
- PageNotAnInteger：当向 page() 传入一个不是整数的值时抛出
- EmptyPage：当向 page() 提供一个有效值，但是那个页面上没有任何对象时抛出

也就是说需要将从数据库中查询到的数据首先交给 Paginator 对象，然后在由 Paginator 对象来生成一个 page 对象，page 对象就是分页处理之后的每一页数据的管理对象。接下来看一下 page 对象：

### 2.page

page 对象是由 Paginator 对象的 page() 方法返回的，不需要手动构造

page 对象的属性：

- object_list：当前页上所有对象的列表
- number：当前页的序号，从1开始
- paginator：当前 page 对象相关的 Paginator 对象

page 对象的方法：

- has_next()：如果有下一页返回 True
- has_previous()：如果有上一页返回 True
- has_other_pages()：如果有上一页或下一页返回 True
- next_page_number()：返回下一页的页码，如果下一页不存在，抛出InvalidPage 异常
- previous_page_number()：返回上一页的页码，如果上一页不存在，抛出InvalidPage 异常
- len()：返回当前页面对象的个数

## 五、Ajax使用

通常情况下我们是使用视图来通过上下文向模板中传递数据，需要先加载完成模板的静态页面，再执行模型代码，生成最后的 html 文件返回给浏览器，这个过程将页面与数据集成到了一起，扩展性差

因此便提出了改进方案：即通过 ajax 的方式获取数据，然后通过 dom 操作将数据呈现到界面上

推荐使用 jquery 框架，因为框架中提供了 \$.ajax、\$.get、\$.post 方法用于进行异步交互，但是由于 csrf 的约束，推荐使用 \$.get

## 六、缓存

对于规模较大、流量较多的网站来说，尽可能地减少网站的开销是非常必要的。其中一种降低网站的开销的方式就是：将常用的，更新不及时的数据进行缓存，使得下一次访问可以直接获取该缓存数据，而不用去执行具体的业务逻辑。缓存数据就是为了保存那些需要很多计算资源的结果，这样的话就不必在下次重复消耗计算资源。

Django 自带了一个健壮的缓存系统来保存动态页面，避免对于每次请求都重新计算。并且 Django 提供了不同级别的缓存粒度：

- 可以缓存特定视图的输出；
- 可以仅仅缓存部分模版；
- 可以缓存整个网站。

### 1.设置缓存

可以通过 setting 文件中的 CACHES 配置设置来决定把数据缓存在哪里，是数据库中、文件系统还是在内存中

其中的参数 TIMEOUT 决定缓存的默认过期时间，以秒为单位，这个参数默认是300秒，即5分钟。设置 TIMEOUT 为 None 则表示永远不会过期，值设置成0造成缓存立即失效

- 设置缓存存储在内存中：

```python
CACHES={
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'TIMEOUT': 60,
    }
}
```

- 设置缓存存储在 redis 中：

首先得安装包：pip install django-redis-cache

然后在 settings 中设置：

```py
CACHES = {
    "default": {
        "BACKEND": "redis_cache.cache.RedisCache",
        "LOCATION": "localhost:6379",
        'TIMEOUT': 60,
    },
}
```

之后可以连接 redis 查看所存的数据：

```
连接：redis-cli
切换数据库：select 1
查看键：keys *
查看值：get 键
```

### 2.缓存单个 view

django.views.decorators.cache 定义了 cache_page 装饰器，用于对视图的输出进行缓存

示例代码如下：

```py
from django.views.decorators.cache import cache_page

@cache_page(60 * 15)
def index(request):
    return HttpResponse('hello1')
```

其中 cache_page 接受一个参数：timeout，秒为单位，上例中缓存了15分钟

视图缓存与 URL 无关，如果多个 URL 指向同一视图，每个 URL 将会分别缓存

### 3.缓存部分模版

使用 cache 模板标签来缓存模板的一个片段，需要两个参数：

- 缓存时间，以秒为单位
- 给缓存片段起的名称

示例代码如下：

```html
\{\% load cache \%\}
\{\% cache 500 hello \%\}
hello1
\{\% endcache \%}\
```

### 4.缓存底层实现接口

from django.core.cache import cache

- 设置：cache.set(键,值,有效时间)
- 获取：cache.get(键)
- 删除：cache.delete(键)
- 清空：cache.clear()
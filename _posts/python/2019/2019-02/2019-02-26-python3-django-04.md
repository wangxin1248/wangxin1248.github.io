---
layout: post
title:  "Python3 Django（四）Django web 开发流程总结"
date:  2019-02-26
desc: "python3 服务器开发系列之 Django 开发实战（四）：整理和总结 Django web 项目开发过程中的步骤"
keywords: "Python3,后台开发,实战,django,服务器,视图,模型"
categories: [Python]
tags: [python3,后台开发,django]
---
# Django项目开发流程

我们创建一个简单的 Django web 演示项目，该项目的需求如下：

- 系统首页显示当前数据库中所保存的书籍名称
- 每一本书籍都可以点击进去查看书籍当中具体的英雄名称

网站运行效果如下：

![首页1](/assets/images/2019/2019-02/12.png)
![首页2](/assets/images/2019/2019-02/13.png)

下面将其具体的创建流程进行总结。

## 一、创建项目

输入如下的命令来创建一个名为 booksite 的 web 项目

```python
django-admin startproject booksite
```

创建完成之后进入项目目录

```python
cd booksite
```

## 二、创建应用

一个项目中可以包含很多个应用，项目中的应用就将项目进行了模块化的处理。

输入如下的命令来创建一个名为 booktest 的应用

```python
python manage.py startapp booktest
```

创建好的项目以及应用的目录结构如下图所示：

![项目结构](/assets/images/2018/2018-12/13.png)

## 三、配置数据库

Django支持多种数据库，这里演示使用 sqlite 

具体的数据库配置是在 /booksite/booksite/settings.py 这里也是很多 Django 项目设置的地方

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
```

## 四、编写 models.py 文件

Django 是基于 MVT 的 web 框架，t便是模型 model 的意思。

模型在 Django 中是作为和数据库表进行相互对应的实体类，类中的属性就对应着数据库表中的属性。

接下来来创建我们项目中所需要用到的两个模型类：

```python
# file:/booksite/booktest/modles.py

from django.db import models


# Create your models here.
class BookInfo(models.Model):
    """
    图书类，以下定义的是类属性，与数据库中的表相对应
    """
    # 书名
    b_title = models.CharField(max_length=30)
    # 书出版日期
    b_pub_date = models.DateField()

    # 重写str方法，在输出书信息时被调用
    def __str__(self):
        return str(self.b_title)


class HeroInfo(models.Model):
    """
    英雄类，做为书中的英雄
    """
    # 英雄名称
    h_name = models.CharField(max_length=30)
    # 英雄性别
    h_gender = models.BooleanField()
    # 英雄简介
    h_content = models.CharField(max_length=300)
    # 英雄所属图书（外键形式引用，注意得指定删除时所执行的操作）
    h_book = models.ForeignKey('BookInfo', on_delete=models.CASCADE, )

    # 重写str方法，在输出书信息时被调用
    def __str__(self):
        return str(self.h_book) + '-' + str(self.h_name)

    # 对性别的显示方式进行处理
    def gender(self):
        if self.h_gender:
            return '男'
        else:
            return '女'

    # 可以给封装的方法的显示起个别名
    gender.short_description = '性别'
```

## 五、迁移模型到数据库中

上面的步骤只是定义了一个模型，但并没有实现模型到数据库的映射。为了实现模型与数据库之间的相互，必须得将创建好的模型激活，并且生成对应的迁移文件，最后执行迁移操作，便将创建的模型与数据库绑定在了一起。

### 5.1 激活模型

激活模型需要编辑 settings.py 文件，将我们创建的 booktest 应用添加到 installed_apps 当中（在/booksites/booksites/settings.py）：

```python
# 注册应用
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'booktest'
]
```

### 5.2 生成迁移文件

这一步是根据所定义的模型类来生成对应的 sql 语句：

在终端中执行如下的命令：

```bash
python manage.py makemigrations
```

### 5.3 执行迁移操作

执行迁移是为了执行 sql 语句来生成对应的数据表

在终端中执行如下的命令：

```bash
python manage.py migrate
```

这样网站的数据库部分就已经创建好了

## 六、编写模版文件

模版是 Django 项目中用来向用户显示网站具体信息的部分，也就是 html 文件，只不过 html 的基础上加入了类 python 的可执行代码，需要进行渲染将其中的 python 代码变为普通的 html 代码。

在 Django 中模版的路径是在项目根路径下的 templates 中：

在 templates 中创建一个和我们创建的应用同名的文件夹，用来存放该应用下的模版文件。我们在该文件夹下创建一个 index.html 作为我们创建的首页模版文件：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>首页</title>
</head>
<body>
<h1>本网站中的图书信息：</h1>
<ul>
    {%for book in books%}
    <li><a href='/detail/{{ book.id }}'>书名：{{ book.b_title }}</a></li>
    {%endfor%}
</ul>
</body>
</html>
```

在创建 detail.html 来显示书籍中具体的英雄信息：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>英雄列表</title>
</head>
<body>
<ul>
    {% for hero in heros %}
    <li>英雄名称：{{ hero.h_name }}</li>
    {% endfor %}
</ul>
</body>
</html>
```

## 七、编写视图文件

视图是 Django 当中用来处理用户请求的部分，视图会根据用户所发出的请求来向模型获取所需要的数据，并将数据发送给模版，并对模版进行渲染操作，将渲染好的 html 页面信息作为响应发送给客户端浏览器。

视图文件是位于具体的应用中，在应用下的 views.py 文件中。所谓的视图其实就是定义一个个的函数，这个函数传入客户端发来的请求信息，通过这个函数对请求信息执行相应的操作，最后该函数会将处理好的数据发送给一个指定的模版，最后会讲渲染好的 html 数据作为返回数据 return 出去。

接下来我们在创建的 booktest 应用下的 views.py 中创建我们用来显示网站首页和书籍中英雄信息的视图：

```python
from django.shortcuts import render
from .models import BookInfo, HeroInfo

# Create your views here.
def index(request):
    """
    定义函数来返回所要显示的数据
    :param request:
    :return:
    """
    # 从模型中查询所有的数据信息
    books = BookInfo.objects.all()
    # 返回对应的主页模版文件
    return render(request, 'booktest/index.html', {'books': books})

def detail(request, id):
    """
    显示当前书籍中的英雄信息
    :param request:
    :return:
    """
    # 根据id查询到当前当前书籍
    book = BookInfo.objects.get(pk = id)
    # 查询当前书籍中所包含的所有英雄信息
    heros = book.heroinfo_set.all()
    return render(request, 'booktest/detail.html', {'heros': heros})

```

## 八、配置url

当我们将网站中的一个功能模块的 model、template、 view 创建好了，接下来便是需要将这几个部分打通起来，让他们可以组合起来协调工作。那么，便要引出我们的 url 配置了。

当客户端浏览器的一个 request 请求到服务器的时候，首先要对请求的 url 信息进行解析，获当前请求所要获取的信息是什么。这里处理具体请求的便是 view 视图，之后视图便会将模版和模型组合起来。

那么我们所需要配置的便是对具体的 url 将其和所要执行的视图 view 中的函数一一对应上。具体的配置信息在项目根路径下的项目同名文件夹下的 urls.py 文件中：

配置相关的 url 映射规则就是在 urlpatterns 列表中创建一个 path 对象，其中 path 中必须传入两个参数

- 第一个参数：所需要匹配的具体的 url 信息
- 第二个参数：匹配的该 url 信息所对应需要执行的视图函数名称（注意不是调用函数）

**注意：**

- 最新版的 Django中配置 path 中请求的方式不再使用正则表达式了，而是直接使用确定的字符，对于可变部分则使用**<类型:变量名>**的格式

```python
"""booksite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
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
from django.urls import path

from booktest import views

urlpatterns = [
    path('admin/', admin.site.urls),
    # 主页访问,name可以不写
    path('', views.index, name='index'),
    # 书籍中的英雄信息
    path('detail/<int:id>', views.detail, name='detail')
]
```

## 九、项目配置

为了将我们项目的细节做好，我们还得对一些本地化的设置。

在项目的设置文件中修改下网站的语言和时区：

```python
# 修改站点语言
# LANGUAGE_CODE = 'en-us'
LANGUAGE_CODE = 'zh-Hans'

# 修改站点时区
# TIME_ZONE = 'UTC'
TIME_ZONE = 'Asia/Shanghai'
```

同时为了让我们的项目可以被远程访问，在设置文件中指定项目运行的主机IP：

```python
ALLOWED_HOSTS = ['10.70.165.115']
```

## 十、启动服务

当上面的步骤都做完的时候，接下来便可以启动站点来看一下，在终端中 cd 当当前文件夹中然后输入如下的命令：

```bash
python manage.py runserver 0.0.0.0:8000
```

接下来便可以在本网络内任意一台电脑浏览器上输入：10.70.165.115:8000 来访问网站了

## 十、站点管理

Django 自带了一套完整可定制的后端站点管理系统，可以完美实现对项目数据库的增删改查操作。

进入方式是在项目网址后面加上 /admin 

但是为了保证网站信息的安全，在进入站点管理之前必须得先创建一个超级用户，通过这个超级用户才能登陆到站点管理后台中。输入以下的命令便可以创建一个超级用户：

```bash
python manage.py createsuperuser
```

之后便可以登入到站点管理界面了

## 总结

通过一个简单的 Django 小案例其实可以看出来 Django 高效、简洁的优点的，通过很小的配置和编写便可以将一个完整的演示案例实现出来，接下来将继续探索 Django 中每一部分更加深入的使用。
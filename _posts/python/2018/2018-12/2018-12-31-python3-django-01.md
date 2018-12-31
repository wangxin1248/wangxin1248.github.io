---
layout: post
title:  "Python3 Django（一）Django 入门介绍"
date:  2018-12-31
desc: "python3 服务器开发系列之 Django 开发实战（一）：Django 概念介绍以及实战入门"
keywords: "Python3,后台开发,实战,django,服务器"
categories: [Python]
tags: [python3,后台开发,django]
---
# Django 入门

Django 是一个开放源代码的 Web 应用框架，由 Python 写成。采用了 MVT 的软件设计模式，即模型 Model，视图 View 和模板 Template 。它最初是被开发来用于管理劳伦斯出版集团旗下的一些以新闻内容为主的网站的。并于2005年7月在BSD许可证下发布。

Django 的主要目标是使得开发复杂的、数据库驱动的网站变得简单。Django 注重组件的重用性和“可插拔性”，敏捷开发和 DRY法则（Don't Repeat Yourself）。在 Django 中 Python 被普遍使用，甚至包括配置文件和数据模型。

以下的教程是基于 Python 3.6 Django 2.1.4 版本来进行演示的。

## Django 组件

Django 框架的核心包括：

- 一个面向对象的映射器，用作数据模型（Python类）和关系型数据库间的介质；
- 一个基于正则表达式的URL分发器；
- 一个视图系统，用于处理请求；
- 一个模板系统。

因此呢，Django 是属于一个基于 MVT 的 Web Framework， 鼓励快速、简洁、以程序设计的思想进行开发网站。通过使用这个框架，可以减少很多开发麻烦，使你更专注于编写自己的app，而不需要重复造轮子。并且最重要的是 Django 免费并且开源。

Django 中的 MVT 不同与常见的 MVC 框架，是针对 Django 专门进行设计的一种网站架构：

- M 表示 model，负责与数据库交互；
- V 表示 view，是核心，负责接收请求、获取数据、返回结果；
- T 表示 template，负责呈现内容到浏览器。

Django 框架的主要流程如下图所示：

![result](/assets/images/2018/2018-12/11.png)

用户在浏览器中输入 URL 后回车, 浏览器会首先对 URL 进行检查, 判断协议,如果是 http 就按照 Web 来处理, 然互调用DNS 查询, 将域名转换为 IP 地址, 然后经过网络传输到达对应 Web 服务器, 服务器对 url 进行解析后, 调用 View 中的逻辑(MTV 中的V), 其中又涉及到 Model(MTV 中的M), 与数据库的进行交互, 将数据发到 Template(MTV 中的T)进行渲染, 然后发送到浏览器中, 浏览器以合适的方式呈现给用户

Django 的主要优点：

- 强大的数据库功能：拥有强大的数据库操作接口（QuerySet API），如需要也能执行原生SQL。
- 自带强大后台：几行简单的代码就让你的网站拥有一个强大的后台，轻松管理内容！
- 优雅的网址：用正则匹配网址，传递到对应函数，随意定义，如你所想！
- 模板系统：强大，易扩展的模板系统，设计简易，代码，样式分开设计，更容易管理
- 缓存系统：与Memcached, Redis等缓存系统联用，更出色的表现，更快的加载速度。
- 国际化：完全支持多语言应用，允许你定义翻译的字符，轻松翻译成不同国家的语言。

## Django 入门实战

### 1.安装 Django

安装 Django 可以简单的通过 pip 来进行安装：

```bash
pip install django
```

安装完成之后执行如下的代码查看是否安装成功：

```bash
python -m django --version
```

如果这行命令输出了一个版本号，证明你已经安装了此版本的 Django；如果你得到的是一个“No module named django”的错误提示，则表明你还未安装。

### 2.创建一个 Django 项目

执行下面这行代码，会在当前文件夹下创建一个 booksite 文件夹，即为所创建的项目目录：

```bash
django-admin startproject booksite
```

查看下该目录：

![result](/assets/images/2018/2018-12/12.png)

目录说明：

- manage.py：一个命令行工具，可以使你用多种方式对Django项目进行交互
- 内层的目录：项目的真正的Python包
- _init _.py：一个空文件，它告诉 Python 这个目录应该被看做一个 Python 包
- settings.py：项目的配置
- urls.py：项目的URL声明
- wsgi.py：项目与 WSGI 兼容的 Web 服务器入口

### 3. 模型设计

接下来首先来设计网站所使用的数据库的关系模型，数据库主要的实体是 图书和英雄。主要用来存储图书信息以及所图书中所对应的英雄信息。

- 图书：BookInfo
    - 名称：b_title
    - 出版时间：b_pub_date
- 英雄：HeroInfo
    - 英雄名称：h_name
    - 英雄性别：h_gender
    - 英雄简介：h_content
    - 所属图书：h_book

这里两个实体类之间的关系是英雄对图书是 **多对一** 的关系。即英雄使用 h_book 外键来与图书进行连接。

### 4.项目数据库配置

在设计好数据模型之后得将设计的模型体现在 Django 项目中，首先要做的便是修改 **settings.py**文件，通过DATABASES 项来进行进行数据库设置。

- Django 支持的数据库包括：sqlite、mysql等主流数据库
- Django 默认使用 SQLite 数据库

settings.py 配置如下：

```python
# 数据库注册
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
```

### 5.创建应用

在 Django 项目中每一个应用代表着处理一种业务，因此当要处理新的业务时，首先要做的便是创建一个应用。

对于我们这个演示的项目来说我们也得创建一个应用来管理我们的图书和英雄之间的关系。使用如下的命令来创建一个应用：

```python
python manage.py startapp booktest
```

执行完之后再来查看下该目录：

![result](/assets/images/2018/2018-12/13.png)

### 6.定义模型类

在 Django 项目中有一个数据表，就得有一个模型类与之对应。而模型类都是在 **models.py**文件中定义。

定义模型类时得引入包 **from django.db import models**，并且定义的模型类必须继承自 **models.Model**类

说明：

- 不需要定义主键列，在生成时会自动添加，并且值为自动增长
- 当输出对象时，会调用对象的str方法

```python
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
        return self.b_title+':'+str(self.b_pub_date)


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
        return str(self.h_book) + ':' + str(self.h_name)

```

### 7.生成数据表

上面的步骤只是定义了一个模型，但并没有实现模型到数据库的映射。为了实现模型与数据库之间的相互，必须得将创建好的模型激活，并且生成对应的迁移文件，最后执行迁移操作，便将创建的模型与数据库绑定在了一起。

#### 激活模型

激活模型需要编辑 **settings.py** 文件，将我们创建的 booksets 应用添加到 installed_apps 当中：

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

#### 生成迁移文件

这一步是根据所钉定义的模型类来生成对应的 sql 语句：

执行如下的命令：

```bash
python manage.py makemigrations
```

执行结果如下：

![result](/assets/images/2018/2018-12/14.png)

可以看到，在文件夹中也已经出现了对应的迁移文件：

![result](/assets/images/2018/2018-12/15.png)

#### 执行迁移

执行迁移是为了执行 sq l语句来生成对应的数据表

命令如下：

```bash
python manage.py migrate
```

执行结果如下：

![result](/assets/images/2018/2018-12/16.png)

#### 模型测试

上面的操作就已经将模型与数据库进行了绑定，接下来可以在命令行中对数据库中的数据模型进行一些简单的测试。

测试的环境是在 django 自带的 shell 环境里面：

```bash
python manage.py shell
```

执行结果如下：

![result](/assets/images/2018/2018-12/17.png)

- 引入所需的包：

```python
>>> from booktest.models import BookInfo,HeroInfo
>>> from datetime import *
```

- 查询所有的图书信息

```python
>>> BookInfo.objects.all()
<QuerySet []>
```

因为此时数据库中并没有数据，所以显示是个空的列表。

- 新建图书对象并保存

```python
>>> b = BookInfo()
>>> b.b_title = "三体"
>>> b.b_pub_date = datetime(year=2015,month=10,day=10)
>>> b.save()
# 再来查询图书数据库
>>> BookInfo.objects.all()
<QuerySet [<BookInfo: 三体:2015-10-10>]>
```

- 修改图书信息

```python
>>> b.b_title = "Three body"
>>> b.save()
# 可以按照主键来查找数据
>>> BookInfo.objects.get(pk=1)
<BookInfo: Three body:2015-10-10>
```

- 新建英雄对象

因为英雄对象中使用外健与图书对象相联系，因此在创建英雄对象之前得先得有一个图书对象。

```python
>>> h = HeroInfo()
>>> h.h_name = "叶文洁"
>>> h.h_gender = False
>>> h.h_content = "三体纪元开创者"
>>> h.h_book = b
>>> h.save()
>>> HeroInfo.objects.get(pk=1)
<HeroInfo: Three body:2015-10-10:叶文洁>
```

## 参考文章

- [https://zh.wikipedia.org/wiki/Django](https://zh.wikipedia.org/wiki/Django)
- [https://m.w3cschool.cn/django/](https://m.w3cschool.cn/django/)
- [https://docs.djangoproject.com/zh-hans/2.1/](https://docs.djangoproject.com/zh-hans/2.1/)
- [https://code.ziqiangxuetang.com/django/django-tutorial.html](https://code.ziqiangxuetang.com/django/django-tutorial.html)
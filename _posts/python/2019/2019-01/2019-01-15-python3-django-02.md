---
layout: post
title:  "Python3 Django（二）Django 站点管理"
date:  2019-01-15
desc: "python3 服务器开发系列之 Django 开发实战（二）：Django 站点管理"
keywords: "Python3,后台开发,实战,django,服务器,站点管理"
categories: [Python]
tags: [python3,后台开发,django]
---
# Django 站点管理

Django 作为热门的 Python Web 框架，除了是因为它独特高效的 MVT 架构模式，同时也是因为它自带了一个功能强大的网站后台管理器，通过它你便不再需要自己去单独编写一个网站后台管理。本文将介绍如何使用 Django 自带的站点管理，并实现对站点管理的定制。

本文所使用的项目是 [Python3 Django（一）Django 入门介绍](https://wangxin1248.github.io/python/2018/12/python3-django-01.html)所创建的项目。

## 一、打开站点管理功能

### 1.创建超级用户

在创建好一个 Django 项目应用之后，想要进入到站点管理后台的界面的话必须首先得创建一个超级用户，通过这个超级用户才能登陆到站点管理后台中。输入以下的命令便可以创建一个超级用户：

```bash
python manage.py createsuperuser
```

之后按照提示输入相应的内容即可。

### 2.注册模型

我们进入网站的站点管理界面最主要的任务是要去管理系统中的数据库中的内容。但是我们在之前的工作中只是定义了模型，并完成了模型到数据库的迁移操作。但这些只是一些准备操作，想要在站点中管理数据库中的对象必须首先将想要管理的对应注册到系统管理中。

注册的位置是在所创建的应用目录下的 **admin.py** 中，在该文件中导入对应的模型类，并使用如下的方法来将其注册到系统管理中：

```python
from django.contrib import admin
from booktest.models import *


# Register your models here.
admin.site.register(BookInfo)
admin.site.register(HeroInfo)
```

这里将上次项目创建的两个模型类注册到了系统中。

### 3.站点设置

为了实现将创建的网站发布上去，还得需要在项目的 **settings.py** 文件中进行一些相应的设置操作。

首先是得设置网站允许的访问主机域名（ip），这里我是在局域网内发布站点，所以设置的是指定的 IP：

```python
ALLOWED_HOSTS = ['10.70.165.115']
```

接下来还得设置一下网站所对应的地区和时间：

```python
# 修改站点语言
LANGUAGE_CODE = 'zh-Hans'

# 修改站点时区
TIME_ZONE = 'Asia/Shanghai'
```

注意一下 Django 中对语言和时区设置的方式和其他的不太一样。

### 4.启动站点

当上述的内容设置好了之后，便可以启动网站了。输入如下的命令将网站启动起来，并且支持外部访问：

```bash
$ python manage.py runserver 0.0.0.0:8000
```

启动完之后，在浏览器中输入对应服务器的 ip 加上 8000 端口便可以访问创建的站点了：

![网站首页](/assets/images/2019/2019-01/17.png)

### 5.进入站点管理界面

在默认创建的网站首页是没有站点管理的入口的，是需要自己单独在网站地址后面加上 **/admin**来访问的。

![网站站点管理首页](/assets/images/2019/2019-01/18.png)

输入刚才创建的超级用户的用户名和密码便进入到了网站站点管理后台界面。

## 二、站点管理操作

在进入到网站的站点管理界面之后，主要的布局分为：

- 所创建的应用数据库管理
- 网站认证和授权管理

前者主要是针对网站应用数据库的增删改查操作；后者是针对网站的用户管理操作。

![站点管理功能](/assets/images/2019/2019-01/19.png)

在站点管理的右侧会显示对该网站所进行一系列操作。

## 三、站点管理界面定制

除了 Django 默认提供给我们的站点管理界面，我们还可以对站点管理界面进行私人定制操作。

定制文件是在所创建应用下的 **admin.py** 文件中：

- Django 提供了 admin.ModelAdmin 类
- 通过定义 ModelAdmin 的子类，来定义模型在 Admin 界面的显示方式

可供定义的内容有：

- 指定模型的显示属性 **list_display**
- 指定模型进行查找的过滤字段（一般是数据中出现次数较多的）**list_filter**
- 指定模型所要进行模糊查找的字段 **search_fields**
- 指定一页所要显示的数据量 **list_per_page**
- 对属性进行分组（修改属性时显示） **fieldsets**
- 模型关联显示

接下来以 BookInfo 模型数据的站点管理界面定制为例介绍下站点定义的方式：

```python
from django.contrib import admin
from booktest.models import *

class BookAdmin(admin.ModelAdmin):
    # 指定模型的显示属性
    list_display = ['b_title', 'b_pub_date']
    # 指定模型进行查找的过滤字段（一般是数据中出现次数较多的）
    list_filter = ['b_title']
    # 指定模型所要进行模糊查找的字段
    search_fields = ['b_title']
    # 指定一页所要显示的数据量
    list_per_page = 10

    # 对属性进行分组
    fieldsets = [
        ('basic', {'fields': ['b_title']}),
        ('more', {'fields': ['b_pub_date']}),
    ]

# Register your models here.
admin.site.register(BookInfo, BookAdmin)
admin.site.register(HeroInfo)

```

可以看到对应的 BookInfo 站点管理的界面已经变为：

![BookInfo站点管理功能](/assets/images/2019/2019-01/20.png)

修改 BookInfo 中的记录时界面变为：

![修改BookInfo站点管理功能](/assets/images/2019/2019-01/21.png)

### 模型关联显示

在我们的实例中英雄与图书是多对一的关联关系，为了在管理界面中表现出来这种关系可以对 manage.py 文件进行定制

首先得创建一个 **HeroInfoLine** 类，用来对关联显示的信息进行设置：

```python
class HeroInfoLine(admin.StackedInline):
    """
    用来设置heroinfo的关联信息,
    admin.StackedInline表示为默认的显示方式
    admin.TabularInline表示为采用表格方式显示
    """
    # 指定设置的模型
    model = HeroInfo
    # 关联现实的数据个数
    extra = 3
```

接下来得在所需关联的类中的 admin 管理类中配置相关信息，在这里便是在图书的 admin 类中进行配置：

```python
class BookAdmin(admin.ModelAdmin):
    # 指定模型的显示属性
    list_display = ['b_title', 'b_pub_date']
    # 指定模型进行查找的过滤字段（一般是数据中出现次数较多的）
    list_filter = ['b_title']
    # 指定模型所要进行模糊查找的字段
    search_fields = ['b_title']
    # 指定一页所要显示的数据量
    list_per_page = 10

    # 对属性进行分组
    fieldsets = [
        ('basic', {'fields': ['b_title']}),
        ('more', {'fields': ['b_pub_date']}),
    ]

    # 进行模型的相关联显示
    inlines = [HeroInfoLine]
```

最后为了将结果进行显示，将配置好的类注册到应用中：

```python
admin.site.register(BookInfo, BookAdmin)
```

最后的显示效果如图所示：

![关联显示效果](/assets/images/2019/2019-02/3.png)

### 布尔类型属性（性别）显示

在我们的实例中英雄模型中的性别属性是拿布尔类型表示的，这样在存储数据的时候可以节约空间，但是在显示英雄信息的时候不是那么的直接：

![英雄信息显示](/assets/images/2019/2019-02/4.png)

为了将布尔值在管理界面中现实的更加美观直接，可以在模型类的定义时对类属性进行相关的封装：

```python
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

按照上面的方法对原先的布尔类型属性进行了相关的封装操作，并对封装的方法设置了别名。但是这样设置并没有在查看英雄的界面发生变换。为了让封装的方法也显示到界面中，还是得在注册模型的时候对模型进行相关的设置：

```python
class HeroAdmin(admin.ModelAdmin):
    list_display = ['id', 'h_name', 'gender', 'h_content', 'h_book']

admin.site.register(HeroInfo, HeroAdmin)
```

这样，刷新便可以在管理界面中看到显示信息已经发生了变化：

![英雄信息显示](/assets/images/2019/2019-02/5.png)

## 四、总结

总的来说，Django 为我们提供了一个功能丰富且可以自由定制的后台管理站点，这样我们在创建一个 Django 项目的时候便无需在编写一个后台管理程序。接下来对 Django 所提供的后台管理做一个简单的总结：

- 在网址之后加入 /admin 便可以进入到 Django 自带的管理界面中
- 支持热更新，修改文件之后直接刷新即可
- 进入站点管理得先创建一个超级管理员
- 站点管理支持对模型数据的增删改查，也可以对模型数据的显示进行个性化定制
- 支持模型之间的关联显示
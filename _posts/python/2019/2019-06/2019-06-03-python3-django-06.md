---
layout: post
title:  "Python3 Django（六）模型详解"
date:  2019-06-03
desc: "python3 服务器开发系列之 Django 开发实战（六）：Django 模型详细介绍"
keywords: "Python3,后台开发,实战,django,MVC,ORM"
categories: [Python]
tags: [python3,后台开发,django]
---
# Django - 模型

在 Django 开发过程中，模型往往是项目创建好之后第一个去编写的部分。Django 当中模型部分的开发流程如下：

1. 创建应用，并将其加入到 settings.py 文件的 installed_app 中
2. 在 models.py 中定义模型类，要求继承自 models.Model
3. 生成迁移文件
4. 执行迁移生成表
5. 使用模型类进行crud操作

除了按照上面的方法手动创建模型之外还可以先自行在数据库中创建好对应的表，然后使用下面的语句来生成对应的模型类：

```
python manage.py inspectdb > booktest/models.py
```

但是这种情况下会生成很多不需要的类，因此还是建议手动来创建需要的模型。接下来将详细介绍创建模型类中所需要注意的知识点。

## 一、创建项目应用

创建一个 Django 项目的过程可以参考：[Python3 Django（四）Django web 开发流程总结](https://wangxin1248.github.io/python/2019/02/python3-django-04.html)

这里介绍如何在 Django 中使用 mysql 数据库。

首先创建项目所对应的数据库，接下来在创建好的 Django 项目中的 settings.py 文件中配置使用对应的 mysql 数据库：

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',# 选择使用mysql的驱动
        'NAME': '',# 数据库名称
        'USER': '',# 数据库用户名
        'PASSWORD': '',# 数据库用户对应密码
        'HOST': '',# 数据库ip
        'PORT': '3306',# 数据库端口号，默认是3306
    }
}
```

在这里由于 python3 使用的 mysql 驱动是 PyMySQL，因此得在 Django 项目中设置一下。

首先在 \_\_init__.py 中添加如下的内容：

```python
import pymysql
pymysql.install_as_MySQLdb()
```

之后在所安装的 django 模块下修改下面这个文件

python3.6/site-packages/django/db/backends/mysql/base.py

注释掉下面的内容：

```
if version < (1, 3, 13):
    raise ImproperlyConfigured('mysqlclient 1.3.13 or newer is required; you have %s.' % Database.__version__)
```

之后就可以创建对应的应用，并将其加到 settings.py 文件中。

## 二、定义模型

Django 中的模型是和创建的应用所对应的，创建的模型的文件是在 models.py 下。

### 1.模型的作用

1. 在模型中所定义的属性，会在对应的表中生成的字段。
2. Django 则会根据属性的类型确定以下信息：
    - 当前选择的数据库支持字段的类型
    - 渲染管理表单时使用的默认html控件
    - 在管理站点最低限度的验证
3. Django 会为表增加自动增长的主键列，每个模型只能有一个主键列，如果使用选项设置某属性为主键列后，则 Django 不会再生成默认的主键列
4. 属性命名限制
    - 不能是python的保留关键字
    - 由于django的查询方式，不允许使用连续的下划线

### 2.模型的属性

在定义模型中所具有的属性时，需要确定该属性所对应的字段类型。字段类型被定义在 django.db.models.fields 目录下，为了方便使用，已经在该模型的 \_\_init__.py 中导入到 django.db.models中

创建模型属性的方法：

- 首先导入 from django.db import models
- 通过 models.Field 创建字段类型的对象，赋值给属性

注意：对于重要数据都做**逻辑删除，不做物理删除**，实现方法是定义 isDelete 属性，类型为 BooleanField，默认值为 False

Django 中所属性所支持的字段类型包括：

- AutoField：一个根据实际ID自动增长的IntegerField，通常不指定，如果不指定，一个主键字段将自动添加到模型中
- BooleanField：true/false 字段，此字段的默认表单控制是CheckboxInput
- NullBooleanField：支持null、true、false三种值
- CharField(max_length=字符长度)：字符串，默认的表单样式是 TextInput
- TextField：大文本字段，一般超过4000使用，默认的表单控件是Textarea
- IntegerField：整数
- DecimalField(max_digits=None, decimal_places=None)：使用python的Decimal实例表示的十进制浮点数
- DecimalField.max_digits：位数总数
- DecimalField.decimal_places：小数点后的数字位数
- FloatField：用Python的float实例来表示的浮点数
- DateField[auto_now=False, auto_now_add=False])：使用Python的datetime.date实例表示的日期
- 参数DateField.auto_now：每次保存对象时，自动设置该字段为当前时间，用于"最后一次修改"的时间戳，它总是使用当前日期，默认为false
- 参数DateField.auto_now_add：当对象第一次被创建时自动设置当前时间，用于创建的时间戳，它总是使用当前日期，默认为false
- 该字段默认对应的表单控件是一个TextInput. 在管理员站点添加了一个JavaScript写的日历控件，和一个“Today"的快捷按钮，包含了一个额外的invalid_date错误消息键
- auto_now_add, auto_now, and default 这些设置是相互排斥的，他们之间的任何组合将会发生错误的结果
- TimeField：使用Python的datetime.time实例表示的时间，参数同DateField
- DateTimeField：使用Python的datetime.datetime实例表示的日期和时间，参数同DateField
- FileField：一个上传文件的字段
- ImageField：继承了FileField的所有属性和方法，但对上传的对象进行校验，确保它是个有效的image

对于模型中的属性来说，不仅需要指定该属性的类型还可以指定该属性的选项。

通过属性选项，可以实现对属性字段的约束，在创建属性字段时通过关键字参数来指定，可以指定的选项包括：

- null：如果为True，Django 将空值以NULL 存储到数据库中，默认值是 False
- blank：如果为True，则该字段允许为空白，默认值是 False。与null的对比：null是数据库范畴的概念，blank是表单验证证范畴的
- db_column：字段的名称，如果未指定，则使用属性的名称
- db_index：若值为 True, 则在表中会为此字段创建索引
- default：默认值
- primary_key：若为 True, 则该字段会成为模型的主键字段
- unique：如果为 True, 这个字段在表中必须有唯一值

### 3.模型间的关系

模型见的关系表示的就是实体之间的关系，具体的包括：
- ForeignKey：一对多，将字段定义在多的端中
- ManyToManyField：多对多，将字段定义在两端中
- OneToOneField：一对一，将字段定义在任意一端中

而且还可以维护递归的关联关系，使用'self'指定，也就是“自关联”

在确定了各个模型之间的关系之后便可以通过模型类来访问其中被关系约束的其他模型对象。比如以图书（bookinfo）和英雄（heroinfo）两个模型类来说，其中图书和英雄的关系是一对多。

- 一访问多：对象.模型类小写_set

```
bookinfo.heroinfo_set
```
- 一访问一：对象.模型类小写
```
heroinfo.bookinfo
```
- 访问id：对象.属性_id
```
heroinfo.book_id
```

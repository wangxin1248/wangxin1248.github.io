---
layout: post
title:  "Python3 Django（六）模型详解"
date:  2019-06-06
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

但是这种情况下会生成很多不需要的类，因此还是建议手动来创建需要的模型。接下来将详细介绍 Django 使用 mysql 数据库创建模型类中所需要注意的知识点。

## 一、项目配置mysql

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

### 3.模型的元选项

可以在模型类中定义一个内部类：Meta，该类用于设置元信息

支持设置的元信息包括：

- db_table：自定义数据表的名称，推荐使用小写字母。Django 中默认的数据表的默认名称是<app_name>_<model_name>
- ordering：对象的默认排序字段，获取对象的列表时使用，接收属性构成的列表。字符串前加 **-** 表示倒序，不加 **-** 表示正序。注意：排序会增加数据库的开销。

例如，在 Book 类中设置对应的元选项

```python
class Book(models.Model):
    ...
    class Meta():
        # 表示按照 id 字段升序排序
        ordering = ['id']

class Book(models.Model):
    ...
    class Meta():
        # 表示按照 id 字段降序排序
        ordering = ['-id']
```

### 4.案例演示

在创建的应用中的 models.py 中定义如下两个模型：

```python
from django.db import models
class Book(models.Model):
    # 书名
    b_name = models.CharField(max_length=20)
    # 出版时间
    b_pub_date = models.DateField()
    # 阅读量
    b_read = models.IntegerField(default=0)
    # 评论量
    b_comment = models.IntegerField(default=0)
    # 逻辑删除
    is_delete = models.BooleanField(default=False)
class Hero(models.Model):
    # 英雄名称
    h_name = models.CharField(max_length=20)
    # 英雄性别
    h_gender = models.BooleanField(default=True)
    # 英雄个人简介
    h_content = models.CharField(max_length=100)
    # 逻辑删除
    is_delete = models.BooleanField(default=False)
    # 所属图书
    book = models.ForeignKey('Book', on_delete=models.CASCADE,)

```

定义完之后，执行模型迁移工作：

首先生成迁移文件

```shell
$ python manage.py makemigrations
```

这里出现了如下的错误：

```
Traceback (most recent call last):
  File "manage.py", line 21, in <module>
    main()
...
  File "/home/wx/django/env/lib/python3.6/site-packages/django/db/backends/mysql/operations.py", line 146, in last_executed_query
    query = query.decode(errors='replace')
AttributeError: 'str' object has no attribute 'decode'
```

解决办法：

```shell
sudo vi /home/wx/django/env/lib/python3.6/site-packages/django/db/backends/mysql/operations.py
```

找到报错的那一行，将 decode 修改为 encode。

```shell
    query = query.encode(errors='replace')
```

之后在生成迁移文件便不会报错了。

接下来执行迁移操作：

```shell
$ python manage.py migrate
```

接下来在数据库中查看下所生成的对应的数据库文件：

```shell
mysql> show tables;
+----------------------------+
| Tables_in_test1            |
+----------------------------+
| auth_group                 |
| auth_group_permissions     |
| auth_permission            |
| auth_user                  |
| auth_user_groups           |
| auth_user_user_permissions |
| booktest_book              |
| booktest_hero              |
| django_admin_log           |
| django_content_type        |
| django_migrations          |
| django_session             |
+----------------------------+
```

查看下定义的模型所生成的对应数据库结构：

```shell
mysql> desc booktest_book;
+------------+-------------+------+-----+---------+----------------+
| Field      | Type        | Null | Key | Default | Extra          |
+------------+-------------+------+-----+---------+----------------+
| id         | int(11)     | NO   | PRI | NULL    | auto_increment |
| b_name     | varchar(20) | NO   |     | NULL    |                |
| b_pub_date | date        | NO   |     | NULL    |                |
| b_read     | int(11)     | NO   |     | NULL    |                |
| b_comment  | int(11)     | NO   |     | NULL    |                |
| is_delete  | tinyint(1)  | NO   |     | NULL    |                |
+------------+-------------+------+-----+---------+----------------+
```

```shell
mysql> desc booktest_hero;
+-----------+--------------+------+-----+---------+----------------+
| Field     | Type         | Null | Key | Default | Extra          |
+-----------+--------------+------+-----+---------+----------------+
| id        | int(11)      | NO   | PRI | NULL    | auto_increment |
| h_name    | varchar(20)  | NO   |     | NULL    |                |
| h_gender  | tinyint(1)   | NO   |     | NULL    |                |
| h_content | varchar(100) | NO   |     | NULL    |                |
| is_delete | tinyint(1)   | NO   |     | NULL    |                |
| book_id   | int(11)      | NO   | MUL | NULL    |                |
+-----------+--------------+------+-----+---------+----------------+
```

可以看到我们所定义的模型中的属性被 django 设置成了符合 mysql 的格式，这就是 ORM 的功能。

接下来向数据库中插入一些测试数据：

```mysql
insert into booktest_book(b_name,b_pub_date,b_read,b_comment,is_delete) values
('射雕英雄传','1980-5-1',12,34,0),
('天龙八部','1986-7-24',36,40,0),
('笑傲江湖','1995-12-24',20,80,0),
('雪山飞狐','1987-11-11',58,24,0);

insert into booktest_hero(h_name,h_gender,book_id,h_content,is_delete) values
('郭靖',1,1,'降龙十八掌',0),
('黄蓉',0,1,'打狗棍法',0),
('黄药师',1,1,'弹指神通',0),
('欧阳锋',1,1,'蛤蟆功',0),
('梅超风',0,1,'九阴白骨爪',0),
('乔峰',1,2,'降龙十八掌',0),
('段誉',1,2,'六脉神剑',0),
('虚竹',1,2,'天山六阳掌',0),
('王语嫣',0,2,'神仙姐姐',0),
('令狐冲',1,3,'独孤九剑',0),
('任盈盈',0,3,'弹琴',0),
('岳不群',1,3,'华山剑法',0),
('东方不败',0,3,'葵花宝典',0),
('胡斐',1,4,'胡家刀法',0),
('苗若兰',0,4,'黄衣',0),
('程灵素',0,4,'医术',0),
('袁紫衣',0,4,'六合拳',0);
```

## 三、模型成员

之前所创建的模型类只是定义了一个类，需要通过这些模型对数据库的内容进行修改的话得创建对应的实例对象。接下来介绍下专门针对模型类以及实例对象的属性设置。

### 1.模型管理器

每一个定义的 Django 模型类都默认有一个类属性：objects，是 Manager 类型的对象，主要用于与数据库进行交互。模型管理器是 Django 的模型进行数据库的查询操作的接口，Django 应用的每个模型都拥有至少一个管理器，是模型类中的一个属性，负责 ORM 的工作，与数据库进行交互。

当在创建模型的时候是可以指定模型类的管理器，假如没有指定模型类的管理器的话，那么 Django 会为模型类提供一个名为 objects 的默认管理器。假如在创建模型的时候为模型类指定管理器后，Django 便不再为模型类生成名为 objects 的默认管理器。

自定义管理器类主要用于两种情况：

- 情况一：向管理器类中添加额外的方法
- 情况二：修改管理器返回的原始查询集

在模型中自定义模型管理属性的方法：首先创建一个自定义的模型管理器类，再在创建模型类的时候指定一个属性指向所创建自定义的模型管理器类对象。

```python
class BookManager(models.Manager):
    # 修改原始的查询集，筛除掉已经被逻辑删除的记录
    def get_queryset(self):
        return super(BookManager, self).get_queryset().filter(isDelete=False)
class Book(models.Model):
    ...
    book_manager = BookManager()
```

### 2.创建实例对象

当定义好模型类之后，想要对数据库进行操作的话就必须创建对应的模型类对象。并且在创建对象时，Django 不会对数据库进行读写操作，只有在调用对象的 save() 方法时才会与数据库交互，将对象保存到数据库中。

由于模型类中的\_\_init__ 方法已经在基类 models.Model 中定义了相关操作，因此在自定义模型对象中无法使用。所以创建模型类的实例对象只能通过关键字参数构造模型对象的方法。但是这种方式比较麻烦，所以推荐使用下面的两种方式：

- 方式一：在模型类中增加一个类方法

```python
class Book(models.Model):
    ...
    @classmethod
    def create(cls, name, pub_date, read, comment, delete):
        book = cls(b_name=name, b_pub_date=pub_date, b_read=read, b_comment=comment, is_delete=delete)
        return book

import datetime
book=BookInfo.create("hello",datetime(1980,10,11),0,0,False);
book.save()
```

- 方式二：在自定义管理器中添加一个方法，在管理器的方法中，可以通过 self.model 来得到它所属的模型类

```python
class BookManager(models.Manager):
    def create_book(self, name, pub_date, read, comment, delete):
        book = self.model()
        book.b_name = name
        book.b_pub_date = pub_date
        book.b_read=read
        book.b_comment=comment
        book.is_delete = delete
        return book

class Book(models.Model):
    ...
    book_manager = BookManager()

book=Book.books.create_book("abc",datetime(1980,1,1),0,0,False)
book.save()
```

在上面的方法中，可以在自定义管理器中调用 self.create() 创建并保存对象，不需要再使用对象调用 save()

```python
class BookManager(models.Manager):
    def create_book(self, name, pub_date, read, comment, delete):
        book = self.create(b_name=name, b_pub_date=pub_date, b_read=read, b_comment=comment, is_delete=delete)
        return book

class Book(models.Model):
    ...
    book_manager = BookManager()

book=Book.books.create_book("abc",datetime(1980,1,1),0,0,False)
# 查看创建是否写入数据库成功
book.pk
```

虽然上面的两种方式都可以实现快速创建模型类的实例对象，但是 Django 建议大家使用第二种方式，即使用自定义模型类的方式来实现，因为这样还可以在自定义的模型类中增加一些其他方法。

注意上面的操作只是在模型类上的 ORM 管理类上进行了修改，并没有在模型的结构上进行修改。所以不需要重新迁移模型结构到数据库中。

### 3.实例对象方法

创建好的模型类实例对象可以通过如下的方法实现对数据库的访问：

- str(self)：将对象转换成字符串时会被调用
- save()：将模型对象保存到数据表中
- delete()：将模型对象从数据表中删除

## 四、模型查询

在定义好模型并迁移到数据库之后，最常见的操作便是对模型的查询操作了。通常对模型进行的查询操作是通过其指定的模型管理器类来控制的，常见的查询命令如下：

- all()：查询该模型中的所有记录
- filter()：按照条件来查询符合要求的记录
- exclude()：查询不符合要求的所有记录
- order_by()：按照指定的要求对查询结果进行排序
- values()：将数据库中的记录构造为字典，所有的记录字典构成列表返回
- get()：返回满足要求的单条记录，如果未找到会引发"模型类.DoesNotExist"异常，如果多条被返回，会引发"模型类.MultipleObjectsReturned"异常
- count()：返回当前查询的总条数
- first()：返回查询到的第一条记录
- last()：返回查询到的最后一条记录
- exists()：判断查询集中是否有数据，如果有则返回True

### 1.查询集

在模型类管理器上调用过滤器方法会返回查询集，查询集经过过滤器筛选后返回新的查询集，因此可以写成链式过滤。

查询集是惰性执行的，即创建查询集不会带来任何数据库的访问，直到调用数据时，才会访问数据库。只有在迭代，序列化，与if合用时才会立即执行查询集。

查询集返回的结果是列表，可以使用下标的方式进行限制，等同于 sql 中的 limit 和 offset 子句

注意：

- 不支持负数索引
- 使用下标后返回一个新的查询集，不会立即执行查询
- 如果获取一个对象，直接使用[0]，等同于[0:1].get()，但是如果没有数据，[0]引发IndexError异常，[0:1].get()引发DoesNotExist异常

每个查询集都包含一个缓存来最小化对数据库的访问，在新建的查询集中，缓存为空，首次对查询集求值时，会发生数据库查询，Django 会将查询的结果存在查询集的缓存中，并返回请求的结果，接下来对查询集求值将重用缓存的结果

案例一：这构成了两个查询集，无法重用缓存，每次查询都会与数据库进行一次交互，增加了数据库的负载

```python
print([e.title for e in Entry.objects.all()])
print([e.title for e in Entry.objects.all()])
```

案例二：两次循环使用同一个查询集，第二次使用缓存中的数据

```python
querylist=Entry.objects.all()
print([e.title for e in querylist])
print([e.title for e in querylist])
```

那么何时查询集不会被缓存呢？

只有当只对查询集的部分进行求值时会检查缓存，但是如果这部分不在缓存中，那么接下来查询返回的记录将不会被缓存，这意味着使用索引来限制查询集将不会填充缓存，如果这部分数据已经被缓存，则直接使用缓存中的数据

### 2.字段查询

Django 中是使用 filter()、exclude()、get() 等方法来查询数据库中的记录的，为了实现 sql 语句中的 where 命令， Django 也支持使用字段来查询，这些字段是作为方法 filter()、exclude()、get() 的参数。

字段查询的语法格式为：

```
属性名称__比较运算符=值
```

其中：

- \_\_表示两个下划线，左侧是属性名称，右侧是比较运算符
- 对于外键，使用“属性名_id”表示外键的原始值
- 对于 sql 中的模糊查询 like 语句来说，% 是关键字，是用来匹配数据中的任意一个字符。在 Django 过滤器中可以直接这么写，表示查找标题中包含 % 的记录。

```python
# sql:where title like '%\%%'
filter(title__contains="%")
```

下面介绍在字段查询中常见的比较运算符（以 Book.book_manager.filter 条件查询为例）：

- exact：表示判等，大小写敏感；如果没有写“ 比较运算符”，表示判等

```python
filter(is_delete=False)
```

- contains：是否包含，大小写敏感

```python
filter(b_name__contains='传')
```

- startswith、endswith：以 value 开头或结尾，大小写敏感

```python
filter(b_name__endswith='传')
```

- isnull、isnotnull：是否为null

```python
filter(b_name__isnull=False)
```

- 在前面加个i表示不区分大小写，如 iexact、icontains、istarswith、iendswith
- in：是否包含在范围内

```python
filter(pk__in=[1, 2, 3, 4, 5])
```

- gt、gte、lt、lte：大于、大于等于、小于、小于等于

```python
filter(id__gt=3)
```

- year、month、day、week_day、hour、minute、second：对日期间类型的属性进行运算

```python
filter(b_pub_date__year=1980)
filter(b_pub_date__gt=date(1980, 12, 31))
```

- 跨关联关系的查询：处理join查询
    - 格式：模型类名__属性名__比较运算符=值
    - 可以没有__<比较>部分，表示等于，结果同inner join
    - 可返向使用，即在关联的两个模型中都可以使用

```python
filter(hero__h_content__contains='八')
```

- 查询的快捷方式：pk，pk表示primary key，默认的主键是id

```python
filter(pk__lt=6)
```

### 3.聚合函数

Django 还支持使用 aggregate() 函数返回聚合函数的值

aggregate() 函数支持：Avg，Count，Max，Min，Sum 等方法

### 4.F对象

上面的字段查询都是使用某一个字段与一个指定的值进行比较，但是有些时候可能会出现和其他字段的值进行比较的情况，此时就需要使用到 F 对象（django.db.models.F）。

当使用模型的字段A 与字段B 进行比较时，如果 A写在了等号的左边，则 B出现在等号的右边，需要通过 F对象构造

```python
list.filter(b_read__gte=F('b_commet'))
```
Django 支持对F()对象使用算数运算

```python
list.filter(b_read__gte=F('b_commet') * 2)
```

F()对象中还可以写作“模型类__列名”进行关联查询

```python
list.filter(is_delete=F('hero__is_delete'))
```

对于date/time字段，可与timedelta()进行运算

```python
list.filter(b_pub_date__lt=F('b_pub_date') + timedelta(days=1))
```

### 5.Q对象

在查询集中使用过滤器的方法进行关键字参数查询时，会合并为 And 进行，也就是多个查询条件是逻辑与的关系，假如要对这些查询条件使用逻辑或进行连接的时候就需要使用 Q 对象。

Q对象(django.db.models.Q) 用于封装一组关键字参数，这些关键字参数与“比较运算符”中的相同

```python
from django.db.models import Q
list.filter(Q(pk__lt=6))
```

Q对象可以使用 **&（and）** 或者 **|（or）** 操作符组合起来，表示逻辑与和逻辑或，但一般链式过滤器查询就是逻辑或，因此一般不使用这些操作符。

当操作符应用在两个 Q 对象时，会产生一个新的 Q 对象

```python
list.filter(pk__lt=6).filter(b_commet__gt=10)
list.filter(Q(pk__lt=6) | Q(b_commet__gt=10))
```

使用 **~（not）** 操作符在Q对象前表示取反

```python
list.filter(~Q(pk__lt=6))
```

注意：

- 可以使用 &|~ 结合括号进行分组，构造做生意复杂的 Q 对象
- 过滤器函数可以传递一个或多个 Q 对象作为位置参数，如果有多个 Q 对象，这些参数的逻辑为 and
- 过滤器函数可以混合使用 Q 对象和关键字参数，所有参数都将 and 在一起，Q 对象必须位于关键字参数的前面

## 五、总结

本文将 Django中的模型有关的操作进行了整理，并且使用 mysql 数据库来作为 Django 存储的数据库。介绍了如何在 Django 中使用 mysql 数据库，如何创建模型，并将模型迁移到数据库当中，并且介绍了如何对模型进行条件查询。

模型创建和查询作为 Django 中最关键的步骤非常重要，是为整个项目提供数据支持的。一般在项目创建的开始便进行这部分任务，通过是先设计好数据库的结构在直接编写对应的模型类，对模型类的相关操作也是配合视图部分进行的。
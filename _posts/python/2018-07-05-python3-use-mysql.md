---
layout: post
title:  "Python3 MySQL 数据库连接"
date:  2018-07-05
desc: "本文将为大家介绍 Python3 使用 PyMySQL 连接数据库，并实现简单的增删改查以及封装为帮助类。"
keywords: "Python3,PyMySQL,数据库"
categories: [Python]
tags: [python3,mysql]
---

# Python3 MySQL 数据库连接

本文将为大家介绍 Python3 使用 PyMySQL 连接数据库，并实现简单的增删改查以及封装为帮助类。

PyMySQL 是在 Python3.x 版本中用于连接 MySQL 服务器的一个库，Python2中则使用 mysqldb。

PyMySQL 遵循 Python 数据库 API v2.0 规范，并包含了 pure-Python MySQL 客户端库。

主要内容包括：

##### · PyMySQL 安装
##### · 删除、添加、修改数据
##### · 查询数据 
##### · 封装 MySQLHelper 类 

-----

## PyMySQL 安装

```
$ pip3 install PyMySQL
```

假如系统提示没有pip3的话可以使用下面的命令来安装pip3

```
sudo apt install python-pip3
```

## 创建数据库连接

在 python 中想要操作数据库必须得先创建对应的数据库连接，并且使用数据库连接来创建 **游标（cursor）**对象。通过游标对象来执行相应的 sql语句来实现与数据库的数据通信。

通过使用 pymysql 模块中的 **connect**方法来创建数据库连接，connect方法接收数据库连接的相应配置信息。通过数据库的连接对象便可以创建相应的游标对象。

创建数据库连接对象常用的参数：

##### · host：连接数据库的地址
##### · user：连接数据库用户名
##### · password：用户对应密码
##### · database：连接的数据库名称
##### · charset：指定的字符编码集
##### · port：连接数据库的端口号（默认为3306，可以指定，整数类型）

一个创建数据库连接对象的实例：

```python
import pymysql


# 打开数据库连接
conn= pymysql.connect(host='localhost', user='wx', password='wx123456', database='python3', charset='utf8')

# 使用cursor方法来创建一个游标对象
cursor = conn.cursor()
```

## 删除、添加、修改数据

在创建了数据库的连接对象之后便可以进行对数据库数据的操作了，其中支持的操作有：对数据库数据执行增删改查操作，对数据库进行创建数据库、创建表、修改表等操作。但是在一般开发过程中数据库的结构会在一开始设计的时候就设计好，所以在程序中经常使用的还是对数据的增删改查操作。

由于对数据的删除、添加、修改都不需要返回数据，所以这三种操作是一种类型的。在python中是通过游标对象调用 execute 函数传入对应的 sql 语句来执行相应的 sql 命令。该方法的返回结果为受影响的行数。

简单的删除数据、添加数据、删除数据实例：

```python
# 执行的sql语句
# 插入数据
sql = 'insert into students(name) values("wangxin")'
# 修改数据
sql = 'update students set name = "xxoo" where id = 5'
# 删除数据
sql = 'delete from students where id =5'

# 执行sql语句,返回受影响的行数
row = cursor.execute(sql)
```

### SQL语句参数化

在构造sql语句的时候还可以使用 **参数化**，这样会避免出现sql注入的问题

例如：一个简单的SQL注入

```sql
select * from students where name = 'input_name';
```

用户可以在输入用户名的时候输入：a' or 1=1 or '，这样最后执行的sql语句就是：

```sql
select * from studnets where name = 'a' or 1=1 or '';
```

这样就会导致将所有的数据都显示出来。

而使用 **参数化**则可以解决这个问题：

在sql语句中使用将要用户输入的信息的位置使用 **%s** 来当作占位符，再将用户输入的数据以列表的形式存储，在执行execute函数时做为参数直接传入即可。python会在后台帮我们将用户输入的字符中的特殊符号进行处理，最后以字符串的形式组合在sql语句中。

使用参数化来实现查询的例子：

```python
name = input('请输入姓名：')
sql = 'insert into students(name) values(%s)'

# 执行sql语句,返回受影响的行数
row = cursor.execute(sql, [name])
```

### 提交修改

由于 pymysql 是默认支持事务的，所以在对数据进行删除、添加、修改操作之后还得需要将结果进行提交操作，否则的话数据库中的数据是不会发生变化的。

```python
# 提交事务
conn.commit()
```

### 关闭连接

当对数据库的操作完成之后便需要将当前的连接对象关闭以节约资源。因为是通过 connect 对象创建的 cursor 对象，所以需要先关闭 cursor 对象再来关闭 connect 对象。

```python
# 关闭相应的连接
cursor.close()
conn.close()
```

### 完整的对数据库数据修改代码

由于在对数据库的操作过程中可以会有异常产生。所以在对数据库进行操作时需要进行相应的 **异常捕获**

```python
import pymysql

try:
    # 打开数据库连接
    conn= pymysql.connect(host='localhost', user='wx', password='wx123456', database='python3', charset='utf8')

    # 使用cursor方法来创建一个游标对象
    cursor = conn.cursor()

    # 执行的sql语句
    # 插入数据
    sql = 'insert into students(name) values("wangxin")'
    # 修改数据
    sql = 'update students set name = "xxoo" where id = 5'
    # 删除数据
    sql = 'delete from students where id =5'

    # 执行sql语句,返回受影响的行数
    # row = cursor.execute(sql)

    # 参数化
    name = input('请输入姓名：')
    sql = 'insert into students(name) values(%s)'

    # 执行sql语句,返回受影响的行数
    row = cursor.execute(sql, [name])

    print(row)
    # 提交事务
    conn.commit()
except Exception as e:
    print(e)
finally:
    # 关闭相应的连接
    cursor.close()
    conn.close()
```

## 查询数据

在程序中对数据库进行的最多操作便是数据查询操作，而通过 pymysql 进行数据查询时与修改数据的操作基本一致。主要是查询操作会有返回的结果元祖，需要单独进行操作。

使用 cursor 对象中的 **fetchall**和 **fetchone**方法来分别获取所有的返回结果和单独一条返回结果。返回的结果类型为 **元祖**类型，假如是使用 fetchall 则会返回一个元祖中嵌套多个元祖。

```python
# 查询多条数据
sql = 'select * from students'
cursor1.execute(sql)
# 获取执行的sql语句返回的所有结果
result = cursor1.fetchall()
print(result)


# 查询单条数据
sql = 'select * from students where id=1'
rows = cursor1.execute(sql)
result = cursor1.fetchone()
print(result)
```

### 完整的查询操作实例

由于在对数据库的操作过程中可以会有异常产生。所以在对数据库进行操作时需要进行相应的 **异常捕获**

```python
import pymysql

try:
    conn = pymysql.connect(host='localhost', user='wx', password='wx123456', database='python3', charset='utf8')
    cursor1 = conn.cursor()

    # sql = 'select * from students'
    sql = 'select * from students where id=1'
    rows = cursor1.execute(sql)
    if rows > 0:
        # 获取执行的sql语句返回的所有结果
        # result = cursor1.fetchall()
        result = cursor1.fetchone()
        print(result)
except Exception as e:
    print(e)
finally:
    cursor1.close()
    conn.close()
```

## 封装 MySQLHelper 类

由于在项目中对数据库的操作是比较频繁的，所以可以将一些比较常用的操作进行 **封装**处理。这样就可以在其他地方很方便的操作数据库了。

下面是我的一个简单封装：

```python
import pymysql


class MySQLHelper(object):
    """python操作mysql帮助类"""

    def __init__(self, host, user, password, database, charset, port=3306):
        """初始化帮助类所需函数"""
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.charset = charset
        self.port = port
        self.conn = None
        self.cursor = None

    def open(self):
        """创建对应的mysql连接"""
        self.conn = pymysql.connect(host=self.host, user=self.user, password=self.password, database=self.database, charset=self.charset, port=self.port)
        self.cursor = self.conn.cursor()

    def close(self):
        """关闭创建的mysql连接"""
        self.conn.close()
        self.cursor.close()

    def alter(self, sql, parameters=[]):
        """修改、更新、删除数据"""
        try:
            rows = self.cursor.execute(sql, parameters)
            if rows > 0:
                print('OK')
                # 假如执行成功则提交事务
                self.conn.commit()
        except Exception as e:
            print(e)
        finally:
            self.close()

    def fetch_all(self, sql, parameters=[]):
        """查询多条数据"""
        try:
            rows = self.cursor.execute(sql, parameters)
            if rows > 0:
                result = self.cursor.fetchall()
                for row in result:
                    print(row)
        except Exception as e:
            print(e)
        finally:
            self.close()

    def fetch_one(self, sql, parameters=[]):
        """查询一条数据"""
        try:
            rows = self.cursor.execute(sql, parameters)
            if rows > 0:
                result = self.cursor.fetchone()
                print(result)
        except Exception as e:
            print(e)
        finally:
            self.close()

```
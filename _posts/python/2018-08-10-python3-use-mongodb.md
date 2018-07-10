---
layout: post
title:  "Python3 MongoDB 数据库连接"
date:  2018-07-10
desc: "本文将为大家介绍 Python3 使用 pymongo 连接数据库，并实现简单的增删改查操作"
keywords: "Python3,pymongo,MongoDB"
categories: [Python]
tags: [python3,mongodb]
---

# Python3 MongoDB 数据库连接

本文将为大家介绍 Python3 使用 pymongo 连接数据库，并实现简单的增删改查操作。主要内容包括：

##### 1.安装 pymongo 模块
##### 2.使用 pymongo 对 MongoDB数据库进行操作

---

## 一、安装 pymongo 模块

安装 pymongo 有很多方式，比较推荐的是使用 python 的 pip 来安装。

```shell
$ python3 -m pip install pymongo
```

安装完成之后便可以编写简单的代码来通过 pymongo 来访问 mongodb 数据库。

## 二、使用 pymongo 对 MongoDB数据库进行操作

### 第一步：引入包

```python
from pymongo import MongoClient
```

### 第二步：创建 MongoClient对象

这里创建 client对象主要有两种，一种是无安全认证的，一种是有安全认真的。

无安全认证：

```python
client = MongoClient('mongodb://localhost:27017')
```

有安全认证：

```python
client = MongoClient('mongodb://用户名:密码@localhost:27017/数据库名称')
```

### 第三步：创建 database对象

获取数据库对象

```python
db = client.数据库名称
```

### 第四步：创建 collection对象

获取数据库 db中所对应的 collection对象

```python
collect = db.集合名
```

对于 collection对象来说具有如下的方法：

##### · insert_one：插入一条数据
##### · insert_many：插入多条数据
##### · update_one：更新一条数据
##### · update_many：更新多条数据
##### · delete_one：删除一条数据
##### · delete_many：删除多条数据
##### · find_one：查询一条数据
##### · find：查询数据

接下来通过这些方法来实现对 mongodb数据库中数据的增删改查

#### 插入数据

```python
# 插入一条数据
result = stu.insert_one({'name': '张三', 'age': 18})
print(result.inserted_id)

# 插入多条数据(列表中包含字典类型)
result = stu.insert_many([{'name': '李四', 'age': 22}, {'name': '王五', 'age': 25}])
print(result.inserted_ids)
```

#### 更新数据

```python
# 更新一条数据
result = stu.update_one({'name': '张三'}, {'$set': {'name': '王大'}})
print(result.modified_count)

# 更新多条数据
result = stu.update_many({'age': {'$gt': 18}}, {'$set': {'name': '王大'}})
print(result.modified_count)
```

#### 删除数据

```python
# 删除一条数据
result = stu.delete_one({'name': '王五'})
print(result.deleted_count)

# 删除多条数据
result = stu.delete_many({'name': '王大'})
print(result.deleted_count)
```

#### 查询数据

```python
# 查询数据
result = stu.find_one({'name': '哈哈哈'})
print(result)

# 查询所有满足条件的数据
for result in stu.find({}):
    print(result)
```

## 示例代码

```python
# 引入包
from pymongo import MongoClient

# 创建mongodb连接对象
client = MongoClient('mongodb://localhost:27017')

# 创建数据库对象
db = client.py3

# 创建集合对象
stu = db.stu

# 插入一条数据
result = stu.insert_one({'name': '张三', 'age': 18})
print(result.inserted_id)

# 插入多条数据(列表中包含字典类型)
result = stu.insert_many([{'name': '李四', 'age': 22}, {'name': '王五', 'age': 25}])
print(result.inserted_ids)


# 更新一条数据
result = stu.update_one({'name': '张三'}, {'$set': {'name': '王大'}})
print(result.modified_count)

# 更新多条数据
result = stu.update_many({'age': {'$gt': 18}}, {'$set': {'name': '王大'}})
print(result.modified_count)


# 删除一条数据
result = stu.delete_one({'name': '王五'})
print(result.deleted_count)

# 删除多条数据
result = stu.delete_many({'name': '王大'})
print(result.deleted_count)

# 查询数据
result = stu.find_one({'name': '哈哈哈'})
print(result)

# 查询所有满足条件的数据
for result in stu.find({}):
    print(result)
```
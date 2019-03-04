---
layout: post
title:  "Python3 Django（五）ORM 简介"
date:  2019-03-04
desc: "python3 服务器开发系列之 Django 开发实战（五）：对 MVC 开发模型中的 ORM 一些基本的概念进行介绍"
keywords: "Python3,后台开发,实战,django,MVC,ORM"
categories: [Python]
tags: [python3,后台开发,django]
---
# ORM 简介

ORM（Object Relational Mapping）是指对象和关系之间映射操作。这是 MVC 框架当中非常重要的一部分。其主要作用是在编程中将面向对象的概念跟数据库中表的概念对应起来。可以实现在创建好一个实体对象类之后便生成一张与之相对应的数据库表。

## ORM 主要任务

- 根据类对象生成表结构
- 将对象、列表的操作，转换为sql语句
- 将sql查询到的结果转换为对象、列表

ORM 的诞生极大的减轻了开发人员的工作量，使得开发人员不需要面对因数据库变更而导致的无效劳动

## Django 中的 ORM

Django 中所定义的模型类包含存储数据的字段和约束，其就对应着数据库中唯一的表结构。Django 支持多种数据库配置，因此所对应的 ORM 操作便有相应的几份。Django所支持的数据库如下：

- mysql
- oracle
- sqlite3
- postgresql
- postgresql_psycopg2

主要的操作如下：

![orm](/assets/images/2019/2019-03/1.png)

当然，仅仅创建一个 python 模型类并不能实现从模型类到数据库的映射，还得需要一些其他的操作。具体的实现步骤如下：

- 在 models.py 中定义模型类，要求继承自 models.Model
- 创建应用并将应用加入 settings.py 文件的 installed_app 项
- 生成迁移文件
- 执行迁移生成表
- 使用模型类进行crud操作

## 使用数据库生成模型类

```shell
python manage.py inspectdb > booktest/models.py
```

## Django 中配置 mysql

打开settings.py文件，修改DATABASES项

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': '数据库名,
        'USER': '用户名',
        'PASSWORD': '密码',
        'HOST': '数据库服务器ip，本地可以使用localhost',
        'PORT': '端口，默认为3306',
    }
}
```
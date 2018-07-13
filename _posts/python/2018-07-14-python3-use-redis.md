---
layout: post
title:  "Python3 Redis 数据库连接"
date:  2018-07-14
desc: "本文将为大家介绍 Python3 使用 redis 连接数据库，并实现简单的增删改查操作"
keywords: "Python3,redis,Redis"
categories: [Python]
tags: [python3,redis]
---

# Python3 Redis 数据库连接

本文将为大家介绍 Python3 使用 redis 连接数据库，并实现简单的增删改查操作，主要内容包括：

#### 1.安装 redis 模块
#### 2.python 使用 redis 模块操作数据库
#### 3.基本功能封装

---

## 一、安装 redis 模块

安装 redis 模块推荐使用 pip 进行安装

```shell
$ sudo pip3 install redis
```

## 二、python 使用 redis 模块操作数据库

### 引入模块

```python
import redis
```

### 创建连接对象

```python
try:
    r=redis.StrictRedis(host='localhost',port=6379)
except Exception,e:
    print e.message
```

### 操作数据库

这里主要有两种方式来操作数据库：

**方式一：根据数据类型的不同，调用相应的方法，完成读写**

注意：更多方法同前面学的命令

```python
r.set('name','hello')
r.get('name')
```

**方式二：pipline**

缓冲多条命令，然后一次性执行，减少服务器-客户端之间TCP数据库包，从而提高效率

```python
pipe = r.pipeline()
pipe.set('name', 'world')
pipe.get('name')
pipe.execute()
```

## 三、封装

因为连接redis服务器部分是一致的，那么便可以将string类型的读写进行封装

```python
import redis
class RedisHelper():
    def __init__(self,host='localhost',port=6379):
        self.__redis = redis.StrictRedis(host, port)
    def get(self,key):
        if self.__redis.exists(key):
            return self.__redis.get(key)
        else:
            return ""
    def set(self,key,value):
        self.__redis.set(key,value)
```
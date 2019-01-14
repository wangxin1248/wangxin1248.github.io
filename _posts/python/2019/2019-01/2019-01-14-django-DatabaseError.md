---
layout: post
title:  "django.db.utils.DatabaseError: database disk image is malformed"
date:  2019-01-14
desc: "django 启动错误：django.db.utils.DatabaseError: database disk image is malformed"
keywords: "django,DatabaseError,database,image,malformed"
categories: [Python]
tags: [python3,django]
---
# django 创建 superuser 错误

在准备使用 django 的 manage.py 创建一个超级用户的时候遇到了下面的错误：

```bash
Traceback (most recent call last):
  File "/home/wx/project/env/lib/python3.6/site-packages/django/db/backends/utils.py", line 83, in _execute
    return self.cursor.execute(sql)
  File "/home/wx/project/env/lib/python3.6/site-packages/django/db/backends/sqlite3/base.py", line 294, in execute
    return Database.Cursor.execute(self, query)
sqlite3.DatabaseError: database disk image is malformed
```

分析原因应该是 sqlite 数据库的错误，因此尝试重新备份下数据库最终解决了这个 bug。

## 解决方法

### 1.下载安装 sqlite3（已安装跳过）

```bash
$ sudo apt-get install sqlite3
```

### 2.备份数据库

```bash
$ sqlite3 db.sqlite3 ".dump" > dump

mv db.sqlite3 db.sqlite3.backup

cat dump | sqlite3 db.sqlite3
```

这样数据库的错误便可以解决了。之后便可以正确的创建一个超级用户了。
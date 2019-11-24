---
layout: post
title:  "Python3 Django（十）第三方工具简介"
date:  2019-11-24
desc: "python3 服务器开发系列之 Django 开发实战（十）：Django 所使用到的第三方工具介绍"
keywords: "Python3,后台开发,实战,django,MVC,ORM"
categories: [Python]
tags: [python3,后台开发,django]
---
# Django 第三方工具简介

Django 在开发过程中除了使用 MVC 架构来实现基本的业务功能之外，有时一些高级操作也是需要第三方的工具来完成的。

本节就将介绍 Django 中常用的几种第三方工具，他们分别是：

- 富文本编辑器：tinymce
- 全文检索工具：haystack
- 异步加载工具：celery

接下来分别进行介绍

## 一、富文本编辑器

借助富文本编辑器，管理员能够编辑出来一个包含 html 的页面，从而页面的显示效果，可以由管理员定义，而不用完全依赖于前期开发人员。使用编辑器的显示效果为：

![image](/assets/images/2019/2019-11/28.png)

这里以 tinymce 为例来演示下如何在 Django 中使用富文本编辑器。

### 1.下载安装

使用 pip 来下载对应的包：

```shell
pip install tinymce
```

在 settings.py 中为 INSTALLED_APPS 添加编辑器应用

```py
INSTALLED_APPS = (
    ...
    'tinymce',
)
````

在 settings.py 中添加编辑配置项

```py
TINYMCE_DEFAULT_CONFIG = {
    'theme': 'advanced',
    'width': 600,
    'height': 400,
}
````

在根 urls.py 中配置

```py
urlpatterns = [
    ...
    url(r'^tinymce/', include('tinymce.urls')),
]
```

### 2.富文本编辑器使用

首先在所需应用中的模型类定义对应富文本编辑器的属性为 HTMLField

```py
from django.db import models
from tinymce.models import HTMLField

class HeroInfo(models.Model):
    ...
    hcontent = HTMLField()
````

接下来在 Django 自带的后台管理界面中查看该 HeroInfo 对应的数据，就会显示为富文本编辑器，而不是多行文本框

为了将富文本编辑器显示在模版页面中还需要在进行相应的设置。演示如下：

1.定义视图 editor ，用于显示编辑器并完成提交

```py
def editor(request):
    return render(request, 'other/editor.html')
```

2.配置url

```py
urlpatterns = [
    ...
    url(r'^editor/$', views.editor, name='editor'),
]
```

3.创建模板 editor.html

```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <script type="text/javascript" src='/static/tiny_mce/tiny_mce.js'></script>
    <script type="text/javascript">
        tinyMCE.init({
            'mode':'textareas',
            'theme':'advanced',
            'width':400,
            'height':100
        });
    </script>
</head>
<body>
<form method="post" action="/content/">
    <input type="text" name="hname">
    <br>
    <textarea name='hcontent'>哈哈hhhhh</textarea>
    <br>
    <input type="submit" value="提交">
</form>
</body>
</html>
```

4.定义视图 content，接收请求，并更新 heroinfo 对象

```py
def content(request):
    hname = request.POST['hname']
    hcontent = request.POST['hcontent']

    heroinfo = HeroInfo.objects.get(pk=1)
    heroinfo.hname = hname
    heroinfo.hcontent = hcontent
    heroinfo.save()

    return render(request, 'other/content.html', {'hero': heroinfo})
```

5.添加url项

```py
urlpatterns = [
    ...
    url(r'^content/$', views.content, name='content'),
]
```

6.定义模板 content.html

```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body>
姓名：{{hero.hname}}
<hr>
\{\% autoescape off \%\}
{{ hero.hcontent }}
\{\% endautoescape \%\}
</body>
</html>
```

## 二、全文检索

全文检索不同于特定字段的模糊查询，使用全文检索的效率更高，并且能够对于中文进行分词处理。接下来介绍在 Django 中使用全文检索的一个工具包：haystack


haystack 是 Django 的一个包，可以方便地对 model 里面的内容进行索引、搜索，设计为支持whoosh,solr,Xapian,Elasticsearc 四种全文检索引擎后端，属于一种全文检索的框架。

其中，whoosh 是纯 Python 编写的全文搜索引擎，虽然性能比不上 sphinx、xapian、Elasticsearc 等，但是无二进制包，程序不会莫名其妙的崩溃，对于小型的站点，whoosh 已经足够使用

另外为了实现全文检索还得需要对输入的正文进行分词，而分词就得需要使用一些特定的中文分词包，这里使用 jieba 一款免费的中文分词包，如果觉得不好用可以使用一些收费产品

### 1.安装

```shell
pip install django-haystack
pip install whoosh
pip install jieba
```

### 2.修改settings.py文件

```py
# 添加应用
INSTALLED_APPS = (
    ...
    'haystack',
)
# 添加搜索引擎
HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.whoosh_cn_backend.WhooshEngine',
        'PATH': os.path.join(BASE_DIR, 'whoosh_index'),
    }
}

# 自动生成索引
HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.RealtimeSignalProcessor'
```

### 3.在项目的urls.py中添加url

```py
urlpatterns = [
    ...
    url(r'^search/', include('haystack.urls')),
]
```

### 4.在应用目录下建立search_indexes.py文件

```py
from haystack import indexes
from models import GoodsInfo


class GoodsInfoIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)

    def get_model(self):
        return GoodsInfo

    def index_queryset(self, using=None):
        return self.get_model().objects.all()
```

### 5.在目录“templates/search/indexes/应用名称/”下创建“模型类名称_text.txt”文件

```py
#goodsinfo_text.txt，这里列出了要对哪些列的内容进行检索
{{ object.gName }}
{{ object.gSubName }}
{{ object.gDes }}
```

### 6.在目录“templates/search/”下建立search.html

```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body>
\{\% if query \%\}
    <h3>搜索结果如下：</h3>
    \{\% for result in page.object_list \%\}
        <a href="/{{ result.object.id }}/">{{ result.object.gName }}</a><br/>
    \{\% empty \%\}
        <p>啥也没找到</p>
    \{\% endfor \%\}

    \{\% if page.has_previous or page.has_next \%\}
        <div>
            \{\% if page.has_previous \%\}<a href="?q={{ query }}&amp;page={{ page.previous_page_number }}">\{\% endif \%\}&laquo; 上一页\{\% if page.has_previous \%\}</a>\{\% endif \%\}
        |
            \{\% if page.has_next \%\}<a href="?q={{ query }}&amp;page={{ page.next_page_number }}">\{\% endif \%\}下一页 &raquo;\{\% if page.has_next \%\}</a>\{\% endif \%\}
        </div>
    \{\% endif \%\}
\{\% endif \%\}
</body>
</html>
```

### 7.建立ChineseAnalyzer.py文件

保存在haystack的安装文件夹下，路径如“/home/python/.virtualenvs/django_py2/lib/python2.7/site-packages/haystack/backends”

```py
import jieba
from whoosh.analysis import Tokenizer, Token


class ChineseTokenizer(Tokenizer):
    def __call__(self, value, positions=False, chars=False,
                 keeporiginal=False, removestops=True,
                 start_pos=0, start_char=0, mode='', **kwargs):
        t = Token(positions, chars, removestops=removestops, mode=mode,
                  **kwargs)
        seglist = jieba.cut(value, cut_all=True)
        for w in seglist:
            t.original = t.text = w
            t.boost = 1.0
            if positions:
                t.pos = start_pos + value.find(w)
            if chars:
                t.startchar = start_char + value.find(w)
                t.endchar = start_char + value.find(w) + len(w)
            yield t


def ChineseAnalyzer():
    return ChineseTokenizer()
```

### 8.复制whoosh_backend.py文件，改名为whoosh_cn_backend.py

注意：复制出来的文件名，末尾会有一个空格，记得要删除这个空格

```py
from .ChineseAnalyzer import ChineseAnalyzer 
查找
analyzer=StemmingAnalyzer()
改为
analyzer=ChineseAnalyzer()
```

### 9.生成索引

初始化索引数据

```py
python manage.py rebuild_index
```

### 10.在模板中创建搜索栏

```html
<form method='get' action="/search/" target="_blank">
    <input type="text" name="q">
    <input type="submit" value="查询">
</form>
```

## 三、异步加载

- [官方网站](http://www.celeryproject.org/)
- [中文文档](http://docs.jinkan.org/docs/celery/)

示例一：用户发起 request，并等待 response 返回。在一些 views 中，可能需要执行一段耗时的程序，那么用户就会等待很长时间，造成不好的用户体验

示例二：网站每小时需要同步一次天气预报信息，但是 http 是请求触发的，难道要一小时请求一次吗？
使用 celery 后，情况就不一样了

示例一的解决：将耗时的程序放到 celery 中执行

示例二的解决：使用 celery 定时执行

### 1.名词

- 任务task：就是一个 Python 函数
- 队列queue：将需要执行的任务加入到队列中
- 工人worker：在一个新进程中，负责执行队列中的任务
- 代理人broker：负责调度，在布置环境中使用 redis

### 2.使用

安装包

```shell
celery==3.1.25
celery-with-redis==3.0
django-celery==3.1.17
```

配置settings

```py
INSTALLED_APPS = (
  ...
  'djcelery',
}


import djcelery
djcelery.setup_loader()
BROKER_URL = 'redis://127.0.0.1:6379/0'
CELERY_IMPORTS = ('应用名称.task')
```

在应用目录下创建 task.py 文件

```py
import time
from celery import task

@task
def sayhello():
    print('hello ...')
    time.sleep(2)
    print('world ...')
```

迁移，生成 celery 需要的数据表

```
python manage.py migrate
```

启动 Redis

```
sudo redis-server /etc/redis/redis.conf
```

启动 worker

```
python manage.py celery worker --loglevel=info
```

调用语法

```
function.delay(parameters)
```

使用代码

```py
#from task import *

def sayhello(request):
    print('hello ...')
    import time
    time.sleep(10)
    print('world ...')

    # sayhello.delay()

    return HttpResponse("hello world")
```
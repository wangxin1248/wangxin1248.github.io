---
layout: post
title:  "Python3 爬虫（十二）：Scrapy 框架介绍"
date:  2018-09-21
desc: "python3 网络爬虫实战系列之十二：介绍python爬虫框架：scrapy，并且安装和简单应用scrapy框架来进行爬虫爬取数据"
keywords: "Python3,网络爬虫,实战,scrapy,机器学习"
categories: [Python]
tags: [python3,网络爬虫,scrapy]
---
# Scrapy

Scrapy是一个为了爬取网站数据，提取结构性数据而编写的应用框架。 可以应用在包括数据挖掘，信息处理或存储历史数据等一系列的程序中。

其最初是为了 页面抓取 (更确切来说, 网络抓取 )所设计的， 也可以应用在获取API所返回的数据(例如 Amazon Associates Web Services ) 或者通用的网络爬虫。

## 架构设计

Scrapy架构设计如下图所示：

![scrapy架构设计](/assets/images/2018-09/05-framwork.jpg)

接下来分别介绍每个组件的功能：

### Scrapy Engine

引擎负责控制数据流在系统中所有组件中流动，并在相应动作发生时触发事件。 详细内容查看下面的数据流(Data Flow)部分。

此组件相当于爬虫的“大脑”，是整个爬虫的调度中心。

### 调度器(Scheduler)

调度器从引擎接受 request 并将他们入队，以便之后引擎请求他们时提供给引擎。

初始的爬取 URL 和后续在页面中获取的待爬取的 URL 将放入调度器中，等待爬取。同时调度器会自动去除重复的 URL（如果特定的 URL 不需要去重也可以通过设置实现，如 post 请求的 URL）

### 下载器(Downloader)

下载器负责获取页面数据并提供给引擎，而后提供给 爬虫。

### Spiders

Spider 是 Scrapy 用户编写用于分析 response 并提取 item(即获取到的item)或额外跟进的URL的类。 每个spider负责处理一个特定(或一些)网站。

### Item Pipeline

Item Pipeline 负责处理被 spider 提取出来的 item。典型的处理有清理、 验证及持久化(例如存取到数据库中)。

当页面被爬虫解析所需的数据存入 Item 后，将被发送到项目管道(Pipeline)，并经过几个特定的次序处理数据，最后存入本地文件或存入数据库。

### 下载器中间件(Downloader middlewares)

下载器中间件是在引擎及下载器之间的特定钩子(specific hook)，处理 Downloader 传递给引擎的response。 其提供了一个简便的机制，通过插入自定义代码来扩展Scrapy功能。

通过设置下载器中间件可以实现爬虫自动更换user-agent、IP等功能。

### Spider中间件(Spider middlewares)

Spider 中间件是在引擎及 Spider 之间的特定钩子(specific hook)，处理 spider的输入(response)和输出(items 及 requests)。 其提供了一个简便的机制，通过插入自定义代码来扩展Scrapy功能。

### 数据流(Data flow)

在使用 Scrapy 框架的时候其中的数据在各个组件之间的传递过程如下所示：

1. 引擎打开一个网站(open a domain)，找到处理该网站的 Spider 并向该 spider 请求第一个要爬取的 URL(s)。

2. 引擎从 Spider 中获取到第一个要爬取的 URL 并交给调度器(Scheduler)以 Request调度。

3. 引擎向调度器请求下一个要爬取的 URL。

4. 调度器返回下一个要爬取的 URL给引擎，引擎将 URL通过下载中间件(请求(request)方向)转发给下载器(Downloader)。

5. 一旦页面下载完毕，下载器生成一个该页面的 Response，并将其通过下载中间件(返回(response)方向)发送给引擎。

6. 引擎从下载器中接收到 Response并通过 Spider中间件(输入方向)发送给 Spider处理。

7. Spider处理 Response并返回爬取到的 Item及(跟进的)新的 Request给引擎。

8. 引擎将(Spider返回的)爬取到的 Item 给 Item Pipeline，将(Spider返回的)Request给调度器。

9. (从第二步)重复直到调度器中没有更多地 request，引擎关闭该网站。

## 安装Scrapy

安装 Scrapy非常简单，只需要使用pip安装即可

```bash
pip install scrapy
```

## 项目结构分析

新建一个 Scrapy 项目可以直接在 bash 命令行中进行，输入如下的命令来新建一个 scrapy项目：

```bash
python3 -m scrapy startproject firstSpider
```

成功创建项目会提示如下的信息：

![创建项目](/assets/images/2018-09/06-scrapyproject.png)

该命令将会创建包含下列内容的 firstSpider目录:

![项目目录](/assets/images/2018-09/07-scrapy-tree.png)

这些文件分别是:

* scrapy.cfg: 项目的配置文件。
* firstSpider/: 该项目的python模块。之后您将在此加入代码。
* firstSpider/items.py: 项目中的item文件。
* firstSpider/pipelines.py: 项目中的pipelines文件。
* firstSpider/settings.py: 项目的设置文件。
* firstSpider/spiders/: 放置spider代码的目录。

## Scrapy简单使用

Spider是用户编写用于从单个网站(或者一些网站)爬取数据的类。

其包含了一个用于下载的初始 URL，是跟进网页中的链接以及如何分析页面中的内容， 提取生成 item 的方法。

为了创建一个Spider，您必须继承 scrapy.Spider 类， 且定义以下三个属性:

* **name**：用于区别Spider。 该名字必须是唯一的，您不可以为不同的Spider设定相同的名字。
* **start_urls**：包含了Spider在启动时进行爬取的url列表。 因此，第一个被获取到的页面将是其中之一。 后续的URL则从初始的URL获取到的数据中提取。
* **parse()**： 是spider的一个方法。 被调用时，每个初始URL完成下载后生成的 Response 对象将会作为唯一的参数传递给该函数。 该方法负责解析返回的数据(response data)，提取数据(生成item)以及生成需要进一步处理的URL的 Request 对象。

以下为我们的第一个Spider代码，保存在firstSpider/spiders目录下的blog_spider.py文件中:

```python
from scrapy.spiders import Spider
  

class BlogSpider(Spider):
    # 爬虫名称
    name = 'wangxin1248'
    # 爬虫爬取范围
    allowd_domains  =  ['https://wangxin1248.github.io/']
    # 爬虫真实的爬取url
    start_urls = ["https://wangxin1248.github.io"]

    # 网页响应解析
    def parse(self, response):
        titles = response.xpath('//a[@class="nice-title"]/text()').extract()
        for title in titles:
            print(title.strip())
```

### 启动爬虫

在终端中运行下列命令：

```python
python3 -m scrapy crawl wangxin1248
```

启动爬虫后就可以看到打印出来当前页所有文章标题了。
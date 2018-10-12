---
layout: post
title:  "Python3 爬虫（十九）：Scrapy 基础之下载中间件"
date:  2018-10-12
desc: "python3 网络爬虫实战系列之十九：在爬虫与反爬虫的激烈斗争中便出现了反反爬虫，这次我们便将介绍在 scrapy 中的反爬虫设置--Downloader Middlewares。"
keywords: "Python3,网络爬虫,实战,Scrapy,Spider,settings"
categories: [Python]
tags: [python3,网络爬虫,scrapy]
---
# Downloader Middlewares

下载中间件是处于引擎(crawler.engine)和下载器(crawler.engine.download())之间的一层组件，可以有多个下载中间件被加载运行。

当引擎传递请求给下载器的过程中，下载中间件可以对请求进行处理 （例如增加http header信息，增加proxy信息等）；

在下载器完成http请求，传递响应给引擎的过程中， 下载中间件可以对响应进行处理（例如进行gzip的解压等）

## 下载器中间件使用

要激活下载器中间件组件，首先需要将其加入到 **DOWNLOADER_MIDDLEWARES** 设置中。 该设置是一个字典(dict)，键为中间件类的路径，值为其中间件的顺序(order)。

例如：

```python
DOWNLOADER_MIDDLEWARES = {
    'mySpider.middlewares.MyDownloaderMiddleware': 543,
}
```

每个中间件组件是一个定义了一个或多个方法的Python类:

```python
class MyDownloaderMiddleware(object):
    ...
```

其中最主要的方法便是：**process_request** 和 **process_response**

- process_request：当每个request通过下载中间件时，该方法被调用
- process_response：当下载器完成http请求，传递响应给引擎的时候调用

### process_request(self, request, spider)

process_request() 必须返回以下其中之一：一个 None 、一个 Response 对象、一个 Request 对象或 raise IgnoreRequest:

- 如果其返回 None ，Scrapy 将继续处理该 request，执行其他的中间件的相应方法，直到合适的下载器处理函数(download handler)被调用， 该request被执行(其response被下载)。
- 如果其返回 Response 对象，Scrapy将不会调用 任何 其他的 process_request() 或 process_exception() 方法，或相应地下载函数； 其将返回该response。 已安装的中间件的 process_response() 方法则会在每个response返回时被调用。
- 如果其返回 Request 对象，Scrapy则停止调用 process_request 方法并重新调度返回的 request。当新返回的request被执行后， 相应地中间件链将会根据下载的response被调用。
- 如果其raise一个 IgnoreRequest 异常，则安装的下载中间件的 process_exception() 方法会被调用。如果没有任何一个方法处理该异常， 则 request 的 errback(Request.errback)方法会被调用。如果没有代码处理抛出的异常， 则该异常被忽略且不记录(不同于其他异常那样)。

该方法的参数如下：

- request (Request 对象)：处理的 request
- spider (Spider 对象)：该 request 对应的 spider

### process_response(self, request, response, spider)

process_request() 必须返回以下其中之一: 返回一个 Response 对象、 返回一个 Request 对象或raise一个 IgnoreRequest 异常。

- 如果其返回一个 Response (可以与传入的response相同，也可以是全新的对象)， 该response会被在链中的其他中间件的 process_response() 方法处理。
- 如果其返回一个 Request 对象，则中间件链停止， 返回的request会被重新调度下载。处理类似于 process_request() 返回request所做的那样。
- 如果其抛出一个 IgnoreRequest 异常，则调用 request 的 errback(Request.errback)。 如果没有代码处理抛出的异常，则该异常被忽略且不记录(不同于其他异常那样)。

该方法的参数如下：

- request (Request 对象)：response 所对应的 request
- response (Response 对象)：被处理的 response
- spider (Spider 对象)：response 所对应的 spider

## 反反爬虫

目前主流的网站都已经进行了相应的反爬虫的处理机制，因此 scrapy 中的中间件一般来说是用来进行相应的反反爬虫处理的。

常见的反反爬虫处理方法：

- 动态设置 User-Agent（随机切换User-Agent，模拟不同用户的浏览器信息）
- 禁用 Cookies（也就是不启用cookies middleware，不向 Server 发送 cookies，有些网站通过 cookie 的使用发现爬虫行为）
- 设置延迟下载（防止访问过于频繁，设置为 2秒 或更高）
- Google Cache 和 Baidu Cache：如果可能的话，使用谷歌/百度等搜索引擎服务器页面缓存获取页面数据。
- 使用IP地址池：VPN 和代理 IP，现在大部分网站都是根据IP来处理的。
- 使用 Crawlera（专用于爬虫的代理组件），正确配置和设置下载中间件后，项目所有的request都是通过crawlera发出。

目前主流的反反爬虫的随机 User-Agent 和 代理 ip 都是通过下载中间件来实现的。

接下来，下一个爬虫实战便来通过下载中间件来实现反反爬虫来爬取豆瓣电影 TOP 250 中的全部信息。
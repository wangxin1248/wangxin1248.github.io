---
layout: post
title:  "Python3 爬虫（十七）：Scrapy 基础之模拟登陆"
date:  2018-10-12
desc: "python3 网络爬虫实战系列之十七：之前都是使用 scrapy 来发送 get请求到服务器，这次使用 post 来向服务器发送表单数据。post数据的主要应用是用来进行登陆使用的，因此以一个简单的模拟登陆示例来讲解"
keywords: "Python3,网络爬虫,实战,Scrapy,CrawlSpider,Spider,模拟登陆"
categories: [Python]
tags: [python3,网络爬虫,scrapy]
---
# 模拟登陆

模拟登陆是爬虫项目中比较常见的一种应用，并且因为目前很多的网站都做了相应的反爬虫措施，因此模拟登陆也越来越困难。因此，模拟登陆也是爬虫工程师的基本工之一。本文只是简单的介绍下使用 scrapy 进行模拟登陆的主要步骤，并以模拟登陆软媒来进行演示。

---

## 一、Scrapy-Request源码分析

Request部分源码

```python
# 部分代码
class Request(object_ref):

    def __init__(self, url, callback=None, method='GET', headers=None, body=None, 
                 cookies=None, meta=None, encoding='utf-8', priority=0,
                 dont_filter=False, errback=None):

        self._encoding = encoding  # this one has to be set first
        self.method = str(method).upper()
        self._set_url(url)
        self._set_body(body)
        assert isinstance(priority, int), "Request priority not an integer: %r" % priority
        self.priority = priority

        assert callback or not errback, "Cannot use errback without a callback"
        self.callback = callback
        self.errback = errback

        self.cookies = cookies or {}
        self.headers = Headers(headers or {}, encoding=encoding)
        self.dont_filter = dont_filter

        self._meta = dict(meta) if meta else None

    @property
    def meta(self):
        if self._meta is None:
            self._meta = {}
        return self._meta

```

其中常要的参数有：

- url: 就是需要请求，并进行下一步处理的url
- callback: 指定该请求返回的Response，由那个函数来处理。
- method: 请求一般不需要指定，默认GET方法，可设置为"GET", "POST", "PUT"等，且保证字符串大写
- headers: 请求时，包含的头文件。一般不需要。内容一般如下：<br/>
        Host: media.readthedocs.org<br/>
        User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64; rv:33.0) Gecko/20100101 Firefox/33.0<br/>
        Accept: text/css,*/*;q=0.1<br/>
        Accept-Language: zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3<br/>
        Accept-Encoding: gzip, deflate<br/>
        Referer: http://scrapy-chs.readthedocs.org/zh_CN/0.24/<br/>
        Cookie: _ga=GA1.2.1612165614.1415584110;<br/>
        Connection: keep-alive<br/>
        If-Modified-Since: Mon, 25 Aug 2014 21:59:35 GMT<br/>
        Cache-Control: max-age=0<br/>
- meta: 比较常用，在不同的请求之间传递数据使用的。字典dict型<br/>
        request_with_cookies = Request(<br/>
            url="http://www.example.com",<br/>
            cookies={'currency': 'USD', 'country': 'UY'},<br/>
            meta={'dont_merge_cookies': True}<br/>
        )<br/>
- encoding: 使用默认的 'utf-8' 就行。
- dont_filter: 表明该请求不由调度器过滤。这是当你想使用多次执行相同的请求,忽略重复的过滤器。默认为False。
- errback: 指定错误处理函数

## 二、Scrapy-Response源码分析

Response 部分源码：

```python
# 部分代码
class Response(object_ref):
    def __init__(self, url, status=200, headers=None, body='', flags=None, request=None):
        self.headers = Headers(headers or {})
        self.status = int(status)
        self._set_body(body)
        self._set_url(url)
        self.request = request
        self.flags = [] if flags is None else list(flags)

    @property
    def meta(self):
        try:
            return self.request.meta
        except AttributeError:
            raise AttributeError("Response.meta not available, this response " \
                "is not tied to any request")
```

其中的主要参数为（大部分参数与Request相同）：

- status: 响应码
- _set_body(body)： 响应体
- _set_url(url)：响应url
- self.request = request

## 三、Scrapy-模拟登陆

在进行模拟登陆的时候，一般向服务器发送的数据是分为表单数据和 json 数据两种类型。

### 1.发送 POST 数据

在进行模拟登陆的过程中是需要向服务器发送 POST 数据的，而 Scrapy 向服务器发送 POST 数据是通过 **yield scrapy.FormRequest(url, formdata, callback)**方法。

- url：指定请求发送的地址
- formdata：发送的表单数据
- callback：相应处理的回调函数

如果希望程序执行一开始就发送 POST 请求，可以重写 Spider 类的 **start_requests(self)** 方法，并且不再调用start_urls 里的 url。

```python
class mySpider(scrapy.Spider):
    # start_urls = ["http://www.example.com/"]

    def start_requests(self):
        url = 'http://www.example.com/'

        # FormRequest 是Scrapy发送POST请求的方法
        yield scrapy.FormRequest(
            url = url,
            formdata = {"email" : "mr_mao_hacker@163.com", "password" : "axxxxxxxe"},
            callback = self.parse_page
        )

    def parse_page(self, response):
        # do something
```

### 2.发送 Json 数据

有时需要向服务器发送 Json 数据，这时可以使用 **yield scrapy.Request(url, method='POST', body=json.dumps(data), headers={'Content-Type': 'application/json'}, callback=self.parse_something)** 方法。

- url：指定发送的地址
- method：指定发送的方法为 POST
- body：发送的 json 文件，需要是 json 类型
- headers：指定表头发送的类型为 json
- callback：指定响应处理回调函数

### 3.模拟登陆标准步骤

在登陆网站的额过程中，通常网站通过实现对某些表单字段（如数据或是登录界面中的认证令牌等）的预填充，来实现反爬虫的处理，因此在使用 Scrapy 抓取网页时，就得对这些预填充字段进行填充。

对预填充字典的填充或者重写像用户名、用户密码这些表单字段， 可以使用 **FormRequest.from_response()** 方法实现。

进行模拟登陆的标准步骤为：

1. 访问登陆页面
2. 从登陆页面了解需要向服务器发送的表单数据
3. 构造表单数据，使用 **FormRequest**向服务器发送 POST 请求
4. 判断登陆是否成功
5. 执行登陆成功之后的处理操作

下面是使用这种方法的爬虫标准例子:

```python
import scrapy

class LoginSpider(scrapy.Spider):
    name = 'example.com'
    start_urls = ['http://www.example.com/users/login.php']

    def parse(self, response):
        # 先访问登陆页面，之后在向登陆界面发送对应的表单数据
        return scrapy.FormRequest.from_response(
            response,
            formdata={'username': 'john', 'password': 'secret'},
            callback=self.after_login
        )

    def after_login(self, response):
        # check login succeed before going on
        if "authentication failed" in response.body:
            self.log("Login failed", level=log.ERROR)
            return

        # continue scraping with authenticated session...
```

注意在模拟登陆的过程中 settings.py 配置文件中的 **COOKIES_ENABLED**的值一定得设置为 True。这样是为了让Cookies中间件处于开启状态，在登陆过程中记录登陆的 cookie 状态。

## 四、模拟登陆软媒案例

### 1.分析网站

本次所要进行模拟登陆的网站是[IT之家](https://www.ithome.com/)，该网站是一个 it新闻的资讯类网站。之所以选择这个网站登陆是因为该网站没有做太多的反爬虫处理，比较适合新手爬虫工程师来进行模拟登陆练习。

我们所要登陆的网页是

![软媒登陆界面](/assets/images/2018-10/04-ruanmei-login.png)

通过抓包分析可以看到：

![软媒登陆抓包](/assets/images/2018-10/05-ruanmei-web.png)

真正的登陆网页是[http://my.ruanmei.com](http://my.ruanmei.com)，而处理登陆逻辑的网页是[http://my.ruanmei.com/Default.aspx/LoginUser](http://my.ruanmei.com/Default.aspx/LoginUser)

在登陆过程中向服务器发送的数据为json类型，包含用户名、密码和是否记住登陆状态

```js
{
	mail: "12345678900",
	psw: "0000000000",
	rememberme: "true"
}
```

接下来便可以开始动手编写代码了

### 2.新建项目

```bash
scrapy startproject ruanmeiSpider

cd ruanmeiSpider/ruanmeiSpider/spiders/

scrapy genspider ruanmei my.ruanmei.com
```

### 3. 编写爬虫文件 ruanmei.py

```python
# -*- coding: utf-8 -*-
import scrapy
import json


class RuanmeiSpider(scrapy.Spider):
    name = 'ruanmei'
    allowed_domains = ['my.ruanmei.com']
    start_urls = ['http://my.ruanmei.com']

    def parse(self, response):
        # 因为不需要获取网页上的其他数据，因此可以直接发送请求
        url = 'http://my.ruanmei.com/Default.aspx/LoginUser'
        data = {
            "mail": "your_mail",
	        "psw": "your_password",
	        "rememberme": "true"
        }
        yield scrapy.Request(url, method='POST', body=json.dumps(data), headers={'Content-Type': 'application/json'}, callback=self.parse_ruanmei)

    def parse_ruanmei(self, response):
        # 请求一个登陆之后才能看到的网页
        url = 'http://my.ruanmei.com/usercenter/base.aspx'
        yield scrapy.Request(url, callback=self.parse_page)

    def parse_page(self, response):
        # 将该网页保存下来
        with open('ruanmei.html', 'w') as filename:
            filename.write(response.body.decode('utf-8'))
        

```

### 4.编写配置文件 settings.py

```python
# -*- coding: utf-8 -*-

# Scrapy settings for ruanmeiSpider project

BOT_NAME = 'ruanmeiSpider'

SPIDER_MODULES = ['ruanmeiSpider.spiders']
NEWSPIDER_MODULE = 'ruanmeiSpider.spiders'

COOKIES_ENABLED = True

DEFAULT_REQUEST_HEADERS = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko'
}
```

### 5.运行项目

```python
scrapy crawl ruanmei
```

### 6.查看结果

打开项目中保存的 ruanmei.html 来查看是否是登陆之后的网页。
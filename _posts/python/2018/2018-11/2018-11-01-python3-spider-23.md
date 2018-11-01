---
layout: post
title:  "Python3 爬虫（二十三）：Scrapy-Redis 官方案例分析"
date:  2018-11-01
desc: "python3 网络爬虫实战系列之二十三：介绍基于分布式的爬虫技术 Scrapy-Redis，这是在基本 Scrapy 的基础上添加了分布式的 Redis 组件而形成的一种新技术。我们将介绍这个新技术，并以其官方提供的一个案例来详细了解。 "
keywords: "Python3,网络爬虫,实战,Scrapy,Spider,Scrapy-Redis,组件"
categories: [Python]
tags: [python3,网络爬虫,scrapy-redis]
---
# Scrapy-Redis 官方案例分析

首先从官方的 github 上将示例项目下载下来，项目地址 [https://github.com/rmax/scrapy-redis](https://github.com/rmax/scrapy-redis)

具体的项目在 example-project/example 下，项目结构和普通的 scrapy 项目一致。

对于 scrapy-redis 项目来说，其和普通的 scrapy 项目的差别就是在 spider 爬虫类和 setting 设置文件。接下来便主要分析下其中的爬虫类和设置类。

## 爬虫类

### dmoz.py

```python
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule


class DmozSpider(CrawlSpider):
    """Follow categories and extract links."""
    name = 'dmoz'
    allowed_domains = ['dmoz.org']
    start_urls = ['https://dmoztools.net/']

    rules = [
        Rule(LinkExtractor(
            restrict_css=('.top-cat', '.sub-cat', '.cat-item')
        ), callback='parse_directory', follow=True),
    ]

    def parse_directory(self, response):
        for div in response.css('.title-and-desc'):
            yield {
                'name': div.css('.site-title::text').extract_first(),
                'description': div.css('.site-descr::text').extract_first().strip(),
                'link': div.css('a::attr(href)').extract_first(),
            }

```

这个爬虫继承的是 CrawlSpider，它是用来说明 Redis 的持续性，当我们第一次运行 dmoz 爬虫，然后 Ctrl + C 停掉之后，再运行 dmoz 爬虫，之前的爬取记录是保留在 Redis 里的。

分析起来，其实这就是一个 scrapy-redis 版 CrawlSpider 类，需要设置 Rule 规则，以及callback 不能写 parse() 方法。

执行方式：scrapy crawl dmoz

### myspider_redis.py

```python
from scrapy_redis.spiders import RedisSpider


class MySpider(RedisSpider):
    """Spider that reads urls from redis queue (myspider:start_urls)."""
    name = 'myspider_redis'
    redis_key = 'myspider:start_urls'

    # 可选：等效于allowd_domains()，__init__方法按规定格式写，使用时只需要修改super()里的类名参数即可
    def __init__(self, *args, **kwargs):
        # Dynamically define the allowed domains list.
        domain = kwargs.pop('domain', '')
        self.allowed_domains = filter(None, domain.split(','))
        # 这里的类名是本类的类名
        super(MySpider, self).__init__(*args, **kwargs)

    def parse(self, response):
        return {
            'name': response.css('title::text').extract_first(),
            'url': response.url,
        }

```

这个爬虫继承了 RedisSpider， 它能够支持分布式的抓取，采用的 basic spider ，需要写parse 函数。

其次就是不再有 start_urls 了，取而代之的是 redis_key，scrapy-redis 将 key 从Redis 里 pop 出来，成为请求的url地址。

注意：

RedisSpider 类 不需要写 allowd_domains 和 start_urls：

- scrapy-redis 将从在构造方法 __init__() 里动态定义爬虫爬取域范围，也可以选择直接写 allowd_domains。
- 必须指定 redis_key，即启动爬虫的命令，参考格式：redis_key = 'myspider:start_urls'
- 根据指定的格式，start_urls 将在 Master端的 redis-cli 里 lpush 到 Redis数据库里，RedisSpider 将在数据库里获取 start_urls。

执行方式：

- 通过 runspider 方法执行爬虫的 py 文件（也可以分次执行多条），爬虫（们）将处于等待准备状态：

```bash
scrapy runspider myspider_redis.py
```

- 在 Master 端的 redis-cli 输入 lpush 指令，参考格式：

```bash
$redis > lpush myspider:start_urls https://dmoztools.net/
```

- Slaver端爬虫获取到请求，开始爬取。

### mycrawler_redis.py

```python
from scrapy.spiders import Rule
from scrapy.linkextractors import LinkExtractor

from scrapy_redis.spiders import RedisCrawlSpider


class MyCrawler(RedisCrawlSpider):
    """Spider that reads urls from redis queue (myspider:start_urls)."""
    name = 'mycrawler_redis'
    redis_key = 'mycrawler:start_urls'

    rules = (
        # follow all links
        Rule(LinkExtractor(), callback='parse_page', follow=True),
    )

    # __init__方法必须按规定写，使用时只需要修改super()里的类名参数即可
    def __init__(self, *args, **kwargs):
        # Dynamically define the allowed domains list.
        domain = kwargs.pop('domain', '')
        self.allowed_domains = filter(None, domain.split(','))

        # 修改这里的类名为当前类名
        super(MyCrawler, self).__init__(*args, **kwargs)

    def parse_page(self, response):
        return {
            'name': response.css('title::text').extract_first(),
            'url': response.url,
        }
```

这个 MyCrawler 类爬虫继承了 RedisCrawlSpider，能够支持分布式的抓取。

因为采用的是 crawlSpider，所以需要遵守 Rule 规则，以及 callback 不能写 parse()方法。

同样也不再有 start_urls 了，取而代之的是 redis_key，scrapy-redis 将 key 从 Redis 里 pop 出来，成为请求的 url 地址。

注意：

同样的，RedisCrawlSpider 类不需要写 allowd_domains 和 start_urls：

- scrapy-redis 将从在构造方法 __init__() 里动态定义爬虫爬取域范围，也可以选择直接写 allowd_domains。
- 必须指定 redis_key ，即启动爬虫的命令，参考格式：redis_key = 'myspider:start_urls'
- 根据指定的格式，start_urls 将在 Master 端的 redis-cli 里 lpush 到 Redis 数据库里，RedisSpider 将在数据库里获取 start_urls。

执行方式：

- 通过 runspider 方法执行爬虫的 py 文件（也可以分次执行多条），爬虫（们）将处于等待准备状态：

```bash
scrapy runspider mycrawler_redis.py
```

- 在 Master 端的 redis-cli 输入 lpush 指令，参考格式：

```bash
$redis > lpush mycrawler:start_urls http://www.dmoz.org/
```

- 爬虫获取url，开始执行。

### 总结：

1. 如果只是用到 Redis 的去重和保存功能，就选第一种；
2. 如果要写分布式，则根据情况，选择第二种、第三种；
3. 通常情况下，会选择用第三种方式编写深度聚焦爬虫。

## 设置文件

### settings.py

```python
# Scrapy settings for example project
#
# For simplicity, this file contains only the most important settings by
# default. All the other settings are documented here:
#
#     http://doc.scrapy.org/topics/settings.html
#
SPIDER_MODULES = ['example.spiders']
NEWSPIDER_MODULE = 'example.spiders'

USER_AGENT = 'scrapy-redis (+https://github.com/rolando/scrapy-redis)'

# 指纹去重类
DUPEFILTER_CLASS = "scrapy_redis.dupefilter.RFPDupeFilter"
# 调度器类
SCHEDULER = "scrapy_redis.scheduler.Scheduler"
# 调度器支持暂停
SCHEDULER_PERSIST = True

# 可选的请求调度顺序
SCHEDULER_QUEUE_CLASS = "scrapy_redis.queue.SpiderPriorityQueue"
#SCHEDULER_QUEUE_CLASS = "scrapy_redis.queue.SpiderQueue"
#SCHEDULER_QUEUE_CLASS = "scrapy_redis.queue.SpiderStack"

ITEM_PIPELINES = {
    'example.pipelines.ExamplePipeline': 300,
    # redis服务器pipelines，优先级设置为最高，表示在最后执行
    'scrapy_redis.pipelines.RedisPipeline': 400,
}

LOG_LEVEL = 'DEBUG'

# redis服务器ip以及端口
REDIS_HOST = "172.16.92.136"
REDIS_PORT = 6379
# Introduce an artifical delay to make use of parallelism. to speed up the
# crawl.
DOWNLOAD_DELAY = 1
```

其中，与 scrapy 相比添加的属性主要有：

- 指纹去重组件：**DUPEFILTER_CLASS = "scrapy_redis.dupefilter.RFPDupeFilter"**
- 调度器组件：**SCHEDULER = "scrapy_redis.scheduler.Scheduler"**
- 调度器支持暂停：**SCHEDULER_PERSIST = True**
- 请求发送顺序队列格式，可以选择三种中的任何一种，也可以都不选择，使用 scrapy 默认的
- redis 服务器配置 **REDIS_HOST = "172.16.92.136" REDIS_PORT = 6379**
- 管道 pipeline配置：**'scrapy_redis.pipelines.RedisPipeline': 400,**

在基本的 scrapy 配置文件中添加上述的配置信息再使用相对应的爬虫类之后便可以将一个普通的 scrapy 项目更改为支持分布式的 scrapy-redis 项目。
---
layout: post
title:  "Python3 爬虫（二十二）：Scrapy-Redis 介绍"
date:  2018-10-22
desc: "python3 网络爬虫实战系列之二十二：介绍基于分布式的爬虫技术 Scrapy-Redis，这是在基本 Scrapy 的基础上添加了分布式的 Redis 组件而形成的一种新技术。我们将介绍这个新技术，并以其官方提供的一个案例来详细了解。 "
keywords: "Python3,网络爬虫,实战,Scrapy,Spider,Scrapy-Redis,组件"
categories: [Python]
tags: [python3,网络爬虫,scrapy-redis]
---
# Scrapy-Redis

首先必须得弄清楚 Scrapy 与 Scrapy-Redis 的区别：

- Scrapy 是一个通用的爬虫框架，但是不支持分布式。
- Scrapy-redis 是为了更方便地实现 Scrapy 分布式爬取，而提供了一些以 redis 为基础的组件(仅有组件)。

也就是说，当有一个比较大型的网站需要爬取的时候使用 Scrapy 是比较浪费时间的，而且官方也没有给出比较好的解决办法，这是便出现了 Scrapy-redis 组件，利用这些组件便可以轻松的给 Scrapy 加上了 分布式 Redis 的支持。

---

## Scrapy-Redis 架构

可以首先看一下 Scrapy-redis 的架构图：

![20](/assets/images/2018-10/20.png)

从上图可以看出来，Scrapy-redis 在 scrapy 的架构上增加了 redis，基于 redis 的特性拓展了如下组件：

- Scheduler
- Duplication Filter
- Item Pipeline
- Base Spider

接下来详细的看下每一个组件及其功能：

### Scheduler

官方对于 Scheduler 的定义是 **SCHEDULER 接受来自 Engine 的 Requests,并将它们放入队列（可以按顺序优先级），以便在之后将其提供给Engine**，根据官方文档说明 在我们没有没有指定 SCHEDULER 参数时，默认使用：’scrapy.core.scheduler.Scheduler’ 作为SCHEDULER(调度器)

scrapy 改造了 python 本来的 collection.deque (双向队列)形成了自己的 [Scrapy queue](https://github.com/scrapy/queuelib/blob/master/queuelib/queue.py) ，但是 Scrapy 多个 spider 不能共享待爬取队列 Scrapy queue， 即 Scrapy 本身不支持爬虫分布式。

Scrapy 中跟“待爬队列”直接相关的就是调度器 Scheduler，它负责对新的 request 进行入列操作（加入Scrapy queue），取出下一个要爬取的 request（从Scrapy queue中取出）等操作。它把待爬队列按照优先级建立了一个字典结构，比如：

```js
    {
        优先级0 : 队列0
        优先级1 : 队列1
        优先级2 : 队列2
    }
```

然后根据 request 中的优先级，来决定该入哪队列，出列时则按优先级较小的优先出列。

Scheduler 的主要目的是完成了 **push Request** 、**pop Request** 和 **去重**的操作。并且 queue 有关的操作是在内存队列中完成的。这个内存是每一个爬虫启动时的进程空间中的。我们都知道进程之间内存中的数据不可共享的，那么在开启多个 Scrapy 的时候，它们相互之间并不知道对方采集了些什么那些没有没采集。

这时便出现了 Scrapy-Redis

scrapy-redis 的解决是把这个 Scrapy queue 换成 redis 数据库，将 redis 数据库作为存放 request 的队列。在同一个 redis-server 存放要爬取的 request，便能让多个spider 去同一个数据库里读取。

![21](/assets/images/2018-10/21.jpg)
图片来源：https://cuiqingcai.com/6058.html

### Duplication Filter

Scrapy 中用集合实现这个 request 去重功能，Scrapy 中把已经发送的 **request 指纹**放入到一个集合中，把下一个 request 的指纹拿到集合中比对，如果该指纹存在于集合中，说明这个 request 发送过了，如果没有则继续操作。这个核心的判重功能是这样实现的：

```python
    def request_seen(self, request):
        # self.request_figerprints就是一个指纹集合  
        fp = self.request_fingerprint(request)

        # 这就是判重的核心操作  
        if fp in self.fingerprints:
            return True
        self.fingerprints.add(fp)
```

在 scrapy-redis 中去重是由 Duplication Filter 组件来实现的

它通过 redis 的set 不重复的特性，巧妙的实现了 Duplication Filter 去重。

scrapy-redis 调度器从引擎接受 request，将 request 的指纹存⼊ redis 的 set 检查是否重复，并将不重复的 request push 写⼊ redis 的 request queue。

引擎请求 request(Spider发出的）时，调度器从 redis 的 request queue  队列⾥里根据优先级 pop 出⼀个request 返回给引擎，引擎将此 request 发给 spider 处理。

### Item Pipeline

引擎将(Spider 返回的)爬取到的 Item 给 Item Pipeline，scrapy-redis 的 Item Pipeline 将爬取到的 Item 存⼊redis的 items queue。

修改过 Item Pipeline 可以很方便的根据 key 从 items queue 提取item，从⽽实现 items processes 集群。

### Base Spider

scrapy-redis 不再使用 scrapy 原有的 Spider 类，而是重写的 RedisSpider 继承了 Spider 和 RedisMixin 这两个类，RedisMixin 是用来从 redis 读取 url 的类。

当我们创建一个 Spider 继承 RedisSpider 时，调用 setup_redis 函数，这个函数会去连接 redis 数据库，然后会设置 signals(信号)：

- 当 spider 空闲时候的 signal，会调用 spider_idle 函数，这个函数调用 schedule_next_request 函数，保证 spider 是一直活着的状态，并且抛出 DontCloseSpider 异常。
- 当抓到一个 item 时的 signal，会调用 item_scraped 函数，这个函数会调用 schedule_next_request 函数，获取下一个 request。

## Scrapy-Redis 小结

最后总结一下 scrapy-redis 的总体思路：

Scrapy-Redis 通过重写 scheduler 和 spider 类，实现了调度、spider 启动和 redis 的交互。并且实现新的 dupefilter 和 queue 类，达到了判重和调度容器和 redis 的交互。

因为每个主机上的爬虫进程都访问同一个 redis 数据库，所以调度和判重都统一进行统一管理，达到了分布式爬虫的目的。

当 spider 被初始化时，同时会初始化一个对应的 scheduler 对象，这个调度器对象通过读取 settings ，在 redis 数据库中配置好自己的调度容器 queue 和判重工具 dupefilter。

每当一个 spider 产出一个 request 的时候，scrapy 内核会把这个 reuqest 递交给这个 spider 对应的 scheduler 对象进行调度，scheduler 对象通过访问 redis 对 request 进行判重，如果不重复就把他添加进 redis 中的调度池。

当调度条件满足时，scheduler 对象就从 redis 的调度池中取出一个 request 发送给 spider，让他爬取。

当 spider 爬取完了所有暂时可用的 url 之后，scheduler 发现这个 spider 对应的 redis 的调度池空了，于是触发信号spider_idle ，spider 收到这个信号之后，直接连接 redis 读取 start url 池，拿出新的一批 url 入口，然后再次重复上边的工作。
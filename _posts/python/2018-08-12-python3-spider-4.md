---
layout: post
title:  "Python3 爬虫（四）：通过 Xpath 解析百度贴吧"
date:  2018-08-12
desc: "python3 网络爬虫实战系列之四：通过 Xpath 来解析百度贴吧，爬取百度贴吧中发送的图片并下载。"
keywords: "Python3,网络爬虫,实战,知识点,Xpath"
categories: [Python]
tags: [python3,网络爬虫,Xpath]
---

# Python3 爬虫（四）：通过 Xpath 解析百度贴吧

## Xpath介绍

使用正则来处理 HTML 文档来说比较麻烦，一般来说处理 HTML 文档都是使用 Xpath

**Xpath** 可以用来查找HTML节点或元素，是一门在 XML 文档中查找信息的语言。他有自己的一套规则来匹配对应的节点元素，类似于正则，具体的xpath学习请看[Xpath](http://www.w3school.com.cn/xpath/)

常用的 Xpath 匹配的表达式如下表所示：
![xpath](/assets/images/2018-08/02-xpath匹配规则.jpg)

在使用 Xpath 之前呢需要将 HTML 文档转换为 XML 文档（其实转换的是HTML DOM),
这里的转换是通过 lxml 模块中的 etree 包下的HTML方法来实现，
而 lxml 模块是一个第三方模块，需要自己手动安装到电脑中去才能使用，

在ubuntu中的安装方法如下：

```bash
$ sudo apt-get install python3-lxml
```

## 练习：

使用xpath来获取指定百度贴吧中指定页面的帖子中所发布的图片（只查看帖子中首页中的图片），并将图片保存到本地。

### 分析：

首先需要做的是了解到所需要爬取的贴吧的主页地址，这个可以通过拼接字符串来实现。

在获取到指定贴吧首页的源码之后需要将其中对应于每一个帖子的url找到，然后将其添加到
tieba.baidu.com 之后组成一个完整的 url，具体格式如：

```url
https://tieba.baidu.com/p/5832432185
```

在获取到指定帖子的页面url之后呢便需要将指定帖子的源码爬取下来，爬取下来之后呢便需要对源码进行分析，找到其中对应于图片的链接，然后将图片的链接做为新的请求来下载对应的图片，并将其进行保存。

这里需要涉及到两次从网页源码中获取指定信息的操作，一次是从源码中获取对应帖子的url，一次是从指定源码中获取图片的url

这些可以通过正则来实现，但是为了方便呢便可以使用Xpath来操作，具体对应于每个操作的Xpath规则如下：

```python
# 获取贴吧中每个帖子的url
//div[@class="t_con cleafix"]/div/div/div/a/@href
# 获取帖子中包含的图片url
//img[@class="BDE_Image"]/@src
```

**注意：**

有时出现在浏览器中可以匹配xpath规则，但是在程序中却不能匹配的情况，这是因为服务器会针对不同的浏览器进行相应的优化，为了保证xpath能正确的匹配网页数据，因此最好使用ie的user-agent。

附上ie11的 user-agent

```python
Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko
```

### 代码

```python
import urllib.request
from lxml import etree


class TiebaSpider(object):
    """
    创建一个贴吧的爬虫类，可以实现爬取指定贴吧中的图片信息
    """
    def __init__(self):
        # 贴吧基本url
        self.url = r'https://tieba.baidu.com'
        # 获取帖子url的xpath规则
        self.x_tiezi = r'//div[@class="t_con cleafix"]/div/div/div/a/@href'
        # 获取帖子中图片URL的xpath规则
        self.x_iamge = r'//img[@class="BDE_Image"]/@src'
        # 对指定下载图片的命名
        self.num = 1
        # 图片保存路径
        self.path = r'tieba_image/'
        # user-agent
        self.user_agent = r'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko'


    def download_html(self, full_url):
        """
        下载给定url所对应的界面信息
        :param full_url:所要下载的帖子url
        :return:所下载界面的html信息
        """
        request = urllib.request.Request(full_url)
        # 使用add_header方法来添加或者修改一个http报头
        request.add_header('User-Agent', self.user_agent)
        response = urllib.request.urlopen(request)

        # 爬取到的网页源码
        html = response.read()
        # 将html数据返回
        return html

    def get_tie_zi(self, html):
        """
        对每一页的贴吧信息进行提取，将其中对应的帖子url提取出来
        :param html:贴吧的网页信息
        :return:None
        """
        # 首先先将html的网页转换为html dom形式
        content = etree.HTML(html)
        # 获取每一页中所对应的帖子
        tie_zi_url_list = content.xpath(self.x_tiezi)
        # 拼接出每一个帖子的url并进行访问
        for temp in tie_zi_url_list:
            print(temp)
            full_url = self.url+temp
            tie_zi_html = self.download_html(full_url)

            # 调用访问图片的方法来访问帖子中对应的图片
            self.get_image(tie_zi_html)

    def get_image(self, html):
        """
        对于给定的帖子网页源码来进行图片的获取
        :param html:每一个帖子的源码
        :return:
        """
        content = etree.HTML(html)
        image_url_list = content.xpath(self.x_iamge)
        for image_url in image_url_list:
            print(image_url)
            self.save_image(image_url)

    def save_image(self, url):
        """
        对指定的url的图片进行保存
        :param url:图片的url
        :return:None
        """
        image = self.download_html(url)
        path = self.path+'image'+str(self.num)+'.jpg'
        with open(path, 'wb') as file:
            file.write(image)
            print(path+' 下载完成')
            self.num += 1

    def start(self):
        print('*'*50)
        print('贴吧图片下载器v1.0')
        print('*'*50)

        # 获取所需要访问的贴吧
        tie_ba_name = input('请输入你想要下载的贴吧名称：')
        kw = urllib.request.quote(tie_ba_name)
        start_page = int(input('想要访问的起始页：'))
        end_page = int(input('想要访问的终止页：'))
        url = self.url + '/f?kw=' + kw
        self.handle_page(url, start_page, end_page)

    def handle_page(self, url, start_page, end_page):
        """
        处理从起始页到终止页所对应的贴吧数据
        :param url:所要访问的贴吧的url
        :param start_page:访问的起始页
        :param end_page:访问的终止页
        :return:None
        """
        for page in range(start_page, end_page + 1):
            # 对每一个页面进行处理
            print('开始下载第%d页' % page)
            pn = (page - 1) * 50
            full_url = url + '&pn=' + str(pn)
            html = self.download_html(full_url)

            # 将对应的页面中的数据进行处理
            print('开始处理第%d页' % page)
            self.get_tie_zi(html)

        print('*' * 50)
        print('END')


if __name__ == '__main__':
    tie_ba_spider = TiebaSpider()
    tie_ba_spider.start()
```
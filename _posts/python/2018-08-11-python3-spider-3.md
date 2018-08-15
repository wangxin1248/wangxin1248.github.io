---
layout: post
title:  "Python3 爬虫（三）：使用正则表达式获取内涵段子中的段子数据"
date:  2018-08-11
desc: "python3 网络爬虫实战系列之三：使用 re模块来进行正则表达式的匹配，来获取内涵段子中的段子数据"
keywords: "Python3,网络爬虫,实战,知识点,正则表达式"
categories: [Python]
tags: [python3,网络爬虫,re]
---

# Python3 爬虫（三）：使用正则表达式获取内涵段子中的段子信息

本教程将首先介绍有关正则表达式的一些基本信息，然后利用正则表达式的功能从内涵段子中获取其中内涵段子中的信息。主要内容包括：

##### 1.re模块介绍
##### 2.获取内涵段子信息

---

# 一、re模块介绍

python中的 re模块是负责提供相应的正则表达式功能的，由于其不是系统自带的库，因此在使用时需要首先将其导入。

想要使用正则表达式来获取字符串中的相应信息首先要创建一个[正则表达式](http://tool.oschina.net/uploads/apidocs/jquery/regexp.html)，并且将正则表达式编译成一个 Pattern规则对象。

```python
pattern = re.compile("正则表达式"，参数)
```

在创建 Pattern规则对象的时候还可以传入参数，主要的参数（爬虫中最常使用）包括：

re.I：忽略大小写

re.S：表示进行全文匹配

在创建好 Pattern 对象之后便可以通过相应的方法来对字符串进行相应的匹配操作。
Pattern规则对象常用的主要方法如下：

```python
pattern.match():从起始位置开始向后查找，返回第一个符合规则的字符串
pattern.search():从任何位置开始向后查找，返回第一个符合规则的字符串
pattern.findall():将所有匹配的都返回，返回一个列表
pattern.split():分割字符串，返回列表
pattern.sub():替换字符串
```

# 二、获取内涵段子信息

要求：

使用 urllib.request 和 正则表达式 来完成对内涵段子网页中所有的内涵段子的获取和保存。

内涵段子网站：
http://neihanba.92kaifa.com/wenzi/
http://neihanba.92kaifa.com/wenzi/index_2.html
http://neihanba.92kaifa.com/wenzi/index_3.html

可以发现：除了首页之外其余的页面都是在网址中加入/index_数字.html

发现了网页的规律之后呢还需要查看网页的源码来观察对应段子的标签是什么

查看对应网站的源码：

```html
<div class="f18 mb20">
                            <div>
	夏天为了穿裙子，在网上拍了个安全裤，货到了，同事问我：买了什么？我说：安全裤。她竟然反问我：穿上这个就不会怀孕了？</div>


                        </div>
```

网页中所有的段子对应的信息都是上面的格式，因此便可以指定对应的正则表达式来进行匹配

注意得取消正则表达式的贪婪模式

```python
pattern = re.compile('<div\sclass="f18 mb20">\s+<div>\s+(.*?)\s+</div>')
```

这样就不会出现正则表达式贪婪的匹配符合要求的文字的情况了。

**完整的代码如下**

```python
import urllib.request
import re
import random


class Spider(object):
    """
    创建爬虫类来爬取内涵吧网站中所有的内涵段子
    """
    def __init__(self):
        """
        初始化方法
        """
        # 指定所需要爬取的静态页面路径
        self.url = "http://neihanba.92kaifa.com/wenzi/"
        # 是否进行爬取的开关，默认为true
        self.switch = True
        # user-agent可以是一个列表
        self.ag_list = [
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv2.0.1) Gecko/20100101 Firefox/4.0.1",
            "Mozilla/5.0 (Windows NT 6.1; rv2.0.1) Gecko/20100101 Firefox/4.0.1",
            "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.8.131 Version/11.11",
            "Opera/9.80 (Windows NT 6.1; U; en) Presto/2.8.131 Version/11.11",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11"
        ]
        # 正则表达式（取消贪婪模式）(注意正则里面的是双引号，加入是单引号的话就不对了）
        self.pattern = re.compile(r'<div\sclass="f18 mb20">\s+<div>\s+(.*?)\s+</div>', re.S)
        # 对每一条段子进行编号
        self.num = 1

    def get_html(self, page_num):
        """
        获取页面信息
        :param:page_num 表示所要爬取的指定页面
        :return:
        """
        print('开始下载第'+str(page_num)+'页...')
        # 构造url
        if page_num != 1:
            full_url = self.url+"index_"+str(page_num)+".html"
        else:
            full_url = self.url
        request = urllib.request.Request(full_url)
        # 在user-agent列表里随机选择一个做为user-agent
        user_agent = random.choice(self.ag_list)
        # 使用add_header方法来添加或者修改一个http报头
        request.add_header('User-Agent', user_agent)
        response = urllib.request.urlopen(request)

        # 爬取到的网页源码
        html = response.read().decode("utf-8")
        # print(html)
        # 利用正则表达式将网页中的内涵段子提取出来
        nei_han_list = self.pattern.findall(html)
        # print(len(nei_han_list))
        # 对所有的段子进行处理
        self.get_content(nei_han_list)

    def write_content(self, content):
        """
        将信息写入到文件中保存下来
        :return:
        """
        print('开始保存第'+str(self.num)+'个段子...')
        with open('duanzi.txt', 'a') as duan_zi:
            duan_zi.write(content)


    def strat_spider(self):
        """
        爬虫启动,控制爬虫进行网页的爬取操作
        :return:
        """
        # 用i来控制所要爬取的网页序号，从1开始

        # 用户交互型友好处理
        # i = 1
        # while self.switch:
        #     print("爬虫启动...")
        #     self.get_html(i)
        #     command = input("是否需要继续进行，继续请输入任意字符，退出请输入：quit")
        #     if command == "quit":
        #         self.switch = False
        #         print('谢谢使用!')
        #     else:
        #         i += 1

        # 自动爬取所有的段子信息
        for i in range(1, 452):
            print('爬虫启动...')
            self.get_html(i)
        print('谢谢使用')


    def get_content(self, nei_han_list):
        """
        获取每条内涵信息
        :param:content从网页中获取到的内涵段子信息
        :return:
        """
        print('开始获取段子...')
        # 对每一个段子进行处理
        for content in nei_han_list:
            duan_zi = str(self.num)+'.'+content.replace('</div>', '')+'\n'
            self.num += 1
            # print(duan_zi)
            self.write_content(duan_zi)

if __name__ == '__main__':
    nei_han_spider = Spider()
    nei_han_spider.strat_spider()
```

在开启自动爬取段子信息之后出现了错误：

```python
urllib.error.HTTPError: HTTP Error 504: Gateway Timeout
```

显示网关超时，暂时无解，等以后学习了更好的方式再来解决。
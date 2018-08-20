---
layout: post
title:  "Python3 爬虫（四）：lxml 解析库学习"
date:  2018-08-12
desc: "python3 网络爬虫实战系列之四：学习 lxml 解析库，并且通过他来解析百度贴吧，爬取指定贴吧中发送的图片并下载到本地。"
keywords: "Python3,网络爬虫,实战,知识点,lxml"
categories: [Python]
tags: [python3,网络爬虫,lxml]
---

## lxml介绍

使用正则来处理 HTML 文档来说比较麻烦，一般来说处理 HTML 文档都是使用 Xpath

**Xpath** 可以用来查找HTML节点或元素，是一门在 XML 文档中查找信息的语言。他有自己的一套规则来匹配对应的节点元素，类似于正则，具体的xpath学习请看[Xpath](http://www.w3school.com.cn/xpath/)

常用的 Xpath 匹配的表达式如下表所示：
![xpath](/assets/images/2018-08/02-xpath匹配规则.png)

在使用 Xpath 之前呢需要将 HTML 文档转换为 XML 文档（其实转换的是HTML DOM),
这里的转换是通过 **lxml** 模块中的 etree 包下的HTML方法来实现，
而 lxml 模块是一个第三方模块，需要自己手动安装到电脑中去才能使用，

## lxml模块安装

在ubuntu中的安装方法如下：

```bash
$ sudo apt-get install python3-lxml
```

## lxml基本使用

在使用 XML 时，最想了解的三个问题是：

问题1：有一个XML文件，如何解析

问题2：解析后，如果查找、定位某个标签

问题3：定位后如何操作标签，比如访问属性、文本内容等

接下来分别针对不同的问题来进行处理：

开始之前，首先是导入 lxml 模块：

```python
from lxml import etree
```

### Element类

Element 是 XML 处理的核心类，Element 对象可以直观的理解为 XML 的节点，大部分 XML 节点的处理都是围绕该类进行的。

#### 节点操作

1、创建Element对象

直接使用Element方法，参数即节点名称。

```python
root = etree.Element('root')
print(root)
# <Element root at 0x2da0708>
```

2、获取节点名称

使用tag属性，获取节点的名称。

```python
print(root.tag)
# root
```

3、输出XML内容

使用 tostring 方法输出 XML 内容,参数为Element对象。

```python
print(etree.tostring(root))
# b'<root><child1/><child2/><child3/></root>'
```

4、添加子节点

使用 SubElement 方法创建子节点，第一个参数为父节点（Element对象），第二个参数为子节点名称。

```python
child1 = etree.SubElement(root, 'child1')
child2 = etree.SubElement(root, 'child2')
child3 = etree.SubElement(root, 'child3')
```

5、删除子节点

使用 remove 方法删除指定节点，参数为 Element 对象。clear 方法清空所有节点。

```python
root.remove(child1)  # 删除指定子节点
print(etree.tostring(root))
# b'<root><child2/><child3/></root>'

root.clear()  # 清除所有子节点
print(etree.tostring(root))
# b'<root/>'
```

6、以列表的方式操作子节点

可以将 Element 对象的子节点视为列表进行各种操作：

```python
child = root[0]  # 下标访问
print(child.tag)
# child1

print(len(root))  # 子节点数量
# 3

root.index(child2)  # 获取索引号
# 1

for child in root:  # 遍历
    print(child.tag)
# child1
# child2
# child3

root.insert(0, etree.Element('child0'))  # 插入
start = root[:1]  # 切片
end = root[-1:]

print(start[0].tag)
# child0

print(end[0].tag)
# child3

root.append( etree.Element('child4') )  # 尾部添加
print(etree.tostring(root))
# b'<root><child0/><child1/><child2/><child3/><child4/></root>'
```

其实前面讲到的删除子节点的两个方法 remove 和 clear 也和列表相似。

7、获取父节点

使用 getparent 方法可以获取父节点。

```python
print(child1.getparent().tag)
# root
```

#### 属性操作

属性是以 key-value 的方式存储的，就像字典一样。

1、创建属性

可以在创建Element对象时同步创建属性，第二个参数即为属性名和属性值：

```python
root = etree.Element('root', interesting='totally')
print(etree.tostring(root))
# b'<root interesting="totally"/>'

# 也可以使用set方法给已有的Element对象添加属性，两个参数分别为属性名和属性值：
root.set('hello', 'Huhu')
print(etree.tostring(root))
# b'<root interesting="totally" hello="Huhu"/>'
```

2、获取属性

属性是以key-value的方式存储的，就像字典一样。

```python
# get方法获得某一个属性值
print(root.get('interesting'))
# totally

# keys方法获取所有的属性名
sorted(root.keys())
# ['hello', 'interesting']

# items方法获取所有的键值对
for name, value in sorted(root.items()):
    print('%s = %r' % (name, value))
hello = 'Huhu'
interesting = 'totally'

# 也可以用attrib属性一次拿到所有的属性及属性值存于字典中：
attributes = root.attrib
print(attributes)
# {'interesting': 'totally', 'hello': 'Huhu'}

attributes['good'] = 'Bye'  # 字典的修改影响节点
print(root.get('good'))
# Bye
```

#### 文本操作

标签及标签的属性操作介绍完了，最后就剩下标签内的文本了。可以使用 text 和 tail 属性、或XPath 的方式来访问文本内容。

1、text 和 tail 属性

一般情况，可以用 Element 的 text 属性访问标签的文本。

```python
root = etree.Element('root')
root.text = 'Hello, World!'
print(root.text)
# Hello, World!

print(etree.tostring(root))
# b'<root>Hello, World!</root>'
```

XML的标签一般是成对出现的，有开有关，但像HTML则可能出现单一的标签，比如下面这段代码中的<br/>。

```html
<html><body>Text<br/>Tail</body></html>
```

Element 类提供了 tail 属性支持单一标签的文本获取。

```python
html = etree.Element('html')
body = etree.SubElement(html, 'body')
body.text = 'Text'
print(etree.tostring(html))
# b'<html><body>Text</body></html>'

br = etree.SubElement(body, 'br')
print(etree.tostring(html))
# b'<html><body>Text<br/></body></html>'

# tail仅在该标签后面追加文本
br.tail = 'Tail'
print(etree.tostring(br))
# b'<br/>Tail'

print(etree.tostring(html))
# b'<html><body>Text<br/>Tail</body></html>'

# tostring方法增加method参数，过滤单一标签，输出全部文本
print(etree.tostring(html, method='text'))
# b'TextTail'
```

2、XPath方式

```python
# 方式一：过滤单一标签，返回文本
print(html.xpath('string()'))
# TextTail

# 方式二：返回列表，以单一标签为分隔
print(html.xpath('//text()'))
# ['Text', 'Tail']
# 方法二获得的列表，每个元素都会带上它所属节点及文本类型信息，如下：

texts = html.xpath('//text()'))

print(texts[0])
# Text

# 所属节点
parent = texts[0].getparent()  
print(parent.tag)
# body

print(texts[1], texts[1].getparent().tag)
# Tail br

# 文本类型：是普通文本还是tail文本
print(texts[0].is_text)
# True
print(texts[1].is_text)
# False
print(texts[1].is_tail)
# True
```

#### 文件解析与输出

这部分讲述如何将XML文件解析为 Element 对象，以及如何将 Element 对象输出为XML文件。

1、文件解析

文件解析常用的有 fromstring、XML 和 HTML 三个方法。接受的参数都是字符串。

```python
xml_data = '<root>data</root>'

# fromstring方法
root1 = etree.fromstring(xml_data)
print(root1.tag)
# root

print(etree.tostring(root1))
# b'<root>data</root>'

# XML方法，与fromstring方法基本一样
root2 = etree.XML(xml_data)
print(root2.tag)
# root

print(etree.tostring(root2))
# b'<root>data</root>'

# HTML方法，如果没有<html>和<body>标签，会自动补上
root3 = etree.HTML(xml_data)
print(root3.tag)
# html

print(etree.tostring(root3))
# b'<html><body><root>data</root></body></html>'
```

2、输出

输出其实就是前面一直在用的 tostring 方法了，这里补充 xml_declaration 和 encoding 两个参数，前者是XML声明，后者是指定编码。

```python
root = etree.XML('<root><a><b/></a></root>')

print(etree.tostring(root))
# b'<root><a><b/></a></root>'

# XML声明
print(etree.tostring(root, xml_declaration=True))
# b"<?xml version='1.0' encoding='ASCII'?>\n<root><a><b/></a></root>"

# 指定编码
print(etree.tostring(root, encoding='iso-8859-1'))
# b"<?xml version='1.0' encoding='iso-8859-1'?>\n<root><a><b/></a></root>"
```

#### ElementPath

这一节回答问题2。

讲 ElementPath 前，需要引入 ElementTree 类，一个 ElementTree 对象可理解为一个完整的XML 树，每个节点都是一个 Element 对象。而 ElementPath 则相当于 XML 中的 XPath。用于搜索和定位 Element 元素。

这里介绍两个常用方法，可以满足大部分搜索、查询需求，它们的参数都是XPath语句：

findall()：返回所有匹配的元素，返回列表

find()：返回匹配到的第一个元素

```python
root = etree.XML("<root><a x='123'>aText<b/><c/><b/></a></root>")

# 查找第一个b标签
print(root.find('b'))
# None
print(root.find('a').tag)
# a

# 查找所有b标签，返回Element对象组成的列表
# [ b.tag for b in root.findall('.//b') ]
# ['b', 'b']

# 根据属性查询
print(root.findall('.//a[@x]')[0].tag)
# a
print(root.findall('.//a[@y]'))
# []
```

## 练习：解析百度贴吧中的发帖图片

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

有时出现 **在浏览器中可以匹配xpath规则，但是在程序中却不能匹配的情况**

这是因为服务器会针对不同的浏览器进行相应的优化。

为了保证xpath能正确的匹配网页数据，因此最好使用 ie 浏览器的user-agent，这是因为只有 ie 浏览器会保证服务器发送过来的数据是与在网页上浏览的数据格式一致。

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
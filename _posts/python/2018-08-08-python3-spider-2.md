---
layout: post
title:  "Python3 爬虫（二）：urllib 库的用法"
date:  2018-08-08
desc: "python3 网络爬虫实战系列之二：urllib 库的用法，主要包括 urllib.request 以及 urllib.parse 模块的主要用法介绍。"
keywords: "Python3,网络爬虫,实战,知识点"
categories: [Python]
tags: [python3,网络爬虫]
---

# Python3 爬虫（二）：urllib 库的用法

学习python 爬虫首先要学习的知识点便是 urllib 库的使用。urllib 库是 python 中进行网络请求和相应的主要库，是python自带的基础库。为了模拟用户真实的浏览器网络请求，我们便要学会使用 urllib 库来进行网络的请求发送。

注意：在python2 中的 urllib 库分为 urllib 和 urllib2 个库，但是在python3当中，将这些库合并成了一个urllib库，只不过将这两个分别做为urllib库下的两个模块：urllib.request 和 urllib.parse，具体的操作并没有改变。

主要内容包括：

##### 1.urllib基本使用
##### 2.urllib高级使用

---

## 一、urllib基础使用

### 1.urllib发送 GET 请求

通过查看urllib.request的源码可以发现其urlopen方法是调用了open方法，但是open方法不支持
指定header，所以在编写爬虫时只使用urlopen方法而不使用open方法。

首先我们简单的来编写一个爬虫来爬取百度的首页信息，主要通过 urllib.request 中的 urlopen 方法来完成。

```python
import urllib.request

# 通过urllib来打开一个链接，返回一个类文件对象，是该链接的相应信息
request = urllib.request.urlopen('http://www.baidu.com/')

# 读取该文件的信息,返回字符串
html = request.read()

# 打印信息
print(html)
```

只是使用 urlopen 方法并不能够自定义 User-Agent 信息，这样会导致服务器可以知道当前是爬虫在访问数据.

为了保证爬虫不被发现，需要使用urllib 中的 request 方法来自定义 User-Agent 信息。

```python
import urllib.request

# 访问的请求头是一个字典类型的数据
ua_headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
}

# 通过Request方法构造请求对象
request = urllib.request.Request('http://www.baidu.com/', headers=ua_headers)

# 使用urllib访问请求，返回响应数据
response = urllib.request.urlopen(request)
# 读取响应信息中的内容
html = response.read()

# 打印返回时数据
print(html)

# response是服务器是返回的数据，不仅支持文件的操作，而且还可以支持一下的方法
print('-'*50)
# 返回响应信息
print(response.getcode())

# 返回返回实际数据的url，防止重定向问题
print(response.geturl())

# 返回服务器响应的http报头
print(response.info())
```

为了在爬虫-反爬虫-反反爬虫的斗争中获得最后胜利，还是需要在user-agent上做更多的处理,不能一味的只使用一种user-agent来访问服务器

因此，可以通过一个列表来每次随机的获取其中的一个user-agent来进行访问

```python
import random
import urllib.request

url = 'http://www.baidu.com'

# user-agent可以是一个列表
ag_list = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv2.0.1) Gecko/20100101 Firefox/4.0.1",
    "Mozilla/5.0 (Windows NT 6.1; rv2.0.1) Gecko/20100101 Firefox/4.0.1",
    "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.8.131 Version/11.11",
    "Opera/9.80 (Windows NT 6.1; U; en) Presto/2.8.131 Version/11.11",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11"
]

# 在user-agent列表里随机选择一个做为user-agent
user_agent = random.choice(ag_list)

# 构造请求
request = urllib.request.Request(url)

# 使用add_header方法来添加或者修改一个http报头
request.add_header('User-Agent', user_agent)

# get_header() 获取一个已有的HTTP报头的值，注意只能是第一个字母大写，其他的必须小写
print(request.get_header("User-agent"))
```

### 2.练习一：编写一个百度搜索的接口，实现用户输入内容返回百度搜索所返回的结果页面

观察百度在搜索时的url信息可以发现，百度是使用的get方式将所要查询的关键字做为 wd 参数的值来进行服务器的访问的，因此我们只需拼接对应的url便可以实现百度搜索的接口编写。

注意：当在url中输入中文时，其实会将当中的中文进行转码操作，而在浏览器地址栏中看到的中文信息其实是经过解码之后显示出来的。将中文转码是使用的 url 自己的编码方式，在程序中可以使用 urllib库中的方法来进行：

编码使用的是：urllib.request.quote方法

解码使用的是：urllib.request.unquote方法

```python
import random
import urllib.request

url = 'https://www.baidu.com/s'

# 采用随机的user-agent
headers = [
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv2.0.1) Gecko/20100101 Firefox/4.0.1",
    "Mozilla/5.0 (Windows NT 6.1; rv2.0.1) Gecko/20100101 Firefox/4.0.1",
    "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.8.131 Version/11.11",
    "Opera/9.80 (Windows NT 6.1; U; en) Presto/2.8.131 Version/11.11",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
]
user_agent = random.choice(headers)

# 对输入的关键字进行url编码
wd = input('请输入想要搜索的关键字：')
wd = urllib.request.quote(wd)

full_url = url+'?wd='+wd

# 创建请求对象
request = urllib.request.Request(full_url)

# 添加请求头信息
request.add_header('User-Agent', user_agent)

# 打印请求头信息，查看是否正确
print(request.get_full_url())

# 获取返回信息
response = urllib.request.urlopen(request)
html = response.read()
print(html.decode('utf-8'))
```

### 3.练习二：使用爬虫爬取指定贴吧中指定页面的信息

通过观察百度贴吧的URL可以发现:

```url
http://tieba.baidu.com/f?kw=java&ie=utf-8&pn=50
```

其中，kw后面的便是所需要进入的贴吧，而pn则是当前的页面
即pn的取值为：（page为当前页面编号）
（page-1）*50

通过上面的规律便可以实现爬取指定贴吧中对应页面的信息

```python
import random
import urllib.request

path = 'tieba/'


def get_ag():
    """
    获取一个随机的user-agent
    :return:一个随机的user-agent
    """
    # 采用随机的user-agent
    headers = [
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv2.0.1) Gecko/20100101 Firefox/4.0.1",
        "Mozilla/5.0 (Windows NT 6.1; rv2.0.1) Gecko/20100101 Firefox/4.0.1",
        "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.8.131 Version/11.11",
        "Opera/9.80 (Windows NT 6.1; U; en) Presto/2.8.131 Version/11.11",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
    ]
    return random.choice(headers)


def load_page(full_url):
    """
    处理页面，将页面中的信息爬取下来
    :param full_url:所要爬取的页面路径
    :return:每一个页面的响应对象
    """
    request = urllib.request.Request(full_url)
    request.add_header('User-Agent', get_ag())

    # 打印出当前构造的url信息（测试使用）
    # print(request.get_full_url())
    print('处理完毕')
    return urllib.request.urlopen(request).read().decode('utf-8')


def write_page(html, file_path):
    """
    将页面信息写入到文件中去
    :param html:所要写入到文件中的每一个响应页面
    :param file_path:写入文件的路径信息
    :return:
    """

    # 使用with上下文管理器来做文件处理操作，不必担心文件的关闭
    # 注意此处要指定打开文件的类型，因为默认为r，要写入的话会提示文件不存在
    with open(file_path, 'w') as file:
        file.write(html)
    print('写入完成')


def request_page(url, start_page, end_page):
    """
    页面处理的调度器，负责处理每一个页面
    :param url:想要访问的url
    :param start_page:访问的起始页
    :param end_page:访问的终止页
    :return:
    """
    for page in range(start_page, end_page+1):
        # 对每一个页面进行处理
        print('开始处理第%d页' % page)
        pn = (page-1)*50
        full_url = url+'&pn='+str(pn)
        html = load_page(full_url)

        # 将对应的页面处理进行保存
        print('开始写入第%d页' % page)
        write_page(html, path+str(page)+'.html')

    print('*'*50)
    print('END')


if __name__ == '__main__':
    """
    用户访问接口
    """
    # 拼接访问的url
    url = 'http://tieba.baidu.com/f'
    kw = input('请输入想要访问的贴吧：')
    kw = urllib.request.quote(kw)
    start_page = int(input('想要访问的起始页：'))
    end_page = int(input('想要访问的终止页：'))
    url = url+'?kw='+kw
    # 开始进行页面调度处理
    request_page(url, start_page, end_page)
```

### 4.urllib发送 POST 请求

在使用抓包软件进行分析时发现，GET 和 POST 请求方式的主要区别在于 GET 会将请求数据会显示在 querystring 中，而 POST 则是将请求数据放在 form 表单里。

因此在使用 urllib 来模拟 POST 请求的时候便需要构造对应的请求信息。在 urllib 中表单数据为字典类型，跟 headers 类型一样。将所需要添加到表单中的数据设置到字典中去。

### 5.urllib处理 ajax返回的数据

ajax 返回的数据是 json 类型的，所以可以通过获取对应的 json 数据来进行 ajax处理，因此可以使用抓包获取对应的url进行分析，获取到 ajax返回的 json数据。

注意：**做爬虫不需要关注页面信息，而是页面信息的数据来源**

### 6.练习三：获取豆瓣电影排名前10的电影的json描述信息

通过抓包软件可以看到豆瓣在加载电影排行页面时的具体发送信息如下：

```
GET /j/chart/top_list?type=11&interval_id=100%3A90&action=&start=20&limit=20 HTTP/1.1
Host: movie.douban.com
Connection: keep-alive
Accept: */*
X-Requested-With: XMLHttpRequest
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36
Referer: https://movie.douban.com/typerank?type_name=%E5%89%A7%E6%83%85&type=11&interval_id=100:90&action=
Accept-Encoding: gzip, deflate, br
Accept-Language: en,zh-CN;q=0.9,zh;q=0.8
push_noty_num=0; push_doumail_num=0; ll="118371"; _vwo_uuid_v2=D273F544B305AE64FC0C0623DE399D8D1|ad2852fe8ef03fee28ad3ccc99270336; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1532524989%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_ses.100001.4cf6=*; __utma=30149280.949629340.1532524989.1532524989.1532524989.1; __utmc=30149280; __utmz=30149280.1532524989.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __utmt=1; __utmb=30149280.1.10.1532524989; __utma=223695111.205246693.1532524989.1532524989.1532524989.1; __utmb=223695111.0.10.1532524989; __utmc=223695111; __utmz=223695111.1532524989.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_id.100001.4cf6=c2b7882d1f8895b4.1531819482.2.1532525003.1531819482.
```

当继续在向下滑动页面加载其他的电影信息时，发现返回了一些 json 数据，这就是 ajax 返回的数据。因为 ajax 主要是以 json 的格式来传递数据的。

主要的 json 返回数据如下：

```js
[{
	"rating": ["9.2", "45"],
	"rank": 21,
	"cover_url": "https://img1.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p511146807.jpg",
	"is_playable": false,
	"id": "1292001",
	"types": ["剧情", "音乐"],
	"regions": ["意大利"],
	"title": "海上钢琴师",
	"url": "https:\/\/movie.douban.com\/subject\/1292001\/",
	"release_date": "1998-10-28",
	"actor_count": 5,
	"vote_count": 679770,
	"score": "9.2",
	"actors": ["蒂姆·罗斯", "普路特·泰勒·文斯", "比尔·努恩", "梅兰尼·蒂埃里", "阿尔贝托·巴斯克斯"],
	"is_watched": false
}, {
	"rating": ["9.2", "45"],
	"rank": 22,
	"cover_url": "https://img3.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p2206088801.jpg",
	"is_playable": true,
	"id": "1889243",
	"types": ["剧情", "科幻", "冒险"],
	"regions": ["美国", "英国", "加拿大", "冰岛"],
	"title": "星际穿越",
	"url": "https:\/\/movie.douban.com\/subject\/1889243\/",
	"release_date": "2014-11-12",
	"actor_count": 28,
	"vote_count": 590959,
	"score": "9.2",
	"actors": ["马修·麦康纳", "安妮·海瑟薇", "杰西卡·查斯坦", "卡西·阿弗莱克", "迈克尔·凯恩", "马特·达蒙", "麦肯吉·弗依", "蒂莫西·柴勒梅德", "艾伦·伯斯汀", "约翰·利思戈", "韦斯·本特利", "大卫·吉雅西", "比尔·欧文", "托弗·戈瑞斯", "科莱特·沃夫", "弗朗西斯·X·麦卡蒂", "安德鲁·博尔巴", "乔什·斯图沃特", "莱雅·卡里恩斯", "利亚姆·迪金森", "杰夫·赫普内尔", "伊莱耶斯·加贝尔", "布鲁克·史密斯", "大卫·奥伊罗", "威廉姆·德瓦内", "拉什·费加", "格里芬·弗雷泽", "弗洛拉·诺兰"],
	"is_watched": false
},]
```

可以看到，虽然豆瓣是使用的 get来获取数据的，但是我们可以使用构造 post 请求来直接获取对应的 json

代码如下：

```python
import urllib.parse
import urllib.request

# 访问的url信息（注意此处的url得是从抓包工具中获得的网址）
url = "https://movie.douban.com/j/chart/top_list?type=11&interval_id=100%3A90&action="

# 构造访问头信息
headers = {
	"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
}

# 构造请求数据
form_data = {
    "start": "0",
    "limit": "10",
}
data = urllib.parse.urlencode(form_data).encode('utf-8')
# 构造请求信息
request = urllib.request.Request(url, data=data, headers=headers)

json = urllib.request.urlopen(request).read().decode('utf-8')

print(json)
```

## 二、urllib高级使用

由于基础的 urllib 不支持对请求的自定义以及对 cookie 的处理，因此需要进行高级设置。

### 1.自定义处理器对象和请求启动器对象

urllib.request 库中有自定义处理器对象以及请求启动器对象，通过自定义处理器对象和请求启动器对象实现请求的高级定制功能。

**可以通过自定义一个 url 的 handler 对象，然后通过该对象创建一个 opener 对象，最后通过 opener 对象便可以调用 open 方法来处理一个 request 请求。**

```python
import urllib.request

# 构建一个http handler对象，支持http请求
# http_handler = urllib.request.HTTPHandler()

# 在httphandler()中添加参数"debuglevel=1"将会自动打开debug log模式
# 此时会程序会打印出相应的收发包信息
http_handler = urllib.request.HTTPHandler(debuglevel=1)

# 调用 build_opener方法传入一个处理器handler将创建一个自定义的opener对象
opener = urllib.request.build_opener(http_handler)

request = urllib.request.Request('http://www.baidu.com')

# 使用自定义的opener对象调用open方法来发送一个request请求
response = opener.open(request)
#print(response.read().decode('utf-8'))
```

### 2.使用代理ip

正常情况下为了保证爬虫程序的稳定运行，一般是需要使用代理 ip 来进行访问 url

**代理ip**也就是一台运行着的服务器，我们会先将请求放松到代理服务器上，在通过代理服务器去访问所要请求的url，最后由代理将返回的响应在发送给本机。

因此，便涉及到发送回来的数据需要进行相应的 **转码**以及 **代理ip**的获得两个主要问题。

#### 代理ip获取

代理 ip 一般分为 **免费ip** 以及 **收费ip**：

**免费代理**直接在相应的网站上寻找就好，使用时直接在代理处理器中使用就好

**收费ip**分为私密代理和独享代理，这类的ip在使用时还需要单独进行账号和密码的验证。

代理ip又可以分为 **高匿ip**和 **透明ip**：

**高匿ip**在使用时网站只能看到代理ip的信息，而看不到真是发送发的ip

**透明ip**在网站后台即可以看到代理ip的信息，又可以看到真实发送方的ip

#### 响应数据转码

一般国内的代理ip需要进行"gbk"的转码，国外的是进行"utf-8"的转码

注意：
代理在使用的时候也使需要创建一个代理列表，从中使用random任意选择一个来进行访问

#### 使用代理ip来获取百度首页的信息

```python
import urllib.request

# 创建一个代理的Handler处理器,传入的参数是字典类型，其中包括代理的相关信息
# 收费代理的话这里还得使用相关的账号和密码进行验证，格式：用户名：密码@ip：端口号
# 注意这里代理ip的输入模式
http_proxy_handler = urllib.request.ProxyHandler({"HTTP": "125.46.0.62:31773"})

# 通过代理处理器创建一个opener对象
opener = urllib.request.build_opener(http_proxy_handler)

# 将当前的opener对象安装到程序中做为全局的opener对象，替换掉原先的，这样便可以在程序中直接使用urlopen的方法了
urllib.request.install_opener(opener)

request = urllib.request.Request("http://www.baidu.com")

response = urllib.request.urlopen(request)

print(response.read().decode("utf-8"))
```

在真正的开发环境中呢一般使用的都是公司提供的私密代理或者是自己单独购买的独享代理

私密代理和独享代理在使用时和普通的代理一样，只不过需要进行相应的账号和密码验证

不过为了保护代理的隐私，需要将代理的账号和密码进行保密处理，一般来说有以下两种方式来进行：

1. 将账号和密码写入到一个python模块中

2. 将账号和密码写入到系统环境变量中

因为 python 是属于解释型语言，因此将账号和密码写入到环境变量中最好

环境变量位置：~/.bash_profile

写入完成之后需要使其生效：source ~/.bash_profile

使用时需要导入os模块，通过os模块中的 environ 中的 get 方法来获取

### 3.密码管理器

有时有些网页是需要进行账号和密码验证之后才能进行访问，为了保证能够爬取这类的网站，便需要创建一个对应的密码管理器来存储相关的密码信息

urllib.request.build_opener可以添加多个处理器

```python
import urllib.request

test = "test"
password = "123456"
webserver = "192.168.21.52"

# 构建一个密码管理对象，可以用来保存和HTTP请求相关的授权账户信息
passwordMgr = urllib.request.HTTPPasswordMgrWithDefaultRealm()

# 添加授权账户信息，第一个参数realm如果没有指定就写None，后三个分别是站点IP，账户和密码
passwordMgr.add_password(None, webserver, test, password)

# HTTPBasicAuthHandler() HTTP基础验证处理器类
httpauth_handler = urllib.request.HTTPBasicAuthHandler(passwordMgr)

# 处理代理基础验证相关的处理器类
proxyauth_handler = urllib.request.ProxyBasicAuthHandler(passwordMgr)

# 构建自定义opener
opener = urllib.request.build_opener(httpauth_handler, proxyauth_handler)

#urllib.request.install_opener(opener)

request = urllib.request.Request("http://192.168.21.52/")

# 用授权验证信息
response = opener.open(request)

# 没有授权验证信息
#response = urllib.request.urlopen(request)

print(response.read())
```

### 4.自定义cookie

一般在登陆网站是需要先进行登陆操作的，（现在的网站登陆一般都是有一个动态的token来进行用户验证，这种的得等以后在学习，现在是登陆一个人人网之前的登陆接口，这个接口并没有token验证机制）

在登陆操作之后便会将用户的登陆信息进行保存起来，生成一个对应的cookie值，然后在访问网站时便会直接进入，而不需要进行登陆操作

在模拟登陆时需要使用 cookielib 库来保存登陆网站的 cookie 值，这样在之后的请求时便可以使用之前保存的cookie信息了。

一般用程序模拟登陆主要分为两步：

1. 使用账号和密码向服务器发送post登陆请求，并将登陆成功的cookie保存

2. 使用已经登陆的cookie来向对应的网页发送请求

**注意：**

在 python2 中是使用 cookielib 库；而在python3中是使用 http.cookiejar 库

该模块主要的对象：

```js
                        CookieJar____
                        /     \      \
            FileCookieJar      \      \
             /    |   \         \      \
 MozillaCookieJar | LWPCookieJar \      \
                  |               |      \
                  |   ---MSIEBase |       \
                  |  /      |     |        \
                  | /   MSIEDBCookieJar BSDDBCookieJar
                  |/
               MSIECookieJar
```

具体的代码如下：

```python
import http.cookiejar
import urllib.request
import urllib.parse

# 通过http.cookiejar.CookieJar()方法创建一个cookie对象，用来保存cookie信息
cookie = http.cookiejar.CookieJar()

# 使用HTTPCookieProcessor方法创建一个cookie处理器对象，传入参数为cookie对象
cookie_handler = urllib.request.HTTPCookieProcessor(cookie)

# 创建一个opener对象，传入参数为cookie处理器对象
opener = urllib.request.build_opener(cookie_handler)

# opener中有一个addheaders属性，其中保存的是对应的头信息
opener.addheaders = [('User-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36')]

# 接下来是用户对应的登陆网页的账号和密码，这里是需要从网页中获取对应的表单的名称
# 而且向服务器发送的数据都是需要进行相应的urlencode编码的
data = {'email': '', 'password': ''}
data = urllib.parse.urlencode(data)

# 首先构造登陆网站的请求
request_login = urllib.request.Request('http://www.renren.com/PLogin.do', data=data)
# 将登陆请求发送
response_login = opener.open(request_login)

# 接下来便可以发送向其他网页进行访问的请求了
# 注意以上的登陆请求是必须要进行发送的，只有这样才会将对应的cookie保存下来
```
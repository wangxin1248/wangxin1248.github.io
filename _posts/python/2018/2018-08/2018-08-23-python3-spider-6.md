---
layout: post
title:  "Python3 爬虫（六）：Json 和 JsonPath 应用"
date:  2018-08-23
desc: "python3 网络爬虫实战系列之六：学习 Python 中有关 Json 数据的处理的方法，以及利用 JsonPath 来处理拉勾网上的真实 Json 数据"
keywords: "Python3,网络爬虫,实战,知识点,Json,JsonPath"
categories: [Python]
tags: [python3,网络爬虫,Json]
---

# JSON

**JSON**(JavaScript Object Notation)是一种轻量级的数据交换格式，它使的人们很容易的进行阅读和编写。同时也方便了机器进行解析和生成。适用于进行数据交互的场景，比如网站前台与后台之间的数据交互。

Json 简单说就是 javascript 中的 **对象**和 **数组**，所以这两种结构就是对象和数据两种结构，通过这两种结构可以表示各种复杂的结构。

**对象**：对象在js中表示为{}括起来的内容，数据结构为{key:value,key:value,...}的键值对的结构，在面向对象的语言中，key为对象的属性，value为对应的属性值，所以很容易理解，取值方法为对象.key获取属性值，这个属性值的类型可以是数字、字符串、数组、对象这几种。

**数组**：数组在js中是中括号[]括起来的内容，数据结构为["Python", "javascript", "C++",..]，取值方式和所有语言中一样，使用索引获取，字段值的类型可以是数字、字符串、数组、对象几种。

Python3 当中自带了 Python 模块，官网：[https://docs.python.org/3/library/json.html](https://docs.python.org/3/library/json.html)

## Python3 使用 Json

json 模块是 python3 中自带的一个库，使用的时候只需直接导入便可：

```python
import json
```

json模块提供了四个功能：**dumps、dump、loads、load**

### json.loads()

把 Json 格式字符串解码转换成 Python 对象，从 Json 到 Python 的类型转化对照如下：
![json-python](/assets/images/2018-08/05-json-python.png)

```python
import json

strList = '[1, 2, 3, 4, 5, 6, 7, 8, 9]'

strDict = '{"city": "西安", "name": "wangxin"}'

print(json.loads(strList))

print(json.loads(strDict))
```

### json.dumps()

实现 Python 类型转化为 Json 字符串，返回一个 str 对象把一个 Python 对象编码转换成 Json 字符串。

从 Python 原始类型向 Json 类型转化的对照表如下：
![json-python](/assets/images/2018-08/06-python-json.png)

```python
import json
# chardet是一个编码识别模块，可通过pip3安装
import chardet

listStr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
tupleStr = (1, 2, 3, 4, 5, 6, 7, 8, 9)
dictStr  = {"city":"西安", "name":"wangxin"}

print(type(json.dumps(listStr)))

print(type(json.dumps(tupleStr)))

#注意，json.dumps()序列化时默认使用ascii编码
#添加参数 ensure_ascii = False,禁用ascii编码，按utf-8编码

print(json.dumps(dictStr))

print(chardet.detect(json.dumps(dictStr)))

print(json.dumps(dictStr, ensure_ascii=False))

print(chardet.detect(json.dumps(dictStr, ensure_ascii=False)))
```

### json.load()

读取文件中 Json 形式的字符串元素 转化成 Python 类型

```python
import json

strList = json.load(open("listStr.json"))
print(strList)

strDict = json.load(open("dictStr.json"))
print(strDict)
```

### json.dump()

将 Python 内置类型序列化为 Json 对象后写入文件

```python
import json

listStr = [{"city": "北京"}, {"name": "大刘"}]
json.dump(listStr, open("listStr.json","w"), ensure_ascii=False)

dictStr = {"city": "北京", "name": "大刘"}
json.dump(dictStr, open("dictStr.json","w"), ensure_ascii=False)
```

# JsonPath

JsonPath 是一种信息抽取类库，是从JSON文档中抽取指定信息的工具，类似于 XPath 在 xml 文档中的定位，JsonPath 表达式通常是用来路径检索或设置 Json 的。

## 安装 JsonPath

JsonPath 可以使用 pip3 来进行安装：

```bash
$ pip3 install jsonpath
```

## JsonPath 与 Xpath 语法对比

son结构清晰，可读性高，复杂度低，非常容易匹配，下表中对应了XPath的用法：

![jsonpath](/assets/images/2018-08/07-jsonpath.png)

## 示例

从[https://www.lagou.com/lbs/getAllCitySearchLabels.json](https://www.lagou.com/lbs/getAllCitySearchLabels.json)中获取所有的城市信息

```python
import json
import jsonpath
import urllib.request


def get_city():
    url = 'https://www.lagou.com/lbs/getAllCitySearchLabels.json'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko'
    }
    request = urllib.request.Request(url, headers=headers)
    response = urllib.request.urlopen(request)
    html = response.read().decode('utf-8')
    # print(html)

    # 将 json 内容转换为 python 对象
    jsonobj = json.loads(html)

    # 进行json内容的解析
    city_list = jsonpath.jsonpath(jsonobj, '$..name')
    for item in city_list:
        print(item)

    # 将 python 数组转换为 json 对象
    array = json.dumps(city_list, ensure_ascii=False)
    # 写入文件
    with open('lagoucity.txt', 'w') as file:
        file.write(array)


if __name__ == '__main__':
    get_city()
```
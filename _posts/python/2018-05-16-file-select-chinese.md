---
layout: post
title:  "数据清洗之获取文件中的中文内容"
date:  2018-05-16
desc: "在进行各种各样的操作之前，首先需要的便是清洗数据。最近获取到一份文件，其中中文和英文都有，现想要从中提取出其中的中文内容"
keywords: "python,数据清洗,获取中文"
categories: [Python]
tags: [python3,数据清洗]
---

# 清洗文件之获取文件中的中文内容

## 原理

使用正则表达式来判断文件中的中文，将其写入到新的文件中去

## 代码

``` python
import imp
import sys
imp.reload(sys)
import re

#判断是否为中文的正则表达式
pchinese = re.compile('([\u4e00-\u9fa5]+)+?')
#打开要提取的文件
f = open("data.txt")
# 打开要写入的文件
fw = open("getdata.txt","w")
# 循环读取要读取文件的每一行
for line in f.readlines():
    # 使用正则表达获取中文
    m = pchinese.findall(str(line))
    if m:
        # 将获取中文内容按空格分开
        str1 = ' '.join(m)
        str2 = str(str1)
        # 写入文件
        fw.write(str2)
        # 不同行的要换行
        fw.write("\n")
# 关闭文件
f.close()
fw.close()
```
---
layout: post
title:  "linux服务器设置语言环境为支持中文"
date:  2018-04-17
desc: "搬瓦工中的ubuntu16.04 vps默认不支持中文，其实对于所有的Linux服务器来说都是默认不支持中文，需要单独进行设置才能使用中文"
keywords: "Linux,中文,ubuntu16.04,搬瓦工vps,服务器"
categories: [Linux]
tags: [Linux,Ubuntu]
---
# linux服务器设置语言环境为支持中文

最近想在Linux服务器中进行开发工作，但在编辑文件时发现不能输入中文，在文件中输入的中文会变成乱码。在网上找了好久之后发现来下面这种方法可以很简单的设置服务器支持中文。

本教程是在Ubuntu16.04 服务器版本下实验成功，理论上所有的服务器都支持这样设置。

## 安装语言包

### 修改locale.gen文件
```
sudo vim /etc/locale.gen
```
将文件中的zh_CN.GBK GBK zh_CN.UTF8 UTF8的注释去掉

### 下载语言
```
sudo locale-gen
```

这样设置之后服务器便可以正常使用中文进行输入了。
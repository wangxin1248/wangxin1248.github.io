---
layout: post
title:  "Ubuntu18.04下更改apt源为阿里云源"
date:  2018-10-30
desc: "安装了 Ubuntu 之后为了下载更方便，速度更快，我们往往在使用 Linux 系列系统时修改apt源为国内的源，一般选择有阿里云，豆瓣之类的，下面简单说下如何更改为阿里云源。"
keywords: "Linux,Ubuntu,服务器,apt源,换源,阿里源"
categories: [Linux]
tags: [Linux,Ubuntu]
---
# 更改apt源为阿里云源

### 1.备份原有源以防万一

```bash
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
```

### 2.编辑源列表文件

```bash
sudo vim /etc/apt/sources.list
```

输入 i ，将文件中的内容更改为：

```bash
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
```

之后按 esc 键，输入 :x 返回

### 3.更新软件列表

```bash
sudo apt-get update
```

### 4.更新软件包

```bash
sudo apt-get upgrade
```
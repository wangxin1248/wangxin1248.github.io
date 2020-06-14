---
layout: post
title:  "Centos7 更换阿里 yum源"
date:  2020-06-11
desc: "Centos7 更换阿里 yum源"
keywords: "Centos,yum,阿里,换源,Linux"
categories: [Linux]
tags: [Centos]
---
# Centos7 更换阿里 yum源

1、备份

```shell
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
```

2、下载新的CentOS-Base.repo 到/etc/yum.repos.d/

```shell
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
```

3、生成缓存

```shell
yum makecache
```

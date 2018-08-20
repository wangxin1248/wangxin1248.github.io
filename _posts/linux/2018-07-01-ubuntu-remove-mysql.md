---
layout: post
title:  "ubuntu 完全卸载 mysql"
date:  2018-07-01
desc: "需要在 ubuntu 中卸载掉安装的 mysql-server，只需要一下简单的几步便可以实现完全卸载"
keywords: "Linux,ubuntu,mysql-server,服务器,卸载"
categories: [Linux]
tags: [Linux,Ubuntu,mysql]
---


需要在ubuntu 服务器中卸载掉安装的 mysql-server，只需要一下简单的几步便可以实现完全卸载:

```
sudo apt-get remove mysql-common
sudo apt-get autoremove --purge mysql-server-5.0 
```

使用

```
dpkg --list|grep mysql
```

查看，还剩什么就卸载什么

最后清楚残留数据：

```
dpkg -l |grep ^rc|awk '{print $2}' |sudo xargs dpkg -P
```
![mysql-install-1](/assets/images/2018-07/01_ubuntu_remove_mysql.png)

再次使用

```
dpkg --list|grep mysql
```

假如没有东西显示就表示 mysql 已经完全从 ubuntu 中卸载了。
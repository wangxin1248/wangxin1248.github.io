---
layout: post
title:  "MAC 远程连接 Ubuntu 桌面"
date:  2018-11-30
desc: "在 MAC 上远程连接 ubuntu 主机桌面，实现远程访问"
keywords: "Linux,Ubuntu桌面,MAC,远程连接"
categories: [Linux]
tags: [Linux,Ubuntu]
---
# MAC 远程连接 Ubuntu 桌面

有时候得需要在 MAC 下远程访问一些 Ubuntu 主机，并且该主机安装的是 Ubuntu 桌面版。

这时候就得在 Ubuntu 电脑上进行一些设置：

## 1.安装

```bash
$ sudo apt-get install x11vnc
```

## 配置 vnc 密码

```bash
$ x11vnc -storepasswd
```

## 启动 vnc 服务

```bash
$ x11vnc -forever -shared -rfbauth ~/.vnc/passwd
```

上述操作已经完成了 Ubuntu 桌面主机上的设置，接下来的操作在 MAC 上进行：

## 下载 realVNC 客户端

下载链接：[https://www.realvnc.com/en/connect/download/viewer/](https://www.realvnc.com/en/connect/download/viewer/)

下载完之后，新建链接，输入指定主机的 **ip:5900**来进行远程连接。
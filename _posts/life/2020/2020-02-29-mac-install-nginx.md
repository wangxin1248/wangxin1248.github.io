---
layout: post
title:  "MAC 安装 Nginx"
date:  2020-02-29
desc: "MAC 安装 Nginx 步骤介绍"
keywords: "MAC,Nginx"
categories: [Life]
tags: [MAC]
---
# MAC 安装 Nginx

## 安装 Nginx

Mac 下安装 nginx 可以通过 brew 进行。

```shell
$ brew search nginx
$ brew install nginx
```

出现如下的信息表示安装成功：

```
Docroot is: /usr/local/var/www

The default port has been set in /usr/local/etc/nginx/nginx.conf to 8080 so that
nginx can run without sudo.

nginx will load all files in /usr/local/etc/nginx/servers/.

To have launchd start nginx now and restart at login:
  brew services start nginx
Or, if you don't want/need a background service you can just run:
  nginx
```

## Nginx 启动

输入如下的命令来启动 Nginx：

```shell
$ nginx
```

然后在浏览器中输入：[http://localhost:8080/](http://localhost:8080/) 查看 Nginx 首页。

## Nginx 操作

- nginx -s reload：重新加载配置
- nginx -s reopen：重启
- nginx -s stop：停止
- nginx -s quit：退出

其中 Nginx 配置文件路径在 /usr/local/etc/nginx/nginx.conf

```shell
vim /usr/local/etc/nginx/nginx.conf
```

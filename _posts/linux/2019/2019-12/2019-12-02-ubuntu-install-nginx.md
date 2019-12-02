---
layout: post
title:  "Ubuntu 18.04 安装 nginx"
date:  2019-12-02
desc: "Ubuntu 16.04 服务器中安装 nginx 并进行配置"
keywords: "Ubuntu,nginx,服务器,安装"
categories: [Linux]
tags: [Ubuntu]
---
# nginx 安装

## 一、安装 nginx

```shell
$ sudo apt install nginx
```

查看是否安装成功

```shell
$ nginx -v
```

## 二、nginx控制

可以通过 service 服务来对 nginx 进行控制

- 启动 nginx

```shell
$ service nginx start
```

- 关闭 nginx

```shell
$ service nginx stop
```

- 重启 nginx

```shell
$ service nginx restart
```

## 三、nginx 配置

在安装完成之后 nginx 的安装文件路径：

- /usr/sbin/nginx：主程序
- /etc/nginx：存放配置文件
- /usr/share/nginx：存放静态文件
- /var/log/nginx：存放日志

通过对 /etc/nginx/nginx.conf 文件进行修改来配置 nginx
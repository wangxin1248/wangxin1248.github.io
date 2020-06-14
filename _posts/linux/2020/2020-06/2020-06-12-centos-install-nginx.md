---
layout: post
title:  "Centos7 安装 Nginx"
date:  2020-06-12
desc: "Centos7 安装 Nginx 服务器并进行控制"
keywords: "Centos,Nginx,服务器,Linux"
categories: [Linux]
tags: [Centos]
---
# Centos7 安装 Nginx

## 配置源

```shell
rpm -Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
```

## 安装

```shell
yum install -y nginx
# 开启nginx
systemctl start nginx.service
# 加入开机自启动
systemctl enable nginx.service
```

## 配置

```shell
# 允许其它设备访问 http 服务器，打开防火墙的对应服务和端口（80）
firewall-cmd --add-service=http --permanent
firewall-cmd --add-port=80/tcp --permanent
# 重启防火墙令其生效
firewall-cmd --reload
```

Nginx 的配置路径在：/etc/nginx/conf.d/default.conf

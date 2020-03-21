---
layout: post
title:  "Ubuntu 18.04 安装 RabbitMQ"
date:  2020-03-21
desc: "Ubuntu 18.04 服务器中安装 RabbitMQ 并进行配置"
keywords: "Ubuntu,RabbitMQ,服务器,安装"
categories: [Linux]
tags: [Ubuntu]
---
# RabbitMQ

RabbitMQ 由 Erlang 语言开发，Erlang 语言用于并发及分布式系统的开发，在电信领域应用广泛，OTP（Open Telecom Platform）作为 Erlang 语言的一部分，包含了很多基于 Erlang 开发的中间件及工具库，安装 RabbitMQ 需要安装Erlang/OTP。

RabbitMQ的下载地址：[http://www.rabbitmq.com/download.html](http://www.rabbitmq.com/download.html)

## 一、安装 RabbitMQ

由于 RabbitMQ 需要 erlang 语言的支持，在安装 RabbitMQ 之前需要安装erlang

首先配置源

```shell
echo "deb https://dl.bintray.com/rabbitmq/debian trusty main" | sudo tee /etc/apt/sources.list.d/bintray.rabbitmq.list
echo "deb http://packages.erlang-solutions.com/ubuntu trusty contrib" | sudo tee -a /etc/apt/sources.list.d/erlang_solutions.list
```

导入对应的 key

```shell
wget -c -O- http://packages.erlang-solutions.com/ubuntu/erlang_solutions.asc | sudo apt-key add -
wget -O- https://dl.bintray.com/rabbitmq/Keys/rabbitmq-release-signing-key.asc |sudo apt-key add -
```

开始安装 erlang 和 RabbitMQ

```shell
sudo apt-get update
sudo apt-get install erlang-nox
sudo apt-get install rabbitmq-server
```

安装完之后 RabbitMQ 便已经自动启动了，可以使用如下的命令对 RabbitMQ 进行操作：

```shell
sudo service rabbitmq-server start # 启动
sudo service rabbitmq-server stop # 停止
sudo service rabbitmq-server restart # 重启
sudo service rabbitmq-server status # 查看当前状态
```

## 配置 RabbitMQ

添加admin用户，密码设置为admin。

```shell
sudo rabbitmqctl add_user  admin  admin  
```

赋予权限

```shell
sudo rabbitmqctl set_user_tags admin administrator 
```

赋予virtual host中所有资源的配置、写、读权限以便管理其中的资源

```shell
sudo rabbitmqctl  set_permissions -p / admin '.*' '.*' '.*'
```

## 管理 RabbitMQ

RabbitMQ 提供了一个 web 管理工具（rabbitmq_management），方便在浏览器端管理 RabbitMQ

```shell
sudo rabbitmq-plugins enable rabbitmq_management
```

之后在浏览器访问 [http://server-ip:15672/]，账号与密码都是刚才设置的 admin

![2](/assets/images/2020/2020-03/2.png)

---
layout: post
title:  "Linux安装Go"
date:  2021-01-22
desc: "Centos8安装Go语言"
keywords: "Centos,Go,Linux"
categories: [Linux]
tags: [Centos]
---
# Linux安装Go

- 安装系统：CentOS 8
- Go版本：1.15.7
- 用户身份：root

## 下载安装包

```shell
wget https://golang.org/dl/go1.15.7.linux-amd64.tar.gz
```

## 安装

首先解压安装包，解压路径设置为 /usr/local

```shell
sudo tar -C /usr/local -xzf go1.15.7.linux-amd64.tar.gz
```

设置环境变量

```shell
vi /etc/profile
```

在里面添加如下的内容（其中GOROOT为安装包解压路径；GOPATH为go项目所在的工作目录）：

```shell
export GOROOT=/usr/local/go
export PATH=$PATH:$GOROOT/bin
export GOPATH=$HOME/goproject
```

注销当前用户然后重启登陆

```shell
exit
```

输入如下命令查看所安装的 Go 的版本：

```shell
go version
```

终端显示如下内容证明安装成功：

```shell
go version go1.15.7 linux/amd64
```

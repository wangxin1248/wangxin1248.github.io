---
layout: post
title:  "Linux Mac Golang 安装及配置"
date:  2021-01-22
desc: "Centos8以及 Mac OS 安装并配置 Go 语言"
keywords: "Centos,Go,Linux, Mac"
categories: [Linux]
tags: [Centos]
---

# Linux Mac Golang 安装及配置

## 安装

### Linux

- 安装系统：CentOS 8
- Go版本：1.15.7
- 用户身份：root

下载安装包

```shell
wget https://golang.org/dl/go1.15.7.linux-amd64.tar.gz
```

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

### Mac

下载 go 安装程序：[下载地址](https://golang.google.cn/dl/)

下载完按照要求进行安装即可。

## 开发配置

- 开发工具：VSCode

当使用 VSCode 进行 Go 项目开发的时候可能需要代码自动补全和自动导入包，这就需要进行一些相关的开发配置。

首先下载 VSCode 应用程序，然后安装 Go 插件。

安装完成之后使用 `command+shift+p` 打开命令窗口，然后输入：

```shell
go:install/update tools
```

然后显示的都是一些需要在开发 Go 项目过程中需要用到的相关插件，将所有的插件都选择上然后进行安装，安装路径在之前设置的 GOPATH 路径下的 bin 文件夹中。

这里可能会出现安装失败的情况，这是因为国内网络环境的因素。

可以使用国内的代理环境：[Goproxy 中国](https://goproxy.cn/)

在终端中输入：

```shell
$ go env -w GO111MODULE=on
$ go env -w GOPROXY=https://goproxy.cn,direct
```

然后在重新进行插件安装即可。
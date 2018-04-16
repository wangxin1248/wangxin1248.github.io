---
layout: page
title:  "macOS中安装python3"
date:  2018-04-13
desc: "本文主要介绍如何在macOS中通过Homebrew安装python3"
keywords: "macOS,python,安装,Homebrew"
categories: [Life]
tags: [macOS,python]
---
# macOS中安装python3
在最新的macOS系统中已经默认安装了python2，但目前python3处于主流地位，许多新的项目已经使用python3进行开发了。于是便得需要在macOS中安装python3.

在macOS中安装python3得需要通过Homebrew来进行安装。
## Homebrew
Homebrew是Mac OSX上的软件包管理工具，能在Mac中方便的安装软件或者卸载软件，相当于linux下的apt-get、yum神器

Homebrew可以在Mac上安装一些OS X没有的UNIX工具，Homebrew将这些工具统统安装到了 /usr/local/Cellar 目录中，并在 /usr/local/bin 中创建符号链接。
Homebrew官网：[https://brew.sh/](https://brew.sh/)
### Homebrew安装
在macOS的终端中输入如下的命令来安装Homebrew
```
 /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
安装万完之后查看安装的版本
```
 brew --version
```
正确显示版本号便是安装成功

## 通过Homebrew来安装python3
安装好Homebrew之后便可以来安装python3了，使用如下的命令来进行安装：
```
 brew install python3
```
安装完成之后输入如下的命令查看安装的版本号
```
 python3 --version
```
正确显示版本号即为安装成功。
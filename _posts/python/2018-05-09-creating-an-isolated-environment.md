---
layout: post
title:  "创建一个独立的python项目运行环境"
date:  2018-05-09
desc: "开始创建python项目之前，首先需要创建一个独立的项目运行环境，这样有助于管理不同项目之间可能发生冲突的库版本"
keywords: "python,运行环境,创建项目"
categories: [python]
tags: [python3,运行环境]
---

# 创建一个独立的机器学习项目运行环境

强烈推荐大家创建一个单独的机器学习工作环境，这样可以保证在多个工作项目之间不同的依赖库版本不会导致冲突。
创建一个独立的工作环境主要是通过 [virtualenv](https://virtualenv.pypa.io/en/stable/) 来实现的。


## 准备条件

在安装virtualenv之前需要安装[python3](http://getpython3.com)。
安装完成之后需要配置python3的环境变量

``` python3
export PATH=$PATH:/Users/用户名/Library/Python/3.6/bin
```

## 安装virtualenv

使用如下的命令来安装

``` python3
pip3 install --user --upgrade virtualenv
```

## 创建独立的开发环境

``` python3
cd 项目路径
virtualenv env
```

这样，一个独立的python开发环境就已经设置好了，这样遗憾想要进入独立的开发环境时只需要在终端中输入：

``` python3
cd 项目路径
source env/bin/activate
```

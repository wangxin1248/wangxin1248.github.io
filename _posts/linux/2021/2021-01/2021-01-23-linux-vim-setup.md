---
layout: post
title:  "Vim个性化设置"
date:  2021-01-23
desc: "Vim个性化设置"
keywords: "Vim,Linux"
categories: [Linux]
tags: [Vim]
---
# Vim个性化设置

在 Linux 系统中 Vim 的使用频率非常高，但是很多情况下默认的 Vim 设置并不方便使用。因此，需要进行一些个性化的设置。

本文只是针对当前用户进行个性化 Vim 配置，不会影响到全局的 Vim 设置。

想要对当前用户的 Vim 进行设置的话需要在当前用户的 home 目录下创建一个隐藏文件：`.vimrc`

```shell
vi ~/.vimrc
```

然后各种个性化设置都可以在该文件中进行配置，以下是我自己的一些配置，可供参考：

```shell
# 设置显示行号
set number

# 设置tab为4个空格
set ts=4
set expandtab
set autoindent
```

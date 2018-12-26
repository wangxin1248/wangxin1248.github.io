---
layout: post
title:  "Ubuntu git 仓库服务器搭建"
date:  2018-12-26
desc: "在 Ubuntu 18.04 服务器上搭建 git 版本控制仓库"
keywords: "Linux,Ubuntu,git,仓库服务器"
categories: [Linux]
tags: [Linux,Ubuntu]
---
# git 仓库服务器搭建与使用

## git 仓库服务器搭建

### 1.安装 git

首先在服务器上安装 git

```bash
sudo apt-get install git
```

### 2.创建 git 账户

接下来得创建一个专门用来进行 git 仓库版本控制的 Linux 用户，为了方便，这里建议切换到 root 用户 **（下面的所有操作都是在 root 账户下完成）**：

```bash
sudo -i
adduser git
```

接下来会要求输入密码等信息，直接按照提示输入即可。

### 3.创建登录证书

为了保证仓库的安全性，必须得要求登陆仓库时使用密钥登陆。首先执行下面的命令创建密钥的存放路径：

```bash
cd /home/git/
mkdir .ssh
chmod 755 .ssh
touch .ssh/authorized_keys
chmod 644 .ssh/authorized_keys  
```

接下来收集所有需要登录的用户的公钥，就是他们自己的 **id_rsa.pub** 文件，把所有公钥导入到**/home/git/.ssh/authorized_keys** 文件里，一行一个。

### 4.禁用 git 用户 shell 登陆

出于安全考虑，创建的 git 用户是不允许登陆 shell 的

```bash
vi /etc/passwd
```

找到 passwd 文件中的：

```
git:x:1003:1004:,,,:/home/git:/bin/bash
```

将其修改为：

```
git:x:1003:1004:,,,:/home/git:/usr/bin/git-shell
```

这样，git 用户可以正常通过 ssh 使用 git ，但无法登录 shell，因为我们为 git 用户指定的 git-shell 每次一登录就自动退出。

### 5.初始化 git 仓库

首先创建一个空的文件夹来做为 git 仓库的目录，这里选择在 /home 目录下创建，文件夹名根据实际项目来起，这里使用 gitproject：

```bash
cd /home
mkdir gitproject
```

为 gitproject 指定用户和用户组：

```bash
chown git:git gitproject
```

之后进入该文件夹下创建一个新的裸仓库：

```bash
cd gitproject

git init --bare gitproject.git
```

**--bare 是指定创建一个裸仓库，裸仓库表示在服务器不存储代码，只存储版本更改信息，因此在服务器看不到对应的项目代码，而且这里必须创建一个裸仓库，否则 push 项目到服务器的时候会报错**

新建了一个裸仓库之后还得将其对应的用户和用户组更改为 git：

```bash
chown -R git:git gitproject.git
```

### 6.克隆仓库

接下来就可以在客户端克隆服务器的项目了

```bash
git clone git:server-ip:/home/gitproject/gitproject.git
```

此时会提示克隆了一个空的项目

接下来就可以在客户端写入一些文件 commit 到 git 服务器上去了。

这里有关的 git 操作推荐去看：[git - 简明指南](http://rogerdudler.github.io/git-guide/index.zh.html)

## git 客户端设置

### 1.安装 git 应用

这里直接到 git 官网下载对应操作系统版本的软件安装就好：

- [下载 git OSX 版](https://git-scm.com/download/mac)

- [下载 git Windows 版](https://gitforwindows.org/)

- [下载 git Linux 版](https://git-scm.com/download/linux)

### 2.git 账户配置

首先设置 git 的 user name 和 email：

```bash
git config --global user.name "username"
git config --global user.email "email@qq.com"
```

接下来生成对应的密钥：

```bash
ssh-keygen -t rsa -C "email@qq.com"
```

### 3.密钥使用

创建好密钥之后可以将公钥保存到 git 服务器的 authorized_keys 中使其可以访问 git 服务器，或者填写到 github 上，来向 github 上传项目。

密钥的位置：

- Linux/Mac：～/.ssh/id_rsa.pub
- windows：C:/User/Administrator/.ssh/id_rsa.pub（在安装git时指定）
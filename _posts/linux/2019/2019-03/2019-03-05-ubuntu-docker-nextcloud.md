---
layout: post
title:  "Ubuntu 搭建基于 Docker 的私人网盘"
date:  2019-03-05
desc: "在 Ubuntu 上搭建基于 Docker 的 NextCloud 私人网盘，通过内网穿透来实现在外网进行访问"
keywords: "Linux,Ubuntu,Docker,NextCloud,私人网盘,ngrok"
categories: [Linux]
tags: [Linux,Docker]
---
# Ubuntu 搭建基于 Docker 的私人网盘

本教程是基于在本地运行 Ubuntu 系统的主机上进行搭建，并利用 ngrok 实现内网穿透。搭建 NextCloud 需要用到 mysql 数据库，因此需要提前进行安装。

- Ubuntu系统版本：18.04（最低版本要求16.04）
- mysql版本：5.7

## 一、Docker 配置

### 安装 Docker

首先在 Ubuntu 上安装 Docker

```shell
sudo apt update
sudo apt install docker.io
```

接下来启动 Docker 并将其设置为开机自启：

```shell
sudo systemctl start docker
sudo systemctl enable docker
```

### 创建 Docker 用户

创建一个名为 docker_user 的用户：

```shell
sudo useradd -m -s /bin/bash docker_user
```

设置该账号的密码：

```shell
sudo passwd docker_user
```

将新建的用户加入到 docker 组中：

```shell
sudo usermod -aG docker docker_user
```

切换到新建的 docker_user，接下来的操作在该用户下进行：

```shell
su - docker_user 
```

## 二、部署 NextCloud

### 安装 NextCloud

在 Docker hub 中来搜寻 NextCloud

```shell
docker search nextcloud
```

将该镜像拉取到本地：

```shell
docker pull nextcloud
```

启动 NextCloud 容器

```shell
docker run -d  --restart=always --name nextcloud -p 80:80 -v/root/nextcloud:/data docker.io/nextcloud
```

- -d：在后台运行
- --restart：指定容器停止后的重启策略为退出时总是重启
- -p：指定容器的暴露端口
- -v：指定容器挂载目录（此时注意网盘空间问题，挂载目录尽量大些，否则可能空间不足）

查看当前容器的运行状态：

```shell
docker ps -a
```

**记录下屏幕显示的 CONTAINER ID，后面将会使用**

### 创建 NextCloud 存储数据库

登陆到 mysql 数据库当中：

```shell
sudo mysql -uroot -p
```

创建一个名为 nextcloud 的数据库（该名称可以自定义）

```shell
create database nextcloud charset=utf8;
```

查看下数据库是否创建成功：

```shell
show databases;
```

创建成功后退出mysql：

```shell
exit
```

### 设置 NextCloud

在安装好 NextCloud 之后，在当前内网中的浏览器中输入 Ubuntu 主机 IP 来访问。

在网站首页中输入管理员的账号和密码，在下面数据库配置中选择 mysql，并配置相关的信息，数据库名称选择刚才创建的数据库。之后点击完成设置。

## 三、设置外网访问

既然搭建一个私有云盘，因此需要该网盘能够从外网进行访问。

### 配置 NextCloud

NextCloud 默认设置是不允许从外部 IP 进行访问的。首先得修改该设置。（下面的操作还是在 docker_user 用户登陆下进行）

进入容器内部：

```shell
docker exec -it CONTAINER ID /bin/bash
```

- CONTAINER ID：上文中所记录的

下载 vim 编辑器：

```shell
apt-get update
apt-get install vim -y
```

进入到 config 目录下：

```shell
cd config
```

修改 config 文件

```shell
vim config.php
```

将 array 中添加如下内容（0是已有的本机ip，只需要添加1）：

```shell
array (
    0 => '10.70.165.115',
    1 => '*',
),
```

重新载入配置文件

```shell
service apache2 reload
```

退出容器

```shell
exit
```
NextCloud 设置完成，现在已经支持从局域网其他主机浏览器中输入 ip 来进行访问该网盘。

### 设置内网穿透

内外穿透使用的是 [https://ngrok.com/](https://ngrok.com/)。访问不了可以看这里：[http://ngrok.ciqiuwl.cn/](http://ngrok.ciqiuwl.cn/)

ngrok 需要创建账号，这里使用的是免费的版本。

下载对应的安装程序到本地，解压之后按照网站的提示进行操作即可。

现在便可以随时随地去访问自己的私人云服务了。
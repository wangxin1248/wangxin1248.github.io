---
layout: post
title:  "Ubuntu 18.04 安装 ROS"
date:  2019-07-18
desc: "如何在 Ubuntu 18.04 系统中安装 ROS 机器人操作系统"
keywords: "Ubuntu,ros"
categories: [Linux]
tags: [Ubuntu]
---

# ROS 安装

首先得明确 ROS 安装的版本是和 Ubuntu 系统版本相对应的，因此本教程只适合在 Ubuntu 18.04 系统上使用。

## 1.设置源

```shell
$ sudo sh -c ' echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
```

## 2.设置密钥

```shell
$ sudo apt-key adv --keyserver hkp://ha.pool.sks-keyservers.net:80 --recv-key 421C365BD9FF1F717815A3895523BAEEB01FA116
```

## 3.更新软件源

```shell
$ sudo apt-get update
```

此时可能会遇到下面的错误：

```shell
Get:6 http://packages.ros.org/ros/ubuntu bionic InRelease [4,669 B]      
Err:6 http://packages.ros.org/ros/ubuntu bionic InRelease        
The following signatures couldn't be verified because the public key is not available: NO_PUBKEY F42ED6FBAB17C654
```

解决办法如下：

```shell
$ sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-key F42ED6FBAB17C654
```

注意，上面的key是和你报错的 key 是一致的。

## 4.安装 ROS

```shell
$ sudo apt-get install ros-melodic-desktop-full
```

## 5.ROS配置

```shell
$ sudo rosdep init
$ rosdep update
$ echo "source /opt/ros/melodic/setup.bash" >> ~/.bashrc
$ source ~/.bashrc
```

## 6.检验是否安装成功

```shell
$ roscore 
```

正常输出便安装成功
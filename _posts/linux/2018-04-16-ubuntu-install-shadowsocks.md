---
layout: page
title:  "Ubuntu16.04服务器安装shadowsocks"
date:  2018-04-16
desc: "搬瓦工vps ubuntu16.04系统下安装shadowsocks并配置相关属性"
keywords: "Linux,shadowsocks,ubuntu16.04,搬瓦工vps"
categories: [linux]
tags: [Linux,shadowsocks]
---
# UBUNTU 16.04服务器上搭建SHADOWSOCKS服务
最近购买了搬瓦工的vps，想着搭个梯子用来在国外看些最新技术资料，现将搭建过程分享给大家。
本教程仅供教育和科学使用，勿进行其他用途。

## shadowsocks 服务器安装

首先更新软件源
```
sudo apt-get update
```

然后安装 PIP 环境
```
sudo apt-get install python-pip
```

接下来直接安装shadowsocks
```
sudo pip install shadowsocks
```

## 运行 shadowsocks 服务器

### 创建shadowsocks配置文件

使用如下命令创建并打开配置文件
```
sudo vi /etc/shadowsocks.json
```

在打开的界面里，输入i进入编辑模式，输入如下内容：
```
{
“server”:“server_ip”,
“server_port”:443,
“local_address”: “127.0.0.1”,
“local_port”:1080,
“password”:“password”,
“timeout”:300,
“method”:“rc4-md5”
}
```

编辑完成后按esc并输入：x 退出编辑
其中各个字段的含义如下：

- server	服务器 IP (IPv4/IPv6)，注意这也将是服务端监听的 IP 地址
- server_port	服务器端口
- local_port	本地端端口
- password	用来加密的密码
- timeout	超时时间（秒）
- method	加密方法，可选择 “bf-cfb”, “aes-256-cfb”, “des-cfb”, “rc4″, 等等。


加密方式推荐使用rc4-md5，因为 RC4 比 AES 速度快好几倍，如果用在路由器上会带来显著性能提升。旧的 RC4 加密之所以不安全是因为 Shadowsocks 在每个连接上重复使用 key，没有使用 IV。现在已经重新正确实现，可以放心使用。更多可以看 issue。

如果需要配置多个用户，可以按照下面的配置修改配置文件
```
{
“server”:“server_ip”,
“port_password”: {
“端口1”: “密码1”,
“端口2”: “密码2”
},
“timeout”:300,
“method”:“rc4-md5”,
“fast_open”: false
}
```

创建完成后，给文件相应的权限
```
sudo chmod 755 /etc/shadowsocks.json
```

安装所需的软件
```
sudo apt–get install python–m2crypto
```

设置配置文件在后台运行
```
sudo ssserver -c /etc/shadowsocks.json -d start
```

### 配置shadowsocks开机自启动
编辑 /etc/rc.local 文件
```
sudo vi /etc/rc.local
```

在 exit 0 这一行的上边加入如下
```
/usr/local/bin/ssserver –c /etc/shadowsocks.json
```

到此配置完成。重启服务器后，ss会自动启动。

## 安装和配置shadowsocks客户端
- Android版下载地址：[点击下载](https://github.com/shadowsocks/shadowsocks-android/releases/download/v4.5.6/shadowsocks--universal-4.5.6.apk)
- ios版下载地址：[点击下载](https://www.25pp.com/ios/detail_1923429/)
- Windows版下载地址：[点击下载](https://github.com/shadowsocks/shadowsocks-windows/releases/download/4.0.9/Shadowsocks-4.0.9.zip)
- macOS版下载地址：[点击下载](https://github.com/shadowsocks/ShadowsocksX-NG/releases/download/v1.7.1/ShadowsocksX-NG.1.7.1.zip)
- linux版下载地址：[点击查看](https://github.com/shadowsocks/shadowsocks-qt5/wiki/Installation)

将上面配置文件中的ip地址、端口号、密码、加密方式填写到客户端点击连接即可。
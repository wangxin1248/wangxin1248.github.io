---
layout: post
title:  "Ubuntu 16.04 安装 WireGuard"
date:  2019-09-03
desc: "Ubuntu 16.04 服务器中安装 WireGuard 并进行配置"
keywords: "Ubuntu,WireGuard,服务器,安装"
categories: [Linux]
tags: [Ubuntu]
---
# WireGuard

WireGuard 是 Jason A. Donenfeld 开发的开源 VPN 协议。目前支持 Linux, macOS, Android以及OpenWrt。被视为是下一代 VPN 协议。

![1](/assets/images/2019/2019-09/1.png)

## WireGuard 安装

首先切换到 root 用户：

```shell
sudo su
```

依次执行如下的命令来进行安装

```shell
add-apt-repository ppa:wireguard/wireguard
apt-get update
apt-get install wireguard-dkms wireguard-tools resolvconf -y
```

安装完成之后得先开启服务器的 ipv4 流量转发

```shell
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p
```

接下来创建 WireGuard 文件夹并设置权限

```shell
mkdir -p /etc/wireguard && chmod 0777 /etc/wireguard
cd /etc/wireguard
umask 077
```

接下来生成服务器和客户端的密钥对

```shell
wg genkey | tee server_privatekey | wg pubkey > server_publickey
wg genkey | tee client_privatekey | wg pubkey > client_publickey
```

## 服务端配置文件设置

首先查看自己的主网卡名称

```shell
ifconfig
```

![2](/assets/images/2019/2019-09/2.png)

记住当前主网卡的名称，接下来会用到

生成服务器配置文件

- 以下内容一次性粘贴执行，不要分行执行
- 重要：如果名字不是 enp0s5, 请将 enp0s5 替换成自己服务器显示的名字
- ListenPort为端口号，可以自己设置想使用的数字

```shell
echo "
  [Interface]
    PrivateKey = $(cat server_privatekey)
    Address = 10.0.0.1/24
    PostUp   = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o enp0s5 -j MASQUERADE
    PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o enp0s5 -j MASQUERADE
    ListenPort = 50814
    DNS = 8.8.8.8
    MTU = 1420

  [Peer]
    PublicKey = $(cat client_publickey)
    AllowedIPs = 10.0.0.2/32 " > wg0.conf
```

设置开机自启

```shell
systemctl enable wg-quick@wg0
```

## 客户端配置文件设置

生成客户端 client 配置文件

- Endpoint是自己服务器ip和服务端配置文件中设置的端口号
- 以下内容一次性粘贴执行，不要分行执行

```shell
echo "
[Interface]
  PrivateKey = $(cat client_privatekey)
  Address = 10.0.0.2/24
  DNS = 8.8.8.8
  MTU = 1420

[Peer]
  PublicKey = $(cat server_publickey)
  Endpoint = 1.2.3.4:50814
  AllowedIPs = 0.0.0.0/0, ::0/0
  PersistentKeepalive = 25 " > client.conf
```

## 多客户端配置文件生成

一个客户端文件只能同时有一个设备连接，所以如果需要同时使用的话，可以建立多个客户端文件。

再添加一个客户端 client0 的操作方法

首先生成新的密钥对

```shell
wg genkey | tee client0_privatekey | wg pubkey > client0_publickey
```

在服务端配置文件中加入新的客户端公钥

- AllowedIPs重新定义一个
- 一次性复制粘贴，不要分行执行

```shell
echo "
[Peer]
  PublicKey = $(cat client0_publickey)
  AllowedIPs = 10.0.0.3/32" >> wg0.conf
```

新建一个客户端文件，使用新客户端密钥的私钥

- Address 与上面的 AllowedIPs 保持一致
- Endpoint 和之前的一样，为服务器 ip 和设置好的 ListenPort
- 一次性复制粘贴，不要分行执行

```shell
echo "
[Interface]
  PrivateKey = $(cat client0_privatekey)
  Address = 10.0.0.3/24
  DNS = 8.8.8.8
  MTU = 1420

[Peer]
  PublicKey = $(cat server_publickey)
  Endpoint = 1.2.3.4:50814
  AllowedIPs = 0.0.0.0/0, ::0/0
  PersistentKeepalive = 25 " > client0.conf
```

## 启动 WireGuard

配置文件生成好之后便可以启动 WireGuard 了

```shell
wg-quick up wg0
```

查看运行状态

```shell
wg
```

停止 WireGuard 命令

```shell
wg-quick down wg0
```

## 导出服务端配置文件

方法一：使用 将客户端配置文件显示为二维码打印在终端上

```shell
apt install qrencode -y
# 选择一个客户端配置文件进行输出
qrencode -t ansiutf8 < /etc/wireguard/client.conf
```

方法二：手动在本地创建一个配置文件

```shell
# 选择一个客户端配置文件进行输出
cat /etc/wireguard/client.conf
```

然后在本地编辑一个 .conf 的文件，将上面输出的文件粘贴进去。
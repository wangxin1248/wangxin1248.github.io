---
layout: post
title:  "Centos7 拨号上网"
date:  2020-06-05
desc: "Centos7 使用 pppoe 实现拨号上网功能"
keywords: "Centos,pppoe,服务器,安装,Linux"
categories: [Linux]
tags: [Centos]
---
# Centos7 拨号上网

## pppoe 安装

为了使用拨号上网功能，需要首先安装 pppoe 拨号软件，这里使用 **rp-pppoe**

首先安装 rp-pppoe

```shell
yum install rp-pppoe -y
```

然后开始配置拨号上网账号信息

## pppoe 配置

配置 pppoe 之前首先得需要查看当前的网卡信息：

```shell
ifconfig
```

记录下对应的网卡代号，后续会有应用。我这里是 ens32

执行如下的命令开始进行 pppoe 设置：

```shell
pppoe-setup
```

按照提示输入对应的信息

```shell
Welcome to the PPPoE client setup.  First, I will run some checks on
your system to make sure the PPPoE client is installed properly...

LOGIN NAME

Enter your Login Name (default dsp): 12345      　　# 网络服务提供商提供的账户

INTERFACE
 
 Enter the Ethernet interface connected to the PPPoE modem
 For Solaris, this is likely to be something like /dev/hme0.
 For Linux, it will be ethX, where 'X' is a number.
 (default eth0): enp9s0                          　　# 选择以太网卡，有线网卡
 
 Do you want the link to come up on demand, or stay up continuously?
 If you want it to come up on demand, enter the idle time in seconds
 after which the link should be dropped.  If you want the link to
 stay up permanently, enter 'no' (two letters, lower-case.)
 NOTE: Demand-activated links do not interact well with dynamic IP
 addresses.  You may have some problems with demand-activated links.
 Enter the demand value (default no): no         　　# 输入no，否则若长时间连线，连线会被自动中断
 
 DNS
 
 Please enter the IP address of your ISP's primary DNS server.
 If your ISP claims that 'the server will provide dynamic DNS addresses',
 enter 'server' (all lower-case) here.
 If you just press enter, I will assume you know what you are
 doing and not modify your DNS setup.
 Enter the DNS information here: 8.8.8.8         　　# 主DNS服务器IP，本人使用Google Public DNS
 Please enter the IP address of your ISP's secondary DNS server.
 If you just press enter, I will assume there is only one DNS server.
 Enter the secondary DNS server address here: 8.8.4.4      　　# 二级DNS服务器IP
 
 PASSWORD　　　　　　　　　　　　　　　　　　　　　　　　　# 账户对应的密码，需两次输入以确认无误
 
 Please enter your Password: 
 Please re-enter your Password: 
 
 USERCTRL
 
 Please enter 'yes' (three letters, lower-case.) if you want to allow
 normal user to start or stop DSL connection (default yes): yes  # 普通用户是否可以启动停止网络连接
 
 FIREWALLING
 
 Please choose the firewall rules to use.  Note that these rules are
 very basic.  You are strongly encouraged to use a more sophisticated
 firewall setup; however, these will provide basic security.  If you
 are running any servers on your machine, you must choose 'NONE' and
 set up firewalling yourself.  Otherwise, the firewall rules will deny
 access to all standard servers like Web, e-mail, ftp, etc.  If you
 are using SSH, the rules will block outgoing SSH connections which
 allocate a privileged source port.
 
 The firewall choices are:
 0 - NONE: This script will not set any firewall rules.  You are responsible
           for ensuring the security of your machine.  You are STRONGLY
           recommended to use some kind of firewall rules.
 1 - STANDALONE: Appropriate for a basic stand-alone web-surfing workstation
 2 - MASQUERADE: Appropriate for a machine acting as an Internet gateway
                 for a LAN
 Choose a type of firewall (0-2): 0　　　　　　　　　　　　　　　# 选 0 吧
 
 Start this connection at boot time
 
 Do you want to start this connection at boot time?
 Please enter no or yes (default no):yes　　　　　　　　　　　　# 是否系统启动是就连接网络
 
 ** Summary of what you entered **　　　　　　　　　　　　　　　
 
 Ethernet Interface: ens32
 User name:          12345
 Activate-on-demand: No
 Primary DNS:        8.8.8.8
 Secondary DNS:      8.8.4.4
 Firewalling:        NONE
 User Control:       yes
 Accept these settings and adjust configuration files (y/n)? y　　　　# 确认刚才输入的网络配置信息
 Adjusting /etc/sysconfig/network-scripts/ifcfg-ppp0
 Adjusting /etc/resolv.conf
   (But first backing it up to /etc/resolv.conf.bak)
 Adjusting /etc/ppp/chap-secrets and /etc/ppp/pap-secrets
   (But first backing it up to /etc/ppp/chap-secrets.bak)
   (But first backing it up to /etc/ppp/pap-secrets.bak)
 
 
 Congratulations, it should be all set up!
 
 Type '/sbin/ifup ppp0' to bring up your xDSL link and '/sbin/ifdown ppp0'　# rp-pppoe的操作命令
 to bring it down.
 Type '/sbin/pppoe-status /etc/sysconfig/network-scripts/ifcfg-ppp0'
 to see the link status.
 
 [root@node1]# /sbin/ifup ppp0　　　　　　# 启动网络连接
 [root@node1]# /sbin/pppoe-status　　　　# 查看网络连接状态
```

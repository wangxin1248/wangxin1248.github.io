---
layout: post
title:  "Ubuntu18.04 开机黑屏只显示鼠标"
date:  2018-11-15
desc: "新给实验室的电脑上装上了 Ubuntu 18.04 的桌面版，没想到安装好之后开机直接黑屏，只显示鼠标，在折腾了好一阵之后终于解决了这个问题"
keywords: "Linux,Ubuntu,黑屏,只显示鼠标"
categories: [Linux]
tags: [Linux,Ubuntu]
---
# Ubuntu 18.04 开机黑屏只显示鼠标

在给实验室的电脑装上双系统之后迫不及待的开机，结果发现屏幕闪出 Ubuntu 的logo 之后便直接黑屏了，除了能看见鼠标，其余的都是黑的。结果好生给我一顿折腾之后终于发现是你 gdm3 的问题，但是卸载重装都没有解决这个问题，最后终于在网上找到了解决方法：

## 解决方法

在开机状态下下按住 ctrl+alt+f2 进入命令行模式，输入用户名和密码进行登陆，登陆到系统之后输入：

```bash
sudo apt update
sudo apt install lightdm
```

之后会弹出一个选择界面，让你选择是 gdm3 还是 lightdm，这里选择 lightdm ，然后等待程序运行结束，之后输入：

```bash
reboot
```

重启系统，再次进入系统便可以正常的显示桌面了。
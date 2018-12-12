---
layout: post
title:  "Ubuntu 服务器安装shadowsocks"
date:  2018-04-16
desc: "ubuntu 服务器系统下安装shadowsocks并配置相关属性"
keywords: "Linux,shadowsocks,ubuntu,vps,gcp,谷歌云"
categories: [Linux]
tags: [Linux,shadowsocks]
---
# shadowsocks 服务器安装以及常见的错误处理

**本教程仅供教育和科学使用，勿进行其他用途。**

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
"server":"server_ip",
"server_port":443,
"local_address": "127.0.0.1",
"local_port":1080,
"password":"password",
"timeout":300,
"method":"rc4-md5"
}
```

编辑完成后按esc并输入：x 退出编辑
其中各个字段的含义如下：
> - server	服务器 IP (IPv4/IPv6)，注意这也将是服务端监听的 IP 地址
> - server_port	服务器端口
> - local_port	本地端端口
> - password	用来加密的密码
> - timeout	超时时间（秒）
> - method	加密方法，可选择 “bf-cfb”, “aes-256-cfb”, “des-cfb”, “rc4″, 等等。


加密方式推荐使用rc4-md5，因为 RC4 比 AES 速度快好几倍，如果用在路由器上会带来显著性能提升。旧的 RC4 加密之所以不安全是因为 Shadowsocks 在每个连接上重复使用 key，没有使用 IV。现在已经重新正确实现，可以放心使用。更多可以看 issue。

如果需要配置多个用户，可以按照下面的配置修改配置文件:

```
{
"server":"server_ip",
"port_password": {
"端口1": "密码1",
"端口2": "密码2"
},
"timeout":300,
"method":"rc4-md5",
"fast_open": false
}
```

创建完成后，给文件相应的权限

```
sudo chmod 755 /etc/shadowsocks.json
```

安装所需的软件

```
sudo apt-get install python-m2crypto
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

## 常见错误处理

### 1.AttributeError: /usr/lib/x86_64-Linux-gnu/libcrypto.so.1.1: undefined symbol: EVP_CIPHER_CTX_cleanup

最近在 Ubuntu 18.04 LTS 版本上安装编译 shadowsocks 之后无法启动，报错如下：

```
NFO: loading config from ss.json 
2018-12-11 22:47:50 INFO loading libcrypto from libcrypto.so.1.1 
Traceback (most recent call last): 
File “/usr/local/bin/sslocal”, line 11, in 
sys.exit(main()) 
File “/usr/local/lib/python2.7/dist-packages/shadowsocks/local.py”, line 39, in main 
config = shell.get_config(True) 
File “/usr/local/lib/python2.7/dist-packages/shadowsocks/shell.py”, line 262, in get_config 
check_config(config, is_local) 
File “/usr/local/lib/python2.7/dist-packages/shadowsocks/shell.py”, line 124, in check_config 
encrypt.try_cipher(config[‘password’], config[‘method’]) 
File “/usr/local/lib/python2.7/dist-packages/shadowsocks/encrypt.py”, line 44, in try_cipher 
Encryptor(key, method) 
File “/usr/local/lib/python2.7/dist-packages/shadowsocks/encrypt.py”, line 83, in init 
random_string(self._method_info[1])) 
File “/usr/local/lib/python2.7/dist-packages/shadowsocks/encrypt.py”, line 109, in get_cipher 
return m[2](method, key, iv, op) 
File “/usr/local/lib/python2.7/dist-packages/shadowsocks/crypto/openssl.py”, line 76, in init 
load_openssl() 
File “/usr/local/lib/python2.7/dist-packages/shadowsocks/crypto/openssl.py”, line 52, in load_openssl 
libcrypto.EVP_CIPHER_CTX_cleanup.argtypes = (c_void_p,) 
File “/usr/lib/python2.7/ctypes/init.py”, line 375, in getattr 
func = self.getitem(name) 
File “/usr/lib/python2.7/ctypes/init.py”, line 380, in getitem 
func = self._FuncPtr((name_or_ordinal, self)) 
AttributeError: /usr/lib/x86_64-Linux-gnu/libcrypto.so.1.1: undefined symbol: EVP_CIPHER_CTX_cleanup
```

这个问题是由于在 openssl1.1. 0版本中，废弃了 EVP_CIPHER_CTX_cleanup 函数，如官网中所说：

```
EVP_CIPHER_CTX was made opaque in OpenSSL 1.1.0. As a result, EVP_CIPHER_CTX_reset() appeared and EVP_CIPHER_CTX_cleanup() disappeared. 
EVP_CIPHER_CTX_init() remains as an alias for EVP_CIPHER_CTX_reset().
```

处理方法：

1. 用vim打开文件(该路径请根据自己的系统情况自行修改，如果不知道该文件在哪里的话，可以使用find命令查找文件位置):

```
vim /usr/local/lib/python2.7/dist-packages/shadowsocks/crypto/openssl.py
```

2. 跳转到52行（ shadowsocks2.8.2版本，其他版本搜索一下 cleanup）
3. 进入编辑模式
4. 将第52行 libcrypto.EVP_CIPHER_CTX_cleanup.argtypes = (c_void_p,) 改为libcrypto.EVP_CIPHER_CTX_reset.argtypes = (c_void_p,)
5. 再次搜索cleanup（全文件共2处，此处位于111行），将libcrypto.EVP_CIPHER_CTX_cleanup(self._ctx) 改为libcrypto.EVP_CIPHER_CTX_reset(self._ctx)
6. 保存并退出
7. 启动shadowsocks服务：

```
sudo ssserver -c /etc/shadowsocks.json -d start
```

问题解决

### 2.谷歌服务器启动之后无连接

这是因为在 shadowsocks.json 配置文件中将 server 配置成了公网ip，需要将这里配置为 **内部ip**即可。
---
layout: post
title:  "MAC 安装 Maven"
date:  2020-02-29
desc: "MAC 安装 Maven 步骤介绍"
keywords: "MAC,Maven"
categories: [Life]
tags: [MAC]
---
# MAC 安装 Maven

## 下载 Maven

首先从 Maven 官方地址：[http://maven.apache.org/download.cgi](http://maven.apache.org/download.cgi) 下载最新版本apache-maven-xxx-bin.tar.gz

加下来将下载的文件解压到 /usr/local/maven 下。

## 配置环境变量

```shell
$ vi ~/.bash_profile
```

添加如下的 maven 配置：

```shell
export M3_HOME=/usr/local/maven/apache-maven-3.6.3
export PATH=$M3_HOME/bin:$PATH
```

执行如下命令使配置的环境变量生效：

```shell
$ source ~/.bash_profile
```

## 测试 Maven 是否安装成功

可以先输出 Maven 环境地址

```shell
$ echo $M3_HOME
$ echo $PATH
```

如果输出类似这样的值则表明配置没问题。

```s
/usr/local/maven/apache-maven-3.6.3
/usr/local/maven/apache-maven-3.6.3/bin:/Users/wx/library/flutter/bin:/usr/local/opt/coreutils/libexec/gnubin:/Users/wx/library/flutter/bin:/usr/local/opt/coreutils/libexec/gnubin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/VMware Fusion.app/Contents/Public:/Library/TeX/texbin:/Library/Frameworks/Mono.framework/Versions/Current/Commands
```

接下来用maven 的命令查看 maven 版本，鉴定Maven 环境是否安装成功。

```shell
$ mvn -version
```

成功时，输出的日志如下：

```s
Apache Maven 3.6.3 (cecedd343002696d0abb50b32b541b8a6ba2883f)
Maven home: /usr/local/maven/apache-maven-3.6.3
Java version: 1.8.0_172, vendor: Oracle Corporation, runtime: /Library/Java/JavaVirtualMachines/jdk1.8.0_172.jdk/Contents/Home/jre
Default locale: zh_CN, platform encoding: UTF-8
OS name: "mac os x", version: "10.15.3", arch: "x86_64", family: "mac"
```

这样，Mac 下 Maven 的环境就配置成功。
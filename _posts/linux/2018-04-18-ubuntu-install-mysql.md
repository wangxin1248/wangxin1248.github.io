---
layout: post
title:  "Ubuntu16.04服务器安装mysql数据库并配置远程连接"
date:  2018-04-18
desc: "在搬瓦工的ubuntu16.04 vps 中安装MySQL数据库，并且设置远程连接，使用navicat进行控制"
keywords: "Linux,ubuntu16.04,搬瓦工vps,服务器,mysql,数据库"
categories: [linux]
tags: [Linux,Ubuntu,mysql]
---
# 在搬瓦工的ubuntu16.04 vps 中安装MySQL数据库并配置远程连接

## 安装mysql

安装之前首先需要更新系统的软件源
```
sudo apt-get update
```

更新完之后便可以安装mysql服务器和客户端了
```
sudo apt-get install mysql-server mysql-client libmysqlclient-dev
```

在安装过程中会提示是否确认安装
![mysql-install-1](/assets/images/2018-04/mysql-install-1.png)

属于y确认安装

接下来会提示输入相关的root密码
![mysql-install-2](/assets/images/2018-04/mysql-install-2.png)
![mysql-install-3](/assets/images/2018-04/mysql-install-3.png)

以上3个软件包安装完成后，使用如下命令查询是否安装成功：
```
sudo netstat -tap | grep mysql
```
查询结果如下图所示，表示安装成功。
![mysql-install-5](/assets/images/2018-04/mysql-install-5.png)

安装完成之后便可以进行登录mysql数据库
![mysql-install-4](/assets/images/2018-04/mysql-install-4.png)

### mysqld服务操作命令

启动mysqld服务: sudo /etc/init.d/mysql start
停止mysqld服务: sudo /etc/init.d/mysql stop
启动mysqld服务: sudo /etc/init.d/mysql restart

## 配置mysql远程连接

编辑mysql配置文件，把其中bind-address = 127.0.0.1注释了
```
sudo vi /etc/mysql/mysql.conf.d/mysqld.cnf 
```

使用root进入mysql命令行，执行如下2个命令
```
grant all on *.* to root@'%' identified by 'root用户密码' with grant option;
flush privileges;
```

重启mysql
```
/etc/init.d/mysql restart
```
重启成功后，便可以支持从其他计算机进行远程登录。
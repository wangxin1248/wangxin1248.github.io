---
layout: post
title:  "Python3 Django（十一）项目部署"
date:  2019-12-03
desc: "python3 服务器开发系列之 Django 开发实战（十一）：Django 项目部署介绍"
keywords: "Python3,后台开发,实战,django,MVC,ORM"
categories: [Python]
tags: [python3,后台开发,django]
---
# 项目部署

当一个项目开发完毕之后就需要将其部署到指定的生产环境上，也就是不是简单的在自己本地运行项目而是在指定的服务器上运行。这里以 linux 系统的服务器为例来演示如何完整的部署 Django 项目。

这里使用的生产环境部署架构为**nginx+uwsgi**，关于这两个软件的相关知识可以自行查阅。

软件版本信息：

- Django：2.2.6
- nginx：1.14.0
- uwsgi：2.0.18

## 一、项目准备工作

### 1.本地项目处理

在进行项目部署之前首先得把项目所需要的包进行记录，在项目的根路径下使用如下的命令来记录项目的用到的包：

```shell
$ pip freeze > plist.txt
```

### 2.上传项目代码

将项目代码打包压缩之后使用 sftp 上传到服务器的指定路径中。

打包压缩命令：

```shell
tar -czvf code/ code.tar.gz
```

sftp使用：

```shell
$ dftp user@server_ip
$ cd 指定路径
$ put code.tar.gz
```

接下来需要在服务器中进行操作

### 3.服务器项目配置

首先将上传的代码解压缩

```shell
$ tar -xzvf code.tar.gz
```

在服务器项目路径中创建一个虚拟的运行环境（有时一台服务器上有可能会运行多个 web 项目，而每一个项目所需要的包的版本并不同，因此需要针对每一个 python 项目创建一个单独的运行环境。）

```shell
$ python3 -m virtualenv env
```

进入该虚拟环境

```shell
source env/bin/activate
```

进行项目路径

```shell
$ cd code
```

安装项目所需的包

```shell
pip install -r plist.txt
```

接下来还得修改项目的 settings.py 文件设置为生产模式，更改如下的内容

```py
# 关闭调试模式
DEBUG = False
# 表示可以访问服务器的ip
ALLOW_HOSTS=['*',]
# 静态文件路径
STATIC_ROOT='/var/www/code/static/'
# 静态文件链接
STATIC_URL='/static/'
```

静态文件路径是之后配置 nginx 之后对项目中静态文件访问的时候用的，对于配置中的静态文件路径需要自己创建，而且还得修改对应的权限，使其支持读写操作。

```shell
$ sudo chmod 777 /var/www/code

$ mkdir static
```

之后将项目中的静态文件拷贝到新建的静态文件路径下：

```shell
python manage.py collectstatic
```

## 二、uwsgi

### 1.安装 uwsgi

安装 uwsgi ，由于 uwsgi 是 python 中的一个包，因此安装在项目的虚拟环境中。

```shell
pip install uwsgi
```

### 2.uwsgi配置

在项目根目录下创建 uwsgi.ini 文件，编写如下配置：

```py
[uwsgi]
socket=外网ip:端口（使用nginx连接时，使用socket）
http=外网ip:端口（直接做web服务器，使用http）
chdir=项目根目录
wsgi-file=项目中wsgi.py文件的目录，相对于项目根目录
processes=4
threads=2
master=True
pidfile=uwsgi.pid
daemonize=uswgi.log
```

注意，socket 和 http 只能二选一使用，假如使用 nginx 的话必须使用 socket

### 3.uwsgi启动

- 启动：uwsgi --ini uwsgi.ini
- 停止：uwsgi --stop uwsgi.pid
- 重启：uwsgi --reload uwsgi.pid

可以启动 uwsgi 来查看下项目的运行情况，可以正常访问项目便证明配置正确。

接下来配置 nginx 

## 二、nginx

### 1.nginx安装

nginx 安装：

```shell
$ sudo apt install nginx
```

### 2.nginx配置

在安装好 nginx 之后还得需要对其进行相应的配置。

```shell
$ sudo vi /etc/nginx/sites-enabled/default
```

在文件中的 server 下添加新的 location 项，指向 uwsgi 的 ip 与端口

```shell
upstream django {
        server #web的socket端口; 
}
server {
    # 在location下添加
    location / {
        # 添加如下的内容
        root #项目目录; 
        uwsgi_pass django;
        include #uwsgi_params文件的地址; 
    }
    # 在location下添加
    location /static {
        alias #网站的静态文件地址;
    }
}
```

uwsgi_params 文件需要自己新建，内容如下：

```shell
uwsgi_param  QUERY_STRING       $query_string;
uwsgi_param  REQUEST_METHOD     $request_method;
uwsgi_param  CONTENT_TYPE       $content_type;
uwsgi_param  CONTENT_LENGTH     $content_length;

uwsgi_param  REQUEST_URI        $request_uri;
uwsgi_param  PATH_INFO          $document_uri;
uwsgi_param  DOCUMENT_ROOT      $document_root;
uwsgi_param  SERVER_PROTOCOL    $server_protocol;
uwsgi_param  REQUEST_SCHEME     $scheme;
uwsgi_param  HTTPS              $https if_not_empty;

uwsgi_param  REMOTE_ADDR        $remote_addr;
uwsgi_param  REMOTE_PORT        $remote_port;
uwsgi_param  SERVER_PORT        $server_port;
uwsgi_param  SERVER_NAME        $server_name;
```

### 3.nginx启动

- 启动 nginx

```shell
$ service nginx start
```

- 关闭 nginx

```shell
$ service nginx stop
```

- 重启 nginx

```shell
$ service nginx restart
```

接下来便可以通过 ip 不加端口直接访问网站了。
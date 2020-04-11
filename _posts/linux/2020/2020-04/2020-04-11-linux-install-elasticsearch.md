---
layout: post
title:  "Linux 安装 Elasticsearch"
date:  2020-04-11
desc: "Ubuntu 18.04 服务器中安装 Elasticsearch 并进行配置"
keywords: "Ubuntu,Elasticsearch,服务器,安装,Linux"
categories: [Linux]
tags: [Ubuntu]
---
# ElasticSearch

Elasticsearch 是一个基于[Lucene](https://baike.baidu.com/item/Lucene/6753302)的搜索服务器。它提供了一个分布式多用户能力的全文搜索引擎，基于RESTful web接口。Elasticsearch是用Java语言开发的，并作为Apache许可条款下的开放源码发布，是一种流行的企业级搜索引擎。Elasticsearch用于[云计算](https://baike.baidu.com/item/云计算/9969353)中，能够达到实时搜索，稳定，可靠，快速，安装使用方便。官方客户端在Java、.NET（C#）、PHP、Python、Apache Groovy、Ruby和许多其他语言中都是可用的。根据DB-Engines的排名显示，Elasticsearch是最受欢迎的企业搜索引擎，其次是Apache Solr，也是基于Lucene。

官方网址：[https://www.elastic.co/cn/products/elasticsearch](https://www.elastic.co/cn/products/elasticsearch)

Github：[https://github.com/elastic/elasticsearch](https://github.com/elastic/elasticsearch)

总结： 

- Elasticsearch 是一个基于 Lucene 的高扩展的分布式搜索服务器，支持开箱即用。 
- Elasticsearch 隐藏了 Lucene 的复杂性，对外提供Restful 接口来操作索引、搜索。

优点：

- 扩展性好，可部署上百台服务器集群，处理PB级数据。
- 近实时的去索引数据、搜索数据。

## 原理

下图是 Elasticsearch 的索引结构，下边黑色部分是物理结构，上边黄色部分是逻辑结构，逻辑结构也是为了更好的去描述 Elasticsearch 的工作原理及去使用物理结构中的索引文件。

![1](/assets/images/2020/2020-04/1.png)

逻辑结构部分是一个倒排索引表： 

- 将要搜索的文档内容分词，所有不重复的词组成分词列表。 
- 将搜索的文档最终以Document方式存储起来。 
- 每个词和docment都有关联。

所谓倒排索引表是正排索引表的相反操作，在正排索引表当中，索引查找的顺序在先找 document 文档，然后再从 document 文档中查找对应的 term 词；而倒排索引表刚好相反，索引先找 term 词，再根据 term 找对应的 document。因此倒排索引表需要专门保存 term 和 document 之间的对应关系的。

假如 index 索引中有如下的数据：

```s
Term      Doc_1  Doc_2
-------------------------
Quick   |       |  X
The     |   X   |
brown   |   X   |  X
dog     |   X   |
dogs    |       |  X
fox     |   X   |
foxes   |       |  X
in      |       |  X
jumped  |   X   |
lazy    |   X   |  X
leap    |       |  X
over    |   X   |  X
quick   |   X   |
summer  |       |  X
the     |   X   |
------------------------
```

当需要搜索 `quick brown` 的时候，只需要查找到包含这两个单词的文档：

```s
Term      Doc_1  Doc_2
-------------------------
brown   |   X   |  X
quick   |   X   |
------------------------
Total   |   2   |  1
```

两个文档都匹配，但是第一个文档比第二个匹配度更高。如果我们使用仅计算匹配词条数量的简单相似性算法，  那么，我们可以说，对于我们查询的相关性来讲，第一个文档比第二个文档更佳。

## 安装

ElasticSearch 官方的安装教程：[教程](https://www.elastic.co/cn/downloads/elasticsearch)。

这里记录 Linux 环境下的安装过程。Linux 发行版本为：Ubuntu-server 18.04

下载并安装公共签名密钥：

```shell
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
```

安装 apt-transport-https 软件包

```shell
sudo apt-get install apt-transport-https
```

保存存储库定义

```shell
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-7.x.list
```

安装 Elasticsearch

```shell
sudo apt-get update && sudo apt-get install elasticsearch
```

## 配置

Elasticsearch 启动时加载的配置文件位于：`/etc/elasticsearch`，该目录需要使用 root 用户进入。

Elasticsearch 总共有三个重要的配置文件：

- elasticsearch.yml：Elasticsearch 配置文件
- jvm.options： Elasticsearch JVM 配置
- log4j2.properties：Elasticsearch logging 配置

### elasticsearch.yml

配置格式是 YAML，可以采用如下两种方式： 

方式1：层次方式

```shell
path:
    data: /var/lib/elasticsearch
    logs: /var/log/elasticsearch
```

方式2：属性方式

```shell
path.data: /var/lib/elasticsearch
path.logs: /var/log/elasticsearch
```

常用的配置项如下： 

- cluster.name：配置elasticsearch的集群名称，默认是elasticsearch。建议修改成一个有意义的名称。 
- node.name：节点名，通常一台物理服务器就是一个节点，es 会默认随机指定一个名字，建议指定一个有意义的名称，方便管理。一个或多个节点组成一个cluster集群，集群是一个逻辑的概念，节点是物理概念。 
- path.conf：设置配置文件的存储路径，tar或zip包安装默认在es根目录下的conﬁg文件夹，rpm安装默认在/etc/elasticsearch 
- path.data：设置索引数据的存储路径，默认是es根目录下的data文件夹，可以设置多个存储路径， 用逗号隔开。 
- path.logs: 设置日志文件的存储路径，默认是es根目录下的logs文件夹 
- path.plugins: 设置插件的存放路径，默认是es根目录下的plugins文件夹 
- bootstrap.memory_lock：true 设置为true可以锁住ES使用的内存，避免内存与swap分区交换数据。 
- network.host：设置绑定主机的ip地址，设置为0.0.0.0表示绑定任何ip，允许外网访问，生产环境建议设置为具体的ip。 
- http.port：9200 设置对外服务的http端口，默认为9200。 
- transport.tcp.port：9300 集群结点之间通信端口 
- node.master：指定该节点是否有资格被选举成为master结点，默认是true，如果原来的master宕机会重新选举新的master。 
- node.data：指定该节点是否存储索引数据，默认为true。 
- discovery.zen.ping.unicast.hosts：["host1:port", "host2:port", "..."] 设置集群中master节点的初始列表。 
- discovery.zen.ping.timeout：3s 设置 ES 自动发现节点连接超时的时间，默认为3秒，如果网络延迟高可设置大些。 
- discovery.zen.minimum_master_nodes：主结点数量的最少值 ,此值的公式为：`(master_eligible_nodes / 2) + 1` ，比如：有3个符合要求的主结点，那么这里要设置为2。 
- node.max_local_storage_nodes：单机允许的最大存储结点数，通常单机启动一个结点建议设置为1，开发环境如果单机启动多个节点可设置大于1.

### jvm.options

设置最小及最大的JVM堆内存大小： 

在jvm.options中设置 -Xms和-Xmx： 

- 两个值设置为相等 
- 将 Xmx 设置为不超过物理内存的一半。

### log4j2.properties

日志文件设置，ES 使用log4j，注意日志级别的配置。

在 linux 上根据系统资源情况，可将每个进程最多允许打开的文件数设置大些。 

查询当前文件数

```shell
ulimit -n
```

使用 root 用户执行如下命令设置 limit：

```shell
sudo su 
ulimit -n 65536
```

也可通过下边的方式修改文件进行持久设置 

```shell
sudo vi /etc/security/limits.conf

# 将下边的行加入此文件：
elasticsearch - nofile 65536
```

## 启动

配置 Elasticsearch 为在系统启动时自动启动：

```shell
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable elasticsearch.service
```

Elasticsearch 可以按以下方式启动和停止：

```shell
sudo systemctl start elasticsearch.service
sudo systemctl stop elasticsearch.service
```

启动成功之后打开浏览器来访问 http://localhost:9200/ 来查看 Elasticsearch 是否安装成功：

![2](/assets/images/2020/2020-04/2.png)

## 插件

### head插件

head 插件是 ES 的一个可视化管理插件，用来监视 ES 的状态，并通过 head 客户端和 ES 服务进行交互，比如创建映射、创建索引等，head的项目地址在[https://github.com/mobz/elasticsearch-head](https://github.com/mobz/elasticsearch-head)

从ES6.0开始，head 插件支持使用 node.js 运行

```shell
git clone git://github.com/mobz/elasticsearch-head.git
cd elasticsearch-head
npm install
npm run start
```

然后打开 http://localhost:9100/ 来查看是否安装成功。

### 中文分词插件

使用IK分词器可以实现对中文分词的效果。 

IK分词器：（Github地址：[https://github.com/medcl/elasticsearch-analysis-ik](https://github.com/medcl/elasticsearch-analysis-ik)）

下载安装（注意这里的版本要和你安装的 Elasticsearch 版本一致：

```shell
sudo /usr/share/elasticsearch/bin/elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.6.2/elasticsearch-analysis-ik-7.6.2.zip
```
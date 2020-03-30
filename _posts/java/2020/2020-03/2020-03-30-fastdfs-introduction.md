---
layout: post
title:  "FastDFS 介绍"
date:  2020-03-30
desc: "FastDFS原理介绍与使用"
keywords: "Java,SpringBoot,FastDFS"
categories: [Java]
tags: [Java,FastDFS]
---
# FastDFS

FastDFS 是用 c 语言编写的一款开源的分布式文件系统，它是由淘宝资深架构师余庆编写并开源。FastDFS 专为互联网量身定制，充分考虑了冗余备份、负载均衡、线性扩容等机制，并注重高可用、高性能等指标，使用 FastDFS 很容易搭建一套高性能的文件服务器集群提供文件上传、下载等服务。

## FastDFS 工作原理

下图是 FastDFS 的基本结构：

![17](/assets/images/2020/2020-03/17.png)

FastDFS基于 C/S结构，基于服务端包括 Tracker server和Storage server。客户端请求 Tracker server 进行文件上传、下载，通过 Tracker server 调度最终由 Storage server 完成文件上传和下载。
其中：

### Tracker

Tracker Server 作用是负载均衡和调度，通过Tracker server 在文件上传时可以根据一些策略找到 Storage server 提供文件上传服务。可以将tracker 称为追踪服务器或调度服务器。

FastDFS 集群中的 Tracker server 可以有多台，Tracker server 之间是相互平等关系同时提供服务，Tracker server 不存在单点故障。客户端请求Tracker server 采用**轮询**方式，如果请求的tracker 无法提供服务则换另一个 tracker。

### Storage

Storage Server 作用是文件存储，客户端上传的文件最终存储在 Storage 服务器上，Storage server 没有实现自己的文件系统而是使用操作系统的文件系统来管理文件。可以将 storage 称为存储服务器。

Storage 集群采用了分组存储方式。storage 集群由一个或多个组构成，集群存储总容量为集群中所有组的存储容量之和。一个组由一台或多台存储服务器组成，组内的 Storage server 之间是平等关系，不同组的 Storage server 之间不会相互通信，同组内的 Storage server之间会相互连接进行**文件同步**，从而保证同组内每个 storage 上的文件 完全一致的。一个组的存储容量为该组内的存储服务器**容量最小**的那个，由此可见组内存储服务器的软硬件配置最好是一致的。

采用分组存储方式的好处是灵活、可控性较强。比如上传文件时，可以由客户端直接指定上传到的组也可以由 tracker 进行调度选择。一个分组的存储服务器访问压力较大时，可以在该组增加存储服务器来扩充服务能力（纵向扩容）。当系统容量不足时，可以增加组来扩充存储容量（横向扩容）。

### Storage状态收集

Storage server 会连接集群中所有的 Tracker server，定时向他们报告自己的状态，包括磁盘剩余空间、文件同步状况、文件上传下载次数等统计信息。

### 文件上传

![18](/assets/images/2020/2020-03/18.png)

客户端上传文件的流程如上图所示，上传成功之后存储服务器将**文件ID**返回给客户端，此文件ID用于以后访问该文件的索引信息。文件索引信息 包括：组名，虚拟磁盘路径，数据两级目录，文件名。

![19](/assets/images/2020/2020-03/19.png)

- 组名：文件上传后所在的storage组名称，在文件上传成功后有storage服务器返回，需要客户端自行保存。

- 虚拟磁盘路径：storage配置的虚拟路径，与磁盘选项store_path*对应。如果配置了store_path0则是M00， 如果配置了store_path1则是M01，以此类推。

- 数据两级目录：storage服务器在每个虚拟磁盘路径下创建的两级目录，用于存储数据文件。

- 文件名：与文件上传时不同。是由存储服务器根据特定信息生成，文件名包含：源存储服务器IP地址、文件创 建时间戳、文件大小、随机数和文件拓展名等信息。

### 文件下载

![20](/assets/images/2020/2020-03/20.png)

服务端下载文件的流程如上图所示，tracker根据请求的文件路径即文件ID 来快速定义文件。比如请求下边的文件：

![19](/assets/images/2020/2020-03/19.png)

- 通过组名tracker能够很快的定位到客户端需要访问的存储服务器组是group1，并选择合适的存储服务器提供客 户端访问。

- 存储服务器根据“文件存储虚拟磁盘路径”和“数据文件两级目录”可以很快定位到文件所在目录，并根据文件名找到 客户端需要访问的文件。

## 使用示例

可以通过 java 程序来进行 FastDFS 文件的上传和下载操作。

首先得访问[[fastdfs-client-java](https://github.com/happyfish100/fastdfs-client-java)](https://github.com/happyfish100/fastdfs-client-java)下载源码并使用 maven 进行打包。然后在项目中进行引用：

```xml
<dependency>
    <groupId>org.csource</groupId>
    <artifactId>fastdfs-client-java</artifactId>
    <version>1.29-SNAPSHOT</version>
</dependency>
```

### 文件上传

```java
public void testUpload(){
        // 加载配置文件
        try {
            ClientGlobal.initByProperties("config/fastdfs-client.properties");
            // 定义TrackerClient，用于请求TrackerServer
            TrackerClient tracker = new TrackerClient();
            // 获取trackerserver
            TrackerServer trackerServer = tracker.getTrackerServer();
            // 创建storageserver
            StorageServer storageServer = null;
            // 创建StorageClient1对象
            StorageClient1 client = new StorageClient1(trackerServer, storageServer);
            // 打开文件
            String filePath = "/Users/wx/Downloads/timg.jpeg";
            // 开始上传文件，返回文件id
            String  fileId = client.upload_file1(filePath,"jpeg",null);
            System.out.println(fileId);
            // group1/M00/00/00/wKh0gV6Ai3qAIrL8AAPk5r6YTL026.jpeg
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
```

### 文件下载

```java
public void testDownload(){
        // 加载配置文件
        try {
            ClientGlobal.initByProperties("config/fastdfs-client.properties");
            // 定义TrackerClient，用于请求TrackerServer
            TrackerClient tracker = new TrackerClient();
            // 获取trackerserver
            TrackerServer trackerServer = tracker.getTrackerServer();
            // 创建storageserver
            StorageServer storageServer = null;
            // 创建StorageClient1对象
            StorageClient1 client = new StorageClient1(trackerServer, storageServer);
            // 开始下载文件
            byte[] bytes = client.download_file1("group1/M00/00/00/wKh0gV6Ai3qAIrL8AAPk5r6YTL026.jpeg");
            // 使用输出流来保存文件
            FileOutputStream fileOutputStream = new FileOutputStream(new File("/Users/wx/Downloads/timg01.jpeg"));
            fileOutputStream.write(bytes);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
```
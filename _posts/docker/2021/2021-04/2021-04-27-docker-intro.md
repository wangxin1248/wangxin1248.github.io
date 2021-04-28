---
layout: post
title:  "Docker入门"
date:  2021-04-27
desc: "Docker入门介绍"
keywords: "Docker,笔记,学习笔记,安装实例"
categories: [Docker]
tags: [Docker]
---
# Docker 入门

本文部分内容参考自[菜鸟教程](https://www.runoob.com/docker/docker-tutorial.html)

## 简介

Docker 是由 Go 语言开发的操作系统层层面的虚拟化技术，Docker 对进程进行独立于宿主和其它进程的隔离，将其称为 **容器**。并且在容器的基础上，进行了进一步的封装，从文件系统、网络互联到进程隔离等等。极大的简化了容器的创建和维护，解决了软件的运行环境和配置的复杂操作。

Docker 的特点：

- **轻量**：在一台机器上运行的多个 Docker 容器可以共享这台机器的操作系统内核；它们能够迅速启动，只需占用很少的计算和内存资源。镜像是通过文件系统层进行构造的，并共享一些公共文件。这样就能尽量降低磁盘用量，并能更快地下载镜像。
- **标准**：Docker 容器基于开放式标准，能够在所有主流 Linux 版本、Microsoft Windows 以及包括 VM、裸机服务器和云在内的任何基础设施上运行。
- **安全**：Docker 赋予应用的隔离性不仅限于彼此隔离，还独立于底层的基础设施。Docker 默认提供最强的隔离，因此应用出现问题，也只是单个容器的问题，而不会波及到整台机器。
- **一致的运行环境**：Docker 的镜像提供了除内核外完整的运行时环境，确保了应用运行环境一致性，从而不会再出现 “这段代码在我机器上没问题啊” 这类问题。
- **更快速的启动时间**：可以做到秒级、甚至毫秒级的启动时间。大大的节约了开发、测试、部署的时间。
- **隔离性**：避免公用的服务器，资源会容易受到其他用户的影响。
- **弹性伸缩，快速扩展**：善于处理集中爆发的服务器使用压力；
- **迁移方便**：可以很轻易的将在一个平台上运行的应用，迁移到另一个平台上，而不用担心运行环境的变化导致应用无法正常运行的情况。
- **持续交付和部署**：使用 Docker 可以通过定制应用镜像来实现持续集成、持续交付、部署。

Docker 是一种容器化技术，通常将其和传统的虚拟化技术进行比较：

![02](/assets/images/2021/2021-04/02.jpeg)

- **容器是一个应用层抽象，用于将代码和依赖资源打包在一起**。多个容器可以在同一台机器上运行，共享操作系统内核，但各自作为独立的进程在用户空间中运行。与虚拟机相比，容器占用的空间较少（容器镜像大小通常只有几十兆），瞬间就能完成启动；
- 虚拟机 (VM) 是一个物理硬件层抽象，用于将一台服务器变成多台服务器。管理程序允许多个 VM 在一台机器上运行。每个VM都包含一整套操作系统、一个或多个应用、必要的二进制文件和库资源，因此占用大量空间而且 VM 启动也十分缓慢；
- 容器和虚拟机具有相似的资源隔离和分配优势，但功能有所不同，因为**容器虚拟化的是操作系统，而不是硬件**，因此容器更容易移植，效率也更高；
- 传统虚拟机技术是虚拟出一套硬件后，在其上运行一个完整操作系统，在该系统上再运行所需应用进程；
- 容器内的应用进程直接运行于宿主的内核，容器内没有自己的内核，而且也没有进行硬件虚拟，因此容器要比传统虚拟机更为轻便。
- 虚拟机更擅长于彻底隔离整个运行环境。例如，云服务提供商通常采用虚拟机技术隔离不同的用户。
- Docker 通常用于隔离不同的应用。例如前端，后端以及数据库。

## 基本概念

Docker 主要的概念就是：**镜像、容器、仓库**

Docker 使用客户端-服务器 (C/S) 架构模式，使用远程API来管理和创建 Docker 容器。

Docker 容器通过 Docker 镜像来创建，容器与镜像的关系类似于面向对象编程中的对象与类。

![03](/assets/images/2021/2021-04/03.png)

Docker 的架构由 Clients、Hosts、Registries 三大部分组成。

- Docker 客户端通过**命令行**或者其他工具使用 Docker SDK 与 Docker 的守护进程通信；- Host 是一个物理或者虚拟的机器用于执行 Docker 守护进程和容器；
- Docker 仓库用来保存镜像，可以理解为代码控制中的代码仓库。

### 镜像

Docker 镜像是一个特殊的文件系统，是一个**只读的多层文件系统（由一堆分层的文件系统整合在一起的特殊文件系统）**。除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。

因为镜像包含操作系统完整的 root 文件系统，其体积往往是庞大的，因此在 Docker 设计时，就充分利用 Union FS 的技术，将其设计为分层存储的架构。

镜像构建时，会一层层构建，前一层是后一层的基础。每一层构建完就不会再发生改变，后一层上的任何改变只发生在自己这一层。分层存储的特征还使得镜像的复用、定制变的更为容易。

Docker 镜像的构建过程：

首先在所要打包的项目路径下编写对应的 Dockerfile 文件，然后使用如下的命令来来打包一个镜像：

```shell
$ docker build -t 镜像名 镜像目录 
```

然后使用 `docker run` 命令运行镜像将其变为一个容器。

Dockerfile的主要参数：

- **copy**：复制文件，将从构建上下文目录中 <源路径> 的文件/目录复制到新的一层的镜像内的 <目标路径> 位置。
- **add**：该指令和 COPY 的格式和性质基本一致。但是在 COPY 基础上增加了一些功能，比如源路径可以是url或者压缩包。


### 容器

镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的**类**和**实例**一样，镜像是静态的定义，容器是镜像运行时的实体，`容器 = 镜像 + 可读层`

容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的命名空间。因此容器可以拥有自己的 root 文件系统、自己的网络配置、自己的进程空间，甚至自己的用户 ID 空间。容器内的进程是运行在一个隔离的环境里，使用起来，就好像是在一个独立于宿主的系统下操作一样。

每一个容器运行时，是以镜像为基础层，在其上创建一个当前容器的存储层为**容器存储层**（支持读写）。容器存储层的生存周期和容器一样，容器消亡时，容器存储层也随之消亡。因此，任何保存于容器存储层的信息都会随容器删除而丢失。容器不应该向其存储层内写入任何数据，容器存储层要保持无状态化。

所有的文件写入操作，都应该使用**数据卷（Volume）**、或者绑定宿主目录，在这些位置的读写会跳过容器存储层，直接对宿主（或网络存储）发生读写，其性能和稳定性更高。数据卷的生存周期独立于容器，容器消亡，数据卷不会消亡。

### 仓库

Docker Registry 提供一个集中的存储、分发镜像的服务，一个 Docker Registry 中可以包含多个仓库（Repository）；每个仓库可以包含多个标签（Tag）；每个标签对应一个镜像。

通常，一个仓库会包含同一个软件不同版本的镜像，而标签就常用于对应该软件的各个版本。我们可以通过 <仓库名>:<标签> 的格式来指定具体是这个软件哪个版本的镜像。如果不给出标签，将以 latest 作为默认标签。

## 常用命令

### 容器生命周期管理

#### Docker run 命令

`docker run` ：创建一个新的容器并运行，相当于`下载（pull）+ 创建（create）+ 运行（start）`

语法：

```shell
$ docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

OPTIONS说明：

- `-a stdin`: 指定标准输入输出内容类型，可选 STDIN/STDOUT/STDERR 三项；
- `-d`: 后台运行容器，并返回容器ID；
- `-i`: 以交互模式运行容器，通常与 -t 同时使用；
- `-P`: 随机端口映射，容器内部端口随机映射到主机的端口
- `-p`: 指定端口映射，格式为：主机(宿主)端口:容器端口
- `-t`: 为容器重新分配一个伪输入终端，通常与 -i 同时使用；
- `--name="nginx-lb"`: 为容器指定一个名称；
- `--dns 8.8.8.8`: 指定容器使用的DNS服务器，默认和宿主一致；
- `--dns-search example.com`: 指定容器DNS搜索域名，默认和宿主一致；
- `-h "mars"`: 指定容器的hostname；
- `-e username="ritchie"`: 设置环境变量；
- `--env-file=[]`: 从指定文件读入环境变量；
- `--cpuset="0-2" or --cpuset="0,1,2"`: 绑定容器到指定CPU运行；
- `-m` :设置容器使用内存最大值；
- `--net="bridge"`: 指定容器的网络连接类型，支持 bridge/host/none/container: 四种类型；
- `--link=[]`: 添加链接到另一个容器；
- `--expose=[]`: 开放一个端口或一组端口；
- `--volume , -v`: 绑定一个卷
- `--rm`: 表示这是一个临时容器，在容器退出时就能够自动清理容器内部的文件系统（不能与`-d`同时使用，或者说同时使用没有意义）。

#### Docker start/stop/restart 命令

`docker start`：启动一个或多个已经被停止的容器

`docker stop`：停止一个运行中的容器

`docker restart`：重启容器

语法：

```shell
$ docker start/stop/restart [OPTIONS] CONTAINER [CONTAINER...]
```

#### Docker kill 命令

`docker kill`：杀掉一个运行中的容器

语法：

```shell
$ docker kill [OPTIONS] CONTAINER [CONTAINER...]
```

OPTIONS说明：

- `-s` :向容器发送一个信号

#### Docker rm 命令

`docker rm`：删除一个或多个容器

语法：

```shell
$ docker rm [OPTIONS] CONTAINER [CONTAINER...]
```

OPTIONS说明：

- `-f` :通过 SIGKILL 信号强制删除一个运行中的容器。
- `-l` :移除容器间的网络连接，而非容器本身。
- `-v` :删除与容器关联的卷

#### Docker pause/unpause 命令

`docker pause`：暂停容器中所有的进程。

`docker unpause`：恢复容器中所有的进程。

语法：

```shell
$ docker pause/unpause CONTAINER [CONTAINER...]
```

#### Docker create 命令

`docker create`：创建一个新的容器但不启动它

语法：

```shell
$ docker create [OPTIONS] IMAGE [COMMAND] [ARG...]
```

OPTIONS 与 `docker run` 一致。

#### Docker exec 命令

`docker exec`：在运行的容器中执行命令

语法：

```shell
$ docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
```

OPTIONS说明：

- `-d` :分离模式: 在后台运行
- `-i` :即使没有附加也保持 STDIN 打开
- `-t` :分配一个伪终端

### 容器操作

#### Docker ps 命令

`docker ps`：列出所有正在运行的容器

语法：

```shell
$ docker ps [OPTIONS]
```

OPTIONS说明：

- `-a` :显示所有的容器，包括未运行的。
- `-f` :根据条件过滤显示的内容。
- `--format` :指定返回值的模板文件。
- `-l` :显示最近创建的容器。
- `-n` :列出最近创建的n个容器。
- `--no-trunc` :不截断输出。
- `-q` :静默模式，只显示容器编号。
- `-s` :显示总的文件大小。

#### Docker inspect 命令

`docker inspect`：获取容器/镜像的元数据。

语法：

```shell
$ docker inspect [OPTIONS] NAME|ID [NAME|ID...]
```

OPTIONS说明：

- `-f` :指定返回值的模板文件。
- `-s` :显示总的文件大小。
- `--type` :为指定类型返回JSON。
- `--format` :指定输出格式（支持动作）

#### Docker top 命令

`docker top`：查看容器中运行的进程信息，支持 ps 命令参数。

语法：

```shell
$ docker top [OPTIONS] CONTAINER [ps OPTIONS]
```

容器运行时不一定有/bin/bash终端来交互执行top命令，而且容器还不一定有top命令，可以使用docker top来实现查看container中正在运行的进程。

#### Docker attach 命令

`docker attach`：连接到正在运行中的容器。

语法：

```shell
$ docker attach [OPTIONS] CONTAINER
```

要attach上去的容器必须正在运行，可以同时连接上同一个container来共享屏幕（与screen命令的attach类似）。

菜鸟教程补充：`官方文档中说attach后可以通过CTRL-C来detach，但实际上经过我的测试，如果container当前在运行bash，CTRL-C自然是当前行的输入，没有退出；如果container当前正在前台运行进程，如输出nginx的access.log日志，CTRL-C不仅会导致退出容器，而且还stop了。这不是我们想要的，detach的意思按理应该是脱离容器终端，但容器依然运行。好在attach是可以带上--sig-proxy=false来确保CTRL-D或CTRL-C不会关闭容器。`

#### Docker events 命令

`docker events`：从服务器获取实时事件

语法：

```shell
$ docker events [OPTIONS]
```

OPTIONS说明：

- `-f` ：根据条件过滤事件；
- `--since` ：从指定的时间戳后显示所有事件;
- `--until` ：流水时间显示到指定的时间为止；

#### Docker logs 命令

`docker logs`：获取容器的日志

语法：

```shell
$ docker logs [OPTIONS] CONTAINER
```

OPTIONS说明：

- `-f` : 跟踪日志输出
- `--since` :显示某个开始时间的所有日志
- `-t` : 显示时间戳
- `--tail` :仅列出最新N条容器日志

#### Docker wait 命令

`docker wait`：阻塞运行直到容器停止，然后打印出它的退出代码

语法：

```shell
$ docker wait [OPTIONS] CONTAINER [CONTAINER...]
```

#### Docker export 命令

`docker export`：将文件系统作为一个tar归档文件导出到STDOUT。

语法：

```shell
$ docker export [OPTIONS] CONTAINER
```

OPTIONS说明：

- `-o` :将输入内容写到文件。

#### Docker port 命令

`docker port`：列出指定的容器的端口映射，或者查找将PRIVATE_PORT NAT到面向公众的端口。

语法：

```shell
$ docker port [OPTIONS] CONTAINER [PRIVATE_PORT[/PROTO]]
```

### 容器rootfs命令

#### Docker commit 命令

`docker commit`：从容器创建一个新的镜像。

语法：

```shell
$ docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]
```

OPTIONS说明：

- `-a` :提交的镜像作者；
- `-c` :使用Dockerfile指令来创建镜像；
- `-m` :提交时的说明文字；
- `-p` :在commit时，将容器暂停。

#### Docker cp 命令

`docker cp`：用于容器与主机之间的数据拷贝。

语法：

```shell
$ docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|-
$ docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH
```

OPTIONS说明：

- `-L` :保持源目标中的链接

#### Docker diff 命令

`docker diff`：检查容器里文件结构的更改。

语法：

```shell
$ docker diff [OPTIONS] CONTAINER
```

### 镜像仓库

#### Docker login/logout 命令

`docker login` : 登陆到一个Docker镜像仓库，如果未指定镜像仓库地址，默认为官方仓库 Docker Hub

`docker logout` : 登出一个Docker镜像仓库，如果未指定镜像仓库地址，默认为官方仓库 Docker Hub

语法：

```shell
$ docker login [OPTIONS] [SERVER]
$ docker logout [OPTIONS] [SERVER]
```

OPTIONS说明：

- `-u` :登陆的用户名
- `-p` :登陆的密码

#### Docker pull 命令

`docker pull` : 从镜像仓库中拉取或者更新指定镜像

语法

```shell
$ docker pull [OPTIONS] NAME[:TAG|@DIGEST]
```
OPTIONS说明：

- `-a` :拉取所有 tagged 镜像
- `--disable-content-trust` :忽略镜像的校验,默认开启

#### Docker push 命令

`docker push` : 将本地的镜像上传到镜像仓库,要先登陆到镜像仓库

语法

```shell
$ docker push [OPTIONS] NAME[:TAG]
```

OPTIONS说明：

- `--disable-content-trust` :忽略镜像的校验,默认开启

#### Docker search 命令

`docker search` : 从Docker Hub查找镜像

语法

```shell
$ docker search [OPTIONS] TERM
```

OPTIONS说明：

- `--automated` :只列出 automated build类型的镜像；
- `--no-trunc` :显示完整的镜像描述；
- `-f <过滤条件>`:列出收藏数不小于指定值的镜像。

### 本地镜像管理

#### Docker images 命令

`docker images` : 列出本地镜像。

语法

```shell
$ docker images [OPTIONS] [REPOSITORY[:TAG]]
```

OPTIONS说明：

- `-a` :列出本地所有的镜像（含中间映像层，默认情况下，过滤掉中间映像层）；
- `--digests` :显示镜像的摘要信息；
- `-f` :显示满足条件的镜像；
- `--format` :指定返回值的模板文件；
- `--no-trunc` :显示完整的镜像信息；
- `-q` :只显示镜像ID。

#### Docker rmi 命令

`docker rmi` : 删除本地一个或多少镜像。

语法

```shell
$ docker rmi [OPTIONS] IMAGE [IMAGE...]
```

OPTIONS说明：

- `-f` :强制删除；
- `--no-prune` :不移除该镜像的过程镜像，默认移除；

#### Docker tag 命令

`docker tag` : 标记本地镜像，将其归入某一仓库。

语法

```shell
$ docker tag [OPTIONS] IMAGE[:TAG] [REGISTRYHOST/][USERNAME/]NAME[:TAG]
```

#### Docker build 命令

`docker build` 命令用于使用 Dockerfile 创建镜像。

语法

```shell
$ docker build [OPTIONS] PATH | URL | -
```

OPTIONS说明：

- `--build-arg=[]` :设置镜像创建时的变量；
- `--cpu-shares` :设置 cpu 使用权重；
- `--cpu-period` :限制 CPU CFS周期；
- `--cpu-quota` :限制 CPU CFS配额；
- `--cpuset-cpus` :指定使用的CPU id；
- `--cpuset-mems` :指定使用的内存 id；
- `--disable-content-trust` :忽略校验，默认开启；
- `-f` :指定要使用的Dockerfile路径；
- `--force-rm` :设置镜像过程中删除中间容器；
- `--isolation` :使用容器隔离技术；
- `--label=[]` :设置镜像使用的元数据；
- `-m` :设置内存最大值；
- `--memory-swap` :设置Swap的最大值为内存+swap，"-1"表示不限swap；
- `--no-cache` :创建镜像的过程不使用缓存；
- `--pull` :尝试去更新镜像的新版本；
- `--quiet, -q` :安静模式，成功后只输出镜像 ID；
- `--rm` :设置镜像成功后删除中间容器；
- `--shm-size` :设置/dev/shm的大小，默认值是64M；
- `--ulimit` :Ulimit配置。
- `--squash` :将 Dockerfile 中所有的操作压缩为一层。
- `--tag, -t`: 镜像的名字及标签，通常 name:tag 或者 name 格式；可以在一次构建中为一个镜像设置多个标签。
- `--network`: 默认 default。在构建期间设置RUN指令的网络模式

#### Docker history 命令

`docker history` : 查看指定镜像的创建历史。

语法

```shell
$ docker history [OPTIONS] IMAGE
```

OPTIONS说明：

- `-H` :以可读的格式打印镜像大小和日期，默认为true；
- `--no-trunc` :显示完整的提交记录；
- `-q` :仅列出提交记录ID。

#### Docker save 命令

`docker save` : 将指定镜像保存成 tar 归档文件。

语法

```shell
$ docker save [OPTIONS] IMAGE [IMAGE...]
```

OPTIONS 说明：

- `-o` :输出到的文件。

#### Docker load 命令

`docker load` : 导入使用 docker save 命令导出的镜像。

语法

```shell
$ docker load [OPTIONS]
```

OPTIONS 说明：

- `--input , -i` : 指定导入的文件，代替 STDIN。
- `--quiet , -q` : 精简输出信息。

#### Docker import 命令

`docker import` : 从归档文件中创建镜像。

语法

```shell
$ docker import [OPTIONS] file|URL|- [REPOSITORY[:TAG]]
```

OPTIONS说明：

- `-c` :应用docker 指令创建镜像；
- `-m` :提交时的说明文字；

### info|version

#### Docker info 命令

`docker info` : 显示 Docker 系统信息，包括镜像和容器数。。

语法

```shell
$ docker info [OPTIONS]
```

#### Docker version 命令

`docker version` :显示 Docker 版本信息。

语法

```shell
$ docker version [OPTIONS]
```

OPTIONS说明：

- `-f` :指定返回值的模板文件。

## Docker 实例

### Docker 安装 Mysql

拉取镜像：

```shell
$ docker pull mysql:latest
```

运行容器：

```shell
$ docker run -itd --name mysql -p 3306:3306 -v /opt/docker_v/mysql/conf:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=123456 mysql:latest
```

命令说明：

- `-i`: 以交互模式运行容器，通常与 -t 同时使用
- `-t`: 为容器重新分配一个伪输入终端，通常与 -i 同时使用
- `-d`: 后台运行容器，并返回容器ID
- `--name`：容器名称
- `-p 3306:3306`：将容器的3306端口映射到主机的3306端口
- `-v /opt/docker_v/mysql/conf:/etc/mysql/conf.d`：将主机/opt/docker_v/mysql/conf目录挂载到容器的/etc/mysql/conf.d，修改mysql的配置文件
- `-e MYSQL_ROOT_PASSWORD=123456`：初始化root用户的密码
- `mysql:latest`: mysql镜像名称以及版本

### Docker 安装 Redis

拉取镜像：

```shell
$ docker pull redis:latest
```

运行容器：

```shell
docker run -itd --name redis -p 6379:6379 redis:latest
```

命令说明：

- `-i`: 以交互模式运行容器，通常与 -t 同时使用
- `-t`: 为容器重新分配一个伪输入终端，通常与 -i 同时使用
- `-d`: 后台运行容器，并返回容器ID
- `--name`：容器名称
- `-p 6379:6379`：将容器的6379端口映射到主机的6379端口，外部可以直接通过宿主机ip:6379 访问到 Redis 的服务。
- `redis:latest`: redis镜像名称以及版本

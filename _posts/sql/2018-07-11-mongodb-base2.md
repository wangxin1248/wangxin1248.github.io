---
layout: post
title:  "MongoDB 知识点归纳总结（二）"
date:  2018-07-11
desc: "MongoDB 知识点归纳总结（二）：基础知识点。"
keywords: "mongodb,知识点，整理，归纳"
categories: [SQL]
tags: [mongodb,sql]
---

# MongoDB 知识点归纳总结（二）

本片博客将接着总结 MongoDB 的主要知识点，主要内容包括：

##### 1.MongoDB 高级操作
##### 2.MongoDB 索引
##### 3.MongoDB 数据库安全设置
##### 4.MongoDB 复制设置
##### 5.MongoDB 数据库备份和恢复

---

## 一、MongoDB 高级操作

### 聚合 aggregate

聚合（aggregate）主要用于计算数据，类似于 sql 中的 sum(),avg()

语法：

```js
db.集合名.aggregate([{管道:{表达式}}])
```

**管道**：在 linux 和 unix 中一般用于将当前命令的输出结果做为下一个命令的输入。而在 MongoDB 中也有管道的概念。当文档处理完毕后，通过管道进行下一次处理。

常用的管道：

##### · $gruop：将集合中的文档分组，可用于统计结果
##### · $match：过滤数据，只输出符合条件的文档
##### · $project：投影，修改输入文档的结构做为输出
##### · $sort：将输入文档排序后输出
##### · $limit：限制聚合管道返回的文档数
##### · $skip：跳过指定数量的文档
##### · $unwind：将数组类型的字段进行拆分

表达式是为了处理输入文档并进行输出，语法：

```js
表达式:'$列名'
```

常用的表达式：

##### · $sum：计算总和
##### · $avg：计算平均值
##### · $min：获取最小值
##### · $max：获取最大值
##### · $push：将结果文档插入到一个数组中，$$ROOT表示将所有的文档内容插入到数组中。
##### · $first：获取第一个文档数据
##### · $last：获取最后一个文档数据

#### $group

将集合中的文档分组，可用于统计结果。$group ：之后是一个集合，中表示的是所要输出的结果的格式。_id 表示分组的依据，使用某个字段的格式为：**$字段**，其余的字段都会在结果中出现。

示例1.统计男生和女生的总人数，并按姓名进行分组：

```js
db.stu.aggregate([
    {
        $group:{
            _id:'$gender',
            counter:{$sum:1}
        }
    }
])
```

示例2.统计男生和女生的平均年龄：

```js
db.stu.aggregate([
{
    $group:{
        _id:'$gender',
        avg:{$avg:'$age'}
        }
    }
])
```

示例3.找出男生和女生的中年龄最大的学生：

```js
db.stu.aggregate([
{
    $group:{
        _id:'$gender',
        max:{$max:'$age'}
        }
    }
])
```

示例4.列出学生中男生和女生的所有名单（注意在 $push 中使用 **$$ROOT** 表示文档中所有的内容）：

```js
db.stu.aggregate([
{
    $group:{
        _id:'$gender',
        student:{$push:'$$ROOT'}
        }
    }
])
```

#### $match

$match 用于过滤数据，功能和过滤条件都与 find 一致，不同点在于其可以在管道中进行数据统计。

示例：查询年龄大于20的男生和女生的人数

```js
db.stu.aggregate([
   {$match:{age:{$gt:20}}},
   {$group:{_id:'$gender',counter:{$sum:1}}}
])
```

#### $project

投影操作，将设置的字段结果显示到最终的结果集中去，与find中的投影操作一致

示例：查询年龄大于20的男生和女生的人数，只显示人数

```js
db.stu.aggregate([
   {$match:{age:{$gt:10}}},
   {$group:{_id:'$gender',counter:{$sum:1}}},
   {$project:{_id:0,counter:1}}
])
```

#### $sort

排序操作，跟在 group 管道之后对结果进行排序显示，其条件与 find 中的一致。

示例：查询年龄大于20的男生和女生的人数，按年龄排序

```js
db.stu.aggregate([
   {$match:{age:{$gt:10}}},
   {$group:{_id:'$gender',counter:{$sum:1}}},
   {$sort:{age:1}}
])
```

#### $limit $skip

**$limit** 用来限制输出结果的条数，**$skip** 用来跳过一定数量的结果文档。使用方式也以 find 中的一致，只是支持管道操作。

注意：必须得先使用 $skip 再使用 $limit

示例：查询年龄大于20的男生和女生的人数，按年龄排序，查看第二个结果

```js
db.stu.aggregate([
   {$match:{age:{$gt:10}}},
   {$group:{_id:'$gender',counter:{$sum:1}}},
   {$sort:{age:1}},
   {$skip:1},
   {$limit:1}
])
```

#### $unwind

将文档中的某一个数组类型字段拆分为多条，每条包含数组中的一个值。（类似与分组操作的逆操作）

语法：

```js
db.集合名.aggregate([{$unwind:'$字段名称'}])
```

$unwind 会将数组字段中的值分别取出来和文档中的其他数据重新组合成一条新的文档显示出来。

但假如要处理空数组，非数组，无字段，null的情况的时候直接使用 unwind 进行拆分的时候这些情况对应的文档便不会显示，造成数据丢失。那么便可以使用 **preserveNullAndEmptyArrays**来设置使其不要丢失。

```js
db.集合名.aggregate([{
    $unwind:{
        path:'$字段名称',
        preserveNullAndEmptyArrays:<boolean>#防止数据丢失，为true则不会丢失
    }
}])
```

## 二、MongoDB 索引

MongoDB 为了加快数据的检索速度，也是支持在指定字段上建立索引的。为了测试 MongoDB 索引的性能，再集合中插入大量数据：

```js
for(int i=0;i<100000;i++){
    db.t1.insert({name:'test'+i,age:i})
}
```

接下来使用 explain() 命令来进行查询性能分析。

```js
db.t1.find({name:'test100000'}).explain('executionStats')
```

其中的 executionStats 下的 executionTimeMillis 表示整体查询时间，单位为毫秒。

那么便可以考虑得查询率比较高的字段创建索引，语法为：

```js
db.集合名.ensureIndex({属性：1})
```

1表示升序，-1表示降序。

接下来在 name 字段创建索引，语法为：

```js
db.t1.ensureIndex({name:1})
```

索引的一些基本命令：

1.建立唯一索引，实现唯一约束的功能：

```js
db.集合名.ensureIndex({字段：1},{unique:true})
```

2.建立联合索引，对多个属性建立一个索引

```js
db.集合名.ensureIndex(字段:1,字段:2,...)
```

3.查看文档中的索引

```js
db.集合名.getIndexs()
```

4.删除索引

```js
db.集合名.dropIndex('索引名称')
```

## 三、MongoDB 数据库安全设置

MongoDB 数据库在默认情况下是不需要密码验证便可以直接登陆到数据库中。这样是很危险的操作，为了保护数据的安全，需要给用户设置指定的权限。

### 创建超级管理员

首先得给 MongoDB 创建一个超级管理员角色。采用的是角色-用户-数据库的方法来设置角色的操作权限。

常用的系统角色是：

##### · root：只有在 admin 数据库中可用，超级账号，超级权限
##### · Read：只允许用户读取数据库
##### · readWrite：允许用户读写数据库

了解了系统的角色之后便可以创建一个root管理员，在mongo登入数据库中执行以下命令：

```js
> use admin

> db.createUser({
    user:'admin',
    pwd:'...',
    roles:[{role:'root',db:'admin'}]
})
```

这样，系统管理员账号便创建好了，接下来还得进行相应的设置：

### 启用安全认证

首先修改配置文件

```shell
$ sudo vi /etc/mongodb.conf
```
在配置文件中添加(注意配置文件：后有空格)：

```
security:
    authorization: enabled
```

修改完成之后需要重启 MongoDB

```shell
$ sudo systemctl restart mongodb
```

接下来便可以使用用户名和密码登陆 mongo 终端了：

```shell
$ mongo -u 'admin' -p '...' --authenticationDatabase 'admin'
```

### 创建普通用户

在创建好了 root管理员用户之后便可以对相应的用户创建普通的用户权限了。这主要根据用户对所属数据的具体所需的操作来设置。在使用对应的数据库之后便在数据库中创建相应的普通用户即可。

使用 py3 数据库：

```js
use py3
```

在该数据库下创建相应的用户：

```js
db.createUser({
    user:'t1',
    pwd:'123',
    roles:[{role:'readWrite',db:'py3'}]
})
```

接下来该用户便可以连接终端：

```shell
$ mongo -u t1 -p 123 --authenticationDatabase py3
```

现在该用户只可以查看当前数据库中的内容，其他数据库的内容没有权限访问。

## 四、MongoDB 复制设置

复制就是在多个数据库上存储数据副本，保证在主服务器出现问题时可以让其他服务器继续提供服务，保证了数据的可用性和安全性。并且，复制支持从硬件故障和服务中断中恢复数据。

复制可以提供数据备份，数据灾难恢复，读写分离，高可用性，无宕机维护，副本集对应用程序是透明的等好处。

### 复制的工作原理：

复制至少需要两个节点A,B，A节点是主节点，负责处理客户端的请求。其余的都是从节点，负责以固定的时间间隔以轮询的方式复制主节点上的数据。主从节点的搭配一般是：**一主一从，一主多从**。主节点负责写操作，并记录在其上的所有操作。从节点定期轮询主节点获取这些操作，然后对自己的数据副本执行这些操作，从而保证从节点的数据与主节点一致，主节点与从节点进行数据交互保障数据的一致性

### 复制的特点：

##### · 支持n个节点的集群
##### · 任何节点都可以做为主节点
##### · 所有写入操作都是在主节点上
##### · 自动故障转移
##### · 自动恢复

### 设置复制节点

#### 第一步：创建两个数据库目录

```shell
mkdir t1
mkdir t2
```

#### 第二步：开启两个mongod服务，注意replSet的名称是一致的

```shell
mongod --bind_ip 172.16.92.132 --port 27018 --dbpath ~/code/t1 --replSet rs0
mongod --bind_ip 172.16.92.132 --port 27019 --dbpath ~/code/t2 --replSet rs0
```

#### 第三步：连接主服务器

```shell
mongo --host 172.16.92.132 --port 27018
```

#### 第四步：初始化设置

```js
rs.initiate()
```

设置完成之后可以看到提示符发生了变化

```js
rs0:OTHER>
```

查看当前的数据库状态：

```js
rs.status()

{
	"set" : "rs0",
	"date" : ISODate("2018-07-10T02:39:31.676Z"),
	"myState" : 1,
	"term" : NumberLong(1),
	"heartbeatIntervalMillis" : NumberLong(2000),
	"optimes" : {
		"lastCommittedOpTime" : {
			"ts" : Timestamp(1531190365, 1),
			"t" : NumberLong(1)
		},
		"readConcernMajorityOpTime" : {
			"ts" : Timestamp(1531190365, 1),
			"t" : NumberLong(1)
		},
		"appliedOpTime" : {
			"ts" : Timestamp(1531190365, 1),
			"t" : NumberLong(1)
		},
		"durableOpTime" : {
			"ts" : Timestamp(1531190365, 1),
			"t" : NumberLong(1)
		}
	},
	"members" : [
		{
			"_id" : 0,
			"name" : "172.16.92.132:27018",
			"health" : 1,
			"state" : 1,
			"stateStr" : "PRIMARY",
			"uptime" : 2029,
			"optime" : {
				"ts" : Timestamp(1531190365, 1),
				"t" : NumberLong(1)
			},
			"optimeDate" : ISODate("2018-07-10T02:39:25Z"),
			"infoMessage" : "could not find member to sync from",
			"electionTime" : Timestamp(1531190284, 2),
			"electionDate" : ISODate("2018-07-10T02:38:04Z"),
			"configVersion" : 1,
			"self" : true
		}
	],
	"ok" : 1,
	"operationTime" : Timestamp(1531190365, 1),
	"$clusterTime" : {
		"clusterTime" : Timestamp(1531190365, 1),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	}
}
```

可以看到当前 numbers 只有一个节点，接下来便可以添加其他的节点：

#### 第五步：添加副本集

```js
rs.add('172.16.92.132:27019')
```

添加成功之后再来查看当前数据库的状态：

```js
rs.status()

{
	"set" : "rs0",
	"date" : ISODate("2018-07-10T02:42:16.249Z"),
	"myState" : 1,
	"term" : NumberLong(1),
	"heartbeatIntervalMillis" : NumberLong(2000),
	"optimes" : {
		"lastCommittedOpTime" : {
			"ts" : Timestamp(1531190528, 1),
			"t" : NumberLong(1)
		},
		"readConcernMajorityOpTime" : {
			"ts" : Timestamp(1531190528, 1),
			"t" : NumberLong(1)
		},
		"appliedOpTime" : {
			"ts" : Timestamp(1531190528, 1),
			"t" : NumberLong(1)
		},
		"durableOpTime" : {
			"ts" : Timestamp(1531190528, 1),
			"t" : NumberLong(1)
		}
	},
	"members" : [
		{
			"_id" : 0,
			"name" : "172.16.92.132:27018",
			"health" : 1,
			"state" : 1,
			"stateStr" : "PRIMARY",
			"uptime" : 2194,
			"optime" : {
				"ts" : Timestamp(1531190528, 1),
				"t" : NumberLong(1)
			},
			"optimeDate" : ISODate("2018-07-10T02:42:08Z"),
			"electionTime" : Timestamp(1531190284, 2),
			"electionDate" : ISODate("2018-07-10T02:38:04Z"),
			"configVersion" : 2,
			"self" : true
		},
		{
			"_id" : 1,
			"name" : "172.16.92.132:27019",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 8,
			"optime" : {
				"ts" : Timestamp(1531190528, 1),
				"t" : NumberLong(1)
			},
			"optimeDurable" : {
				"ts" : Timestamp(1531190528, 1),
				"t" : NumberLong(1)
			},
			"optimeDate" : ISODate("2018-07-10T02:42:08Z"),
			"optimeDurableDate" : ISODate("2018-07-10T02:42:08Z"),
			"lastHeartbeat" : ISODate("2018-07-10T02:42:16.243Z"),
			"lastHeartbeatRecv" : ISODate("2018-07-10T02:42:15.796Z"),
			"pingMs" : NumberLong(0),
			"configVersion" : 2
		}
	],
	"ok" : 1,
	"operationTime" : Timestamp(1531190528, 1),
	"$clusterTime" : {
		"clusterTime" : Timestamp(1531190528, 1),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	}
}
```

### 第六步：连接从服务器并设置

```shell
mongo --host 172.16.92.132 --port 27019
```

操作符已经发生了变化：

```js
rs0:SECONDARY>
```

设置可以从主服务器中读取数据

```js
rs.slaveOk()
```

### 第七步：测试主从服务器数据查询

首先在主服务器中插入数据：

```js
rs0:PRIMARY> use py3
switched to db py3
rs0:PRIMARY> db.stu.insert({name:'wangxin',age:18})
WriteResult({ "nInserted" : 1 })
```

接下来在从服务器中进行查询

```js
rs0:SECONDARY> use py3
switched to db py3
rs0:SECONDARY> db.stu.find()
{ "_id" : ObjectId("5b441e855166d441d86973eb"), "name" : "wangxin", "age" : 18 }
```

### 其他说明：

##### 1.主从服务器是自动切换到，当主服务器因不可抗因素宕机之后从服务器便自动变为主服务器，而原先的主服务器开机之后遍自动变为从服务器
##### 2.假如想要把一个服务器节点从数据库集群中删除的话便使用 rs.remove('ip_addr:port')

## 五、MongoDB 数据库备份和回复

MongoDB 还支持手动备份和恢复数据库

### 备份

语法：

```shell
$ mongodump -h dbhost -d dbname -o dbdirectory
```

##### -h：服务器地址，也可以指定端口号
##### -d：需要备份的数据库名称
##### -o：备份的数据存放位置，此目录中存放着备份出来的数据

### 恢复

语法：

```shell
$ mongorestore -h dbhost -d dbname --dir dbdirectory
```

##### -h：服务器地址
##### -d：需要恢复的数据库实例
##### --dir：备份数据所在位置
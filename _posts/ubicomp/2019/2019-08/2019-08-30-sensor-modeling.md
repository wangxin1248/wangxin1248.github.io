---
layout: post
title:  "传感器建模方法综述"
date:  2019-08-30
desc: "传感器网络（WSN）是目前物联网主要的组成部分，其由多个异构的传感器节点以及网关所组成，本文主要对目前所存在的传感器建模方式进行介绍"
keywords: "传感器,建模,sensor modeling,SensorML,本体建模"
categories: [Ubiquitous computing]
tags: [ubicom,传感器,建模,WSN]
---
# 传感器建模

随着物联网的飞速发展，传感器网络（WSN）也越来越多的被提及。WSN是由众多的被称为网络节点的单个传感器设备所组成的，单个传感器设备负责检测周围环境中的温度、湿度、光照、压力等数据并将其通过特定的通信协议通过网关发送到服务器当中。

下图是一个简单的传感器网络的结构图

![wsn](/assets/images/2019/2019-08/7.png)

目前围绕着 WSN 的研究大多都是围绕着传感器网络的应用和组网方式进行的，并没有太多的研究面向于传感器本身的建模。本文便对目前所存在的传感器建模方法进行简单的介绍，欢迎大家评论指正。

## 基于本体进行传感器建模

### 本体介绍

**本体**是指一种“形式化的，对于共享概念体系的明确而又详细的说明”。本体提供的是一种共享词表，也就是特定领域之中那些存在着的对象类型或概念及其属性和相互关系。

本体是人们以自己兴趣领域的知识为素材，运用信息科学的本体论原理而编写出来的作品。本体一般可以用来针对该领域的属性进行推理，亦可用于定义该领域（也就是对该领域进行建模）。此外，有时人们也会将本体称为本体论。

作为一种关于现实世界或其中某个组成部分的知识表达形式，本体当前的应用领域包括（但不仅限于）：人工智能、语义网、软件工程、 生物医学信息学、图书馆学以及信息架构。

本体的构成要素分为：

- 个体（实例）：基础的或者说“底层的”对象。
- 类：集合（sets）、概念、对象类型或者说事物的种类。
- 属性：对象（和类）所可能具有的属性、特征、特性、特点和参数。
- 关系：类与个体之间的彼此关联所可能具有的方式。
- 函数术语：在声明语句当中，可用来代替具体术语的特定关系所构成的复杂结构。
- 约束（限制）：采取形式化方式所声明的，关于接受某项断言作为输入而必须成立的情况的描述。。
- 规则：用于描述可以依据特定形式的某项断言所能够得出的逻辑推论的，if-then（前因－后果）式语句形式的声明。
- 公理：采取特定逻辑形式的断言（包括规则在内）所共同构成的就是其本体在相应应用领域当中所描述的整个理论。这种定义有别于产生式语法和形式逻辑当中所说的“公理”。在这些学科当中，公理之中仅仅包括那些被断言为先验知识的声明。就这里的用法而言，“公理”之中还包括依据公理型声明所推导得出的理论。
- 事件 (哲学)：属性或关系的变化。

正是因为本体可以将一切事物进行规范化的描述，因此考虑利用本体来对传感器的结构和数据进行描述，也就是对传感器进行建模。

### 传感器本体建模

## 传感器建模标准

目前针对传感器建模的标准主要有以下几种：

- SensorML：开放地理空间联盟（OCG）所推出的面向传感器网络（SWE）数据标准中所推荐的传感器建模语言。
- IEEE 1451：IEEE 对传感器网络传输所定义的传感器描述规则
- Device Kit：对传感器硬件信息进行描述
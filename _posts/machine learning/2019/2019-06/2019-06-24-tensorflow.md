---
layout: post
title:  "TensorFlow 简介"
date:  2019-06-24
desc: "tensorflow 是 google 开发的机器学习软件库，本文将简单介绍 tensorflow 的相关概念"
keywords: "Tensorflow,简介"
categories: [MachineLearning]
tags: [tensorflow]
---
# TensorFlow

## TensorFlow 简介

TensorFlow 是一个采用数据流图（data flow graphs），用于数值计算的开源软件库。节点（Nodes）在图中表示数学操作，图中的线（edges）则表示在节点间相互联系的多维数据数组，即张量（tensor）。它灵活的架构让你可以在多种平台上展开计算，例如台式计算机中的一个或多个CPU（或GPU），服务器，移动设备等等。TensorFlow 最初由Google大脑小组（隶属于Google机器智能研究机构）的研究员和工程师们开发出来，用于机器学习和深度神经网络方面的研究，但这个系统的通用性使其也可广泛用于其他计算领域。

### 什么是数据流图（Data Flow Graph）?

数据流图用“结点”（nodes）和“线”(edges)的有向图来描述数学计算。“节点” 一般用来表示施加的数学操作，但也可以表示数据输入（feed in）的起点/输出（push out）的终点，或者是读取/写入持久变量（persistent variable）的终点。“线”表示“节点”之间的输入/输出关系。这些数据“线”可以输运“size可动态调整”的多维数据数组，即“张量”（tensor）。张量从图中流过的直观图像是这个工具取名为“Tensorflow”的原因。一旦输入端的所有张量准备好，节点将被分配到各种计算设备完成异步并行地执行运算。

![tensors_flowing](/assets/images/2019/2019-06/tensors_flowing.gif)

### TensorFlow的特征

- 高度的灵活性
TensorFlow 不是一个严格的“神经网络”库。只要你可以将你的计算表示为一个数据流图，你就可以使用Tensorflow。你来构建图，描写驱动计算的内部循环。我们提供了有用的工具来帮助你组装“子图”（常用于神经网络），当然用户也可以自己在Tensorflow基础上写自己的“上层库”。定义顺手好用的新复合操作和写一个python函数一样容易，而且也不用担心性能损耗。当然万一你发现找不到想要的底层数据操作，你也可以自己写一点c++代码来丰富底层的操作。

- 真正的可移植性（Portability）
Tensorflow 在CPU和GPU上运行，比如说可以运行在台式机、服务器、手机移动设备等等。想要在没有特殊硬件的前提下，在你的笔记本上跑一下机器学习的新想法？Tensorflow可以办到这点。准备将你的训练模型在多个CPU上规模化运算，又不想修改代码？Tensorflow可以办到这点。想要将你的训练好的模型作为产品的一部分用到手机app里？Tensorflow可以办到这点。你改变主意了，想要将你的模型作为云端服务运行在自己的服务器上，或者运行在Docker容器里？Tensorfow也能办到。Tensorflow就是这么拽 :)

- 将科研和产品联系在一起
过去如果要将科研中的机器学习想法用到产品中，需要大量的代码重写工作。那样的日子一去不复返了！在Google，科学家用Tensorflow尝试新的算法，产品团队则用Tensorflow来训练和使用计算模型，并直接提供给在线用户。使用Tensorflow可以让应用型研究者将想法迅速运用到产品中，也可以让学术性研究者更直接地彼此分享代码，从而提高科研产出率。

- 自动求微分
基于梯度的机器学习算法会受益于Tensorflow自动求微分的能力。作为Tensorflow用户，你只需要定义预测模型的结构，将这个结构和目标函数（objective function）结合在一起，并添加数据，Tensorflow将自动为你计算相关的微分导数。计算某个变量相对于其他变量的导数仅仅是通过扩展你的图来完成的，所以你能一直清楚看到究竟在发生什么。

- 多语言支持
Tensorflow 有一个合理的c++使用界面，也有一个易用的python使用界面来构建和执行你的graphs。你可以直接写python/c++程序，也可以用交互式的ipython界面来用Tensorflow尝试些想法，它可以帮你将笔记、代码、可视化等有条理地归置好。当然这仅仅是个起点——我们希望能鼓励你创造自己最喜欢的语言界面，比如Go，Java，Lua，Javascript，或者是R。

- 性能最优化
比如说你又一个32个CPU内核、4个GPU显卡的工作站，想要将你工作站的计算潜能全发挥出来？由于Tensorflow 给予了线程、队列、异步操作等以最佳的支持，Tensorflow 让你可以将你手边硬件的计算潜能全部发挥出来。你可以自由地将Tensorflow图中的计算元素分配到不同设备上，Tensorflow可以帮你管理好这些不同副本。

## TensorFlow 编程概念

### Hello World

以下代码块为“Hello World”TensorFlow 程序。

其中包含初始化代码，然后输出“Hello, world!”字符串常量。

```python
from __future__ import print_function

import tensorflow as tf
try:
  tf.contrib.eager.enable_eager_execution()
except ValueError:
  pass  # enable_eager_execution errors after its first call

tensor = tf.constant('Hello, world!')
tensor_value = tensor.numpy()
print(tensor_value)
```

## 基本概念介绍

TensorFlow 的名称源自张量，张量是任意维度的数组。借助 TensorFlow，您可以操控具有大量维度的张量。即便如此，在大多数情况下，只会使用以下一个或多个低维张量：

- **标量**：零维数组（零阶张量）。例如，\'Howdy\' 或 5
- **矢量**：一维数组（一阶张量）。例如，[2, 3, 5, 7, 11] 或 [5]
- **矩阵**：二维数组（二阶张量）。例如，[\[3.1, 8.2, 5.9][4.3, -2.7, 6.5]]

TensorFlow 指令会创建、销毁和操控张量。典型 TensorFlow 程序中的大多数代码行都是指令。

TensorFlow **图**（也称为计算图或数据流图）是一种图数据结构。很多 TensorFlow 程序由单个图构成，但是 TensorFlow 程序可以选择创建多个图。

图的节点是指令；图的边是张量。张量流经图，在每个节点由一个指令操控。一个指令的输出张量通常会变成后续指令的输入张量。TensorFlow 会实现延迟执行模型，意味着系统仅会根据相关节点的需求在需要时计算节点。

张量可以作为常量或变量存储在图中。您可能已经猜到，常量存储的是值不会发生更改的张量，而变量存储的是值会发生更改的张量。不过，您可能没有猜到的是，常量和变量都只是图中的一种指令。常量是始终会返回同一张量值的指令。变量是会返回分配给它的任何张量的指令。

要定义常量，请使用 tf.constant 指令，并传入它的值。例如：

```python
x = tf.constant([5.2])
```
同样，您可以创建如下变量：

```python
y = tf.Variable([5])
```

或者，您也可以先创建变量，然后再如下所示地分配一个值（注意：您始终需要指定一个默认值）：

```python
y = tf.Variable([0])
y = y.assign([5])
```

定义一些常量或变量后，您可以将它们与其他指令（如 tf.add）结合使用。在评估 tf.add 指令时，它会调用您的 tf.constant 或 tf.Variable 指令，以获取它们的值，然后返回一个包含这些值之和的新张量。

图必须在 TensorFlow 会话中运行，会话存储了它所运行的图的状态：

将 tf.Session() 作为会话：

```python
initialization = tf.global_variables_initializer()
print(y.eval())
```

在使用 tf.Variable 时，您必须在会话开始时调用 tf.global_variables_initializer，以明确初始化这些变量，如上所示。

注意：会话可以将图分发到多个机器上执行（假设程序在某个分布式计算框架上运行）。

### 总结

TensorFlow 编程本质上是一个两步流程：

- 将常量、变量和指令整合到一个图中。
- 在一个会话中评估这些常量、变量和指令。
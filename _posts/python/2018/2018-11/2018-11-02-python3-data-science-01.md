---
layout: post
title:  "Python3 数据科学（一）：环境搭建"
date:  2018-11-02
desc: "python3 数据科学分析与实战系列之一：搭建数据科学分析过程中所需要用到的开发环境"
keywords: "Python3,数据科学,实战,机器学习,数据挖掘,jupyterlab,jupyter"
categories: [Python]
tags: [python3,数据科学,jupyterlab]
---
# 数据科学环境搭建

在进行数据科学的分析过程中是需要使用到一些专门用来数据分析的 IDE 的，这里我们选择使用的是 JupyterLab，这是 Jupyter 正在开发过程中的一款全新的基于浏览器的数据分析 IDE，是属于下一代的 Jupyter notebook。目前最新的版本是 0.35.3，预计在18年底发布 1.0 版本，届时将会取代 Jupyter notebook。

## JupyterLab

[JupyterLab](https://jupyterlab.readthedocs.io/en/stable/) 是一个集成更多功能，高度可扩展的交互式数据分析开发环境，广泛用于数据科学、机器学习、教育等多个方面。

JupyterLab 是一个交互式的开发环境，其用于应对包含着 notebook、代码以及数据的工作场景。最为重要的是，JupyterLab 对于 Jupyter Notebook 有着完全的支持。

除此之外，JupyterLab 让您能够使用文本编辑器、终端、数据文件查看器以及其他自定义的内容。他们都将以标签的形式肩并肩地和 notebook 一起排列在工作区中。

![jupyterlab](https://jupyterlab.readthedocs.io/en/stable/_images/jupyterlab.png)

## 安装

可以通过很多种方法来安装 JupyterLab，可以通过 conda, pip, 或者 pipenv

这里我选择的是在独立的 python 虚拟环境中通过 pip来安装，这样可以保证电脑上不同项目不同版本的模块包之间不会相互影响。

首先在相对应的目录下创建一个独立虚拟的 python 运行环境：

```bash
python3 -m virtualenv env
```

接下来进入到虚拟环境中：

```bash
source env/bin/activate
```

之后命令界面之前便出现了 **(env)** 即表示已经进入到了虚拟环境中来。接下来便通过 pip 来安装 juputerlab

```bash
pip install jupyterlab
```

## 运行 JupyterLab

想要运行 jupyterlab 的话首先得需要进入到相对应的 python 虚拟运行环境中，之后在运行环境中输入：

```bash
jupyter notebook
```

启动状态如下：

![jupyter](/assets/images/2018/2018-11/01.png)

之后在浏览器中便自动打开了一个新的 jupyter notebook 窗口：

![jupyter notebook](/assets/images/2018/2018-11/02.png)

## Jupyter notebook 使用

可以简单的看一下 Jupyter notebook 的运行界面，其实就是一个在网页上打开的页面。

主要的功能包括：

- 文件：当前目录下的文件信息
- 运行：当前处于运行状态的 notebook
- 集群：notebook 集群（需要安装插件）
- 上传：从其他路径下将文件拷贝到当前工作目录下
- 新建：创建新的 notebook 文件或文件夹

对于我们需要进行的数据分析来说，我们需要新建一个 python3 的 notebook

![jupyter notebook](/assets/images/2018/2018-11/03.png)

新建之后，点击未命名文件即可更改文件的名称。

当前界面的主要菜单也都是中文显示的，可以很简单的就学会如何使用，接下来让我们来写一个简单的 Hello World 吧。

在 In[1] 的地方来输入输入对应的 python3 代码，按住 shift+enter来执行该代码（也可以点击执行按钮来执行）：

![jupyter notebook](/assets/images/2018/2018-11/04.png)

以上，便是一个完整的数据科学开发环境的搭建过程。接下来，让我们来开始学习处理数据的几个重要工具吧。

![](http://ww4.sinaimg.cn/large/9150e4e5ly1fi5tmg050ag206o06o0st.gif)
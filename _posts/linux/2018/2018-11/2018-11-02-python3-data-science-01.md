---
layout: post
title:  "Ubuntu 18.04 服务器安装 JupyterLab"
date:  2018-11-02
desc: "搭建数据科学分析过程中所需要用到的开发环境 JupyterLab"
keywords: "Python3,数据科学,实战,机器学习,数据挖掘,jupyterlab,jupyter"
categories: [Linux]
tags: [python3,数据科学,jupyterlab]
---
# 数据科学环境搭建

在进行数据科学的分析过程中是需要使用到一些专门用来数据分析的 IDE 的，这里我们选择使用的是 JupyterLab，这是 Jupyter 正在开发过程中的一款全新的基于浏览器的数据分析 IDE，是属于下一代的 Jupyter notebook。

## JupyterLab

[JupyterLab](https://jupyterlab.readthedocs.io/en/stable/) 是一个集成更多功能，高度可扩展的交互式数据分析开发环境，广泛用于数据科学、机器学习、教育等多个方面。

JupyterLab 是一个交互式的开发环境，其用于应对包含着 notebook、代码以及数据的工作场景。最为重要的是，JupyterLab 对于 Jupyter Notebook 有着完全的支持。

除此之外，JupyterLab 让您能够使用文本编辑器、终端、数据文件查看器以及其他自定义的内容。他们都将以标签的形式肩并肩地和 notebook 一起排列在工作区中。

![jupyterlab](https://jupyterlab.readthedocs.io/en/stable/_images/jupyterlab.png)

## 安装

可以通过很多种方法来安装 JupyterLab，可以通过 conda, pip, 或者 pipenv

这里我选择的是通过 pip 来安装 juputerlab

```bash
pip install jupyterlab
```

## 配置 JupyterLab

注意：以下命令是将 JupyterLab 安装在服务器上的，本机电脑安装的话并不需要。

生成登陆密码：

```python
(env) wx@ubuntu:~$ ipython3

In [1]: from notebook.auth import passwd                       

In [2]: passwd()                                               
Enter password: 
Verify password: 
Out[2]: 'sha1:a68b5838f88b:f6f9fb4340dd081a4d06a5f9f36f841ffa8ae0c6'
```

生成对应的配置文件：

```sh
jupyter lab --generate-config
```

注意终端上会出现对应的配置文件的路径，接下来使用 vim 打开它。找到下面这几行文件，删掉注释并修改成如下格式：

```
c.NotebookApp.allow_root = True
c.NotebookApp.ip = '0.0.0.0'
c.NotebookApp.open_browser = False
c.NotebookApp.password = u'sha1:a68b5838f88b:f6f9fb4340dd081a4d06a5f9f36f841ffa8ae0c6'
```

## 运行 JupyterLab

想要运行 jupyterlab 的话首先得需要进入到相对应的 python 虚拟运行环境中，之后在运行环境中输入：

```bash
# nohup表示ssh终端断开后仍然运行
# &表示允许后台运行
nohup jupyter lab &
```
运行成功之后在该网络上的随意一台电脑上输入 **ip:8888** 便可以访问到 jupyterlab 上。
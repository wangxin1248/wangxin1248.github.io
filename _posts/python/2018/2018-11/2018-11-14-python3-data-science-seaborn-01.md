---
layout: post
title:  "Python3 数据科学（五）：seaborn"
date:  2018-11-14
desc: "python3 数据科学分析与实战系列之五：数据处理分析必备工具之 seaborn 入门介绍"
keywords: "Python3,数据科学,实战,seaborn,数据挖掘,jupyterlab,jupyter"
categories: [Python]
tags: [python3,数据科学,seaborn]
---
# seaborn 入门

seaborn 是一个基于 matplotlib 的 Python 数据可视化库。它提供了一个高级界面，用于绘制有吸引力且信息丰富的统计图形。目前最新的版本是 v0.9.0

![logo](https://seaborn.pydata.org/_static/horizontal_boxplot_thumb.png?v=0.9.0)

当然，还是那句话：“学习最好的方式是模仿”。我们的学习可以按照 seaborn 官方提供的 [示例](https://seaborn.pydata.org/examples/index.html)

数据分析的好不好关键取决于数据展示的好不好，数据展示的好不好关键取决于图画的好不好，图画的好不好关键取决于颜色选的对不对。而 seaborn 便提供给了我们一系列丰富的颜色来帮助我们的图画出更好看。

## seaborn 安装

安装可以直接使用 pip 来进行安装

```bash
pip install seaborn
```

## seaborn 使用

首先得导入 seaborn 库以及一些相关的库

```python
import seaborn as sns
import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl

# 不用使用show方法便可以直接显示当前的绘图
%matplotlib inline
```
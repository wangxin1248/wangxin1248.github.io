---
layout: post
title:  "Python3 数据科学（七）：seaborn（三）：高级绘图"
date:  2018-11-28
desc: "python3 数据科学分析与实战系列之七：数据处理分析必备工具之 seaborn 高级绘图方法介绍"
keywords: "Python3,数据科学,实战,seaborn,数据挖掘,jupyterlab,jupyter,FacetGrid"
categories: [Python]
tags: [python3,数据科学,seaborn]
---
# seaborn 高级绘图

## FacetGrid

FacetGrid 是 seaborn 库当中用来绘制数据集当中的某些子集的方法，利用该方法可以很轻松的绘制出数据集当中子集的情形。

首先先来导入所需的库

```python
%matplotlib inline
import numpy as np
import pandas as pd
import seaborn as sns
from scipy import stats
import matplotlib as mpl
import matplotlib.pyplot as plt

sns.set(style="ticks")
np.random.seed(sum(map(ord, "axis_grids")))
```

导入所需要展示的数据集：

```python
tips = sns.load_dataset("tips")
tips.head()
```

显示结果：

![result](/assets/images/2018/2018-11/71.png)

我们所展示的数据集还是上次所使用的 tips 数据集。

接下来先创建一个空白的 FacetGrid 对象，传入数据集和想要表示的子数据集名称

```python
g = sns.FacetGrid(tips, col="time")
```

- tips：数据集
- col：想要表示的数据集的子集

显示结果：

![result](/assets/images/2018/2018-11/72.png)

这样创建出来的对象只是表明的所要会绘制的数据集以及子数据集，而真正相会绘制出来图形是需要调用 **map**方法。并且需要指定所要绘制的曲线类型。

### 直方图绘制

接下来简单的绘制 tips 数据集中小费和吃饭时间的直方图，并且要区分不同的吃饭时间小费的情况：

```python
g = sns.FacetGrid(tips, col="time", size=4)
g.map(plt.hist, "tip")
```
map 函数中所对应的属性：

- plt.hist：想要绘制的图形类型
- "tip"：x轴数据索引

显示结果：

![result](/assets/images/2018/2018-11/73.png)

### 散点图绘制

使用 FacetGrid 也可以很轻松的绘制出不同子集之间的散点图：

```python
g = sns.FacetGrid(tips, col="sex", hue="smoker", size=4)
# alpha表示透明度
g.map(plt.scatter, "total_bill", "tip", alpha=0.7)
# 添加图示说明
g.add_legend()
```

显示结果：

![result](/assets/images/2018/2018-11/74.png)

当然，FacetGrid 也支持一些绘图的高级操作：

```python
# 指定现实的调色板
pal = dict(Lunch="seagreen", Dinner="gray")
g = sns.FacetGrid(tips, hue="time", palette=pal, size=6)
# s表示点的大小，linewidth线宽
g.map(plt.scatter, "total_bill", "tip", s=70, alpha=.7)
# 添加图示说明
g.add_legend();
```

显示结果：

![result](/assets/images/2018/2018-11/75.png)


```python
g = sns.FacetGrid(tips, hue="sex", palette="Set1", size=5, hue_kws={"marker": ["^", "v"]})
g.map(plt.scatter, "total_bill", "tip", s=100, linewidth=.5, edgecolor="white")
g.add_legend();
```

显示结果：

![result](/assets/images/2018/2018-11/76.png)

在创建 FacetGrid 的时候不仅可以指定数据的某一子集为列，也可以指定数据的某一子集为行：

```python
g = sns.FacetGrid(tips, row="sex", col="smoker", margin_titles=True, size=2.5)

g.map(plt.scatter, "total_bill", "tip", color="#334488", edgecolor="white", lw=.5);
```

显示结果：

![result](/assets/images/2018/2018-11/77.png)

### 回归图绘制

回归图绘制 margin_titles=True 表示是否在图旁边显示标题，fit_reg 表示是否显示出回归曲线

```python
g = sns.FacetGrid(tips, col="time", row="smoker", margin_titles=True, size=4)
g.map(sns.regplot, "size", "total_bill", color=".1", fit_reg=False, x_jitter=.1)
```

显示结果：

![result](/assets/images/2018/2018-11/82.png)

### 柱状图绘制


```python
g = sns.FacetGrid(tips, col="day", size=5, aspect=.5)
g.map(sns.barplot, "sex", "total_bill");
```

显示结果：

![result](/assets/images/2018/2018-11/83.png)

### 柱状图绘制


```python
g = sns.FacetGrid(tips, row="day",size=1.7, aspect=4)
g.map(sns.boxplot, "total_bill");
```

显示结果：

![result](/assets/images/2018/2018-11/84.png)

## PairGrid

PairGrid 是将数据集中的成对属性进行组合展示

以鸢尾花的数据集为例：

```python
iris = sns.load_dataset("iris")
g = sns.PairGrid(iris)
g.map(plt.scatter);
```

显示结果：

![result](/assets/images/2018/2018-11/78.png)

而且在显示的过程中还可以指定所显示的曲线类型以及中间对角线上所显示的曲线类型：

```python
g = sns.PairGrid(iris)
# 对角线显示的曲线样式
g.map_diag(plt.hist)
# 非对角线显示的曲线样式
g.map_offdiag(plt.scatter);
```

显示结果：

![result](/assets/images/2018/2018-11/79.png)

当然，也可以指定数据集中所需要对比的具体属性,使用 **hue**参数来指定：

```python
g = sns.PairGrid(iris, hue="species")
g.map_diag(plt.hist)
g.map_offdiag(plt.scatter)
g.add_legend();
```

显示结果：

![result](/assets/images/2018/2018-11/80.png)

还可以传入指定的调色板来显示出比较好看的图形：

```python
g = sns.PairGrid(tips, hue="size", palette="GnBu_d", size=4)
g.map(plt.scatter, s=70, edgecolor="white")
g.add_legend();
```

显示结果：

![result](/assets/images/2018/2018-11/81.png)

## heatmap

heatmap 是热力图，可以用来显示数据的集中分布区域。

这里使用飞机的乘客数据集来进行展示，首先导入数据集：

```python
flights = sns.load_dataset("flights")
flights.head()
```

显示结果：

![result](/assets/images/2018/2018-11/85.png)

我们将数据集当中每一年中各个月的乘客人数来作为一个二维矩阵数据：

```python
flights = flights.pivot("month", "year", "passengers")
print (flights)
```

显示结果：

![result](/assets/images/2018/2018-11/86.png)

我们创建一个热力图的实例化对象，传入所需要展示的数据：

```python
ax = sns.heatmap(flights)
```
显示结果：

![result](/assets/images/2018/2018-11/87.png)

上图便展示了随着年份的增长，在每个月之间乘客乘坐飞机的人数变化，可以根据右边的 colorbar 可以看出不同颜色所代表的数字。

### 填入具体数字

还可以将将具体的数值填入到图中，注意得指定 fmt 参数为 d，要不然会出现科学计数法表示的数字：

```python
ax = sns.heatmap(flights, annot=True,fmt="d")
```
显示结果：

![result](/assets/images/2018/2018-11/88.png)

### 边框加空格

```python
ax = sns.heatmap(flights, linewidths=.5))
```
显示结果：

![result](/assets/images/2018/2018-11/89.png)

### 改变颜色

```python
ax = sns.heatmap(flights, cmap="YlGnBu")
```
显示结果：

![result](/assets/images/2018/2018-11/90.png)

### 不显示colorbar

```python
ax = sns.heatmap(flights, cbar=False)
```
显示结果：

![result](/assets/images/2018/2018-11/91.png)

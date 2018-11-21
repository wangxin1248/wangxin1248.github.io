---
layout: post
title:  "Python3 数据科学（六）：seaborn（二）：高级绘图"
date:  2018-11-21
desc: "python3 数据科学分析与实战系列之六：数据处理分析必备工具之 seaborn 高级绘图介绍"
keywords: "Python3,数据科学,实战,seaborn,数据挖掘,jupyterlab,jupyter"
categories: [Python]
tags: [python3,数据科学,seaborn]
---
# seaborn 高级绘图

上节介绍了一些简单的 seaborn 的颜色和样式，这节让我们来看一下 seaborn 中一些常用的数据的绘图操作。

首先进行一些常用库的导入操作：

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats,integrate
```

##  单变量数据

有时候对于一些数据来说，有时可能得需要对数据的每一个属性进行分析，这种情况称之为单变量分析。

而这种情况通常是使用 **直方图** 来进行展示


首先使用 numpy 中的 random 来创建一些随机的符合高斯分布的数据：

```python
x = np.random.normal(size=100)
```

```python
sns.distplot(x, kde=False)
```

- x：表示所需要绘制的数据集
- kde：是否绘制高斯核密度估计，默认为 True

显示结果：

![result](/assets/images/2018/2018-11/39.png)

当然也可以显示高斯核密度，并且可以指定 bins 来将数据显示为多少个柱

```python
sns.distplot(x, bins=20)
```

- x：表示所需要绘制的数据集
- bins：数据显示为多少个柱

显示结果：

![result](/assets/images/2018/2018-11/40.png)

当然对于一些符合某种分布的数据来说，也可以对其进行相应的数据拟合操作，只需要指定 fit 参数

```python
# 生成 gamma 分布数据
x = np.random.gamma(6, size=200)
# 使用fit 属性来拟合 gamma 曲线
sns.distplot(x, kde=False, fit=stats.gamma)
```

- x：表示所需要绘制的数据集
- kde：是否绘制高斯核密度估计，默认为 True
- fit：对数据进行何种拟合操作

显示结果：

![result](/assets/images/2018/2018-11/41.png)

## 两个变量分析

有时需要对数据集中的两个属性之间进行分析，这时最好使用散点图和回归图来进行分析。

## 散点图 jointplot

首先我们先创建一些相关的数据，这是指定均值和协方差使用 **np.random.multivariate_normal**来创建200个服从正态分布的数据，并将其转变为 DataFrame 格式的数据。

```python
mean, cov = [0, 1], [(1, .5), (.5, 1)]
data = np.random.multivariate_normal(mean, cov, 200)
df = pd.DataFrame(data, columns=['x', 'y'])
df
```

![result](/assets/images/2018/2018-11/42.png)

接下来使用散点图来绘制这些数据：

```python
sns.jointplot(x='x', y='y', data=df)
```

- x：x 轴所需展示的数据，传入字符串的话表示数据标签，还需传入 data 集
- y：y 轴所需展示的数据，传入字符串的话表示数据标签，还需传入 data 集
- data：数据集

显示结果：

![result](/assets/images/2018/2018-11/43.png)

上面的这种散点图的绘制方式是适合于数据量比较少的情况下使用，而对于数据量比较多的时候就得使用一些特殊的散点图了，改变散点图的格式使用的是 **kind**参数。

```python
# 创建1000个数据
x, y = np.random.multivariate_normal(mean, cov, 1000).T

sns.jointplot(x=x, y=y, kind='hex')
```
- x：x 轴所需展示的数据
- y：y 轴所需展示的数据
- kind：散点图格式，kind : { “scatter” | “reg” | “resid” | “kde” | “hex” }

显示结果：

![result](/assets/images/2018/2018-11/44.png)

### 回归图 

回归图主要有两种：

- regplot
- lmplot

regplot 是基本的回归图绘制方法，而 lmplot 则提供了一些更高级操作。在分析数据时可以根据不同的需要来使用。

首先回归分析所使用的数据集为 [tips](https://github.com/mwaskom/seaborn-data/blob/master/tips.csv)，它已经内置到了 seaborn 中，可以直接使用。

```python
tips = sns.load_dataset('tips')
```

简单查看下这些数据：

```python
tips.head()
```

显示结果：

![result](/assets/images/2018/2018-11/46.png)

数据分别是：

- total_bill：总花费金额
- tip：小费金额
- sex：性别
- smoker：是否吸烟
- day：星期日期
- time：时间，中午还是晚上
- size：吃饭人数

接下来针对这些数据中的属性来绘制回归图

#### regplot

```python
sns.regplot(x='total_bill', y='tip', data=tips)
```

显示结果：

![result](/assets/images/2018/2018-11/47.png)

上图就展示吃饭总的花费和小费之间的关系。

再来看一下吃饭的人数和给小费的关系：

```python
sns.regplot(x='size', y='tip', data=tips)
```

显示结果：

![result](/assets/images/2018/2018-11/48.png)

由于 size 数据是固定的数字，来做回归分析不是很好，因此，可以将数据进行一定的抖动，抖动可以分为x轴和y轴

```python
sns.regplot(x='size', y='tip', data=tips, x_jitter=0.05)
```

- x_jitter：左右抖动 0.05 的距离

显示结果：

![result](/assets/images/2018/2018-11/49.png)

#### lmplot

lmplot 也可以用来绘制回归分析的曲线，而且还拥有较多的可选参数，可以用来绘制出更复杂的图像

#### hue

hue 属性是关注数据集中的变量

```python
sns.lmplot(x='total_bill', y='tip', hue='smoker', data=tips)
```

显示结果：

![result](/assets/images/2018/2018-11/50.png)

上图便展示了 total_bill 和 tip 中是否吸烟对结果的影响。

还可以指定画图的样式和格式

- markers：点的样式
- palette：调色板名称

```python
sns.lmplot(x="total_bill", y="tip", hue="smoker", data=tips,
           markers=["o", "x"], palette="Set1");
```

显示结果：

![result](/assets/images/2018/2018-11/51.png)

#### col

还可以使用 col 参数来根据某些属性的取值来将图像分开成不同的列来展示

```python
sns.lmplot(x='total_bill', y='tip', hue='smoker', col='time', data=tips)
```

显示结果：

![result](/assets/images/2018/2018-11/52.png)

#### row

还可以使用 row 参数来根据某些属性的取值来将图像分开成不同的行来展示

```python
sns.lmplot(x='total_bill', y='tip', hue='smoker', col='time', row='sex', data=tips)
```

显示结果：

![result](/assets/images/2018/2018-11/53.png)

还可以将数据分别进行展示

- col_wrap：一行展示几个图形，
- size：图形的大小

```python
sns.lmplot(x="total_bill", y="tip", col="day", data=tips,
           col_wrap=2, size=4);
```

显示结果：

![result](/assets/images/2018/2018-11/54.png)

## 多变量分析

### 多变量图 pairplot

我们对鸢尾花的数据集中各个属性之间的关系进行展示：

```python
# 加载鸢尾花数据集
iris = sns.load_dataset("iris")
# pairplot 绘制数据集中的多个属性之间的关系。
sns.pairplot(iris)
```

显示结果：

![result](/assets/images/2018/2018-11/45.png)

## 分类数据

很多情况下我们所要分析的数据中都存在某些按照类别划分的数据，对于这种数据进行分析就不能使用之前的回归数据的分析方法，接下来介绍主要用于分类数据绘制的几种图形：

- 分布散点图：stripplot、swarmplot
- 盒图：boxplot
- 小提琴图：violinplot
- 条形图：barplot
- 点图：pointplot
- 多层面板分类图：factorplot

接下来分别介绍一下他们的主要用法。

### 分布散点图绘制

```python
sns.stripplot(x='day', y='total_bill', data=tips)
```

我们将数据按每一天进行分类，总共分成4类，接下来分别显示在每一天中吃饭所花费费用的一个情况

在分布散点图当中默认有一个参数是 **jitter=True** 即抖动数据,所以数据的显示结果为：

显示结果：

![result](/assets/images/2018/2018-11/55.png)

相对应的，我们可以查看下未进行抖动的数据的分布情况：

```python
sns.stripplot(x='day', y='total_bill', data=tips, jitter=False)
```

显示结果：

![result](/assets/images/2018/2018-11/56.png)

还有一种分布散点图是 **swarmplot**

```python
sns.swarmplot(x='day', y='total_bill', data=tips)
```

显示结果：

![result](/assets/images/2018/2018-11/57.png)

可以看出结果更像是一颗圣诞树的样子，这种方式展示的数据更加好看一点，可以根据个人喜好来选择。

还可以使用 **hue** 参数来关注一些重点的数据

```python
sns.swarmplot(x='day', y='total_bill', hue='sex', data=tips)
```

显示结果：

![result](/assets/images/2018/2018-11/58.png)

还可以将 x 和 y 数据互换，使图像横着显示

```python
sns.swarmplot(y='day', x='total_bill', hue='sex', data=tips)
```

显示结果：

![result](/assets/images/2018/2018-11/59.png)

### 盒图

- IQR 即统计学概念四分位距，第 1/4 位与第 3/4 位之间的距离
- N = 1.5IQR
- 如果一个值 >Q3+N 或 <Ｑ1-N,则为离群点

```python
sns.boxplot(x='day', y='total_bill', hue='time', data=tips)
```

显示结果：

![result](/assets/images/2018/2018-11/60.png)

对于一些宽型数据来说可以使用 **orient** 参数来进行显示

```python
sns.boxplot(data=iris,orient="h")
```

显示结果：

![result](/assets/images/2018/2018-11/61.png)

### 小提琴图

- 使用核密度估计来更好地描述值的分布。
- 小提琴内还显示了箱体四分位数和晶须值。
- 由于小提琴使用KDE，还有一些其他可以调整的参数，相对于简单的boxplot增加了一些复杂性

```python
sns.violinplot(x='day', y='total_bill', hue='time', data=tips)
```

显示结果：

![result](/assets/images/2018/2018-11/62.png)

使用 **split**参数来将 hue 所指定的数据对应展示,注意只能是hue具有 **两个属性**的时候使用

```python
sns.violinplot(x='day', y='total_bill', hue='sex', data=tips, split=True)
```

显示结果：

![result](/assets/images/2018/2018-11/63.png)

### 条形图

- 显示值的集中趋势可以用条形图

```python
# 加载所需的数据集
titanic = sns.load_dataset("titanic")

sns.barplot(x="sex", y="survived", hue="class", data=titanic);
```

显示结果：

![result](/assets/images/2018/2018-11/64.png)

### 点图

- 点图可以更好的显示数据的变化

```python
sns.pointplot(x="sex", y="survived", hue="class", data=titanic);
```

显示结果：

![result](/assets/images/2018/2018-11/65.png)

还可以对图像的格式颜色样式进行单独设置来画出更好看的图形

```python
sns.pointplot(x="class", y="survived", hue="sex", data=titanic,
              palette={"male": "g", "female": "m"},
              markers=["^", "o"], 
              linestyles=["-", "--"]);
```

- palette：调色板
- markers：点的样式
- linestyles：曲线样式

显示结果：

![result](/assets/images/2018/2018-11/66.png)

### 多层面板分类图

使用这种图可以实现之前多种类型图像的显示

```python
seaborn.factorplot(x=None, y=None, hue=None, data=None, row=None, col=None, col_wrap=None, estimator=, ci=95, n_boot=1000, units=None, order=None, hue_order=None, row_order=None, col_order=None, kind='point', size=4, aspect=1, orient=None, color=None, palette=None, legend=True, legend_out=True, sharex=True, sharey=True, margin_titles=False, facet_kws=None, **kwargs)
```

### Parameters： ###

* x,y,hue 数据集变量 变量名
* date 数据集 数据集名
* row,col 更多分类变量进行平铺显示 变量名
* col_wrap 每行的最高平铺数 整数
* estimator 在每个分类中进行矢量到标量的映射 矢量
* ci 置信区间 浮点数或None
* n_boot 计算置信区间时使用的引导迭代次数 整数
* units 采样单元的标识符，用于执行多级引导和重复测量设计 数据变量或向量数据
* order, hue_order 对应排序列表 字符串列表
* row_order, col_order 对应排序列表 字符串列表
* kind : 可选：point 默认, bar 柱形图, count 频次, box 箱体, violin 提琴, strip 散点，swarm 分散点
size 每个面的高度（英寸） 标量
aspect 纵横比 标量
orient 方向 "v"/"h"
color 颜色 matplotlib颜色
palette 调色板 seaborn颜色色板或字典
legend hue的信息面板 True/False
legend_out 是否扩展图形，并将信息框绘制在中心右边 True/False
share{x,y} 共享轴线 True/False

其默认的显示风格为：

```python
sns.factorplot(x="day", y="total_bill", hue="smoker", data=tips)
```

显示结果：

![result](/assets/images/2018/2018-11/67.png)

但是给其设置不同的 kind 参数，便可以绘制指定类型的曲线：

```python
sns.factorplot(x="day", y="total_bill", hue="smoker", data=tips, kind="bar")
```

显示结果：

![result](/assets/images/2018/2018-11/68.png)

```python
sns.factorplot(x="day", y="total_bill", hue="smoker",
               col="time", data=tips, kind="swarm")
```

显示结果：

![result](/assets/images/2018/2018-11/69.png)

```python
sns.factorplot(x="time", y="total_bill", hue="smoker",
               col="day", data=tips, kind="box")
```

显示结果：

![result](/assets/images/2018/2018-11/70.png)
---
layout: post
title:  "Python3 数据科学（五）：seaborn（一）：基础操作"
date:  2018-11-14
desc: "python3 数据科学分析与实战系列之五：数据处理分析必备工具之 seaborn 入门介绍"
keywords: "Python3,数据科学,实战,seaborn,数据挖掘,jupyterlab,jupyter"
categories: [Python]
tags: [python3,数据科学,seaborn]
---
# seaborn 入门

seaborn 是一个基于 matplotlib 的 Python 数据可视化库。它提供了一个高级界面，用于绘制有吸引力且信息丰富的统计图形。目前最新的版本是 v0.9.0

![result](/assets/images/2018/2018-11/27.png)

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

# 不需要调用show方法便可以直接显示当前的绘图
%matplotlib inline
```

seaborn 是做为 matplotlib 的补充存在的，主要的画图操作还是由 matplotlib 来实现的，而 seaborn 主要是给画出的图像设置一些样式。

### 样式

seaborn 所提供的主题风格主要有五种：

- darkgrid
- whitegrid
- dark
- white
- ticks

使用方式是在调用 set_style（）方法中进行传入

接下来创建一个简单的画图函数来画出几条不同的 sin 函数：

```python
def sinplot(flip=1):
    # 创造100个随机数据
    x = np.linspace(0, 14, 100)
    # 画出六条图像
    for i in range(1,7):
        plt.plot(x, np.sin(x + i * .5) * (7 - i) * flip)
```

我们来看一下显示的效果：

```python
sinplot()
```

显示结果：

![result](/assets/images/2018/2018-11/28.png)

接下来使用 seaborn 来显示图像，使用的方式很简单，直接调用 set 方法，这样表示使用默认的主题风格，之后再次进行图像显示：

```python
sns.set()
sinplot()
```

显示结果：

![result](/assets/images/2018/2018-11/29.png)

接下来在看一下其他的几种风格：

```python
sns.set_style("whitegrid")
sinplot()
```

显示结果：

![result](/assets/images/2018/2018-11/30.png)

```python
sns.set_style("dark")
sinplot()
```

显示结果：

![result](/assets/images/2018/2018-11/31.png)

```python
sns.set_style("white")
sinplot()
```

显示结果：

![result](/assets/images/2018/2018-11/32.png)

除了设置 style 样式之外还可以设置 context 参数，这样 seaboorn 会根据你传入的 context 参数来自动的绘制出符合要求的图像。

context 中可以使用的参数有：

- paper
- talk
- poster
- notebook

这样，在绘图的时候，seaborn 便会将图像自动调整为符合这些参数的形式。

### 颜色

#### 色板

颜色在绘图中非常重要，因此 seaborn 专门提供了调色板 color_palette 来提供一些比较好看的颜色。

color_palette() 允许传入任何 Matplotlib 所支持的颜色，不传入参数时表示使用默认颜色。并且还可以调用 set_palette() 方法来设置所有图的颜色。

一下的代码便是将默认的 palette 中的颜色显示出来：

```python
sns.palplot(sns.color_palette())
```

显示结果：

![result](/assets/images/2018/2018-11/33.png)

当你有多个分类要区分时，最简单的方法就是在一个圆形的颜色空间中画出均匀间隔的颜色(这样的色调会保持亮度和饱和度不变)。这是大多数的当他们需要使用比当前默认颜色循环中设置的颜色更多时的默认方案。

最常用的方法是使用 **hls** 的颜色空间，这是 RGB 值的一个简单转换。

```python
sns.palplot(sns.color_palette('hls', 12))
```

显示结果：

![result](/assets/images/2018/2018-11/34.png)

其中，hls_palette() 函数来控制颜色的亮度和饱和

- l-亮度 lightness
- s-饱和 saturation

例如，我们来画一个简单的具有12列数据的箱图：

```python
data = np.random.normal(size=(20, 12)) + np.arange(12) / 2
sns.boxplot(data=data,palette=sns.color_palette("hls", 12))
```

显示结果：

![result](/assets/images/2018/2018-11/35.png)

#### 连续色板

色彩随数据变换，比如数据越来越重要则颜色越来越深。要实现这种效果只需要在 color_palette 函数中传入想要实现渐变效果的颜色即可。

```python
sns.palplot(sns.color_palette("Blues"))
```

显示结果：

![result](/assets/images/2018/2018-11/36.png)

当然，颜色也可以从深到浅进行变化，只需要在对应颜色的后面加入 **_r**即可

```python
sns.palplot(sns.color_palette('Blues_r'))
```

显示结果：

![result](/assets/images/2018/2018-11/37.png)

## 总结

关于 seaborn 的使用还得在日常工作学习中在进行深入了解，这里只是给出了一个简单入门介绍，还是需要多多练习。
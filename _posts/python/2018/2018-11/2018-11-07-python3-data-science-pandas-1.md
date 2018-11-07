---
layout: post
title:  "Python3 数据科学（三）：Pandas"
date:  2018-11-07
desc: "python3 数据科学分析与实战系列之三：数据处理分析工具 Pandas 入门介绍"
keywords: "Python3,数据科学,实战,pandas,数据挖掘,jupyterlab,jupyter"
categories: [Python]
tags: [python3,数据科学,pandas]
---

# Pandas 入门

与 numpy 库专门处理矩阵运算不同的是 pandas 是一个进行数据处理的库。pandas 在 numpy 的基础上进行了相应的封装，专门用来处理数据，进行数据的预处理操作。

![pandas](http://codingpy.com/static/thumbnails/landscape-1454612525-baby-pandas.jpg)


## 导入 Pandas


```python
import pandas as pd# 标准写法
```

这是导入 pandas 的标准方法。我们不想一直写 pandas 的全名，但是保证代码的简洁和避免命名冲突都很重要，所以折中使用 pd 。如果你去看别人使用 pandas 的代码，就会看到这种导入方式。

## Pandas 中的数据类型

Pandas 基于两种数据类型，series 和 dataframe。

series 是一种一维的数据类型，其中的每个元素都有各自的标签。可以把它当作一个由带标签的元素组成的 numpy 数组。标签可以是数字或者字符。

dataframe 是一个二维的、表格型的数据结构。Pandas 的 dataframe 可以储存许多不同类型的数据，并且每个轴都有标签。你可以把它当作一个 series 的字典。

## 将数据导入 Pandas

在对数据进行修改、探索和分析之前，我们得先导入数据。

这里我鼓励你去找到自己感兴趣的数据并用来练习，一些公开的数据集可以在 Kaggle 上找到。

这里我使用的是食物营养信息数据集，可以从这里下载 [food_info.csv](assets/data/food_info.csv)


```python
food_info = pd.read_csv('data/food_info.csv')
```

这里我们从 csv 文件里导入了数据，并储存在 dataframe 中。这一步非常简单，你只需要调用 read_csv 然后将文件的路径传进去就行了。

## 探索和分析数据

现在数据已经导入到 Pandas 了，我们也许想看一眼数据来得到一些基本信息，以便在真正开始探索之前找到一些方向。

查看前 x 行的数据：


```python
food_info.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>NDB_No</th>
      <th>Shrt_Desc</th>
      <th>Water_(g)</th>
      <th>Energ_Kcal</th>
      <th>Protein_(g)</th>
      <th>Lipid_Tot_(g)</th>
      <th>Ash_(g)</th>
      <th>Carbohydrt_(g)</th>
      <th>Fiber_TD_(g)</th>
      <th>Sugar_Tot_(g)</th>
      <th>...</th>
      <th>Vit_A_IU</th>
      <th>Vit_A_RAE</th>
      <th>Vit_E_(mg)</th>
      <th>Vit_D_mcg</th>
      <th>Vit_D_IU</th>
      <th>Vit_K_(mcg)</th>
      <th>FA_Sat_(g)</th>
      <th>FA_Mono_(g)</th>
      <th>FA_Poly_(g)</th>
      <th>Cholestrl_(mg)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1001</td>
      <td>BUTTER WITH SALT</td>
      <td>15.87</td>
      <td>717</td>
      <td>0.85</td>
      <td>81.11</td>
      <td>2.11</td>
      <td>0.06</td>
      <td>0.0</td>
      <td>0.06</td>
      <td>...</td>
      <td>2499.0</td>
      <td>684.0</td>
      <td>2.32</td>
      <td>1.5</td>
      <td>60.0</td>
      <td>7.0</td>
      <td>51.368</td>
      <td>21.021</td>
      <td>3.043</td>
      <td>215.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1002</td>
      <td>BUTTER WHIPPED WITH SALT</td>
      <td>15.87</td>
      <td>717</td>
      <td>0.85</td>
      <td>81.11</td>
      <td>2.11</td>
      <td>0.06</td>
      <td>0.0</td>
      <td>0.06</td>
      <td>...</td>
      <td>2499.0</td>
      <td>684.0</td>
      <td>2.32</td>
      <td>1.5</td>
      <td>60.0</td>
      <td>7.0</td>
      <td>50.489</td>
      <td>23.426</td>
      <td>3.012</td>
      <td>219.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1003</td>
      <td>BUTTER OIL ANHYDROUS</td>
      <td>0.24</td>
      <td>876</td>
      <td>0.28</td>
      <td>99.48</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.0</td>
      <td>0.00</td>
      <td>...</td>
      <td>3069.0</td>
      <td>840.0</td>
      <td>2.80</td>
      <td>1.8</td>
      <td>73.0</td>
      <td>8.6</td>
      <td>61.924</td>
      <td>28.732</td>
      <td>3.694</td>
      <td>256.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1004</td>
      <td>CHEESE BLUE</td>
      <td>42.41</td>
      <td>353</td>
      <td>21.40</td>
      <td>28.74</td>
      <td>5.11</td>
      <td>2.34</td>
      <td>0.0</td>
      <td>0.50</td>
      <td>...</td>
      <td>721.0</td>
      <td>198.0</td>
      <td>0.25</td>
      <td>0.5</td>
      <td>21.0</td>
      <td>2.4</td>
      <td>18.669</td>
      <td>7.778</td>
      <td>0.800</td>
      <td>75.0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1005</td>
      <td>CHEESE BRICK</td>
      <td>41.11</td>
      <td>371</td>
      <td>23.24</td>
      <td>29.68</td>
      <td>3.18</td>
      <td>2.79</td>
      <td>0.0</td>
      <td>0.51</td>
      <td>...</td>
      <td>1080.0</td>
      <td>292.0</td>
      <td>0.26</td>
      <td>0.5</td>
      <td>22.0</td>
      <td>2.5</td>
      <td>18.764</td>
      <td>8.598</td>
      <td>0.784</td>
      <td>94.0</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 36 columns</p>
</div>



我们只需要调用 head() 函数并且将想要查看的行数传入。默认显示的行数为5

你可能还想看看最后几行：


```python
food_info.tail()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>NDB_No</th>
      <th>Shrt_Desc</th>
      <th>Water_(g)</th>
      <th>Energ_Kcal</th>
      <th>Protein_(g)</th>
      <th>Lipid_Tot_(g)</th>
      <th>Ash_(g)</th>
      <th>Carbohydrt_(g)</th>
      <th>Fiber_TD_(g)</th>
      <th>Sugar_Tot_(g)</th>
      <th>...</th>
      <th>Vit_A_IU</th>
      <th>Vit_A_RAE</th>
      <th>Vit_E_(mg)</th>
      <th>Vit_D_mcg</th>
      <th>Vit_D_IU</th>
      <th>Vit_K_(mcg)</th>
      <th>FA_Sat_(g)</th>
      <th>FA_Mono_(g)</th>
      <th>FA_Poly_(g)</th>
      <th>Cholestrl_(mg)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>8613</th>
      <td>83110</td>
      <td>MACKEREL SALTED</td>
      <td>43.00</td>
      <td>305</td>
      <td>18.50</td>
      <td>25.10</td>
      <td>13.40</td>
      <td>0.00</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>...</td>
      <td>157.0</td>
      <td>47.0</td>
      <td>2.38</td>
      <td>25.2</td>
      <td>1006.0</td>
      <td>7.8</td>
      <td>7.148</td>
      <td>8.320</td>
      <td>6.210</td>
      <td>95.0</td>
    </tr>
    <tr>
      <th>8614</th>
      <td>90240</td>
      <td>SCALLOP (BAY&amp;SEA) CKD STMD</td>
      <td>70.25</td>
      <td>111</td>
      <td>20.54</td>
      <td>0.84</td>
      <td>2.97</td>
      <td>5.41</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>...</td>
      <td>5.0</td>
      <td>2.0</td>
      <td>0.00</td>
      <td>0.0</td>
      <td>2.0</td>
      <td>0.0</td>
      <td>0.218</td>
      <td>0.082</td>
      <td>0.222</td>
      <td>41.0</td>
    </tr>
    <tr>
      <th>8615</th>
      <td>90480</td>
      <td>SYRUP CANE</td>
      <td>26.00</td>
      <td>269</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.86</td>
      <td>73.14</td>
      <td>0.0</td>
      <td>73.2</td>
      <td>...</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.00</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.000</td>
      <td>0.000</td>
      <td>0.000</td>
      <td>0.0</td>
    </tr>
    <tr>
      <th>8616</th>
      <td>90560</td>
      <td>SNAIL RAW</td>
      <td>79.20</td>
      <td>90</td>
      <td>16.10</td>
      <td>1.40</td>
      <td>1.30</td>
      <td>2.00</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>...</td>
      <td>100.0</td>
      <td>30.0</td>
      <td>5.00</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.1</td>
      <td>0.361</td>
      <td>0.259</td>
      <td>0.252</td>
      <td>50.0</td>
    </tr>
    <tr>
      <th>8617</th>
      <td>93600</td>
      <td>TURTLE GREEN RAW</td>
      <td>78.50</td>
      <td>89</td>
      <td>19.80</td>
      <td>0.50</td>
      <td>1.20</td>
      <td>0.00</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>...</td>
      <td>100.0</td>
      <td>30.0</td>
      <td>0.50</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.1</td>
      <td>0.127</td>
      <td>0.088</td>
      <td>0.170</td>
      <td>50.0</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 36 columns</p>
</div>



跟 head 一样，我们只需要调用 tail 并且传入想要查看的行数即可。默认为5行

注意，它并不是从最后一行倒着显示的，而是按照数据原来的顺序显示。

我们已经看到了数据的前几行和后几行，这些数据都有相同的36列属性，我们想看下这些属性的具体信息便可以使用下面的方式：


```python
food_info.dtypes
```




    NDB_No               int64
    Shrt_Desc           object
    Water_(g)          float64
    Energ_Kcal           int64
    Protein_(g)        float64
    Lipid_Tot_(g)      float64
    Ash_(g)            float64
    Carbohydrt_(g)     float64
    Fiber_TD_(g)       float64
    Sugar_Tot_(g)      float64
    Calcium_(mg)       float64
    Iron_(mg)          float64
    Magnesium_(mg)     float64
    Phosphorus_(mg)    float64
    Potassium_(mg)     float64
    Sodium_(mg)        float64
    Zinc_(mg)          float64
    Copper_(mg)        float64
    Manganese_(mg)     float64
    Selenium_(mcg)     float64
    Vit_C_(mg)         float64
    Thiamin_(mg)       float64
    Riboflavin_(mg)    float64
    Niacin_(mg)        float64
    Vit_B6_(mg)        float64
    Vit_B12_(mcg)      float64
    Vit_A_IU           float64
    Vit_A_RAE          float64
    Vit_E_(mg)         float64
    Vit_D_mcg          float64
    Vit_D_IU           float64
    Vit_K_(mcg)        float64
    FA_Sat_(g)         float64
    FA_Mono_(g)        float64
    FA_Poly_(g)        float64
    Cholestrl_(mg)     float64
    dtype: object



上面便展示了每一列数据的类型，这些类型所代表的意思为：

- object - 字符串类型
- int - 整数类型
- float - 浮点数类型
- datetime - 时间类型
- bool - bool值类型

想要获取数据所有的列名，可以使用 colimns 属性来获取


```python
food_info.columns.tolist()
```




    ['NDB_No',
     'Shrt_Desc',
     'Water_(g)',
     'Energ_Kcal',
     'Protein_(g)',
     'Lipid_Tot_(g)',
     'Ash_(g)',
     'Carbohydrt_(g)',
     'Fiber_TD_(g)',
     'Sugar_Tot_(g)',
     'Calcium_(mg)',
     'Iron_(mg)',
     'Magnesium_(mg)',
     'Phosphorus_(mg)',
     'Potassium_(mg)',
     'Sodium_(mg)',
     'Zinc_(mg)',
     'Copper_(mg)',
     'Manganese_(mg)',
     'Selenium_(mcg)',
     'Vit_C_(mg)',
     'Thiamin_(mg)',
     'Riboflavin_(mg)',
     'Niacin_(mg)',
     'Vit_B6_(mg)',
     'Vit_B12_(mcg)',
     'Vit_A_IU',
     'Vit_A_RAE',
     'Vit_E_(mg)',
     'Vit_D_mcg',
     'Vit_D_IU',
     'Vit_K_(mcg)',
     'FA_Sat_(g)',
     'FA_Mono_(g)',
     'FA_Poly_(g)',
     'Cholestrl_(mg)']



在日常的使用过程中，获取到数据最常用的便是得看下数据中格式，这里因为 dataframe 格式的数据也是以矩阵的形式展示，因此可以使用 shape 属性来查看：


```python
food_info.shape
```




    (8618, 36)



可以使用 info 方法来查看数据中每一列的数据情况：


```python
food_info.info()
```

    <class 'pandas.core.frame.DataFrame'>
    RangeIndex: 8618 entries, 0 to 8617
    Data columns (total 36 columns):
    NDB_No             8618 non-null int64
    Shrt_Desc          8618 non-null object
    Water_(g)          8612 non-null float64
    Energ_Kcal         8618 non-null int64
    Protein_(g)        8618 non-null float64
    Lipid_Tot_(g)      8618 non-null float64
    Ash_(g)            8286 non-null float64
    Carbohydrt_(g)     8618 non-null float64
    Fiber_TD_(g)       7962 non-null float64
    Sugar_Tot_(g)      6679 non-null float64
    Calcium_(mg)       8264 non-null float64
    Iron_(mg)          8471 non-null float64
    Magnesium_(mg)     7936 non-null float64
    Phosphorus_(mg)    8046 non-null float64
    Potassium_(mg)     8208 non-null float64
    Sodium_(mg)        8535 non-null float64
    Zinc_(mg)          7917 non-null float64
    Copper_(mg)        7363 non-null float64
    Manganese_(mg)     6478 non-null float64
    Selenium_(mcg)     6868 non-null float64
    Vit_C_(mg)         7826 non-null float64
    Thiamin_(mg)       7939 non-null float64
    Riboflavin_(mg)    7961 non-null float64
    Niacin_(mg)        7937 non-null float64
    Vit_B6_(mg)        7677 non-null float64
    Vit_B12_(mcg)      7427 non-null float64
    Vit_A_IU           7932 non-null float64
    Vit_A_RAE          7089 non-null float64
    Vit_E_(mg)         5613 non-null float64
    Vit_D_mcg          5319 non-null float64
    Vit_D_IU           5320 non-null float64
    Vit_K_(mcg)        4969 non-null float64
    FA_Sat_(g)         8274 non-null float64
    FA_Mono_(g)        7947 non-null float64
    FA_Poly_(g)        7954 non-null float64
    Cholestrl_(mg)     8250 non-null float64
    dtypes: float64(33), int64(2), object(1)
    memory usage: 2.4+ MB


## 过滤

在探索数据的时候，你可能经常想要抽取数据中特定的样本，比如你有一个关于工作满意度的调查表，你可能就想要提取特定行业或者年龄的人的数据。

在 Pandas 中有多种方法可以实现提取我们想要的信息：

有时你想提取一整列，使用列的标签可以非常简单地做到：


```python
food_info['Vit_A_IU'].head()
```




    0    2499.0
    1    2499.0
    2    3069.0
    3     721.0
    4    1080.0
    Name: Vit_A_IU, dtype: float64



注意，当我们提取列的时候，会得到一个 series ，而不是 dataframe 。记得我们前面提到过，你可以把 dataframe 看作是一个 series 的字典，所以在抽取列的时候，我们就会得到一个 series。

还记得我在命名列标签的时候特意指出的吗？不用空格、破折号之类的符号，这样我们就可以像访问对象属性一样访问数据集的列——只用一个点号。


```python
food_info.Vit_A_IU.head()
```




    0    2499.0
    1    2499.0
    2    3069.0
    3     721.0
    4    1080.0
    Name: Vit_A_IU, dtype: float64



这句代码返回的结果与前一个例子完全一样——是我们选择的那列数据。

也可以获取数据集中的多列数据


```python
food_info[['Zinc_(mg)', 'Copper_(mg)']].head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Zinc_(mg)</th>
      <th>Copper_(mg)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0.09</td>
      <td>0.000</td>
    </tr>
    <tr>
      <th>1</th>
      <td>0.05</td>
      <td>0.016</td>
    </tr>
    <tr>
      <th>2</th>
      <td>0.01</td>
      <td>0.001</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2.66</td>
      <td>0.040</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2.60</td>
      <td>0.024</td>
    </tr>
  </tbody>
</table>
</div>



如果数据中含有字符串，还可以使用字符串方法来进行过滤。比如，我们来获取数据所有列中以 ‘g’ 结尾的列名： 


```python
col_names = food_info.columns.tolist()

gram_columns = []

for c in col_names:
    if c.endswith("(g)"):
        gram_columns.append(c)
        
gram_df = food_info[gram_columns]
print(gram_df.head())
```

       Water_(g)  Protein_(g)  Lipid_Tot_(g)  Ash_(g)  Carbohydrt_(g)  \
    0      15.87         0.85          81.11     2.11            0.06   
    1      15.87         0.85          81.11     2.11            0.06   
    2       0.24         0.28          99.48     0.00            0.00   
    3      42.41        21.40          28.74     5.11            2.34   
    4      41.11        23.24          29.68     3.18            2.79   
    
       Fiber_TD_(g)  Sugar_Tot_(g)  FA_Sat_(g)  FA_Mono_(g)  FA_Poly_(g)  
    0           0.0           0.06      51.368       21.021        3.043  
    1           0.0           0.06      50.489       23.426        3.012  
    2           0.0           0.00      61.924       28.732        3.694  
    3           0.0           0.50      18.669        7.778        0.800  
    4           0.0           0.51      18.764        8.598        0.784  


## 索引

之前的部分展示了如何通过列操作来得到数据，但是 Pandas 的行也有标签。行标签可以是基于位置的或者是标签，而且获取行数据的方法也根据标签的类型各有不同。

对于一个数据集来说，它是按行从第0行开始排序的，这也是它的位置。可以通过 iloc 来引用：


```python
food_info.iloc[0]
```




    NDB_No                         1001
    Shrt_Desc          BUTTER WITH SALT
    Water_(g)                     15.87
    Energ_Kcal                      717
    Protein_(g)                    0.85
    Lipid_Tot_(g)                 81.11
    Ash_(g)                        2.11
    Carbohydrt_(g)                 0.06
    Fiber_TD_(g)                      0
    Sugar_Tot_(g)                  0.06
    Calcium_(mg)                     24
    Iron_(mg)                      0.02
    Magnesium_(mg)                    2
    Phosphorus_(mg)                  24
    Potassium_(mg)                   24
    Sodium_(mg)                     643
    Zinc_(mg)                      0.09
    Copper_(mg)                       0
    Manganese_(mg)                    0
    Selenium_(mcg)                    1
    Vit_C_(mg)                        0
    Thiamin_(mg)                  0.005
    Riboflavin_(mg)               0.034
    Niacin_(mg)                   0.042
    Vit_B6_(mg)                   0.003
    Vit_B12_(mcg)                  0.17
    Vit_A_IU                       2499
    Vit_A_RAE                       684
    Vit_E_(mg)                     2.32
    Vit_D_mcg                       1.5
    Vit_D_IU                         60
    Vit_K_(mcg)                       7
    FA_Sat_(g)                   51.368
    FA_Mono_(g)                  21.021
    FA_Poly_(g)                   3.043
    Cholestrl_(mg)                  215
    Name: 0, dtype: object



但是如果设置的索引列中是字符型数据，这意味着我们不能继续使用 iloc 位置来引用，那我们用 loc 。

下面的代码将将数据集的索引设置为 Shrt_Desc 新索引：


```python
food_info_1 = food_info.set_index(['Shrt_Desc'])
food_info_1.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>NDB_No</th>
      <th>Water_(g)</th>
      <th>Energ_Kcal</th>
      <th>Protein_(g)</th>
      <th>Lipid_Tot_(g)</th>
      <th>Ash_(g)</th>
      <th>Carbohydrt_(g)</th>
      <th>Fiber_TD_(g)</th>
      <th>Sugar_Tot_(g)</th>
      <th>Calcium_(mg)</th>
      <th>...</th>
      <th>Vit_A_IU</th>
      <th>Vit_A_RAE</th>
      <th>Vit_E_(mg)</th>
      <th>Vit_D_mcg</th>
      <th>Vit_D_IU</th>
      <th>Vit_K_(mcg)</th>
      <th>FA_Sat_(g)</th>
      <th>FA_Mono_(g)</th>
      <th>FA_Poly_(g)</th>
      <th>Cholestrl_(mg)</th>
    </tr>
    <tr>
      <th>Shrt_Desc</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>BUTTER WITH SALT</th>
      <td>1001</td>
      <td>15.87</td>
      <td>717</td>
      <td>0.85</td>
      <td>81.11</td>
      <td>2.11</td>
      <td>0.06</td>
      <td>0.0</td>
      <td>0.06</td>
      <td>24.0</td>
      <td>...</td>
      <td>2499.0</td>
      <td>684.0</td>
      <td>2.32</td>
      <td>1.5</td>
      <td>60.0</td>
      <td>7.0</td>
      <td>51.368</td>
      <td>21.021</td>
      <td>3.043</td>
      <td>215.0</td>
    </tr>
    <tr>
      <th>BUTTER WHIPPED WITH SALT</th>
      <td>1002</td>
      <td>15.87</td>
      <td>717</td>
      <td>0.85</td>
      <td>81.11</td>
      <td>2.11</td>
      <td>0.06</td>
      <td>0.0</td>
      <td>0.06</td>
      <td>24.0</td>
      <td>...</td>
      <td>2499.0</td>
      <td>684.0</td>
      <td>2.32</td>
      <td>1.5</td>
      <td>60.0</td>
      <td>7.0</td>
      <td>50.489</td>
      <td>23.426</td>
      <td>3.012</td>
      <td>219.0</td>
    </tr>
    <tr>
      <th>BUTTER OIL ANHYDROUS</th>
      <td>1003</td>
      <td>0.24</td>
      <td>876</td>
      <td>0.28</td>
      <td>99.48</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.0</td>
      <td>0.00</td>
      <td>4.0</td>
      <td>...</td>
      <td>3069.0</td>
      <td>840.0</td>
      <td>2.80</td>
      <td>1.8</td>
      <td>73.0</td>
      <td>8.6</td>
      <td>61.924</td>
      <td>28.732</td>
      <td>3.694</td>
      <td>256.0</td>
    </tr>
    <tr>
      <th>CHEESE BLUE</th>
      <td>1004</td>
      <td>42.41</td>
      <td>353</td>
      <td>21.40</td>
      <td>28.74</td>
      <td>5.11</td>
      <td>2.34</td>
      <td>0.0</td>
      <td>0.50</td>
      <td>528.0</td>
      <td>...</td>
      <td>721.0</td>
      <td>198.0</td>
      <td>0.25</td>
      <td>0.5</td>
      <td>21.0</td>
      <td>2.4</td>
      <td>18.669</td>
      <td>7.778</td>
      <td>0.800</td>
      <td>75.0</td>
    </tr>
    <tr>
      <th>CHEESE BRICK</th>
      <td>1005</td>
      <td>41.11</td>
      <td>371</td>
      <td>23.24</td>
      <td>29.68</td>
      <td>3.18</td>
      <td>2.79</td>
      <td>0.0</td>
      <td>0.51</td>
      <td>674.0</td>
      <td>...</td>
      <td>1080.0</td>
      <td>292.0</td>
      <td>0.26</td>
      <td>0.5</td>
      <td>22.0</td>
      <td>2.5</td>
      <td>18.764</td>
      <td>8.598</td>
      <td>0.784</td>
      <td>94.0</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 35 columns</p>
</div>




```python
food_info_1.loc['BUTTER WITH SALT']
```




    NDB_No             1001.000
    Water_(g)            15.870
    Energ_Kcal          717.000
    Protein_(g)           0.850
    Lipid_Tot_(g)        81.110
    Ash_(g)               2.110
    Carbohydrt_(g)        0.060
    Fiber_TD_(g)          0.000
    Sugar_Tot_(g)         0.060
    Calcium_(mg)         24.000
    Iron_(mg)             0.020
    Magnesium_(mg)        2.000
    Phosphorus_(mg)      24.000
    Potassium_(mg)       24.000
    Sodium_(mg)         643.000
    Zinc_(mg)             0.090
    Copper_(mg)           0.000
    Manganese_(mg)        0.000
    Selenium_(mcg)        1.000
    Vit_C_(mg)            0.000
    Thiamin_(mg)          0.005
    Riboflavin_(mg)       0.034
    Niacin_(mg)           0.042
    Vit_B6_(mg)           0.003
    Vit_B12_(mcg)         0.170
    Vit_A_IU           2499.000
    Vit_A_RAE           684.000
    Vit_E_(mg)            2.320
    Vit_D_mcg             1.500
    Vit_D_IU             60.000
    Vit_K_(mcg)           7.000
    FA_Sat_(g)           51.368
    FA_Mono_(g)          21.021
    FA_Poly_(g)           3.043
    Cholestrl_(mg)      215.000
    Name: BUTTER WITH SALT, dtype: float64



和 iloc 一样，loc 会返回你引用的列，唯一一点不同就是此时你使用的是基于字符串的引用，而不是基于数字的。

还有一个引用列的常用常用方法—— ix 。如果 loc 是基于标签的，而 iloc 是基于位置的，但是 ix 已经被弃用了，故这里不做多的介绍。

将数据进行排序通常会很有用，在 Pandas 中，我们可以对 dataframe 调用 sort_values 方法进行排序。inplace 表示是否将排序后的结果替换原来的列。


```python
food_info.sort_values('Sodium_(mg)', inplace=True)
food_info['Sodium_(mg)'].head()
```




    760     0.0
    405     0.0
    761     0.0
    2269    0.0
    763     0.0
    Name: Sodium_(mg), dtype: float64



上面这句是默认的升序排序，假如我们想要降序排序的话便可以指定 ascending = False


```python
food_info.sort_values('Sodium_(mg)', inplace=True, ascending=False)
food_info['Sodium_(mg)'].head()
```




    276     38758.0
    5814    27360.0
    6192    26050.0
    1242    26000.0
    1245    24000.0
    Name: Sodium_(mg), dtype: float64



将索引排序通常会很有用，在 Pandas 中，我们可以对 dataframe 调用 sort_index 方法进行排序。


```python
food_info_2 = food_info.set_index(['NDB_No'])
food_info_2.sort_index(ascending=False).head(5)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Shrt_Desc</th>
      <th>Water_(g)</th>
      <th>Energ_Kcal</th>
      <th>Protein_(g)</th>
      <th>Lipid_Tot_(g)</th>
      <th>Ash_(g)</th>
      <th>Carbohydrt_(g)</th>
      <th>Fiber_TD_(g)</th>
      <th>Sugar_Tot_(g)</th>
      <th>Calcium_(mg)</th>
      <th>...</th>
      <th>Vit_A_IU</th>
      <th>Vit_A_RAE</th>
      <th>Vit_E_(mg)</th>
      <th>Vit_D_mcg</th>
      <th>Vit_D_IU</th>
      <th>Vit_K_(mcg)</th>
      <th>FA_Sat_(g)</th>
      <th>FA_Mono_(g)</th>
      <th>FA_Poly_(g)</th>
      <th>Cholestrl_(mg)</th>
    </tr>
    <tr>
      <th>NDB_No</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>93600</th>
      <td>TURTLE GREEN RAW</td>
      <td>78.50</td>
      <td>89</td>
      <td>19.80</td>
      <td>0.50</td>
      <td>1.20</td>
      <td>0.00</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>118.0</td>
      <td>...</td>
      <td>100.0</td>
      <td>30.0</td>
      <td>0.50</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.1</td>
      <td>0.127</td>
      <td>0.088</td>
      <td>0.170</td>
      <td>50.0</td>
    </tr>
    <tr>
      <th>90560</th>
      <td>SNAIL RAW</td>
      <td>79.20</td>
      <td>90</td>
      <td>16.10</td>
      <td>1.40</td>
      <td>1.30</td>
      <td>2.00</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>...</td>
      <td>100.0</td>
      <td>30.0</td>
      <td>5.00</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.1</td>
      <td>0.361</td>
      <td>0.259</td>
      <td>0.252</td>
      <td>50.0</td>
    </tr>
    <tr>
      <th>90480</th>
      <td>SYRUP CANE</td>
      <td>26.00</td>
      <td>269</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.86</td>
      <td>73.14</td>
      <td>0.0</td>
      <td>73.2</td>
      <td>13.0</td>
      <td>...</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.00</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.000</td>
      <td>0.000</td>
      <td>0.000</td>
      <td>0.0</td>
    </tr>
    <tr>
      <th>90240</th>
      <td>SCALLOP (BAY&amp;SEA) CKD STMD</td>
      <td>70.25</td>
      <td>111</td>
      <td>20.54</td>
      <td>0.84</td>
      <td>2.97</td>
      <td>5.41</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>...</td>
      <td>5.0</td>
      <td>2.0</td>
      <td>0.00</td>
      <td>0.0</td>
      <td>2.0</td>
      <td>0.0</td>
      <td>0.218</td>
      <td>0.082</td>
      <td>0.222</td>
      <td>41.0</td>
    </tr>
    <tr>
      <th>83110</th>
      <td>MACKEREL SALTED</td>
      <td>43.00</td>
      <td>305</td>
      <td>18.50</td>
      <td>25.10</td>
      <td>13.40</td>
      <td>0.00</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>66.0</td>
      <td>...</td>
      <td>157.0</td>
      <td>47.0</td>
      <td>2.38</td>
      <td>25.2</td>
      <td>1006.0</td>
      <td>7.8</td>
      <td>7.148</td>
      <td>8.320</td>
      <td>6.210</td>
      <td>95.0</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 35 columns</p>
</div>



我的索引本来就是有序的，为了演示，我将参数 ascending 设置为 false，这样我的数据就会呈降序排列。

当你将一列设置为索引的时候，它就不再是数据的一部分了。如果你想将索引恢复为数据，调用 set_index 相反的方法 reset_index 即可：


```python
food_info_2 = food_info_2.reset_index(['NDB_No'])
food_info_2.head(5)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>NDB_No</th>
      <th>Shrt_Desc</th>
      <th>Water_(g)</th>
      <th>Energ_Kcal</th>
      <th>Protein_(g)</th>
      <th>Lipid_Tot_(g)</th>
      <th>Ash_(g)</th>
      <th>Carbohydrt_(g)</th>
      <th>Fiber_TD_(g)</th>
      <th>Sugar_Tot_(g)</th>
      <th>...</th>
      <th>Vit_A_IU</th>
      <th>Vit_A_RAE</th>
      <th>Vit_E_(mg)</th>
      <th>Vit_D_mcg</th>
      <th>Vit_D_IU</th>
      <th>Vit_K_(mcg)</th>
      <th>FA_Sat_(g)</th>
      <th>FA_Mono_(g)</th>
      <th>FA_Poly_(g)</th>
      <th>Cholestrl_(mg)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2047</td>
      <td>SALT TABLE</td>
      <td>0.20</td>
      <td>0</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>99.8</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.00</td>
      <td>...</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.00</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.000</td>
      <td>0.000</td>
      <td>0.000</td>
      <td>0.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>18372</td>
      <td>LEAVENING AGENTS BAKING SODA</td>
      <td>0.20</td>
      <td>0</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>36.9</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.00</td>
      <td>...</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.00</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.000</td>
      <td>0.000</td>
      <td>0.000</td>
      <td>0.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>19225</td>
      <td>DESSERTS RENNIN TABLETS UNSWTND</td>
      <td>6.50</td>
      <td>84</td>
      <td>1.00</td>
      <td>0.10</td>
      <td>72.5</td>
      <td>19.8</td>
      <td>0.0</td>
      <td>NaN</td>
      <td>...</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>0.041</td>
      <td>0.038</td>
      <td>0.007</td>
      <td>0.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>6075</td>
      <td>SOUP BF BROTH OR BOUILLON PDR DRY</td>
      <td>3.27</td>
      <td>213</td>
      <td>15.97</td>
      <td>8.89</td>
      <td>54.5</td>
      <td>17.4</td>
      <td>0.0</td>
      <td>16.71</td>
      <td>...</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>2.17</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>3.2</td>
      <td>4.320</td>
      <td>3.616</td>
      <td>0.332</td>
      <td>10.0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>6081</td>
      <td>SOUP CHICK BROTH CUBES DRY</td>
      <td>2.50</td>
      <td>198</td>
      <td>14.60</td>
      <td>4.70</td>
      <td>54.7</td>
      <td>23.5</td>
      <td>0.0</td>
      <td>0.00</td>
      <td>...</td>
      <td>2.0</td>
      <td>0.0</td>
      <td>0.09</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>0.0</td>
      <td>1.200</td>
      <td>1.920</td>
      <td>1.620</td>
      <td>13.0</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 36 columns</p>
</div>



## 对数据集应用函数

有时你想对数据集中的数据进行改变或者某种操作。比方说，你的数据集中的数据是以 mg 为单位的，你想创建一个新的列以 g 为单位。Pandas 中有两个非常有用的函数，apply 和 applymap。


```python
def mg_to_g(mg):
    return mg/1000

food_info['Cholestrl_(g)'] = food_info['Cholestrl_(mg)'].apply(mg_to_g)
food_info.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>NDB_No</th>
      <th>Shrt_Desc</th>
      <th>Water_(g)</th>
      <th>Energ_Kcal</th>
      <th>Protein_(g)</th>
      <th>Lipid_Tot_(g)</th>
      <th>Ash_(g)</th>
      <th>Carbohydrt_(g)</th>
      <th>Fiber_TD_(g)</th>
      <th>Sugar_Tot_(g)</th>
      <th>...</th>
      <th>Vit_A_RAE</th>
      <th>Vit_E_(mg)</th>
      <th>Vit_D_mcg</th>
      <th>Vit_D_IU</th>
      <th>Vit_K_(mcg)</th>
      <th>FA_Sat_(g)</th>
      <th>FA_Mono_(g)</th>
      <th>FA_Poly_(g)</th>
      <th>Cholestrl_(mg)</th>
      <th>Cholestrl_(g)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>276</th>
      <td>2047</td>
      <td>SALT TABLE</td>
      <td>0.20</td>
      <td>0</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>99.8</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.00</td>
      <td>...</td>
      <td>0.0</td>
      <td>0.00</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.000</td>
      <td>0.000</td>
      <td>0.000</td>
      <td>0.0</td>
      <td>0.000</td>
    </tr>
    <tr>
      <th>5814</th>
      <td>18372</td>
      <td>LEAVENING AGENTS BAKING SODA</td>
      <td>0.20</td>
      <td>0</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>36.9</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.00</td>
      <td>...</td>
      <td>0.0</td>
      <td>0.00</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.000</td>
      <td>0.000</td>
      <td>0.000</td>
      <td>0.0</td>
      <td>0.000</td>
    </tr>
    <tr>
      <th>6192</th>
      <td>19225</td>
      <td>DESSERTS RENNIN TABLETS UNSWTND</td>
      <td>6.50</td>
      <td>84</td>
      <td>1.00</td>
      <td>0.10</td>
      <td>72.5</td>
      <td>19.8</td>
      <td>0.0</td>
      <td>NaN</td>
      <td>...</td>
      <td>0.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>0.041</td>
      <td>0.038</td>
      <td>0.007</td>
      <td>0.0</td>
      <td>0.000</td>
    </tr>
    <tr>
      <th>1242</th>
      <td>6075</td>
      <td>SOUP BF BROTH OR BOUILLON PDR DRY</td>
      <td>3.27</td>
      <td>213</td>
      <td>15.97</td>
      <td>8.89</td>
      <td>54.5</td>
      <td>17.4</td>
      <td>0.0</td>
      <td>16.71</td>
      <td>...</td>
      <td>0.0</td>
      <td>2.17</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>3.2</td>
      <td>4.320</td>
      <td>3.616</td>
      <td>0.332</td>
      <td>10.0</td>
      <td>0.010</td>
    </tr>
    <tr>
      <th>1245</th>
      <td>6081</td>
      <td>SOUP CHICK BROTH CUBES DRY</td>
      <td>2.50</td>
      <td>198</td>
      <td>14.60</td>
      <td>4.70</td>
      <td>54.7</td>
      <td>23.5</td>
      <td>0.0</td>
      <td>0.00</td>
      <td>...</td>
      <td>0.0</td>
      <td>0.09</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>0.0</td>
      <td>1.200</td>
      <td>1.920</td>
      <td>1.620</td>
      <td>13.0</td>
      <td>0.013</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 37 columns</p>
</div>



上面的代码创建了一个叫做 Cholestrl_(g) 的列，它只将 Cholestrl_(mg) 列中的数据进行了除1000。这就是 apply 的用法，即对一列数据应用函数。如果你想对整个数据集应用函数，就要使用 applymap 。

## 操作数据集的结构

另一常见的做法是重新建立数据结构，使得数据集呈现出一种更方便并且（或者）有用的形式。

这里我们会使用一份新的数据集来做下面的测试，数据集为英国2014年的降雨数据，点击这里下载：[uk_rain_2014.csv](assets/data/uk_rain_2014.csv)


```python
df = pd.read_csv('data/uk_rain_2014.csv')

df.columns = ['water_year','rain_octsep', 'outflow_octsep',
              'rain_decfeb', 'outflow_decfeb', 'rain_junaug', 'outflow_junaug']

def base_year(year):
    base_year = year[:4]
    base_year= pd.to_datetime(base_year).year
    return base_year

df['year'] = df['water_year'].apply(base_year)
```

### groupby 

groupby 会按照你选择的列对数据集进行分组。


```python
df.groupby(df['year'] // 10 *10).max()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>water_year</th>
      <th>rain_octsep</th>
      <th>outflow_octsep</th>
      <th>rain_decfeb</th>
      <th>outflow_decfeb</th>
      <th>rain_junaug</th>
      <th>outflow_junaug</th>
      <th>year</th>
    </tr>
    <tr>
      <th>year</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1980</th>
      <td>1989/90</td>
      <td>1210</td>
      <td>5701</td>
      <td>470</td>
      <td>10520</td>
      <td>343</td>
      <td>4313</td>
      <td>1989</td>
    </tr>
    <tr>
      <th>1990</th>
      <td>1999/00</td>
      <td>1268</td>
      <td>5824</td>
      <td>484</td>
      <td>11486</td>
      <td>285</td>
      <td>3206</td>
      <td>1999</td>
    </tr>
    <tr>
      <th>2000</th>
      <td>2009/10</td>
      <td>1387</td>
      <td>6391</td>
      <td>437</td>
      <td>10926</td>
      <td>357</td>
      <td>5168</td>
      <td>2009</td>
    </tr>
    <tr>
      <th>2010</th>
      <td>2012/13</td>
      <td>1285</td>
      <td>5500</td>
      <td>350</td>
      <td>9615</td>
      <td>379</td>
      <td>5261</td>
      <td>2012</td>
    </tr>
  </tbody>
</table>
</div>



groupby 会按照你选择的列对数据集进行分组。上例是按照年代分组。不过仅仅这样做并没有什么用，我们必须对其调用函数，比如 max 、 min 、mean 等等。例中，我们可以得到 90 年代的均值。

你也可以按照多列进行分组：


```python
decade_rain = df.groupby([df['year'] // 10 * 10, df.rain_octsep // 1000 * 1000])[['outflow_octsep',                                                              'outflow_decfeb', 'outflow_junaug']].mean()
decade_rain
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th></th>
      <th>outflow_octsep</th>
      <th>outflow_decfeb</th>
      <th>outflow_junaug</th>
    </tr>
    <tr>
      <th>year</th>
      <th>rain_octsep</th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th rowspan="2" valign="top">1980</th>
      <th>0</th>
      <td>4297.500000</td>
      <td>7685.000000</td>
      <td>1259.000000</td>
    </tr>
    <tr>
      <th>1000</th>
      <td>5289.625000</td>
      <td>7933.000000</td>
      <td>2572.250000</td>
    </tr>
    <tr>
      <th rowspan="2" valign="top">1990</th>
      <th>0</th>
      <td>3479.000000</td>
      <td>5515.000000</td>
      <td>1439.000000</td>
    </tr>
    <tr>
      <th>1000</th>
      <td>5064.888889</td>
      <td>8363.111111</td>
      <td>2130.555556</td>
    </tr>
    <tr>
      <th>2000</th>
      <th>1000</th>
      <td>5030.800000</td>
      <td>7812.100000</td>
      <td>2685.900000</td>
    </tr>
    <tr>
      <th>2010</th>
      <th>1000</th>
      <td>5116.666667</td>
      <td>7946.000000</td>
      <td>3314.333333</td>
    </tr>
  </tbody>
</table>
</div>



### unstack

它可以将一列数据设置为列标签


```python
decade_rain.unstack(0)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead tr th {
        text-align: left;
    }

    .dataframe thead tr:last-of-type th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr>
      <th></th>
      <th colspan="4" halign="left">outflow_octsep</th>
      <th colspan="4" halign="left">outflow_decfeb</th>
      <th colspan="4" halign="left">outflow_junaug</th>
    </tr>
    <tr>
      <th>year</th>
      <th>1980</th>
      <th>1990</th>
      <th>2000</th>
      <th>2010</th>
      <th>1980</th>
      <th>1990</th>
      <th>2000</th>
      <th>2010</th>
      <th>1980</th>
      <th>1990</th>
      <th>2000</th>
      <th>2010</th>
    </tr>
    <tr>
      <th>rain_octsep</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>4297.500</td>
      <td>3479.000000</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>7685.0</td>
      <td>5515.000000</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>1259.00</td>
      <td>1439.000000</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>1000</th>
      <td>5289.625</td>
      <td>5064.888889</td>
      <td>5030.8</td>
      <td>5116.666667</td>
      <td>7933.0</td>
      <td>8363.111111</td>
      <td>7812.1</td>
      <td>7946.0</td>
      <td>2572.25</td>
      <td>2130.555556</td>
      <td>2685.9</td>
      <td>3314.333333</td>
    </tr>
  </tbody>
</table>
</div>



这条语句将上例中的 dataframe 转换为下面的形式。它将第 0 列，也就是 year 列设置为列的标签。

## 合并数据集

有时你有两个相关联的数据集，你想将它们放在一起比较或者合并它们。在 Pandas 里很简单：


```python
rain_jpn = pd.read_csv('jpn_rain.csv')
rain_jpn.columns = ['year', 'jpn_rainfall']

uk_jpn_rain = df.merge(rain_jpn, on='year')
uk_jpn_rain.head(5)
```

首先你需要通过 on 关键字来指定需要合并的列。通常你可以省略这个参数，Pandas 将会自动选择要合并的列。

## 使用 Pandas 快速作图

Matplotlib 很棒，但是想要绘制出还算不错的图表却要写不少代码，而有时你只是想粗略的做个图来探索下数据，搞清楚数据的含义。Pandas 通过 plot 来解决这个问题：


```python
uk_jpn_rain.plot(x='year', y=['rain_octsep', 'jpn_rainfall'])
```

![image](http://liubj2016.github.io/Akuan/images/tu.png)

这会调用 Matplotlib 快速轻松地绘出了你的数据图。通过这个图你就可以在视觉上分析数据，而且它能在探索数据的时候给你一些方向。比如，看数据图，你会发现在 1995 年的英国好像有一场干旱。

你会发现英国的降雨明显少于日本，但人们却说英国总是下雨。

## 保存你的数据集

在清洗、重塑、探索完数据之后，你最后的数据集可能会发生很大改变，并且比最开始的时候更有用。你应该保存原始的数据集，但是你同样应该保存处理之后的数据。


```python
df.to_csv('uk_rain.csv')
```

上面的代码将会保存你的数据到 csv 文件以便下次使用。

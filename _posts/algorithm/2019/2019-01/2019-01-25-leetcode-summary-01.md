---
layout: post
title:  "LeetCode 总结（一）：初级算法之数组（持续更新）"
date:  2019-01-25
desc: "LeetCode 初级算法之数组部分总结"
keywords: "LeetCode,刷题算法,Java,Python,总结"
categories: [Algorithm]
tags: [LeetCode,算法,Java,Python]
---
# 初级算法数组部分总结

数组问题在面试中出现频率很高，属于比较常见的题目。本文将对 LeetCode 中官方给出的初级算法中的数组部分的题目进行一个总结。从这些题目中了解到数组类型的题目一个常见的出题方式和解题思路。

总结的题目列表：

- 从排序数组中删除重复项
- 买卖股票的最佳时机 II
- 旋转数组
- 存在重复
- 只出现一次的数字
- 两个数组的交集 II
- 加一
- 移动零
- 两数之和
- 有效的数独
- 旋转图像

所有题目的解答语言是 Python3

## 数组类型题目总结

### 题目特点

- 题目给出数组
- 对数组本身进行操作
- 一般无需返回
- 时间复杂度 O(n)
- 空间复杂度 O(1)
- 返回数组中符合特定需求的元素或角标

### 解题主要的技巧和着手点

- **善用双角标**

对于数组类的题目而言，角标绝对是最最最重要的一个点了。很多有技巧性的问题一般都是通过巧妙的角标变化来实现的。通常也不只是一个角标，也可以是两个角标，但一般在没有更多的了。

- **从结果反推**

有时按照题目所要求的规则来实现代码的话可能超时，这时也就是说是不能按照基本的方法是解题。这时，便可以从最终的输出结果入手来反推方法。通过观察题目对应的输入和输出来推导出过程。

- **题目提示**

有时，题目也会给出一些提示信息。这时，题目中的信息便是跟解题方法相关的信息。

- **善用集合**

**集合** 是一种特殊的数据结构，其最大的特点是 **不存在重复元素**。根据这一点便可以很巧妙的解决一些数组中有关重复元素的问题。

- **熟记位操作，先用异或运算**

在算法题目中。凡是涉及到数字的运算操作的一般首先得想到使用 **位运算**。并且一般只会用到 **异或运算**。

基本的位运算知识：

- 与运算（&）
  - 0 & 0 = 0
  - 1 & 1 = 1
  - 1 & 0 = 0
- 或运算（\|）
  - 0 \| 0 = 0
  - 1 \| 0 = 1
  - 1 \| 1 = 1
- 异或运算（^）
  - 1 ^ 1 = 0
  - 1 ^ 0 = 1
  - 0 ^ 0 = 0

根据上面的知识我们可以知道：**两个相同的数异或的结果为0，而0与任何一个数异或的结果为这个数**

下面是具体的题目和代码

----

## 1.从排序数组中删除重复项

题目地址：[https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array/](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array/)

### 解题思路

这道题目其实可以将需求明确为：

从原来的一个已经排好序的含有重复元素的数组中创建一个不含重复元素的数组。

再来看题目的要求：

O(1)的空间复杂度、原地

那么思路也就明确了：

不能创建一个新的数组来存储结果那么就只能在原来的数组的基础上进行修改，而在原来数组的基础上修改的话就得有一个角标来指向这个数组。并且为了找到重复元素，必须得有另一个角标来遍历数组。也就是通过双角标的形式来实现在一个数组上存储对该数组修改之后的结果。那么只需要创建一个角标从0开始指，遇到与当前角标下的元素不同的元素时就将该角标向前移动，之后将不同的元素存入该位置下。最后返回的非重复的元素个数也就是该角标+1. 同时为了精简表示可以将遍历数组的角标更改为直接获取数组元素。并且题目只要求将数组的前面不重复的部分处理好，数组后面的元素并不做要求，可以不用处理。

### Python3 代码：

```python
class Solution:
    def removeDuplicates(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        if not nums:
            return 0
        # 控制不重复元素的角标
        i = 0

        # 遍历数组，将每一个元素与已有的不重复元素的最后一个相比较
        for temp in nums:
            if nums[i] != temp:
                i += 1
                nums[i] = temp
        return i+1
```

## 2.买卖股票的最佳时机 II

题目地址：[https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/)

### 解题思路

其实这道题目是属于 **贪心算法**和数组两个考点的组合题。一般来说，数组作为存储数据的基础结构是可以与很多的题型相挂钩的。

对于贪心算法这类的题目来说，重点是要与 **动态规划** 区分开来。

- 贪心算法总是要从当前利益出发而不是考虑总体利益。
- 动态规划是要求的是全局的一个最优解，是总体利益。

对于这道题目来说，为了能够获得最多的利益，只需要进行尽可能多的买卖即可。也就是遍历数组，只要数组的当前角标下的元素比后面的元素值小，也就是当前的这次可以买卖那么便进行买卖。不必考虑后面的情形。买卖完之后后面还有元素的话便可以在看有没有还可以进行买卖的，继续买卖下去。

### Python3 代码

```python
class Solution:
    def maxProfit(self, prices):
        """
        :type prices: List[int]
        :rtype: int
        """
        price = 0
        for i in range(1, len(prices)):
            if prices[i] > prices[i-1]:
                price += (prices[i]-prices[i-1])
                # 该句可以省略
                # i += 2
        return price
```

## 3.旋转数组

题目地址：[https://leetcode-cn.com/problems/rotate-array/](https://leetcode-cn.com/problems/rotate-array/)

### 解题思路

该题是典型的需要从结果来推过程的一道题，按照题目的解答思路来做的话会超时。在从结果来看的话便可以很轻松看出题目的解题点。具体可以看 [LeetCode 189.旋转数组](https://wangxin1248.github.io/algorithm/2018/10/leetcode-189.html)

但是，上述过程是典型面向过程语言的解题思路，类似 C++、Java 这类的语言可以按这样的方式来写。但是对于 Python 来说，Python 对于列表格式的数据结构支持一种全新的操作方式：**切片**。通过这种方式便可以对数组的内容进行切分和重组。所以，这道题对于 Python 来说就一句的事。

### Python3 代码

```python
class Solution:
    def rotate(self, nums, k):
        """
        :type nums: List[int]
        :type k: int
        :rtype: void Do not return anything, modify nums in-place instead.
        """
        n = len(nums)
        k = k%n
        # 对原数组进行切片重组，一步达到最终结果的样子
        nums[0:n] = nums[n-k:] + nums[:n-k]

```

## 4.存在重复

题目地址：[https://leetcode-cn.com/problems/contains-duplicate/](https://leetcode-cn.com/problems/contains-duplicate/)

### 解题思路

该题目是要求判断数组中是否存在重复的元素，因此可以使用 **集合** 来存储数据，之后再来看集合中的元素的个数是否和之前的数组的个数是否一致。

### Python3 代码

```python
class Solution:
    def containsDuplicate(self, nums):
        """
        :type nums: List[int]
        :rtype: bool
        """
        return  not len(nums) == len(set(nums))
```

## 6.只出现一次的数字

题目地址：[https://leetcode-cn.com/problems/single-number/](https://leetcode-cn.com/problems/single-number/)

## 解题思路

这道题使用到了位运算的知识：**两个相同的数异或的结果为0，而0与任何一个数异或的结果为这个数**

## Python3 代码

```python
class Solution:
    def singleNumber(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        j = 0
        for i in nums:
            j ^= i
        return j
```
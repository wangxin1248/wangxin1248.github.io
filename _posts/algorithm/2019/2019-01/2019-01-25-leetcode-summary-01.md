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

### 解题主要的技巧和着手点

- **善用多个角标**

对于数组类的题目而言，角标绝对是最最最重要的一个点了。很多有技巧性的问题一般都是通过巧妙的角标变化来实现的。通常也不只是一个角标，也可以是多个角标。

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

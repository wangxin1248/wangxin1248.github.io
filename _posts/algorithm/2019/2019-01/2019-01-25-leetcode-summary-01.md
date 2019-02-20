---
layout: post
title:  "LeetCode 总结（一）：初级算法之数组（更新完成）"
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

一般来说需要对数组进行两次的遍历才能完成解题的问题可以通过双角标来遍历一遍来解决。

还有可以通过双角标移动的快慢来解题。

- **从结果反推**

有时按照题目所要求的规则来实现代码的话可能超时，这时也就是说是不能按照基本的方法是解题。这时，便可以从最终的输出结果入手来反推方法。通过观察题目对应的输入和输出来推导出过程。

- **题目提示**

有时，题目也会给出一些提示信息。这时，题目中的信息便是跟解题方法相关的信息。

- **善用集合**

**集合** 是一种特殊的数据结构，其最大的特点是 **不存在重复元素**。根据这一点便可以很巧妙的解决一些数组中有关重复元素的问题。

- **善用字典**

在有些题目中有时为了方便的存储数据，有时会需要用到 **字典**这种特殊的数据结构。字典是一种强大的数据结构，用来存储 **键值对 {key:value}**的数据结构，也就是一个键对应不同的值，键和值的数据结构可以不一样。

其中最主要的是键的选择必须是不可变元素，在 Python 中也就是 **字符串、元祖、数字**。而 **列表和字典** 是不可以作为字典当中的键的类型的。

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

- **在python中善于利用反向角标**

在 python 中是存在一种和以往的 c++、java 不一样的角标即 **反向角标**，也就是 -1、-2、...。这种角标是从数组的末尾往数组的首部来取的。因此在算法题中可以充分使用这一高级操作来实现对一些题目比较技巧的求解。

- **将题目进行简单的变换**

有时候对于所给的题目并没有明确的思路的情况下可以考虑将题目进行相应的变换。

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

## 7.两个数组的交集 II

题目地址：[https://leetcode-cn.com/problems/intersection-of-two-arrays-ii/](https://leetcode-cn.com/problems/intersection-of-two-arrays-ii/)

### 题目思路


为了取出两个数组中的交集，必须首先得创建一个辅助的数据结构。这个数据结构的选择可以是另一个 **数组**也可以是 **字典**。

在 [https://wangxin1248.github.io/algorithm/2018/10/leetcode-350.html](https://wangxin1248.github.io/algorithm/2018/10/leetcode-350.html) 中使用了第三方数组来直接存储最后的结果。

这里我们换一种思路，来采用字典这种独特的数据结构来帮助完成交集数据的寻找。具体的操作是将要利用字典数据结构中的键值对来存储第一个数组中的每一个元素的出现次数，再来遍历第二个数组中的元素，假如该元素存在于字典中的话则将其保存在最终的交集数据结果中。

### Python3代码

```python
class Solution:
    def intersect(self, nums1, nums2):
        """
        :type nums1: List[int]
        :type nums2: List[int]
        :rtype: List[int]
        """
        nums3 = []
        dic1 = {}
        # 统计数组1中的元素个数
        for num in nums1:
            if num not in dic1:
                dic1[num] = 1
            else:
                dic1[num] += 1
        # 遍历数组2中的元素，假如该元素存在则将其加入到结果数组中
        for num in nums2:
            if num in dic1 and dic1[num]>0:
                nums3.append(num)
                dic1[num] -= 1
        return nums3
        
```

## 8.加一

题目地址：[https://leetcode-cn.com/problems/plus-one/](https://leetcode-cn.com/problems/plus-one/)

### 解题思路

按照对数组进行加一的基本思路我们可以理解到对应的解决方法也就是对数组中的每一个元素加上下一位元素的进位，而最后一位元素加一。

这样最后只需要判断最高位是否有向上的进位即可。

### Python3 代码

```python
class Solution:
    def plusOne(self, digits):
        """
        :type digits: List[int]
        :rtype: List[int]
        """
        add = 1
        for i in range(len(digits)-1, -1, -1):
            num = digits[i]+add
            digits[i] = num%10
            add = int(num/10)
        if add != 0:
            digits = list(map(int, str(add))) + digits
        return digits
```

## 9.移动零

题目地址：[https://leetcode-cn.com/problems/move-zeroes/](https://leetcode-cn.com/problems/move-zeroes/)

### 解题思路

该题是要求将数组中的0移动到数组的末尾，换种思路来说就是将0与非0元素进行调换。每一次将所指向第一个0元素和第一个非0元素进行互换，最后数组遍历结束则实现题目要求。

### Python3 代码

```python
class Solution:
    def moveZeroes(self, nums):
        """
        :type nums: List[int]
        :rtype: void Do not return anything, modify nums in-place instead.
        """
        length = len(nums)
        if length == 1:
            return
        # 创建两个角标,fast用来指向非0元素，slow用来指向0元素
        slow = fast = 0
        # 开始遍历数组
        while fast < length:
            if nums[fast] != 0:
                if nums[slow] ==0 and slow != fast:
                    nums[fast],nums[slow] = nums[slow],nums[fast]
                slow += 1
            fast += 1
```

## 10.两数之和

题目地址：[https://leetcode-cn.com/problems/two-sum/](https://leetcode-cn.com/problems/two-sum/)

### 解题思路

两数之和其实可以理解为寻找两数之差，即目标值与数组中每一个元素的差在数组中的位置。那么便可以考虑将每一个元素与目标值的差值以及该元素的位置保存起来。这个保存的数据结构最好便是字典。

我们可以将数组中所给元素的每一个元素与目标值的差值做为键，该元素的角标作为值。这样在遍历数组的过程中，将数组的角标和角标下对应值都取出来，查询该元素是否在字典中，不在则将该值与 target 的差值存入字典，值为角标。

因为是两数之和，所以当遍历到某个元素存在字典中的时候，那么另一个数其实就已经确定了，与这个数之和就是 target，将该数在字典中的值和该数的角标组成新的数组返回即可。

### Python3 代码

```python
class Solution(object):
    def twoSum(self, nums, target):
        dic = {}
        for i, num in enumerate(nums):
            if num in dic:
                return [dic[num], i]
            else:
                dic[target - num] = i

```

## 11.有效的数独

题目地址：[https://leetcode-cn.com/problems/valid-sudoku/](https://leetcode-cn.com/problems/valid-sudoku/)

### 解题思路

根据题目所给的条件，对于一个有效的数独来说得满足以下的三个条件：

- 数字 1-9 在每一行只能出现一次。
- 数字 1-9 在每一列只能出现一次。
- 数字 1-9 在每一个以粗实线分隔的 3x3 宫内只能出现一次。

因此，我们就对一个 9*9 的矩阵分别判断 行、列、3*3宫

判断的标准是每行、每列、每个3*3宫 数字 1-9 不出现重复。在 python 中对是否有重复元素的处理最快的就是**集合**。

可以将每行、每列、每个3*3宫中的数字分别存到列表中去，之后将列表转换为集合，判断集合和原列表的长度即可。

### Python3 代码

```python
class Solution:
    def isValidSudoku(self, board):
        """
        :type board: List[List[str]]
        :rtype: bool
        """
        # 判断行
        for i in range(0, 9):
            list1 = []
            for j in range(0, 9):
                # 是数字再做处理
                if board[i][j] != ".":
                    list1.insert(j, board[i][j])
            # 判断是否有重复数字
            if len(set(list1)) != len(list1):
                return False
        
        # 判断列
        for i in range(0, 9):
            list2 = []
            for j in range(0, 9):
                # 是数字再做处理
                if board[j][i] != ".":
                    list2.insert(i, board[j][i])
            # 判断是否有重复数字
            if len(set(list2)) != len(list2):
                return False
        
        # 判断3*3的矩阵
        for i in range(0, 9, 3):
            for j in range(0, 9, 3):
                list3 = []
                # 判断每一个3*3的小矩阵
                for m in range(i, i+3):
                    for n in range(j, j+3):
                        # 是数字再做处理
                        if board[m][n] != ".":
                            list3.insert(m+n, board[m][n])
                # 判断是否有重复数字
                if len(set(list3)) != len(list3):
                    return False
        return True
```

## 12.旋转图像

题目地址：[https://leetcode-cn.com/problems/rotate-image/](https://leetcode-cn.com/problems/rotate-image/)

### 解题思路

对于90度的翻转有很多方法:

有一种解法，首先以从对角线为轴翻转，然后再以x轴中线上下翻转即可得到结果，如下图所示(其中蓝色数字表示翻转轴)：

![22](/assets/images/2018-10/22.png)

还有一种解法和上面的其实是一种解法，这种方法首先对原数组取其转置矩阵，然后把每行的数字翻转可得到结果，如下所示(其中蓝色数字表示翻转轴)：

![23](/assets/images/2018-10/23.png)

最后，其实就是简单的数组角标元素变换。

### Python3 代码

```python
class Solution:
    def rotate(self, matrix):
        """
        :type matrix: List[List[int]]
        :rtype: void Do not return anything, modify matrix in-place instead.
        """
        length = len(matrix)
        # 先将矩阵按右对角线交换
        for i in range(0, length-1):
            for j in range(0, length-i):
                matrix[i][j], matrix[length-j-1][length-i-1] = matrix[length-j-1][length-i-1], matrix[i][j]
        # 再将矩阵按中间横线上下交换
        for i in range(0, int(length/2)):
            for j in range(0, length):
                matrix[i][j], matrix[length-i-1][j] = matrix[length-i-1][j],matrix[i][j]

```
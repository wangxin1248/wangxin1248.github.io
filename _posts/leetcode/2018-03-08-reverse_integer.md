---
layout: post
title:  "LeetCode题目7.Reverse Integer"
date:  2018-03-08
desc: "LeetCode刷题"
keywords: "LeetCode,刷题,算法,java"
categories: [leetcode]
tags: [LeetCode,刷题,算法,java]
---
### Description

Given a 32-bit signed integer, reverse digits of an integer.

Example 1:

>Input: 123
>Output:  321

Example 2:

>Input: -123
>Output: -321

Example 3:

>Input: 120
>Output: 21

### Note

Assume we are dealing with an environment which could only hold integers within the 32-bit signed integer range. For the purpose of this problem, assume that your function returns 0 when the reversed integer overflows.

### 思路

这道题可以分成两部分来求解，首先是对int型整数进行逆序，接下来就是判断逆序后的数是否超过int型数的范围。
#### 第一步：逆序

对于123这个整数来说，想要对其进行逆序的话，那么首先得获取到3这个个位数，将它乘以10之后加上十位的2。然后将32乘以10再加上百位的1。这样，整数的逆序就完成了。

那么对于一般的数来说，其基本的操作就是：
>1.获取个位数，将原数除10去掉原个位数
>2.乘10再加上新的个位数

用代码来体现就是：
``` java
result = result*10 + x%10;
x /= 10;
```
对于int型整数来说，除10之后便没有小数点之后的了。对应循环的开始条件便是x不为0。

#### 第二步：判断是否超过int型数范围

对应int型数来说，其最大值和最小值通过java中的Integer类中的常量可以很方便的得到。
主要问题是逆序后的数有可能超过int型数，所以对于逆序后的数来说得使用更大范围类型的变量来接收，这里使用long长整型。

### java求解代码

``` java
class Solution {
    public int reverse(int x) {
       long result = 0;
        while(x!=0){
            result = result*10+x%10;
            x = x/10;
        }
        if(result>0){
            return result>Integer.MAX_VALUE?0:(int)result;
        }else{
            return result<Integer.MIN_VALUE?0:(int)result;
        }
    }
}
```
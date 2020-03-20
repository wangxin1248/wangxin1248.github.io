---
layout: post
title:  "LeetCode 面试题51. 数组中的逆序对"
date:  2020-03-20
desc: "LeetCode 题目之 面试题51. 数组中的逆序对"
keywords: "LeetCode,刷题算法,c++,LeetCode,面试题51. 数组中的逆序对"
categories: [Algorithm]
tags: [LeetCode,算法,Python]
---
# 数组中的逆序对

## 题目描述

在数组中的两个数字，如果前面一个数字大于后面的数字，则这两个数字组成一个逆序对。输入一个数组，求出这个数组中的逆序对的总数。

示例 1:

```s
输入: [7,5,6,4]
输出: 5
```

限制：

- 0 <= 数组长度 <= 50000

## 解题思路

### 方法一：归并排序

首先先来看以下归并排序的动图演示：

![1](/assets/images/2020/2020-03/1.webp)

对于 [7,5,6,4] 可以使用归并排序进行递归求解。按照归并排序的思路，会将arr分解为arrL = [7,5],arrR = [6,4];

继续分解为arrLL = [7], arrLR = [5]; arrRL = [6], arrRR = [4];

自此分解完成。

接下来合并：

假设i为arrLL的数组下标，j为arrLR的数组下标, index为新数组res的下标，初始值都为0

首先arrLL与arrLR合并，因为arrLL[i] > arrLRj，

所以可以说明arrLL中7及其之后的所有数字都大于arrLR中的5，

也就是说7及其之后的所有元素都可以与5组成逆序对，

所以此时7及其之后的所有元素个数（leftLen - i）即我们要的逆序对数，需要添加到结果sum中。即sum += leftLen - 1

（这也就是此算法高效的地方，一次可以查找到好多次的逆序对数，而且不会重复）

合并之后为arrL=[5,7].

根据上述方法将arrRL和arrRR合并为arrR=[4,6];

现在将arrL和arrR合并为arr：

- 5 > 4，说明5及其之后的所有元素都能与4组成逆序对；所以sum += （leftLen - 1）；

- 5 < 6，正常排序，不做处理

- 7 > 6，说明7及其之后的所有元素都能与6组成逆序对；所以sum += （leftLen - 1）；

- 7，正常排序，不作处理

最后sum就是所有逆序对的总个数！

#### 算法实现-Java

```java
class Solution{
    int sum = 0;
    public int reversePairs(int[] nums){
        mergeSort(nums,0,nums.length-1);
        return sum;
    }
    public void mergeSort(int[] nums,int l,int r){
        if(l>=r){
            return;
        }
        int mid = l+(r-l)/2;
        mergeSort(nums,l,mid);
        mergeSort(nums,mid+1,r);
        merge(nums,l,mid,r);
    }
    public void merge(int[] nums,int l,int mid,int r){
        // 将数据拷贝到备份数组上
        int[] temp = new int[r-l+1];
        for(int i=l;i<=r;i++){
            temp[i-l] = nums[i];
        }
        // 开始进行归并
        int i = l;
        int j = mid+1;
        for(int k=l;k<=r;k++){
            if(i>mid){
                nums[k] = temp[j-l];
                j++;
            }else if(j>r){
                nums[k] = temp[i-l];
                i++;
                // 注意这里小于等于
            }else if(temp[i-l] <= temp[j-l]){
                nums[k] = temp[i-l];
                i++;
            }else{
                nums[k] = temp[j-l];
                j++;
                // 这里需要统计逆序对的数量了
                sum += mid-i+1;
            }
        }
    }
}
```

#### 算法性能分析

- 时间复杂度：O(nlogn)
- 空间复杂度：O(n)

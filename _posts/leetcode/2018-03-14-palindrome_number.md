---
layout: post
title:  "LeetCode题目9.Palindrome Numbers"
date:  2018-03-14
desc: "LeetCode刷题之题目9.Palindrome Numbers"
keywords: "LeetCode,刷题,算法,java,Palindrome Numbers"
categories: [leetcode]
tags: [LeetCode,算法,java]
---
# LeetCode刷题之题目9.Palindrome Numbers

## Description
Determine whether an integer is a palindrome. Do this without extra space.
## Some hints
Could negative integers be palindromes? (ie, -1)

If you are thinking of converting the integer to string, note the restriction of using extra space.

You could also try reversing an integer. However, if you have solved the problem "Reverse Integer", you know that the reversed integer might overflow. How would you handle such case?

There is a more generic way of solving this problem.
## 思路
本题要求在不使用任何额外空间的情况下判断一个数是否是回文数。
对于回文数来说是该数从正面读以及从反面读数的大小都是一样的，这样的数称为回文数。例如：1111，1221，123321都是回文数。
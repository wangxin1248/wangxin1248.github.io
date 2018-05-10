---
layout: post
title:  "numpy.random中的shuffle和permutation"
date:  2018-05-10
desc: "numpy.random.shuffle(x) and numpy.random.permutation(x)，这两个有什么不同，或者说有什么关系？"
keywords: "python,numpy,np,permutation,shuffle"
categories: [Machine Learning]
tags: [python3,numpy]
---

# numpy.random中的shuffle和permutationx

numpy中的random中排列功能下有两个方法shuffle和permutationx，那么他们有什么不同呢？

首先来看下官方文档中的解释：
- - shuffle(x)：	Modify a sequence in-place by shuffling its contents.
- - permutation(x)：	Randomly permute a sequence, or return a permuted range.

也就是说，区别主要有两点：

- 1. 如果传给permutation一个矩阵，它会返回一个洗牌后的矩阵副本；而shuffle只是对一个矩阵进行洗牌，无返回值。
- 2. 如果传入一个整数，permutation会返回一个洗牌后的arange。
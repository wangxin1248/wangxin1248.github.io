---
layout: post
title:  "git 设置和取消代理"
date:  2019-07-18
desc: "git 设置和取消代理"
keywords: "git"
categories: [Life]
tags: [git]
---

## 设置代理

```
git config --global http.https://github.com.proxy socks5://127.0.0.1:1080
```

## 取消代理

```
git config --global --unset http.https://github.com.proxy
```
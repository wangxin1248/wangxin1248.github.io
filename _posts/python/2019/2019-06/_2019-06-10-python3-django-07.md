---
layout: post
title:  "Python3 Django（七）视图详解"
date:  2019-06-10
desc: "python3 服务器开发系列之 Django 开发实战（六）：Django 视图详细介绍"
keywords: "Python3,后台开发,实战,django,MVC,ORM"
categories: [Python]
tags: [python3,后台开发,django]
---
# Django - 视图

Django 中的视图是专门用来处理用户的请求并返回响应。接下来分别从以下几个方面来研究视图内容。

## 一、URL配置

Django 项目是通过项目中的 settings.py 中的 ROOT_URLCONF 来指定项目中根级 url 的配置路径。在该路径下便是配置项目中对所有从客户端发来的 url 所做的处理。
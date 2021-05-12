---
layout: post
title:  "修复 MacOS M1 版本中 IDEA&GOlang 无法调试 Go 项目"
date:  2021-05-12
desc: "修复 MacOS M1 版本中 IDEA&GOlang 无法调试 Go 项目"
keywords: "Golang,MacOS,M1,IDEA,Golang,Debug,无法调试"
categories: [Life]
tags: [Golang,fix]
---
# 修复 MacOS M1 版本中 IDEA&GOlang 无法调试 Go 项目

最近公司入职配备了搭载 M1 芯片版本的 MacBook，初期一切开发环境还正常，但是在调试代码的时候发现无法调试，经过一番查找之后找到了解决办法。

首先 GoLang 针对 M1 版本的 MacOS 发布了专门的版本，在开始下载 GoLang 的时候就得注意不要下载错了，应该下载这个版本的：`go版本号.darwin-arm64.pkg`，注意是 **arm64** 版本的，不要下载成 **amd64**版本的。

在下载了正确的 GoLang 版本之后还得下载正确的 IDEA&GoLand 版本。

IDEA&GoLand 针对 M1 版本的 MacOS 发布了专门的版本，下载链接：

- [IDEA Apple Silicon Version](https://www.jetbrains.com/idea/download/download-thanks.html?platform=macM1)
- [Goland Apple Silicon Version](https://www.jetbrains.com/go/download/download-thanks.html?platform=macM1)

在正确下载并安装 GoLang 语言以及 IDEA 之后还是不能正确调试，这是因为当前的调试器版本并没有发布针对 M1 的版本。

目前推荐使用的 GoLang 调试器是 [Delve](https://github.com/go-delve/delve) 但是当前 Delve 的版本并不支持 M1 芯片。但是目前国外有人已经开发出了专门用于 M1 芯片版本的 Delve，下载地址：[Workaround v1.16.1-alpha1 - Mac M1 arm64 only](https://github.com/rfay/delve/releases)

下载完成之后按照指定的要求进行设置：

```go
1、Download the dlv binary
2、Place it in /usr/local/bin (or wherever you want)
3、Make it executable: chmod +x /usr/local/bin/dlv
4、If using IDEA&GoLand, Go to Help->Edit Custom Properties (create if necessary) and add dlv.path=/usr/local/bin/dlv
5、Restart IDEA&GoLand
```

这样就可以在 IDEA&GoLand 上调试 Go 代码了。

后续可以等待 [Delve](https://github.com/go-delve/delve) 官方发布专门针对 M1 芯片的调试器，然后进行更换即可。

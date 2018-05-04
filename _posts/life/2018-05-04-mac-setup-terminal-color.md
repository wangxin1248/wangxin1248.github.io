---
layout: post
title:  "Mac OS 终端颜色定制"
date:  2018-05-04
desc: "介于macOS中的终端颜色太单一，太丑啦，输入输出的内容都不易识别，看的时候累眼睛，于是就去研究了下关于终端定制的方法，说下自己的解决方法"
keywords: "macOS,终端颜色定制"
categories: [Life]
tags: [macOS,terminal]
---
# Mac OS 终端颜色定制

macOS中修改终端颜色的方法有很多种，我这这里使用的是三方插件 Oh My Zsh。主要是因为这种方式安装方便，并且可以支持多种主题和插件。

安装之前的终端效果：
![终端显示效果-1](/assets/images/2018-05/终端效果设置-1.png)

安装之后的终端效果：
![终端显示效果-2](/assets/images/2018-05/终端效果设置-2.png)

可以看到，效果还是比较美观的，不再是单一的现实颜色了。

如果想要使用其他方式来修改的话可以参考这篇博客：[Mac OS 终端颜色定制](https://www.jianshu.com/p/620f66cad0a7)

Oh My Zsh官网地址：[oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)

接下来记录下自己安装Oh My Zsh的过程：

## 安装Zsh

在使用Oh My Zsh之前需要先安装[Zsh](http://www.zsh.org),安装也比较简单，是使用Homebrew进行安装，电脑中还没有安装Homebrew的可以看下我之前的这片博客[macOS中安装python3](https://wangxin1248.com/life/2018/04/mac-install-python.html),里面有介绍如何安装。

这里假设已经安装完成，直接实验Homebrew来安装Zsh

```
brew install zsh zsh-completions
```

安装完成之后便可以进行安装Oh My Zsh

## 安装Oh My Zsh

安装Oh My Zsh有两种方式进行，分别是通过curl和wget，两种方法都可以实现安装。选择其一就好。

### curl安装

```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

### wget安装

```
sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
```

安装完成：
![终端显示效果-3](/assets/images/2018-05/终端效果设置-3.png)

## Oh My Zsh设置

Oh My Zsh最好的地方使其可以安装多种插件并且支持更换主题。

### Oh My Zsh插件设置

Oh My Zsh支持多种插件，具体支持的插件目录为：[plugins](https://github.com/robbyrussell/oh-my-zsh/tree/master/plugins)

安装插件也很简单，只需要在Oh My Zsh的配置文件中进行设置即可

打开配置文件
```
vi ~/.zshrc
```

将所需要的插件按如下的格式填写即可：
```python
plugins=(
  git
  bundler
  dotenv
  osx
  rake
  rbenv
  ruby
)
```

### Oh My Zsh主题设置

Oh My Zsh的主题也是通过配置文件进行设置，首先打开配置文件，

```
vi ~/.zshrc
```

找到其中的的+ZSH_THEME="robbyrussell"+这一句，将右边的值修改为你想要设置的主题名称即可。具体的主题图片在这里：[主题图片](https://github.com/robbyrussell/oh-my-zsh/wiki/themes)


## Oh My Zsh卸载

当然，想要卸载掉Oh My Zsh也使很简单的，只需要一句话

```
uninstall_oh_my_zsh
```

接下来在卸载掉Zsh

```
brew remove zsh zsh-completions
```

## 还有很多关于Oh My Zsh的高级设置，可以在其[官网](https://github.com/robbyrussell/oh-my-zsh)进行了解。
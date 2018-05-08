---
layout: post
title:  "Mac OSX 配置终端vim配色"
date:  2018-05-07
desc: "介于macOS中的终端颜色太单一，太丑啦，输入输出的内容都不易识别，看的时候累眼睛，于是就去研究了下关于终端定制的方法，看到不断有人推荐 Solarized，看了一些截图，感觉还不错，决定试一下。"
keywords: "macOS,终端颜色定制,Solarized"
categories: [Life]
tags: [macOS,terminal,Solarized]
---
# Mac OSX 配置终端vim配色

这里使用的配色方案是Solarized，[Solarized](http://ethanschoonover.com/solarized) 是目前最完整的 Terminal/Editor/IDE 配色项目，几乎覆盖所有主流操作系统（Mac OS X, Linux, Windows）、编辑器和 IDE（Vim, Emacs, Xcode, TextMate, NetBeans, Visual Studio 等），终端（iTerm2, Terminal.app, Putty 等）。

要在 Mac OS X 终端中使用命令行）需要给3个工具配色，terminal、vim 和 ls. 

首先下载 Solarized：
```
$ git clone git://github.com/altercation/solarized.gits
```

## Terminal

如果你使用的是Mac OS X 自带的 Terminal 的话，在 solarized/osx-terminal.app-colors-solarized 下双击 Solarized Dark ansi.terminal 和 Solarized Light ansi.terminal 就会自动导入两种配色方案 Dark 和 Light 到 Terminal.app 里。
然后在 Terminal 的偏好设置中设置默认主题。这样，Terminal 的设置就已经完成了。

## Vim

Vim 的配色最好和终端的配色保持一致，因此设置主题为你在终端中使用的主题：
```
$ cd solarized
$ cd vim-colors-solarized/colors
$ mkdir -p ~/.vim/colors
$ cp solarized.vim ~/.vim/colors/
```

接下来打开配置文件进行配置：
```
$ vi ~/.vimrc
```

写入文件信息：
```
syntax enable
set background=dark
colorscheme solarized
set nu!
```

## ls

Mac OS X 是基于 FreeBSD 的，所以一些工具 ls, top 等都是 BSD 那一套，ls 不是 GNU ls，所以即使 Terminal配置了颜色，但是在 Mac 上敲入 ls 命令也不会显示高亮
可以通过安装 coreutils 来解决

```
$ brew install xz coreutils
$ gdircolors --print-database > ~/.dir_colors
$ vim ~/.bash_profile 添加以下代码
    if brew list | grep coreutils > /dev/null ; then
        PATH="$(brew --prefix coreutils)/libexec/gnubin:$PATH"
        alias ls='ls -F --show-control-chars --color=auto'
        eval `gdircolors -b $HOME/.dir_colors`
    fi

```

## grep语法高亮

```
$ vim ~/.bash_profile 添加以下代码
    alias grep='grep --color'
    alias egrep='egrep --color'
    alias fgrep='fgrep --color'
```

## 增强命令行工具

```
$ vim ~/.bash_profile 添加以下代码
    alias ll='ls -alF'
    alias la='ls -A'
    alias l='ls -CF'
```
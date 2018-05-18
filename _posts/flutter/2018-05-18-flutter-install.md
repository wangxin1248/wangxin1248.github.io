---
layout: post
title:  "Flutter学习（一）：开发环境搭建-macOS版"
date:  2018-05-18
desc: "Flutter是谷歌的移动UI框架，可以快速在iOS和Android上构建高质量的原生用户界面。 Flutter可以与现有的代码一起工作。在全世界，Flutter正在被越来越多的开发者和组织使用，并且Flutter是完全免费、开源的。"
keywords: "Flutter,学习,开发环境,搭建"
categories: [Flutter]
tags: [Flutter,开发环境搭建]
---

# Flutter学习（一）：开发环境搭建-macOS版

## 什么是 Flutter

Flutter是谷歌的移动UI框架，可以快速在iOS和Android上构建高质量的原生用户界面。 Flutter可以与现有的代码一起工作。在全世界，Flutter正在被越来越多的开发者和组织使用，并且Flutter是完全免费、开源的。

flutter中文官网:[flutter](https://flutterchina.club)

官方文档：[文档](https://flutterchina.club/get-started/install/)

flutter中文开发者论坛：[论坛地址](http://flutter-dev.cn)

官方交流QQ群：482462550

## 本教程是在Mac OS中进行环境搭建演示，Windows 以及 Linux 的搭建请前往官网进行查看

windows 环境搭建演示：[演示](https://flutterchina.club/setup-windows/)
linux 环境搭建演示：[演示](https://flutterchina.club/setup-linux/)

## 系统要求

要安装并运行Flutter，您的开发环境必须满足以下最低要求:

操作系统: macOS (64-bit)
磁盘空间: 700 MB (不包括Xcode或Android Studio的磁盘空间）.
工具: Flutter 依赖下面这些命令行工具.
bash, mkdir, rm, git, curl, unzip, which

下面便开始进行flutter的安装

## 安装和配置Flutter

### 下载 Flutter SDK

目前flutter是一开源项目的形式保存在 [GitHub](https://github.com/flutter/flutter) 上的，可以前往前往其GitHub上进行项目下载，也可以直接下载对应的SDK

下载项目:
```
git clone -b beta https://github.com/flutter/flutter.git 
```

下载SDK:

[flutter_macos_v0.3.2-beta.zip ](https://storage.googleapis.com/flutter_infra/releases/beta/macos/flutter_macos_v0.3.2-beta.zip)

具体的 SDK列表[SDK archive](https://flutter.io/sdk-archive/)

我使用的是下载SDK，下载完成之后将其解压，得到flutter的源程序，将其放置到你习惯放置应用的地方。我这里放到了当前用户下到library目录下。现在，flutter的程序便已经安装完成。

### 配置环境变量

在安装完成flutter的程序之后，需要将其配置在环境变量中去。这里跳过了官网的临时变量配置的步骤，主要是因为临时变量最终还是得换成环境变量，因此直接配置为全局的环境变量。

首先，打开 **$HOME/.bash_profile** 文件，改文件不存在则直接创建

```
vi $HOME/.bash_profile
```

在其中加入

```
export PATH= flutter保存路径/flutter/bin:$PATH
```

**注意**，这里因为我自己以前配置过这个文件，导致不能直接在文件末尾添加。我直接在文件末尾添加导致了出现 -bash: brew: No such file or directory -bash: grep: No such file or directory 的错误。网上百度无果之后，便尝试改变了添加语句的位置，之后便成功了。附上我的 $HOME/.bash_profile 配置内容：

```
  1 if brew list | grep coreutils > /dev/null ; then
  2         PATH="$(brew --prefix coreutils)/libexec/gnubin:$PATH"
  3         export PATH=~/library/flutter/bin:$PATH
  4         alias ls='ls -F --show-control-chars --color=auto'
  5         eval `gdircolors -b $HOME/.dir_colors`
  6 fi
  7 alias grep='grep --color'
  8 alias egrep='egrep --color'
  9 alias fgrep='fgrep --color'
 10 alias ll='ls -alF'
 11 alias la='ls -A'
 12 alias l='ls -CF'
```

## 安装 Xcode

想要开发 iOS 上的软件还是需要使用 Xcode来进行编译的。因此首先需要安装Xcode。安装可以从 macOS中的 app story中进行安装。

安装完之后，需要配置配置Xcode命令行工具

```
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

在安装玩之后需要确保 Xcode 许可协议是通过的。打开一次 Xcode 或通过命令

```
sudo xcodebuild -license
```

来进行同意

使用Xcode，您可以在 iOS设备或模拟器上运行 Flutter应用程序。

## iOS 设备设置

想要调试flutter项目目前有两种方式：iOS设备或模拟器，接下来分别进行介绍。

### 设置iOS模拟器

要准备在 iOS模拟器上运行并测试 Flutter应用，请按以下步骤操作：

在Mac上，通过Spotlight或使用以下命令找到模拟器:

```
open -a Simulator
```

通过检查模拟器 硬件>设备 菜单中的设置，确保您的模拟器正在使用64位设备（iPhone 5s或更高版本）.
根据您的开发机器的屏幕大小，模拟的高清屏iOS设备可能会使您的屏幕溢出。在模拟器的 Window> Scale 菜单下设置设备比例

### 安装到iOS设备

可以直接将 Flutter应用程序部署到物理 iOS设备

但是得需要一些其他工具和Apple帐户，还需要在Xcode中设置物理设备部署。

首先需要[安装homebrew](https://wangxin1248.github.io/life/2018/04/mac-install-python.html)，然后打开终端并运行下面的命令来安装用于将Flutter应用程序部署到iOS设备的工具。

```
brew update
brew install --HEAD libimobiledevice
brew install ideviceinstaller ios-deploy cocoapods
pod setup
```

如果这些命令中的任何一个失败并出现错误，请运行 **brew doctor**并按照说明解决问题.

遵循Xcode签名流程来配置您的项目:
1. 在你Flutter项目目录中通过 **open ios/Runner.xcworkspace**打开默认的Xcode workspace.

2. 在Xcode中，选择导航面板左侧中的Runner项目

3. 在 **Runner target**设置页面中，确保在 **常规>签名>团队** 下选择了您的开发团队。当您选择一个团队时，Xcode会创建并下载开发证书，向您的设备注册您的帐户，并创建和下载配置文件（如果需要）

4. 要开始您的第一个iOS开发项目，您可能需要使用您的Apple ID登录Xcode.
![Xcode account add](https://flutterchina.club/images/setup/xcode-account.png)

5. 任何Apple ID都支持开发和测试。需要注册Apple开发者计划才能将您的应用分发到App Store. 查看[differences between Apple membership types.](https://developer.apple.com/support/compare-memberships)
6. 当您第一次attach真机设备进行iOS开发时，您需要同时信任你的Mac和该设备上的开发证书。首次将iOS设备连接到Mac时,请在对话框中选择 Trust。

![Trust Mac](https://flutterchina.club/images/setup/trust-computer.png)

7. 然后，转到iOS设备上的设置应用程序，选择 **常规>设备管理** 并信任您的证书。
8. 如果Xcode中的自动签名失败，请验证项目的 **General > Identity > Bundle Identifier** 值是否唯一.
![Check the app's Bundle ID](https://flutterchina.club/images/setup/xcode-unique-bundle-id.png)

## Android设置

### 安装Android Studio

如果想要开发 Android项目的话，便还是需要下载安装 Android Studio


下载[Android Studio](https://developer.android.com/studio/index.html)

下载完成之后，启动 Android Studio，然后执行“Android Studio安装向导”。安装最新的Android SDK，Android SDK平台工具和 Android SDK 构建工具，这是 Flutter为 Android开发时所必需的。

开发Android时也是支持在实机和虚拟机两种方式来进行调试。

### 真机调试

首先需要在 Android设备上启用 **开发人员选项**和 **USB调试** 。

使用USB将手机插入电脑。如果您的设备出现提示，请授权您的计算机访问您的设备。

在终端中，运行 **flutter devices** 命令以验证 Flutter是否识别连接的Android设备。

默认情况下，Flutter使用的 Android SDK版本是基于你的 adb 工具版本。 
如果想让 Flutter使用不同版本的 Android SDK，则必须将该 **ANDROID_HOME** 环境变量设置为SDK安装目录。

### 设置Android模拟器


首先需要在机器上启用 [VM acceleration](https://developer.android.com/studio/run/emulator-acceleration) .

启动 **Android Studio>Tools>Android>AVD Manager** 并选择 **Create Virtual Device.**

选择一个设备并选择 Next。

为要模拟的Android版本选择一个或多个系统映像，然后选择 Next. 建议使用 x86 或 x86_64 image .

在 Emulated Performance下, 选择 **Hardware - GLES 2.0** 以启用 硬件加速.

验证AVD配置是否正确，然后选择 **Finish**。

在 **Android Virtual Device Manager**中, 点击工具栏的 **Run**。模拟器启动并显示所选操作系统版本或设备的启动画面.


## 执行 Flutter

设置好相应的 iOS模拟器或者 Android模拟器，或者连接真机之后，使用如下命令来创建项目

```
flutter create myapp
cd myapp
flutter run
```

## 使用 IDEA 来创建项目


打开IDEA，按下图所示，点击Plugins进入插件管理页面

![flutter-1-使用idea创建项目](/assets/images/2018-05/flutter-1-使用idea创建项目.png)

在插件管理页面，搜索Dart、Flutter两个插件并点击安装
![flutter-1-dart](/assets/images/2018-05/flutter-1-dart.png)
![flutter-1-flutter](/assets/images/2018-05/flutter-1-flutter.png)


下载插件后，点击创建新项目，先选择Dart，在对应位置填入Dart SDK的path

最后再选择Flutter，在对应位置填入Flutter SDK的path，然后点击创建按钮，就可以创建一个新的Flutter项目了
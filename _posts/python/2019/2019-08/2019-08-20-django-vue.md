---
layout: post
title:  "Python3 Django+Vue 开发环境搭建"
date:  2019-08-20
desc: "Django 是目前 python 后台开发比较完善的开发框架，配合 Vue 可以实现前后端分离的 web 项目"
keywords: "Python3,后台开发,vue,django,MVC,MVVM,环境搭建"
categories: [Python]
tags: [python3,环境搭建,django]
---
# Django+Vue 开发环境搭建

## Django 项目搭建

首先使用 PyCharm 创建一个 Django 项目：

![创建项目](/assets/images/2019/2019-08/1.png)

创建项目时指定一个项目 app 为 users，用来对用户进行管理。

接下来创建一个 python 包 apps 用来存放所有的 app：

![创建项目](/assets/images/2019/2019-08/2.png)

再创建一个 python 包 extra_apps 用来存放所有的第三方 app

之后，将 apps,extra_apps mark 为 sources root

![创建项目](/assets/images/2019/2019-08/3.png)

这样，一个简单的 Django 项目便搭建完成。

## Vue 项目创建

为了快速安装，首先安装 cnmp

```shell
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

接下来安装 vue：

```shell
cnpm install -g vue-cli
```

安装完 vue 之后在当前 Django 项目的根目录下创建 vue 项目

```shell
vue-init webpack frontend
```

在创建项目的过程中会弹出一些与项目相关的选项需要回答，按照真实情况进行输入即可。

安装 vue 依赖模块

```shell
cd frontend
cnpm install
```

打包前端代码

```shell
cnpm run build
```

打包完成之后便会在 vue 项目中生成一个 dist 文件夹，里面保存了项目对应的 html 文件以及静态资源。

![dist](/assets/images/2019/2019-08/5.png)

至此，vue 前端项目便搭建完成。

## Django 项目配置

### Vue 配置

首先需要将前端界面所对应的页面文件配置到 Django 项目中。

在 Django 项目的 urls.py 中指定主页路径：

```python
from django.contrib import admin
from django.urls import path, re_path
# 所需包
from django.views.generic.base import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    # 修改为vue主页
    re_path(r'^$', TemplateView.as_view(template_name='index.html')),
]
```

接下来需要在 Django 项目的 settings.py 文件中进行设置：

首先修改之前的模版设置为 vue 的界面路径

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # 指定为vue的页面路径
        'DIRS': [os.path.join(BASE_DIR, 'frontend/dist')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

并且指定静态资源路径

```py
# 配置静态文件路径
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "frontend/dist/static"),
]
```

### 项目自动响应更改配置

首先安装对应的包：

```shell
pip install django-cors-headers
```

在 settings.py 文件中进行设置

```py
# 自动响应变化
CORS_ORIGIN_ALLOW_ALL = True

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    # 自动响应变化
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```
注意，中间件的位置顺序不能乱写。

### 数据库设置

项目使用 mysql 数据库，因此得修改 settings.py 中的 DATABASES 设置

```py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',# 选择使用mysql的驱动
        'NAME': '',# 数据库名称
        'USER': '',# 数据库用户名
        'PASSWORD': '',# 数据库用户对应密码
        'HOST': '',# 数据库ip
        'PORT': '3306',# 数据库端口号，默认是3306
    }
}
```

## 运行项目

在终端中启动 Django 项目便可以在浏览器中看到搭建好的项目默认主页

```shell
python manage.py runserver
```
![项目主页](/assets/images/2019/2019-08/4.png)

项目最终目录结构如下：

![项目结构](/assets/images/2019/2019-08/6.png)
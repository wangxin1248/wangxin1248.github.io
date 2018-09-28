---
layout: post
title:  "Python3 爬虫（九）：Selenium 实战项目一：模拟登陆豆瓣网站"
date:  2018-09-09
desc: "python3 网络爬虫实战系列之九：使用Selenium 和 Chrome Headless 来模拟登陆豆瓣网站"
keywords: "Python3,网络爬虫,实战,Selenium,Chrome headless"
categories: [Python]
tags: [python3,网络爬虫,Selenium,Chrome headless]
---

# 模拟登陆豆瓣网站

豆瓣网站首页：[https://www.douban.com/](https://www.douban.com/)

通过 selenium 来配合 Chrome headless 便可以完成一个完整的用户浏览网站过程的实现，通过这个浏览器可以完成一系列的真实的用户操作。通过这些操作便可以获取到所需的界面中的数据。

## 模拟登陆原理

模拟登陆一个网站的操作基本上是通用的

首先得通过selenium 创建一个chrome headless 浏览器对象，然后使用这个浏览器来访问所需要登陆的网站。

获得网站的登陆界面数据之后便可以去查找界面中用于输入账号和密码的input 元素（通过 id 或者class name 都可以），在查找到对应的元素之后便可以向账号和密码的输入框中传入用于登陆的账号和密码，假如登陆时需要用到验证码，可以先讲当前页面截图保存，在提示用户根据截图来输入当前的验证码（之后会使用一些机器学习的库来解决验证码的问题）。

在输入完账号和验证码之后便可以点击登陆按钮来进行登陆操作，这样便完成了一个完整的使用爬虫来模拟登陆操作。

## 代码

```python
# 导入selenium来创建访问浏览器的接口
from selenium import webdriver

# 导入控制浏览器的指令
from selenium.webdriver.common.keys import Keys


def douban_login():
    """
    登陆豆瓣网站的函数
    :return:
    """
    url = 'https://www.douban.com/'

    # 创建chrome启动项
    chrome_options = webdriver.ChromeOptions()

    # 指定chrome启动类型为headless，并且禁用gpu
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')

    # 创建chrome浏览器对象
    driver = webdriver.Chrome(chrome_options=chrome_options, executable_path='/home/wx/application/chromedriver')

    # 获取豆瓣网页首页
    driver.get(url=url)

    # 输入用户名和密码
    driver.find_element_by_id('form_email').send_keys('wangxin1349433028@gmail.com')
    driver.find_element_by_id('form_password').send_keys('WANGXIN5@+-')

    # 获取对应的验证码并进行输入
    driver.save_screenshot('douban.png')
    captcha_field = input('请输入验证码：')
    driver.find_element_by_id('captcha_field').send_keys(captcha_field)

    # 进行登陆，并打印首页信息
    driver.find_element_by_class_name('bn-submit').click()
    print('登陆成功')
    driver.save_screenshot('douban_index.png')

    # 关闭浏览器
    driver.close()


if __name__ == '__main__':
    douban_login()
```
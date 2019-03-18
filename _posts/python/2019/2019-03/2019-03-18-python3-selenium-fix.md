---
layout: post
title:  "Python3 爬虫（二十四）：selenium 的三种等待方式"
date:  2019-03-18
desc: "selenium.common.exceptions.StaleElementReferenceException: Message: stale element reference: element is not attached to the page document"
keywords: "Python3,selenium,exceptions,StaleElementReferenceException,Message,element,attached,等待"
categories: [Python]
tags: [python3,网络爬虫,selenium]
---
# selenium 的三种等待方式

## 一个 Bug

selenium.common.exceptions.StaleElementReferenceException: Message: stale element reference: element is not attached to the page document

这是在运行下面一段简单的爬虫代码时发现的bug：

```python
from selenium import webdriver
  
chrome_options = webdriver.ChromeOptions()

chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-gpu')

driver = webdriver.Chrome(chrome_options=chrome_options, executable_path='/home/wx/application/chromedriver')

driver.get('https://www.douyu.com/directory/all')
data = driver.find_elements_by_class_name('DyListCover-hot')
for hot_num in data:
    print(hot_num.text)
driver.quit()
```

出现错误：

```
selenium.common.exceptions.StaleElementReferenceException: Message: stale element reference: element is not attached to the page document
  (Session info: headless chrome=73.0.3683.75)
  (Driver info: chromedriver=73.0.3683.68 (47787ec04b6e38e22703e856e101e840b65afe72),platform=Linux 4.15.0-46-generic x86_64)
```

相信很多新手一开始都会这么写，但运行的时候就会报错，其实这是因为没有加等待的原因。由于 selenium 并没有等到页面元素加载出来就直接获取数据，就造成了所要获取的元素与页面不相符。这里就得说一下**selenium加等待**的重要性了。

其实这里就得知道代码运行速度和浏览器加载渲染速度是不成正比的。代码的运行速度要远快于浏览器的渲染速度，当代码都执行完了而浏览器还没渲染出界面，这时程序便会报错：element is not attached to the page document

那么怎么才能照顾到浏览器缓慢的渲染速度呢？只有一个办法，那就是等待。而等待，又有三种等法

### 1.强制等待

- sleep(xx)

直接让进程休眠指定xx时间。

```python
from selenium import webdriver
  
chrome_options = webdriver.ChromeOptions()

chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-gpu')

driver = webdriver.Chrome(chrome_options=chrome_options, executable_path='/home/wx/application/chromedriver')

driver.get('https://www.douyu.com/directory/all')
# 强制等待3秒
sleep(3)
data = driver.find_elements_by_class_name('DyListCover-hot')
for hot_num in data:
    print(hot_num.text)
driver.quit()

```

这种叫强制等待，不管浏览器是否加载完成，程序都得等待3秒，3秒一到，继续执行下面的代码。这种方式作为调试很有用，有时候也可以在代码里这样等待，不过不建议使用这种等待方式，会严重影响程序执行速度。

### 2.隐性等待

- implicitly_wait(xx)

程序隐形等待，在指定时间内浏览器渲染完成就直接执行下面的代码。否则等待xx秒后直接执行下面的代码。

```python
from selenium import webdriver
  
chrome_options = webdriver.ChromeOptions()

chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-gpu')

driver = webdriver.Chrome(chrome_options=chrome_options, executable_path='/home/wx/application/chromedriver')

driver.get('https://www.douyu.com/directory/all')
# 隐性等待30秒
driver.implicitly_wait(30)
data = driver.find_elements_by_class_name('DyListCover-hot')
for hot_num in data:
    print(hot_num.text)
driver.quit()

```

隐形等待是设置了一个最长等待时间，如果在规定时间内网页加载完成，则执行下一步，否则一直等到时间截止，然后执行下一步。这样有产生一个弊端，那就是程序会一直等待整个页面加载完成，也就是一般情况下看到浏览器标签栏那个小圈不再转，才会执行下一步，但有时候页面想要的元素早就在加载完成了，但是因为个别js之类的东西特别慢，程序仍得等到页面全部完成才能执行下一步。假如想等界面中想要的元素出来之后就下一步怎么办？这时，就得看 selenium 提供的另一种等待方式 —— 显性等待。

注意：**隐性等待对整个driver的周期都起作用，所以只要设置一次即可**

### 3.显性等待

- WebDriverWait

配合该类的 until() 和 until_not() 方法使用，能够根据判断条件而进行灵活地等待了。显性等待得等到执行的页面元素加载出来之后才会继续执行下面的代码。

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

chrome_options = webdriver.ChromeOptions()

chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-gpu')

driver = webdriver.Chrome(chrome_options=chrome_options, executable_path='/home/wx/application/chromedriver')
driver.get('https://www.douyu.com/directory/all')

try:
    # 显性等待 DyListCover-hot class 加载出来20秒，每0.5秒检查一次
    WebDriverWait(driver, 20, 0.5).until(EC.presence_of_element_located((By.CLASS_NAME, "DyListCover-hot")))
    data = driver.find_elements_by_class_name('DyListCover-hot')
    for hot_num in data:
        print(hot_num.text)
finally:
    driver.close()
```

显性等待调用格式：

```python
WebDriverWait(driver, 超时时长, 调用频率, 忽略异常).until(可执行方法, 超时时返回的信息)
```

其中 selenium.webdriver.support.expected_conditions 是 selenium 的一个模块，其中包含一系列可用于判断的条件：

- title_is
- title_contains
- presence_of_element_located
- visibility_of_element_located
- visibility_of
- presence_of_all_elements_located
- text_to_be_present_in_element
- text_to_be_present_in_element_value
- frame_to_be_available_and_switch_to_it
- invisibility_of_element_located
- element_to_be_clickable 
- staleness_of
- element_to_be_selected
- element_located_to_be_selected
- element_selection_state_to_be
- element_located_selection_state_to_be
- alert_is_present

显性等待中 selenium.webdriver.common.by 中 By 所支持查找的类型：

- CLASS_NAME = 'class name'
- CSS_SELECTOR = 'css selector'
- ID = 'id'
- LINK_TEXT = 'link text'
- NAME = 'name'¶
- PARTIAL_LINK_TEXT = 'partial link text'
- TAG_NAME = 'tag name'
- XPATH = 'xpath'

注意：**隐性等待和显性等待可以一同使用，最长的等待时间取决于两者之间的大者。**

## 总结

- 在使用 selenium 爬去网页的过程中加等待是非常重要的一步，千万不能省略
- 推荐使用显性等待+隐性等待结合的方式
- 调试中可以使用 sleep，正式代码中不建议使用
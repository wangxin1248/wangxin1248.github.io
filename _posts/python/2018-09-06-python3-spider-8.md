---
layout: post
title:  "Python3 爬虫（八）：Selenium 和 Chrome Headless"
date:  2018-09-06
desc: "python3 网络爬虫实战系列之八：学习使用Selenium 和 Chrome Headless来爬取动态网页中的内容"
keywords: "Python3,网络爬虫,实战,知识点,Selenium,PhantomJS"
categories: [Python]
tags: [python3,网络爬虫,Selenium,PhantomJS]
---
# 动态HTML实现技术

动态的 HTML 区别于静态的 HTML， 其是用户在浏览网页的过程中动态进行加载的。实现动态 HTML 的技术主要有一下几种：

## JavaScript

JavaScript 是网络上最常使用的也是支持者最多的客户端脚本语言。他可以收集用户的跟踪数据，不需要重载页面就能直接提交表单，在页面中嵌入多媒体文件，甚至他可以运行网页游戏。

## jQuery

jQuery是一个十分常见的库，主要用来动态的创建 HTML 内容，只有在 JavaScript 代码值从之后才会显示。因此使用爬虫爬取使用了 jQuery 的网页的时候必须小心，必须得先执行其网页中对应的 JavaScript 代码。

## Ajax

Ajax其实并不是一门语言，而是用来完成网络任务的一系列技术。Ajax的全称为：Asynchronous JavaScript and XML（异步 JavaScript 和 XML），使用该技术可以使的网站不需要使用单独的页面请求就可以和网络服务器进行交互。

## DHTML

DHTML 称为动态 HTML，也是一系列用于解决网络问题的集合。DHTML 是用客户端语言改变页面的 HTML 元素。网页是否属于 DHTML，关键是要看有没有用 JavaScript 控制 html 和 css 元素。

# Selenium 和 Chrome Headless

为了爬取动态网页中的内容，可以使用 python的第三方库来直接运行 JavaScript 代码，获取在浏览器中所看到的数据。

之前使用的都是Selenium 和 PhantomJS来进行模拟浏览器登陆，但是在 Selenium 更新之后便不在支持PhantomJS 了，而是改为支持 Chrome 和 Firefox 所推出的无头浏览器。

在最新的版本中使用如下语句创建一个浏览器对象时回报错

```python
driver = webdriver.PhantomJS()
```

错误内容：

> Selenium support for PhantomJS has been deprecated, please use headless versions of Chrome or Firefox instead

因此本来是需要学习 Selenium 和 PhantomJS来进行动态页面的爬取的，现在改为了使用 Selenium 和 Chrome Headless来进行

## Selenium

Selenium 是一个 web的自动化测试工具，最初是为网站自动化测试而开发的，可以按照指定的命令自动操作。并且支持所有的主流浏览器，包括 PhantomJS这样的无界面的浏览器。

Selenium自己不带浏览器，不支持浏览器的功能，他需要与第三方的浏览器结合在一起使用。

### 安装 Selenium

Selenium 的安装可以使用第三方管理器 pip 来进行安装

```bash
$ pip3 install selenium
```

## Chrome Headless

Headless Chrome 指在 headless 模式下运行谷歌浏览器。本质就是不用谷歌运行谷歌！它将由 Chromium 和Blink 渲染引擎提供的所有现代网页平台的特征都转化成了命令行。

它有什么用？

Headless浏览器是一种很好的工具，用于自动化测试和不需要可视化用户界面的服务器。例如，你想在一个网页上运行一些测试，从网页创建一个PDF，或者只是检查浏览器怎样递交URL。

安装 ChromeHeadless的方法见我的博客

# Selenium 实际使用

Selenium 库里有个叫 WebDriver 的 API。WebDriver 有点儿像可以加载网站的浏览器，但是它也可以像 BeautifulSoup 或者其他 Selector 对象一样用来查找页面元素，与页面上的元素进行交互 (发送文本、点击等)，以及执行其他动作来运行网络爬虫。

示例演示：

```python
# 导入 webdriver
from selenium import webdriver

# 要想调用键盘按键操作需要引入keys包
from selenium.webdriver.common.keys import Keys

# 创建chrome启动选项
chrome_options = webdriver.ChromeOptions()

# 指定chrome启动类型为headless 并且禁用gpu
chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-gpu')

# 调用环境变量指定的chrome浏览器创建浏览器对象
driver = webdriver.Chrome(chrome_options=chrome_options)

# 如果没有在环境变量指定PhantomJS位置
# driver = webdriver.PhantomJS(chrome_options=chrome_options, executable_path='/home/wx/application/chromedriver')

# get方法会一直等到页面被完全加载，然后才会继续程序，通常测试会在这里选择 time.sleep(2)
driver.get("http://www.baidu.com/")

# 获取页面名为 wrapper的id标签的文本内容
data = driver.find_element_by_id("wrapper").text

# 打印数据内容
print data

# 打印页面标题 "百度一下，你就知道"
print driver.title

# 生成当前页面快照并保存
driver.save_screenshot("baidu.png")

# id="kw"是百度搜索输入框，输入字符串"长城"，注意中文前面得加u将其变为原始字符串
driver.find_element_by_id("kw").send_keys(u"长城")

# id="su"是百度搜索按钮，click() 是模拟点击
driver.find_element_by_id("su").click()

# 获取新的页面快照
driver.save_screenshot("长城.png")

# 打印网页渲染后的源代码
print driver.page_source

# 获取当前页面Cookie
print driver.get_cookies()

# ctrl+a 全选输入框内容
driver.find_element_by_id("kw").send_keys(Keys.CONTROL,'a')

# ctrl+x 剪切输入框内容
driver.find_element_by_id("kw").send_keys(Keys.CONTROL,'x')

# 输入框重新输入内容
driver.find_element_by_id("kw").send_keys("wangxin")

# 模拟Enter回车键
driver.find_element_by_id("su").send_keys(Keys.RETURN)

# 清除输入框内容
driver.find_element_by_id("kw").clear()

# 生成新的页面快照
driver.save_screenshot("王鑫.png")

# 获取当前url
print driver.current_url

# 关闭当前页面，如果只有一个页面，会关闭浏览器
driver.close()

```

## 页面操作

Selenium 的 WebDriver提供了各种方法来寻找元素，假设下面有一个表单输入框：

```html
<input type="text" name="user-name" id="passwd-id" />
```

那么：

```python
# 获取id标签值
element = driver.find_element_by_id("passwd-id")
# 获取name标签值
element = driver.find_element_by_name("user-name")
# 获取标签名值
element = driver.find_elements_by_tag_name("input")
# 也可以通过XPath来匹配
element = driver.find_element_by_xpath("//input[@id='passwd-id']")
```

## 定位UI元素 (WebElements)

关于元素的选取，有如下的API 单个元素选取

```python
find_element_by_id
find_elements_by_name
find_elements_by_xpath
find_elements_by_link_text
find_elements_by_partial_link_text
find_elements_by_tag_name
find_elements_by_class_name
find_elements_by_css_selector
```

### 1.By ID

```html
<div id="coolestWidgetEvah">...</div>
```

实现

```python

element = driver.find_element_by_id("coolestWidgetEvah")

# 或者
from selenium.webdriver.common.by import By
element = driver.find_element(by=By.ID, value="coolestWidgetEvah")
```

### 2.By Class Name

```html
<div class="cheese"><span>Cheddar</span></div><div class="cheese"><span>Gouda</span></div>
```

实现

```python
cheeses = driver.find_elements_by_class_name("cheese")

# 或者
from selenium.webdriver.common.by import By
cheeses = driver.find_elements(By.CLASS_NAME, "cheese")
```

### 3.By Tag Name

```html
<iframe src="..."></iframe>
```

实现

```python
frame = driver.find_element_by_tag_name("iframe")

# 或者
from selenium.webdriver.common.by import By
frame = driver.find_element(By.TAG_NAME, "iframe")
```

### 4.By Name

```html
<input name="cheese" type="text"/>
```

实现

```python
cheese = driver.find_element_by_name("cheese")

# 或者
from selenium.webdriver.common.by import By
cheese = driver.find_element(By.NAME, "cheese")
```

### 5.By Link Text

```html
<a href="http://www.google.com/search?q=cheese">cheese</a>
```

实现

```python
cheese = driver.find_element_by_link_text("cheese")

# 或者
from selenium.webdriver.common.by import By
cheese = driver.find_element(By.LINK_TEXT, "cheese")
```

### 6.By Partial Link Text

```html
<a href="http://www.google.com/search?q=cheese">search for cheese</a>>
```

实现

```python
cheese = driver.find_element_by_partial_link_text("cheese")

# 或者
from selenium.webdriver.common.by import By
cheese = driver.find_element(By.PARTIAL_LINK_TEXT, "cheese")
```

### 7.By CSS

```html
<div id="food"><span class="dairy">milk</span><span class="dairy aged">cheese</span></div>
```

实现

```python
cheese = driver.find_element_by_css_selector("#food span.dairy.aged")

# 或者
from selenium.webdriver.common.by import By
cheese = driver.find_element(By.CSS_SELECTOR, "#food span.dairy.aged")
```

### 8.By XPath

```html
<input type="text" name="example" /> <INPUT type="text" name="other" />
```

实现

```python
inputs = driver.find_elements_by_xpath("//input")

# 或者
from selenium.webdriver.common.by import By
inputs = driver.find_elements(By.XPATH, "//input")
```

## 鼠标动作链

有些时候，我们需要再页面上模拟一些鼠标操作，比如双击、右击、拖拽甚至按住不动等，我们可以通过导入 ActionChains 类来做到：

```python
#导入 ActionChains 类
from selenium.webdriver import ActionChains

# 鼠标移动到 ac 位置
ac = driver.find_element_by_xpath('element')
ActionChains(driver).move_to_element(ac).perform()


# 在 ac 位置单击
ac = driver.find_element_by_xpath("elementA")
ActionChains(driver).move_to_element(ac).click(ac).perform()

# 在 ac 位置双击
ac = driver.find_element_by_xpath("elementB")
ActionChains(driver).move_to_element(ac).double_click(ac).perform()

# 在 ac 位置右击
ac = driver.find_element_by_xpath("elementC")
ActionChains(driver).move_to_element(ac).context_click(ac).perform()

# 在 ac 位置左键单击hold住
ac = driver.find_element_by_xpath('elementF')
ActionChains(driver).move_to_element(ac).click_and_hold(ac).perform()

# 将 ac1 拖拽到 ac2 位置
ac1 = driver.find_element_by_xpath('elementD')
ac2 = driver.find_element_by_xpath('elementE')
ActionChains(driver).drag_and_drop(ac1, ac2).perform()
```

## 填充表单

我们已经知道了怎样向文本框中输入文字，但是有时候我们会碰到<select> </select>标签的下拉框。直接点击下拉框中的选项不一定可行。

```html
<select id="status" class="form-control valid" onchange="" name="status">
    <option value=""></option>
    <option value="0">未审核</option>
    <option value="1">初审通过</option>
    <option value="2">复审通过</option>
    <option value="3">审核不通过</option>
</select>
```

Selenium 专门提供了 Select 类来处理下拉框。 

其实 WebDriver 中提供了一个叫 Select 的方法，可以帮助我们完成这些事情：

```python
# 导入 Select 类
from selenium.webdriver.support.ui import Select

# 找到 name 的选项卡
select = Select(driver.find_element_by_name('status'))

# 
select.select_by_index(1)
select.select_by_value("0")
select.select_by_visible_text(u"未审核")
```

以上是三种选择下拉框的方式，它可以根据索引来选择，可以根据值来选择，可以根据文字来选择。注意：

```python
"""
index 索引从 0 开始
value是option标签的一个属性值，并不是显示在下拉框中的值
visible_text是在option标签文本的值，是显示在下拉框的值
全部取消选择怎么办呢？很简单:
select.deselect_all()
"""
```

## 弹窗处理

当你触发了某个事件之后，页面出现了弹窗提示，处理这个提示或者获取提示信息方法如下：

```python
alert = driver.switch_to_alert()
```

## 页面切换

一个浏览器肯定会有很多窗口，所以我们肯定要有方法来实现窗口的切换。

切换窗口的方法如下：

```python
driver.switch_to.window("this is window name")
```

也可以使用 window_handles 方法来获取每个窗口的操作对象。例如：

```python
for handle in driver.window_handles:
    driver.switch_to_window(handle)
```

## 页面前进和后退

操作页面的前进和后退功能：

```python
driver.forward()     #前进
driver.back()        # 后退
```

## Cookies

获取页面每个Cookies值，用法如下

```python
for cookie in driver.get_cookies():
    print "%s -> %s" % (cookie['name'], cookie['value'])
```

删除Cookies，用法如下

```python
# By name
driver.delete_cookie("CookieName")

# all
driver.delete_all_cookies()
```

## 页面等待

现在的网页越来越多采用了 Ajax 技术，这样程序便不能确定何时某个元素完全加载出来了。

如果实际页面等待时间过长导致某个dom元素还没出来，但是你的代码直接使用了这个WebElement，那么就会抛出NullPointer的异常。

为了避免这种元素定位困难而且会提高产生 ElementNotVisibleException 的概率。所以 Selenium 提供了两种等待方式，一种是隐式等待，一种是显式等待。

隐式等待是等待特定的时间，显式等待是指定某一条件直到这个条件成立时继续执行。

### 1.显式等待
显式等待指定某个条件，然后设置最长等待时间。如果在这个时间还没有找到元素，那么便会抛出异常了。

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
# WebDriverWait 库，负责循环等待
from selenium.webdriver.support.ui import WebDriverWait
# expected_conditions 类，负责条件出发
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get("http://www.xxxxx.com/loading")
try:
    # 页面一直循环，直到 id="myDynamicElement" 出现
    element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "myDynamicElement"))
    )
finally:
    driver.quit()
```

如果不写参数，程序默认会 0.5s 调用一次来查看元素是否已经生成，如果本来元素就是存在的，那么会立即返回。

下面是一些内置的等待条件，你可以直接调用这些条件，而不用自己写某些等待条件了。

```python
title_is
title_contains
presence_of_element_located
visibility_of_element_located
visibility_of
presence_of_all_elements_located
text_to_be_present_in_element
text_to_be_present_in_element_value
frame_to_be_available_and_switch_to_it
invisibility_of_element_located
element_to_be_clickable – it is Displayed and Enabled.
staleness_of
element_to_be_selected
element_located_to_be_selected
element_selection_state_to_be
element_located_selection_state_to_be
alert_is_present
```

### 隐式等待

隐式等待比较简单，就是简单地设置一个等待时间，单位为秒。

```python
from selenium import webdriver

driver = webdriver.Chrome()
driver.implicitly_wait(10) # seconds
driver.get("http://www.xxxxx.com/loading")
myDynamicElement = driver.find_element_by_id("myDynamicElement")
```

当然如果不设置，默认等待时间为0。
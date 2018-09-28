---
layout: post
title:  "Python3 爬虫（十）：Selenium 实战项目二：爬取斗鱼直播网站"
date:  2018-09-10
desc: "python3 网络爬虫实战系列之十：使用Selenium 和 Chrome Headless 来爬取斗鱼直播网站，获取每一个直播间的对应信息，将其保存到本地中。并进行简单的数据统计操作"
keywords: "Python3,网络爬虫,实战,Selenium,Chrome headless"
categories: [Python]
tags: [python3,网络爬虫,Selenium,Chrome headless]
---

# 爬取斗鱼直播网站

[斗鱼直播](https://www.douyu.com/directory/all)是国内比较大的直播平台，具有大量的直播间。

现在使用Selenium 和 Chrome Headless 来爬取斗鱼直播网站，获取网站中每一个直播间的对应信息，并将其保存到本地中。之后在进行简单的数据统计操作，获取到当前网站中所有直播间的数量，并且获取到当前时间内所有观看直播的人数。

## 爬取原理

爬取像斗鱼这样的大型网站肯定需要一定的时间，因此将爬取代码加入到单元测试中，这样便可以直观的看到程序执行所花费的时间。

这里使用的单元测试模块是 [unittest](https://docs.python.org/3/library/unittest.html)

爬取斗鱼直播中所有的直播间信息首先得获取到直播页面所对应的网页资源，再获得页面资源之后便可以对页面中的元素进行解析，这里使用 xpath 来进行解析，具体的解析规则如下：

首先获取到每一页当中所有的直播间信息

```python
//div[@id="live-list-content"]//li
```

再从所有的直播间中找出每一个直播间的信息（将这些信息以json的形式保存到本地）

```python
# 直播间房间名称：
.//h3/text()

# 房间主播名称：
.//span[@class="dy-name ellipsis fl"]/text()

# 房间观看人数：
.//span[@class="dy-num fr"]/text()

# 房间封面图片url：
.//span[@class="imgbox"]/img[@class="JS_listthumb"]/@src
```

在将当前页面中的资源解析完毕之后便可以去获取下一页的资源继续进行解析，获取下一页的资源可以通过点击当前页面中的下一页按钮来进行。

由于斗鱼有几百页的界面，并且还在随着时间的增长动态调整。因此这里可以使用一个死循环来不断的获取下一页的数据，只需判断当前页是否是最后一页，假如当前页是最后一页的话变可以退出循环，否则将一直进行死循环。

在爬取每页数据的过程中还涉及到对数据进行统计，这里主要统计两个数据指标：总的直播间数量、总的观看直播人数

总的直播间数量很简单，只用在获取每一页中所有的直播间的过程中对每一个直播间处理的过程中对计数指针+1就可以了。

重点是直播人数的获取，斗鱼的直播人数在上万之后便使用万作为单位来显示，而不是直接显示数字。所以这里会涉及到一个单位获取与转换的问题。

## 代码

```python
# 导入selenium来创建一个浏览器的接口api
from selenium import webdriver
# 导入单元测试模块
import unittest
# 导入json模块，将来需要将获取的信息保存到本地文件中
import json
# 导入lxml来对网页源码进行解析
from lxml import etree
import time


class DouyuTest(unittest.TestCase):
    """
    获取斗鱼直播平台的相关信息并进行数据统计操作
    """
    def setUp(self):
        """
        单元测试初始化操作
        :return:
        """
        # 所需要爬取的网页
        self.url = 'https://www.douyu.com/directory/all'

        print('开始爬取...')

        # 创建浏览器对象
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--disable-gpu')
        self.driver = webdriver.Chrome(chrome_options=chrome_options, executable_path='/home/wx/application/chromedriver')

        # 总的直播间数量统计
        self.home_number = 0
        # 总的观看直播人数统计
        self.people_number = 0

        self.page_number = 0

    def test_get_douyu(self):
        """
        需要测试的方法，注意：必须以test开头
        :return:
        """
        # 访问斗鱼网站
        self.driver.get(self.url)

        # 开始对网页中的内容进行匹配
        while True:
            # 获取当前网页的源码
            html = self.driver.page_source
            self.page_number += 1

            # 将网页源码转换为html dom格式
            content = etree.HTML(html)

            # 获取当前页面中所有的直播间信息
            zhibo_list = content.xpath('//div[@id="live-list-content"]//li')

            # 获取每一个直播间的相应信息
            for zhibo in zhibo_list:
                # 直播间名称
                name = zhibo.xpath('.//h3')
                if len(name) > 0:
                    name = name[0].text.strip()
                else:
                    name = ''
                # 主播姓名
                user_name = zhibo.xpath('.//span[@class="dy-name ellipsis fl"]')
                if len(user_name) > 0:
                    user_name = user_name[0].text.strip()
                else:
                    user_name = ''
                # 观看人数
                view_number = zhibo.xpath('.//span[@class="dy-num fr"]')
                if len(view_number) > 0:
                    view_number = view_number[0].text.strip()
                else:
                    view_number = '0'
                # 直播间封面url
                image_url = zhibo.xpath('.//span[@class="imgbox"]/img[@class="JS_listthumb"]/@src')[0].strip()

                # 以json的格式保存数据
                zhibo_json = {
                    '直播间：': name,
                    '主播：': user_name,
                    '观看人数：': view_number,
                    '直播间封面：': image_url
                }

                #  将相关信息保存到本地
                with open('douyu.json', 'a', encoding='utf-8') as file:
                    file.write(json.dumps(zhibo_json, ensure_ascii=False)+'\n')

                # 统计相关信息

                self.home_number += 1
                if view_number.endswith('万'):
                    view_number = view_number[:-1]
                    view_number = int(float(view_number)*10000)
                else:
                    view_number = int(view_number)
                self.people_number += view_number

            print('爬取了第%d页数据...'%self.page_number)
            # 判断是否跳出循环,网页中包含无法点击到下一页的内容
            if html.find("shark-pager-disable-next") != -1:
                break

            # 出现selenium.common.exceptions.StaleElementReferenceException:
            # Message: stale element reference: element is not attached to the page document
            # 页面加载太快，导致元素无法匹配，因此出现这种问题时，可以等待数秒在执行
            time.sleep(5)

            # 继续点击下一页来处理下一页的信息
            self.driver.find_element_by_class_name('shark-pager-next').click()

    def tearDown(self):
        """
        单元测试收尾操作
        :return:
        """
        print('当前网站的总直播间数量：'+str(self.home_number))
        print('当前网站的总观看人数数量：'+str(self.people_number))

        self.driver.quit()
        print('爬取结束！    ')


if __name__ == '__main__':
    # 启动单元测试，并不需要创建对应的类，只需要执行unittest的main方法就好
    unittest.main()
```
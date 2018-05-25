---
layout: post
title:  "Flutter学习（二）：创建一个交互式的Flutter应用程序"
date:  2018-05-25
desc: "本教程将完成一个简单的移动应用程序，功能是：为一个创业公司生成建议的名称。用户可以选择和取消选择的名称、保存（收藏）喜欢的名称。该代码一次生成十个名称，当用户滚动时，会生成一新批名称。用户可以点击导航栏右边的列表图标，以打开到仅列出收藏名称的新页面。"
keywords: "Flutter,学习,交互式,应用程序"
categories: [Flutter]
tags: [Flutter,学习]
---

# Flutter学习（二）：创建一个交互式的Flutter应用程序

本文将会完成 Flutter 官网的一个练习例子来作为 Flutter 开发学习的入门hello world。

主要知识点：

>
> 1. Flutter应用程序的基本结构.
> 2. 查找和使用packages来扩展功能.
> 3. 使用热重载加快开发周期.
> 4. 如何实现有状态的widget.
> 5. 如何创建一个无限的、延迟加载的列表.
> 6. 如何创建并导航到第二个页面.
> 7. 如何使用主题更改应用程序的外观.


具体的例子要求是：为一个创业公司生成建议的名称。用户可以选择和取消选择的名称、保存（收藏）喜欢的名称。该代码一次生成十个名称，当用户滚动时，会生成一新批名称。用户可以点击导航栏右边的列表图标，以打开到仅列出收藏名称的新页面。

完成效果：
<video id="video" controls="" preload="none" poster="/assets/images/2018-05/fultter-2-项目演示效果.png">
      <source id="mp4" src="/assets/videos/2018-05/QQ20180524-211040-HD.mp4" type="video/mp4">
      <p>Your user agent does not support the HTML5 Video element.</p>
</video>

## 新建项目

项目使用IDEA来创建，具体新建项目的步骤请查看[Flutter学习（一）：开发环境搭建](https://wangxin1248.github.io/flutter/2018/05/flutter-install.html)

项目创建结束之后，打开 **lib/main.dart**便是项目的主要逻辑代码所在地。

默认创建的项目中包含系统自动生成的一系列代码，这里我们将其统统删除。开始自己亲手创建一个应用程序。

## 导入所需要的第三方依赖包

由于本项目需要生成大量的单词列表，而单词自然不能靠自己去定义。一来浪费时间，二来也不能实现无限瀑布流的效果。

于是使用一个名为 [english_words](https://pub.dartlang.org/packages/english_words)的开源软件包 ，其中包含数千个最常用的英文单词以及一些实用功能.

打开 **pubspec.yaml**文件，在 **dependencies**中添加english_words包的依赖引用。

### 项目依赖添加
```
dependencies:
  flutter:
    sdk: flutter

  # The following adds the Cupertino Icons font to your application.
  # Use with the CupertinoIcons class for iOS style icons.
  cupertino_icons: ^0.1.0
  # 添加常用的英文单词包
  english_words: ^3.1.0
 
```

### 获取项目所需依赖

之后点击右上角的 **packages get**
[flutter-2-packages-get](/assets/images/2018-05/flutter-2-packages-get.png)

之后项目便会下载所需要的包并自动加载到项目中去

```
flutter packages get
Running "flutter packages get" in startup_namer...
Process finished with exit code 0
```

### 导入所需依赖

在 **lib/main.dart** 中, 引入 english_words 包和系统所需的界面包 Material，Material是一种标准的移动端和 web端的视觉设计语言。 Flutter 提供了一套丰富的 Material widgets。

```
import 'package:flutter/material.dart';
import 'package:english_words/english_words.dart';
```

## 编写项目主体框架

首先项目肯定是要有一个主要的界面来作为主界面。在 Flutte中一个界面称之为 **router（界面）**，一个大型的项目便是许许多多的路由在相互跳转。

在Flutter中，**导航器**管理应用程序的路由栈。界面之间的跳转其实是路由栈的 **压栈**和 **出栈**操作。

### 主路由

首先创建项目的主路由：

``` java
// => 为flutter中单行函数或方法的简写
void main() => runApp(new MyApp());
```

这里，主路由使用 **runApp**方法来启动路由。主要的逻辑代码我们将其封装到了MyApp类中。在当前文件中直接创建MyApp类。

``` java
class MyApp extends StatelessWidget{
  // 每次执行该界面是便会执行一遍build方法
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
  }

}
```

MyApp 类继承自 **StatelessWidget**，Statelesswidget 是不可变的, 这意味着其中的属性不能改变，所有的值都是最终的，相当于是一个静态界面。

继承了StatelessWidget之后 MyApp 类也是一个 widget。

在Flutter中，大多数东西都是 **widget**，包括对齐(alignment)、填充(padding)和布局(layout)。widget 的主要工作是提供一个 **build()**方法来描述如何根据其他较低级别的widget来显示自己。

### MaterialApp

在 StatelessWidget 的 build 方法中必须返回一个MaterialApp来作为路由的主要显示

``` java
class MyApp extends StatelessWidget{
  // 每次执行该界面是便会执行一遍build方法
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return new MaterialApp(

    );  
  }

}
```

MaterialApp中包含 **title**、**home**、**theme**等部分。title是当前页面显示的标题，一般在界面顶部显示。而home则是界面的显示主体。theme而是当前应用的主题设置。

在 MaterialApp 中进行简单的设置

``` java
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'Welcome to Flutter',
      home: new Scaffold(
        appBar: new AppBar(
          title: new Text('Welcome to Flutter'),
        ),
        body: new Center(
          child: new Text('Hello World'),
        ),
      ),
    );
  }
}
```

在home中创建了一个 **Scaffold**，Scaffold 是 Material library 中提供的一个widget, 它提供了默认的导航栏、标题和包含主屏幕widget树的body属性

接下来运行应用程序，显示界面如下：
[hello world](https://flutterchina.club/get-started/codelab/images/hello-world-screenshot.png)

## 显示单词列表

由于想要显示的单词列表界面需要进行改变，并且还需响应相应的点击事件。因此需要创建一个 RandomWords类来继承 **StatefulWidget**。

StatefulWidget 和 StatelessWidget 是　Flutter中的两种Widget，主要的区别是：

**Stateless widgets** 是不可变的, 这意味着它们的属性不能改变，所有的值都是最终的.

**Stateful widgets** 持有的状态可能在widget生命周期中发生变化. 实现一个 stateful widget 至少需要两个类:

1. 一个 StatefulWidget类。
2. 一个 State类。 

StatefulWidget类本身是不变的，但是 State 类在 widget 生命周期中始终存在.

### 创建StatefulWidget

``` java
class RandomWords extends StatefulWidget{
  @override
  createState() => new RandomWordState();

}
```

在 RandomWords 中创建了其 State 类 RandomWordsState。State 类将最终为 widget 维护建议的和喜欢的单词对。

### 创建RandomWordState

RandomWordState 继承自 State，作为一个 State，其中需要实现的便是 build 方法。

``` java
class RandomWordState extends State<RandomWords>{
  /**
   * 用来生成单词对的主要运行函数
   */
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    );
  }
}
```

在 build 方法中便可以创建一个无限滚动 ListView来进行列表显示。

首先需要显示列表的话便需要一个存储元素的列表，dart中使用下划线来将变量声明为私有的。

``` java
// 保存单词对
final _suggestions = <WordPair>[];
// 显示字体效果
final _biggerFont = const TextStyle(fontSize: 18.0);
```

其次在 RandomWordsState 类添加一个 **_buildSuggestions()** 函数. 此方法构建显示建议单词对的ListView。

``` java
  /**
   * 用来构建显示单词对的list
   *  当用户滚动时，ListView中显示的列表将无限增长。
   *  ListView的builder工厂构造函数允许按需建立一个懒加载的列表视图。
   */
  Widget _bulidSuggestions(){
    return new ListView.builder(
        padding: const EdgeInsets.all(16.0),
        // 对于每个建议的单词对都会调用一次itemBuilder，然后将单词对添加到ListTile行中
        // 在偶数行，该函数会为单词对添加一个ListTile row.
        // 在奇数行，该行书湖添加一个分割线widget，来分隔相邻的词对。
        // 注意，在小屏幕上，分割线看起来可能比较吃力。
        itemBuilder: (context,i){
          // 在每一列之前，添加一个1像素高的分隔线widget
          // 只用在奇数行之上添加便可以做到所有的都包含一个分割线
          if(i.isOdd){
            return new Divider();
          }

          // 语法 "i ~/ 2" 表示i除以2，但返回值是整形（向下取整），比如i为：1, 2, 3, 4, 5
          // 时，结果为0, 1, 1, 2, 2， 这可以计算出ListView中减去分隔线后的实际单词对数量
          final index = i~/2;

          // 如果是建议列表中最后一个单词对
          if(index >= _suggestions.length){
            // ...接着再生成10个单词对，然后添加到建议列表
            _suggestions.addAll(generateWordPairs().take(10));
          }

          // 对于每一个单词对，_buildSuggestions函数都会调用一次_buildRow。
          // 这个函数在ListTile中显示每个新词对，这使您在下一步中可以生成更漂亮的显示行
          return _buildRow(_suggestions[index]);
        }
    );
  }
```

接下来创建对应的 _buildRow 方法来显示每一行的数据信息

``` java
  Widget _buildRow(WordPair pair) {
    // 显示列表标题
    return new ListTile(
      title: new Text(
        pair.asPascalCase,
        style: _biggerFont,
      ),
    );
  }
```

接下来便可以在 RandomWordState 类中的 build方法中调用 _bulidSuggestions() 方法来显示单词对列表

``` java
  @override
  Widget build(BuildContext context) {
    return new Scaffold (
      appBar: new AppBar(
        title: new Text('Startup Name Generator'),
      ),
      body: _buildSuggestions(),
    );
  }
  ...
```

在返回的 Scaffold widget中的 body中调用 _buildSuggestions()方法来在当前界面主体内容中生成单词列表。

最后还需要更新 MyApp 的 build 方法。

从 MyApp 中删除 Scaffold 和 AppBar 实例。 然后使用RandomWordsState来作为路由的主要显示widget。

``` java
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'Startup Name Generator',
      home: new RandomWords(),
    );
  }
}
```

重新启动应用程序。项目运行结果如下：
[项目运行结果](https://flutterchina.club/get-started/codelab/images/step4-screenshot.png)

## 给单词列表添加交互

目前已经能够显示一个单词列表瀑布流，但是每一个单词列表还不能够对其进行操作。按照之前的要求，还需要对显示的单词列表添加收藏功能。那么便得在显示的单词列表的后面添加一个心形 ❤️ 图标，当点击该图标的时候便将该单词保存到收藏集合中去。这里之所以使用 **集合**作为存储容器是因为集合可以保证存入的变量内容不重复。

### 创建集合来存储收藏的单词对

在 RandomWordState类中添加私有变量 _saved来存储所收藏的单词对。

``` java
final _saved = new Set<WordPair>();
```

### 显示心形 ❤️ 图标

因为所要交互的是显示的集合中的每一个行，因此在 RandomWordState类中的 _buildRow方法添加对应的显示图标。

在 ListTile 中对于的标题 title 之后添加图标：

``` java
      // 显示图标
      trailing: new Icon(
      // 判断是否已经收藏来显示不同的图标
      alreadSaved ? Icons.favorite : Icons.favorite_border,
      color: alreadSaved ? Colors.red : null,
    ),
```
 这里使用 alreadSaved来表示当前的单词对是否已经包含在集合中，在 RandomWordState类第一行的位置进行判断：

``` java
    // 判断当前元素是否已经包含在集合中
    final alreadSaved = _saved.contains(suggestion);
```

显示玩收藏图标之后，还需要对其配置对应的点击事件，在后面编辑 onTap():

``` java
      // 设置点击事件处理
      onTap: (){
        // 当心形❤图标被点击时，函数调用setState()通知框架状态已经改变。
        // 在Flutter的响应式风格的框架中，
        // 调用setState() 会为State对象触发build()方法，从而导致对UI的更新
        setState(() {
          if (alreadSaved){
            _saved.remove(suggestion);
          }else{
            _saved.add(suggestion);
          }
        });
      },
```

现在，完整的 _buildRow 方法已经编辑完成，之后的样子是：

``` java
Widget _buildRow(WordPair suggestion) {
    // 判断当前元素是否已经包含在集合中
    final alreadSaved = _saved.contains(suggestion);
    return new ListTile(
      // 显示标题
      title: new Text(
        suggestion.asPascalCase,
        style: _biggerFont,
      ),

      // 显示图标
      trailing: new Icon(
      // 判断是否已经收藏来显示不同的图标
      alreadSaved ? Icons.favorite : Icons.favorite_border,
      color: alreadSaved ? Colors.red : null,
    ),

      // 设置点击事件处理
      onTap: (){
        // 当心形❤图标被点击时，函数调用setState()通知框架状态已经改变。
        // 在Flutter的响应式风格的框架中，
        // 调用setState() 会为State对象触发build()方法，从而导致对UI的更新
        setState(() {
          if (alreadSaved){
            _saved.remove(suggestion);
          }else{
            _saved.add(suggestion);
          }
        });
      },
    );
  }
```

直接保存代码，假如你没有结束项目的运行的话，新更改的代码会直接显示出来，这便是 Flutter 的 **热重载**

![运行结果](https://flutterchina.club/get-started/codelab/images/step5-screenshot.png)

## 跳转到收藏界面

已经实现了单词的收藏功能，并且也已经将收藏的单词保存到了对应的集合中去，那么便新创建一个界面专门来显示已经收藏的单词对。在 Flutter 中创建的一个新界面称为路由。

### 状态栏添加新路由入口

跳转到新路由的入口可以放置在功能栏里，这样也方便操作。在 RandomWordsState 的 build 方法中为AppBar 添加一个列表图标。当用户点击列表图标时，包含收藏夹的新路由页面入栈显示。

``` java
      appBar: new AppBar(
        title: new Text("Startup Name Generator"),
        // 新建一个可以保存不同Widget的 actions
        actions: <Widget>[
          // 新建一个IconButton来处理点击事件
          new IconButton(icon: new Icon(Icons.list), onPressed: _pushSave)
        ],
      ),
```

### 创建新的路由

在 AppBar中创建的列表图标中的点击事件中调用了_pushSave方法。在 _pushSave 方法中便需要创建一个新的路由，并将 _saved集合中的内容以列表的形式进行展示。

创建一个新的路由需要使用 **导航管理器栈**，在Flutter中，导航器管理应用程序的路由栈。将路由推入（push）到导航器的栈中，将会显示更新为该路由页面。 从导航器的栈中弹出（pop）路由，将显示返回到前一个路由。使用 **Navigator.push**调用，这会使路由推入到导航管理器的栈。

新页面的内容在 **MaterialPageRoute** 的 **builder**属性中构建，builder是一个匿名函数。在builder 中返回一个 Scaffold，其中包含名为“Saved Suggestions”的新路由的应用栏。新路由的body由包含 ListTiles 行的 ListView 组成，每行之间通过一个分隔线分隔。

``` java
  void _pushSave() {
    // 添加Navigator.push调用，
    // 这会使路由入栈（以后路由入栈均指推入到导航管理器的栈）
    Navigator.of(context).push(
      // 新建一个MaterialPageRoute界面
      new MaterialPageRoute(builder: (context){
        final tiles = _saved.map(
                (pair) {
              return new ListTile(
                title: new Text(
                  pair.asPascalCase,
                  style: _biggerFont,
                ),
              );
            }
        );
        // 对显示的内容进行列表处理，让其以列表的形式显示，列表自带分割线
        final divides = ListTile.divideTiles(
          context: context,
          tiles: tiles,
        ).toList();


        // builder返回一个Scaffold，
        // 其中包含名为“Saved Suggestions”的新路由的应用栏。
        // 新路由的body由包含ListTiles行的ListView组成;
        // 每行之间通过一个分隔线分隔。
        return new Scaffold(
          appBar: new AppBar(
            title: new Text("Saved Suggestions"),
          ),
          body: new ListView(children: divides,),
        );
      })
    );
  }
```

## 修改主题为白色主题

主题控制应用程序的外观和风格。可以使用默认主题，该主题取决于物理设备或模拟器，也可以自定义主题以适应不同的品牌。

可以通过配置ThemeData类轻松更改应用程序的主题。 应用程序目前使用默认主题，下面将更改primary color颜色为白色。

``` java
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'Startup Name Generator',
      theme: new ThemeData(
        primaryColor: Colors.white,
      ),
      home: new RandomWords(),
    );
  }
}
```

## main.dart完整代码

``` java
import 'package:flutter/material.dart';
import 'package:english_words/english_words.dart';

// 单行函数或方法的简写
void main() => runApp(new MyApp());

/**
 * 创建一个 Material APP，继承自 StatelessWidget 这样
 * 使得应用本身也称为一个 Widget
 *
 * widget的主要工作是提供一个 build方法来描述如何根据其他较低级别的weidgt来显示自己
 *
 * Stateless widgets 是不可变的, 这意味着它们的属性不能改变 - 所有的值都是最终的.
 */
class MyApp extends StatelessWidget{
  // 每次执行该界面是便会执行一遍build方法
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return new MaterialApp(
      // 标题
      title: "Startup Name Generator",

      // 更改主题,可以通过配置ThemeData类轻松更改应用程序的主题
      theme: new ThemeData(
        primaryColor: Colors.white
      ),
      // 主要显示内容
      home: new RandomWords(),
    );
  }

}
/**
* Stateful widgets 持有的状态可能在widget生命周期中发生变化. 实现一个 stateful widget 至少需要两个类:
* 一个 StatefulWidget类。
* 一个 State类。 StatefulWidget类本身是不变的，但是 State类在widget生命周期中始终存在.
*
* */
class RandomWords extends StatefulWidget{
  @override
  createState() => new RandomWordState();

}

/**
 * 添加 RandomWordsState 类.该应用程序的大部分代码都在该类中，
 * 该类持有RandomWords widget的状态。
 * 这个类将保存随着用户滚动而无限增长的生成的单词对，
 * 以及喜欢的单词对，用户通过重复点击心形 ❤️ 图标来将它们从列表中添加或删除。
 */
class RandomWordState extends State<RandomWords>{
  // dart中使用下划线来将变量声明为私有的，保存单词对
  final _suggestions = <WordPair>[];
  // 显示字体效果
  final _biggerFont = const TextStyle(fontSize: 18.0);
  // 添加一个 _saved Set(集合) 到RandomWordsState。这个集合存储用户喜欢（收藏）的单词对。
  // 在这里，Set比List更合适，因为Set中不允许重复的值。
  final _saved = new Set<WordPair>();

  /**
   * 用来构建显示单词对的list
   *  当用户滚动时，ListView中显示的列表将无限增长。
   *  ListView的builder工厂构造函数允许您按需建立一个懒加载的列表视图。
   */
  Widget _bulidSuggestions(){
    return new ListView.builder(
        padding: const EdgeInsets.all(16.0),
        // 对于每个建议的单词对都会调用一次itemBuilder，然后将单词对添加到ListTile行中
        // 在偶数行，该函数会为单词对添加一个ListTile row.
        // 在奇数行，该行书湖添加一个分割线widget，来分隔相邻的词对。
        // 注意，在小屏幕上，分割线看起来可能比较吃力。
        itemBuilder: (context,i){
          if(i.isOdd){
            // 在每一列之前，添加一个1像素高的分隔线widget
            // 只用在奇数行之上添加便可以做到所有的都包含一个分割线
            return new Divider();
          }

          // 语法 "i ~/ 2" 表示i除以2，但返回值是整形（向下取整），比如i为：1, 2, 3, 4, 5
          // 时，结果为0, 1, 1, 2, 2， 这可以计算出ListView中减去分隔线后的实际单词对数量
          final index = i~/2;

          // 如果是建议列表中最后一个单词对
          if(index >= _suggestions.length){
            // ...接着再生成10个单词对，然后添加到建议列表
            _suggestions.addAll(generateWordPairs().take(10));
          }

          // 对于每一个单词对，_buildSuggestions函数都会调用一次_buildRow。
          // 这个函数在ListTile中显示每个新词对，这使您在下一步中可以生成更漂亮的显示行
          return _buildRow(_suggestions[index]);
        }
    );
  }
  /**
   * 用来生成单词对的主要运行函数
   */
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return new Scaffold(
      // 在Flutter中，导航器管理应用程序的路由栈。
      // 将路由推入（push）到导航器的栈中，将会显示更新为该路由页面。
      // 从导航器的栈中弹出（pop）路由，将显示返回到前一个路由。
      appBar: new AppBar(
        title: new Text("Startup Name Generator"),
        // 新建一个可以保存不同Widget的操作
        actions: <Widget>[
          new IconButton(icon: new Icon(Icons.list), onPressed: _pushSave)
        ],
      ),
      body: _bulidSuggestions(),
    );
  }

  /**
   * 显示单词
   */
  Widget _buildRow(WordPair suggestion) {
    // 判断当前元素是否已经包含在集合中
    final alreadSaved = _saved.contains(suggestion);
    return new ListTile(
      // 显示标题
      title: new Text(
        suggestion.asPascalCase,
        style: _biggerFont,
      ),

      // 显示图标
      trailing: new Icon(
      // 判断是否已经收藏来显示不同的图标
      alreadSaved ? Icons.favorite : Icons.favorite_border,
      color: alreadSaved ? Colors.red : null,
    ),

      // 设置点击事件处理
      onTap: (){
        // 当心形❤图标被点击时，函数调用setState()通知框架状态已经改变。
        // 在Flutter的响应式风格的框架中，
        // 调用setState() 会为State对象触发build()方法，从而导致对UI的更新
        setState(() {
          if (alreadSaved){
            _saved.remove(suggestion);
          }else{
            _saved.add(suggestion);
          }
        });
      },
    );
  }

  /**
   * 点击图标之后的处理函数
   */
  void _pushSave() {
    // 添加Navigator.push调用，
    // 这会使路由入栈（以后路由入栈均指推入到导航管理器的栈）
    Navigator.of(context).push(
      // 新建一个MaterialPageRoute界面
      new MaterialPageRoute(builder: (context){
        final tiles = _saved.map(
                (pair) {
              return new ListTile(
                title: new Text(
                  pair.asPascalCase,
                  style: _biggerFont,
                ),
              );
            }
        );

        final divides = ListTile.divideTiles(
          context: context,
          tiles: tiles,
        ).toList();


        // builder返回一个Scaffold，
        // 其中包含名为“Saved Suggestions”的新路由的应用栏。
        // 新路由的body由包含ListTiles行的ListView组成;
        // 每行之间通过一个分隔线分隔。
        return new Scaffold(
          appBar: new AppBar(
            title: new Text("Saved Suggestions"),
          ),
          body: new ListView(children: divides,),
        );
      })
    );
  }
}
```

热重载应用程序。收藏一些选项，并点击应用栏中的列表图标，在新路由页面中显示收藏的内容。 

请注意，导航器会在应用栏中添加一个“返回”按钮。而不必显式实现Navigator.pop。点击后退按钮返回到主页路由。

## 总结

1. Flutter其实是使用 widget来作为所有的界面组件来进行显示。
2. 热重载很方便，在运行软件的情况下，只需要保存更改的代码便会自动运行更改的部分。
3. Flutter中的界面分为静态界面和可交互界面，分别继承自 StatelessWidget和 StatefulWidget。
4. Flutter当中的 widget的主要属性是配置式的进行创建的。
5. 可以通过主题来更改 Flutter项目的 UI颜色。
6. Flutter中的界面称之为路由（route），Flutter中的界面使用的是导航管理器栈来进行控制。
7. 使用用 ListView和 ListTiles可以创建一个延迟加载的无限滚动列表。
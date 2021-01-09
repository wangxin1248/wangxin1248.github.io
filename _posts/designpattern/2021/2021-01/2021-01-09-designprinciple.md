---
layout: post
title:  "设计模式（一）：七大设计原则"
date:  2021-01-09
desc: "总所周知，设计模型最重要的是设计原则，因为这是所有的设计模式的指导原则。本文将介绍设计模式所要遵守的七大设计原则，其中包括常见的SOLID设计原则以及不常见的迪米特原则、合成复用原则"
keywords: "设计模式,设计原则,Java"
categories: [设计模式]
tags: [设计模式]
---
# 七大设计原则

总所周知，设计模型最重要的是设计原则，因为这是所有的设计模式的指导原则。

本文将介绍设计模式所要遵守的七大设计原则，其中包括 “SOLID” 设计原则、迪米特原则、合成复用原则

其中，常见的设计原则有五大设计原则，使用 “SOLID” 进行表示，分别是：

- S：单一职责原则
- O：开放封闭原则
- L：里氏替换原则
- I：接口隔离原则
- D：依赖倒置原则

还有一些不那么常见的原则，只有两个：迪米特原则、合成复用原则

接下来将会分别详细介绍这些设计原则。

## 单一职责原则

单一职责原则（Single Responsibility Principle）：对某一个类来说，其所负责的职责是单一的，即只应该负责一项职责。

例如，类A负责两个职责：职责1，职责2，而当职责1执行的时候可能会影响到职责2的功能，此时就需要将类A进行拆分，拆分为两个类。

单一职责原则的优点：

- 降低类的复杂度，一个类只负责一项职责；
- 提高类的可读性以及可维护性；
- 降低类变更所引起的风险。

通常情况下，在编程中应该遵守单一职责原则。但是，单一职责原则可以分为类级别以及方法级别。只有在类逻辑足够简单的情况下，才可以在代码中违反单一职责原则。并且只有在类中方法数量足够少的情况下才可以在方法级别保持单一职责原则。

### 单一职责原则代码示例

软件需求：创建一个交通工具类 Vehicle，实现不同交通工具的运行，包括：汽车、飞机、火车等。

实现方式一：直接创建该交通工具类

```java
public class SingleResponsibility1 {
  public static void main(String[] args) {
      Vehicle vehicle = new Vehicle();
      vehicle.run("飞机");
      vehicle.run("汽车");
      vehicle.run("火车");
  }
}

class Vehicle{
    public void run(String vehicle){
        System.out.println(vehicle+" 运行中。。。");
    }
```

这种实现方式虽然可以很方便的实现多种不同交通工具的运行，但是却不满足单一职责原则。因为，一个交通工具类 Vehicle 中就完成了多种不同交通工具的运行，具有了多种职责。

实现方式二：针对多种交通工具创建多种交通工具类来分别执行相应的方法

```java
public class SingleResponsibility2 {
  public static void main(String[] args) {
      RoadVehicle roadVehicle = new RoadVehicle();
      SkyVehicle skyVehicle = new SkyVehicle();
      RailWayVehicle railWayVehicle = new RailWayVehicle();
      roadVehicle.run("汽车");
      railWayVehicle.run("火车");
      skyVehicle.run("飞机");
  }
}

class RoadVehicle{
    public void run(String vehicle){
        System.out.println(vehicle+" 在公路上运行。。。");
    }
}
class SkyVehicle{
    public void run(String vehicle){
        System.out.println(vehicle+" 在天空上运行。。。");
    }
}
class RailWayVehicle{
    public void run(String vehicle){
        System.out.println(vehicle+"在铁路上运行。。。");
    }
}
```

这种方式虽然保证了单一职责原则，但是却提高了代码的复杂性。考虑类中的方法数较少，因此我们可以实现方法层面上的单一职责原则。

实现方式三：只对 Vehicle 类做少量的更改，在其中增加多种不同的方法

```java
public class SingleResponsibility3 {
  public static void main(String[] args) {
      Vehicle2 vehicle2 = new Vehicle2();
      vehicle2.runRoad("汽车");
      vehicle2.runSky("飞机");
      vehicle2.runRailWay("火车");
  }
}
class Vehicle2{
    public void runRoad(String vehicle){
        System.out.println(vehicle+" 在公路上运行。。。");
    }
    public void runSky(String vehicle){
        System.out.println(vehicle+" 在天空上运行。。。");
    }
    public void runRailWay(String vehicle){
        System.out.println(vehicle+" 在铁路上运行");
    }
}
```

这种方式虽然没有完全遵守单一职责原则，但是在方法层级上满足了单一职责原则。但是，只有在类中方法数量足够少的情况下才可以在方法级别保持单一职责原则。

## 开放封闭原则

开放封闭原则（Open Closed Principle）：对一个软件实体来说（类、模块、函数）应该对**扩展（提供方）开放，对修改（使用方）关闭**。

开放封闭原则是编程中**最基础、最重要的设计原则**。也就是说，当软件需要变化的时候，尽量通过**扩展软件实体**的行为来实现变化，而不是通过修改已有代码来实现变化。

使用设计模式的目的就是为了遵循**开放封闭原则**。

### 开放封闭原则代码示例

软件需求：创建一个图像编辑类（使用方）来使用图形类（提供方）进行图形的绘制工作。

首先演示不遵守开放封闭原则的代码设计

```java
public class Main {
  public static void main(String[] args) {
      GraphicEditor graphicEditor = new GraphicEditor();
      graphicEditor.drawShape(new Circle());
      graphicEditor.drawShape(new Rectangle());
      // 新增打印三角形
      graphicEditor.drawShape(new Triangle());
  }
}

/**
 * 图像编辑类：使用方
 */
class GraphicEditor{
    /**
     * 根据传入的图形类的类别不同分别执行不同的方法
     * @param s
     */
    public void drawShape(Shape s){
        if(s.m_type == 1){
            drawRectangle(s);
        }else if(s.m_type == 2){
            drawCircle(s);
        }else if(s.m_type == 3){
            drawTriangle(s);
        }
    }

    private void drawTriangle(Shape s) {
        System.out.println("绘制三角形");
    }

    private void drawCircle(Shape s) {
        System.out.println("绘制圆形");
    }

    private void drawRectangle(Shape s) {
        System.out.println("绘制矩形");
    }
}

/**
 * 图形类：提供方
 */
class Shape{
    int m_type;
}

/**
 * 矩形图形实现类
 */
class Rectangle extends Shape{
    Rectangle(){
        super.m_type = 1;
    }
}

/**
 * 圆形图形实现类
 */
class Circle extends Shape{
    Circle(){
        super.m_type = 2;
    }
}

/**
 * 新增三角形图形实现类
 */
class Triangle extends Shape{
    Triangle(){
        super.m_type = 3;
    }
}
```

这种实现方法的问题在于：
- 无法简单的进行功能的添加
- 假如需要添加一个三角形的绘制则既需要修改提供方，又需要修改使用方

演示遵守开放封闭原则的代码设计

```java
public class Main {
  public static void main(String[] args) {
      GraphicEditor graphicEditor = new GraphicEditor();
      graphicEditor.drawShape(new Circle());
      graphicEditor.drawShape(new Rectangle());
      // 新增打印三角形
      graphicEditor.drawShape(new Triangle());
  }
}

/**
 * 图像编辑类：使用方
 */
class GraphicEditor{
    /**
     * 根据传入的图形类的类别不同分别执行不同的方法
     * @param s
     */
    public void drawShape(Shape s){
        // 直接调用实现类的draw方法
        s.draw();
    }
}

/**
 * 图形类：提供方
 */
 abstract class Shape{
    int m_type;
    public abstract void draw();
}

/**
 * 矩形图形实现类
 */
class Rectangle extends Shape{
    Rectangle(){
        super.m_type = 1;
    }

    @Override
    public void draw() {
        System.out.println("绘制矩形");
    }
}

/**
 * 圆形图形实现类
 */
class Circle extends Shape{
    Circle(){
        super.m_type = 2;
    }
    @Override
    public void draw() {
        System.out.println("绘制圆形");
    }
}

/**
 * 新增三角形图形实现类
 */
class Triangle extends Shape{
    Triangle(){
        super.m_type = 3;
    }
    @Override
    public void draw() {
        System.out.println("绘制三角形");
    }
}
```

主要的改进思路是：
- 将 Shape 类设置为抽象类，并提供一个抽象方法 draw，让子类去实现，这样每个子类都有该方法就不会存在子类重写父类的方法了；
- 其实也是一种**面向接口编程**的方式，也就是**依赖倒置原则**的体现；
- 这样使用方根本不需要进行更改就可以使用不同的提供方。

## 里氏替换原则

里氏替换原则（Liskov Substitution Principle）：如果对每个类型为 T1 的对象 o1，都有类型为 T2 的对象 o2，使得以 T1 定义的所有程序 P 在所有的对象 o1 都替换为 o2 时，程序 P 的行为没有发生变化，那么类型 T2 是类型 T1 的子类型。

换句话说：**所有引用基类的地方必须能够透明的使用其子类的对象，也就是说子类对象可以替换父类对象。**

在使用继承的时候必须遵循里氏替换原则，也就是保证**在子类中尽量不要重写父类的方法**，因为子类对象是可以替换父类对象的。

里氏替换原则告诉我们，继承实际上让两个类的耦合性增强了。那么在适当的情况下，可以通过**聚合、组合、依赖**来解决问题。

### 里氏替换原则代码示例

软件需求：A类作为基类，B类继承自A类，A类实现两数相减的函数，在B类中使用A类相减的函数实现三数相减的功能。

```java
public class Main {
  public static void main(String[] args) {
    //
  }
}

/**
 * A类中的方法实现a-b
 */
class A{
    public int func1(int a,int b){
        return a-b;
    }
}

/**
 * B类中重写了A类中的实现两数相减的函数
 */
class B extends A{
    /**
     * B类在继承自A的时候也将A中的函数进行了修改，导致出现了问题
     * @param a
     * @param b
     * @return
     */
    @Override
    public int func1(int a,int b){
        return a+b;
    }
    public int func2(int a,int b){
        return func1(a,b)-a;
    }
}
```

但是，这样继承的话会出现问题，因为在子类B类中将基类A类中的 func1 函数进行了修改，导致在B类中的 func2 中调用的 func1 以及是修改之后的函数了，功能发生了变化。

改进的方式其实就得需要将 A 类中的方法进行向上抽取，形成新的基类 Base 类。

```java
public class Main {
  public static void main(String[] args) {
    //
  }
}

/**
 * 将A中的方法进行向上抽取，形成新的基类
 */
class Base{

}
/**
 * A类中的方法实现a-b
 */
class A extends Base{
    public int func1(int a,int b){
        return a-b;
    }
}

/**
 * B类中重写了A类中的实现两数相减的函数
 */
class B extends Base{
    // 采用组合的方式来解决耦合
    A claA = new A();
    /**
     * B类在继承自Base，这时对func1修改就不涉及对A类的修改
     * @param a
     * @param b
     * @return
     */
    public int func1(int a,int b){
        return a+b;
    }
    public int func2(int a,int b){
        return func3(a,b)-a;
    }

    /**
     * 采用组合来完善使用A类中的函数
     * @param a
     * @param b
     * @return
     */
    public int func3(int a,int b){
        return claA.func1(a,b);
    }
}
```

形成新的基类  Base 类之后，不论 A 类还是 B 类，func1 函数的功能并没有被继承所修改，从而可以实现所需要的方法。

## 接口隔离原则

接口隔离原则（Interface Segregation Principle）：客户端不应该依赖它不需要的接口，即一个类对另一个类的依赖应该建立在**最小的接口**上，不应该有多余的功能。

### 接口隔离原则代码示例

软件需求：创建接口 Segregation1以及类ABCD，其中类 B D 用来实现了 Segregation1 中的方法，类 A C 依赖了接口 Segregation1中的部分方法并使用类 B D 的实现方法。其中：A类依赖接口Segregation1中的方法123，C类依赖接口Segregation1中的方法145。

首先演示不遵守接口隔离原则的情况。

```java
public class InterfaceSegregation {
    public static void main(String[] args) {
        //
    }
}

// Segregation1接口，具有5个方法
interface Segregation1{
    void operation1();
    void operation2();
    void operation3();
    void operation4();
    void operation5();
}

/**
 * BD类分别实现了Segregation1中的所有方法
 */
class B implements Segregation1{

    @Override
    public void operation1() {
        System.out.println("B 实现了Segregation1");
    }

    @Override
    public void operation2() {
        System.out.println("B 实现了Segregation2");
    }

    @Override
    public void operation3() {
        System.out.println("B 实现了Segregation3");
    }

    @Override
    public void operation4() {
        System.out.println("B 实现了Segregation4");
    }

    @Override
    public void operation5() {
        System.out.println("B 实现了Segregation5");
    }
}
class D implements Segregation1{

    @Override
    public void operation1() {
        System.out.println("D 实现了Segregation1");
    }

    @Override
    public void operation2() {
        System.out.println("D 实现了Segregation2");
    }

    @Override
    public void operation3() {
        System.out.println("D 实现了Segregation3");
    }

    @Override
    public void operation4() {
        System.out.println("D 实现了Segregation4");
    }

    @Override
    public void operation5() {
        System.out.println("D 实现了Segregation5");
    }
}

/**
 * AC类依赖了接口Segregation1
 * A类依赖接口Segregation1中的方法123
 * C类依赖接口Segregation1中的方法145
 */
class A{
    public void depend1(Segregation1 segregation1){
        segregation1.operation1();
    }
    public void depend2(Segregation1 segregation1){
        segregation1.operation2();
    }
    public void depend3(Segregation1 segregation1){
        segregation1.operation3();
    }
}
class C{
    public void depend1(Segregation1 segregation1){
        segregation1.operation1();
    }
    public void depend4(Segregation1 segregation1){
        segregation1.operation4();
    }
    public void depend5(Segregation1 segregation1){
        segregation1.operation5();
    }
}
```



这种情况下类 A C 依赖了接口 Segregation1，但是接口中的5个方法只用到了其中的三个，这种情况下接口的实现类还得实现多余的方法。

这样就造成了类所依赖的接口比较臃肿，不满足接口隔离原则。

接着演示接口隔离原则

将接口 Segregation1 进行拆分，拆分为只包含 A C 类所依赖的方法的多个接口，将接口的方法隔离开来。

具体来说，由于类 A C 都有依赖接口中的 operation1 方法，因此首先将 operation1 方法隔离为一个单独的接口。然后分别按照类 A C 的依赖情况将对应的方法在隔离为两个单独的接口。然后类 B D 可以进行多实现来实现指定的方法。

```java
public class InterfaceSegregation {
}
interface Segregation1{
    void operation1();
}
interface Segregation2{
    void operation2();
    void operation3();
}
interface Segregation3{
    void operation4();
    void operation5();
}
class B implements Segregation1,Segregation2{

    @Override
    public void operation1() {
        System.out.println("B 实现了operation1");
    }

    @Override
    public void operation2() {
        System.out.println("B 实现了operation2");
    }

    @Override
    public void operation3() {
        System.out.println("B 实现了operation3");
    }
}
class D implements Segregation1,Segregation3{

    @Override
    public void operation1() {
        System.out.println("B 实现了operation1");
    }

    @Override
    public void operation4() {
        System.out.println("B 实现了operation4");
    }

    @Override
    public void operation5() {
        System.out.println("B 实现了operation5");
    }
}
class A{
    public void depend1(Segregation1 segregation1){
        segregation1.operation1();
    }
    public void depend2(Segregation2 segregation1){
        segregation1.operation2();
    }
    public void depend3(Segregation2 segregation1){
        segregation1.operation3();
    }
}
class C{
    public void depend1(Segregation1 segregation1){
        segregation1.operation1();
    }
    public void depend4(Segregation3 segregation1){
        segregation1.operation4();
    }
    public void depend5(Segregation3 segregation1){
        segregation1.operation5();
    }
}
```



## 依赖倒置原则

依赖倒置原则（Dependence Inversion Principle）：相对于细节的多变性，抽象的东西要稳定的多，以抽象为基础搭建的架构比以细节为基础搭建的架构要稳定的多。

在Java中，抽象指的是接口或者抽象类，细节就是具体的实现类。

依赖倒置的中心思想是**面向接口编程**，即将依赖以接口的形式进行传递。

对于依赖导致原则来说：

 - 高层模块不应该依赖底层模块，二者都应该依赖其抽象表示；
 - 抽象不应该依赖细节，细节应该依赖抽象；
 - 使用接口或者抽象类的目的就是制定好规范，而不涉及任何具体的操作，把展现细节的任务交由他们的实现类去完成。

其中，依赖关系进行传递有三种方式：

 - 接口传递；
 - 构造器传递；
 - setter方法传递。

依赖倒置原则的注意事项：

 - 底层模块尽量都要有抽象类和接口，或者两者都有，程序稳定性更好；
 - 变量的声明类型尽量都是抽象类和接口，这样我们的变量引用和实际对象间，就存在一个缓冲层，利于程序扩展和优化。
 - 继承时遵循里氏替换原则。

### 依赖倒置原则代码示例

软件需求：创建用户类和电子邮件类两个类，用来模拟用户使用电子邮件来进行通信的过程。

依赖倒转实现方式1：不使用依赖倒转原则，直接依赖一个具体的类。

```java
public class Main {
  public static void main(String[] args) {
      Person person = new Person();
      person.receiveMessage(new Email());
  }
}

/**
 * 电子邮件类，用来负责获取电子邮件的消息
 */
class Email{
    public String getInfo(){
        return "hello,email";
    }
}

/**
 * 用户类，用来接受各种工具的消息
 */
class Person{
    /**
     * 这种实现方式只可以接收电子邮件的消息，而无法接受起来通信方式的消息
     * 属于依赖了底层
     * @param email
     */
    public void receiveMessage(Email email){
        System.out.println(email.getInfo());
    }
}
```

依赖倒转实现方式2：使用依赖倒转原则，依赖一个接口

```java
public class Main {
    public static void main(String[] args) {
        Person person = new Person();
        person.receiveMessage(new Email());
        person.receiveMessage(new Wechat());
    }
}

/** 消息工具接口 */
interface IReceive {
    public String getInfo();
}
/** 电子邮件类，用来负责获取电子邮件的消息 */
class Email implements IReceive {
    @Override
    public String getInfo() {
        return "hello,email";
    }
}

/** 微信类，用来接收微信的消息 */
class Wechat implements IReceive {
    @Override
    public String getInfo() {
        return "hello,wechat";
    }
}

/** 用户类，用来接受各种工具的消息 */
class Person {
    /**
     * 依赖传递使用的是接口传递方式
     *
     * @param iReceive
     */
    public void receiveMessage(IReceive iReceive) {
        System.out.println(iReceive.getInfo());
    }
}
```



## 迪米特原则

迪米特原则（Demeter Princiole）：最少知道原则（最少朋友原则），即一个类对自己依赖的类知道的越少越好。

也就是说，对于被依赖的类不管多么复杂，都尽量将逻辑封装在类的内部。即类中应用只出现类的直接朋友，而不是陌生朋友。

每个对象都会与其他对象有耦合关系，只要两个对象之间有耦合关系，我们就说这两个对象之间是朋友关系。

耦合的方式有很多：依赖、关联、组合、聚合等。

其中，我们称出现在**成员变量、方法参数、方法返回值中的类**称为直接的朋友，而出现在局部变量中的类不是直接的朋友，称为陌生朋友。

也就是说，**类对象最好不要以局部变量的形式出现在类的内部**。

迪米特原则注意事项：

 - 迪米特法则的核心是降低类之间的耦合。
 - 但是每个类都减少不了必要的依赖，因此迪米特法则只是要求降低类间耦合关系，并不是完全没有依赖关系。

### 迪米特原则代码示例

软件需求：创建学校职员类、学院职员类以及对应的管理类，要求能对各自的职员进行管理并且实现输出全校所有的职员信息。

首先演示不遵守迪米特原则的案例

```java
public class Main {
    public static void main(String[] args) {
        EmployeeManage employeeManage = new EmployeeManage();
        employeeManage.printAllEmployee(new SchoolEmployeeManage());
    }
}

/**
 * 学校职员类
 */
class Employee{
    int id;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}

/**
 * 学院职员类
 */
class SchoolEmployee{
    int id;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}

/**
 * 学院管理类
 */
class SchoolEmployeeManage{
    /**
     * 返回学院的所有员工
     * @return
     */
    public List<SchoolEmployee> getAllSchoolEmployee(){
        List<SchoolEmployee> list = new ArrayList<>();
        for (int i = 0; i < 10; ++i) {
            SchoolEmployee employee = new SchoolEmployee();
            employee.setId(i);
            list.add(employee);
        }
        return list;
    }
}
/**
 * 学校职员管理类
 */
class EmployeeManage{
    /**
     * 返回学校总部的所有员工
     * @return
     */
    public List<Employee> getAllEmployee(){
        List<Employee> list = new ArrayList<>();
        for (int i = 0; i < 5; ++i) {
            Employee employee = new Employee();
            employee.setId(i);
            list.add(employee);
        }
        return list;
    }

    /**
     * 输出学校以及学院的所有员工信息
     * @param schoolEmployeeManage
     */
    public void printAllEmployee(SchoolEmployeeManage schoolEmployeeManage){
        // 此处不满足迪米特原则
        // SchoolEmployee作为局部变量（陌生朋友）出现在了EmployeeManage类中
        List<SchoolEmployee> allSchoolEmployee = schoolEmployeeManage.getAllSchoolEmployee();
        System.out.println("------学院员工------");
        for(SchoolEmployee schoolEmployee : allSchoolEmployee){
            System.out.println("学院员工，编号："+schoolEmployee.getId());
        }
        System.out.println("------学校员工------");
        List<Employee> allEmployee = this.getAllEmployee();
        for(Employee employee : allEmployee){
            System.out.println("学校员工，编号："+employee.getId());
        }
    }
}
```

接下来演示遵守迪米特原则的案例

```java
public class Main {
    public static void main(String[] args) {
        EmployeeManage employeeManage = new EmployeeManage();
        employeeManage.printAllEmployee(new SchoolEmployeeManage());
    }
}

/**
 * 学校职员类
 */
class Employee{
    int id;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}

/**
 * 学院职员类
 */
class SchoolEmployee{
    int id;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}

/**
 * 学院管理类
 */
class SchoolEmployeeManage{
    /**
     * 返回学院的所有员工
     * @return
     */
    public List<SchoolEmployee> getAllSchoolEmployee(){
        List<SchoolEmployee> list = new ArrayList<>();
        for (int i = 0; i < 10; ++i) {
            SchoolEmployee employee = new SchoolEmployee();
            employee.setId(i);
            list.add(employee);
        }
        return list;
    }

    /**
     * 打印所有的学院员工
     */
    public void printSchoolEmployee(){
        List<SchoolEmployee> allSchoolEmployee = this.getAllSchoolEmployee();
        for(SchoolEmployee schoolEmployee : allSchoolEmployee){
            System.out.println("学院员工，编号："+schoolEmployee.getId());
        }
    }
}
/**
 * 学校职员管理类
 */
class EmployeeManage{
    /**
     * 返回学校总部的所有员工
     * @return
     */
    public List<Employee> getAllEmployee(){
        List<Employee> list = new ArrayList<>();
        for (int i = 0; i < 5; ++i) {
            Employee employee = new Employee();
            employee.setId(i);
            list.add(employee);
        }
        return list;
    }

    /**
     * 输出学校以及学院的所有员工信息
     * @param schoolEmployeeManage
     */
    public void printAllEmployee(SchoolEmployeeManage schoolEmployeeManage){
        // 此处不满足迪米特原则
        // SchoolEmployee作为局部变量（陌生朋友）出现在了EmployeeManage类中
        System.out.println("------学院员工------");
        // 修改为满足迪米特原则的格式如下，自己的事交由自己去干
        schoolEmployeeManage.printSchoolEmployee();
        System.out.println("------学校员工------");
        List<Employee> allEmployee = this.getAllEmployee();
        for(Employee employee : allEmployee){
            System.out.println("学校员工，编号："+employee.getId());
        }
    }
}
```



## 合成复用原则

合成复用原则（Composite Reuse Principle）：**尽量使用合成/聚合的方式，而不是使用继承。**

由于继承会导致类之间存在强耦合性，而使用依赖、组合、聚合的方式便可以降低这种耦合性。

例如，B 类中只需要使用 A 类中的两个方法，此时A类中还有其他的方法，假如使用继承会导致 B 类和 A 类的耦合性增加。

可以使用**依赖注入**的方式降低耦合。

## 七大设计原则总结

设计原则的核心思想：

- 找出应用中可能需要变化的地方，将其独立出来，不要和那些不需要变化的代码混合在一起。
- 针对接口编程，而不是针对实现编程。
- 为了交互对象之间的松耦合设计而努力。


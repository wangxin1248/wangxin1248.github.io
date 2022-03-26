---
layout: post
title:  "Golang设计模式（四）：行为型设计模式"
date:  2022-03-26
desc: "设计模式非常重要，特别是在一些系统框架设计上发挥了奠定性的作用，本文就来介绍常见的几种设计模式在 Golang 语言中的实现"
keywords: "设计模式,设计原则,Go"
categories: [Design Pattern]
tags: [设计模式]
---
目录：
- 目录
{:toc #markdown-toc}

# 行为型设计模式

本文将介绍设计模式中的行为型设计模式，主要介绍如下几种常见的设计模式：

- 观察者模式
- 模版模式
- 策略模式
- 职责链模式
- 状态模式
- 迭代器模式

## 观察者模式

观察者模式又名“发布订阅”模式，是在对象之间定义一个一对多的依赖，当一个对象状态改变的时候，所有依赖的对象都会自动收到通知。

实现方式包括：

- 同步阻塞
- 异步非阻塞（使用协程实现）
- 同进程
- 跨进程（消息队列）

实现一个简单的观察者模式：

```go
package observer

import "fmt"

// ISubject 观察者相关接口
type ISubject interface {
	Register(observer IObserver)
	Remove(observer IObserver)
	Notify(observer IObserver)
}

// IObserver 观察者管理对象相关接口
type IObserver interface {
	Update(mag string)
}

// Subject 观察者管理对象
type Subject struct {
	observers []IObserver
}

// Register 注册观察者
func (sub *Subject) Register(observer IObserver) {
	sub.observers = append(sub.observers, observer)
}

// Remove 移除观察者
func (sub *Subject) Remove(observer IObserver) {
	for i, o := range sub.observers {
		if o == observer {
			sub.observers = append(sub.observers[:i], sub.observers[i+1:]...)
		}
	}
}

// Notify 通知观察者
func (sub *Subject) Notify(msg string) {
	for _, o := range sub.observers {
		o.Update(msg)
	}
}

// 下面实现一些观察者
type Observer1 struct{}
type Observer2 struct{}

func (o *Observer1) Update(msg string) {
	fmt.Printf("Observer1:%s", msg)
}

func (o *Observer2) Update(msg string) {
	fmt.Printf("Observer2:%s", msg)
}

```

对其进行单元测试

```go
package observer

import "testing"

func TestSubject_Notify(t *testing.T) {
	sub := &Subject{}
	sub.Register(&Observer1{})
	sub.Register(&Observer2{})
	sub.Notify("Hello")
}
```

接下来简单实现一个 EventBus，支持以下功能：

1、异步不阻塞
2、支持任意参数值

```go
package observer

import (
	"fmt"
	"reflect"
	"sync"
)

// Bus 逻辑总线接口
type Bus interface {
	Subscribe(topic string, handler interface{}) error
	Publish(topic string, args ...interface{})
}

// AsyncEventBus 异步总线事件
type AsyncEventBus struct {
	handlers map[string][]reflect.Value
	lock     sync.Mutex
}

func NewAsyncEventBus() *AsyncEventBus {
	return &AsyncEventBus{
		handlers: map[string][]reflect.Value{},
		lock:     sync.Mutex{},
	}
}

// Subscribe 订阅事件
func (bus *AsyncEventBus) Subscribe(topic string, data interface{}) error {
	bus.lock.Lock()
	defer bus.lock.Unlock()

	v := reflect.ValueOf(data)
	if v.Type().Kind() != reflect.Func {
		return fmt.Errorf("data must be func")
	}

	handler, ok := bus.handlers[topic]
	if !ok {
		handler = []reflect.Value{}
	}
	handler = append(handler, v)
	bus.handlers[topic] = handler

	return nil
}

func (bus *AsyncEventBus) Publish(topic string, args ...interface{}) {
	handlers, ok := bus.handlers[topic]
	if !ok {
		fmt.Printf("no handler for topic:%s", topic)
		return
	}

	params := make([]reflect.Value, len(args))
	for i, arg := range args {
		params[i] = reflect.ValueOf(arg)
	}

	// 异步执行
	for i := range handlers {
		go handlers[i].Call(params)
	}
}
```

单元测试：

```go
package observer

import (
	"fmt"
	"testing"
	"time"
)

func sub1(msg1, msg2 string) {
	time.Sleep(1 * time.Microsecond)
	fmt.Printf("sub1,%s %s\n", msg1, msg2)
}

func sub2(msg1, msg2 string) {
	fmt.Printf("sub2,%s %s\n", msg1, msg2)
}

func TestEventBus(t *testing.T) {
	bus := NewAsyncEventBus()
	bus.Subscribe("topic1", sub1)
	bus.Subscribe("topic1", sub2)
	bus.Publish("topic1", "hello", "world")
	bus.Publish("topic1", "你好", "世界")
	time.Sleep(1 * time.Second)
}
```

## 模版模式

模版模式就是在一个方法中定义一个算法骨架，并将某些步骤推迟到子类中实现。模版方法模式可以让子类在不改变算法（业务逻辑）整体结构的情况下，重新定义算法中的某些步骤。

模版模式主要的应用场景有：

- 扩展：框架通过模版模式提供功能扩展点，让框架用户可以在不修改框架源码的情况下，基于扩展点定制化框架的功能。
- 复用：所有的子类可以复用父类中提供的模版方法的代码。

模版与回调的区别：

- 同步回调基于组合关系来实现，把对象传递给另一个对象，是一种对象之间的关系；异步回调更类似于观察者模式。
- 模版模式基于继承关系来实现，子类重写父类的抽象方法，是一种类之间的关系。

举个例子，假设我现在要做一个短信推送的系统，那么需要

- 检查短信字数是否超过限制
- 检查手机号是否正确
- 发送短信
- 返回状态

我们可以发现，在发送短信的时候由于不同的供应商调用的接口不同，所以会有一些实现上的差异，但是他的算法（业务逻辑）是固定的

我们使用代码来模拟下：

```go
package template

import "fmt"

// ISMS 发送短信接口
type ISMS interface {
	send(content string, phone int) error
}

// SMS 发送短信基类
type SMS struct {
	ISMS
}

// Valid 验证短信内容
func (sms *SMS) Valid(content string) error {
	if len(content) > 100 {
		return fmt.Errorf("短信长度不能超过100")
	}
	return nil
}

// Send 发送短信
func (sms *SMS) Send(content string, phone int) error {
	if err := sms.Valid(content); err != nil {
		return err
	}
	// 调用子类的方法发送短信
	return sms.send(content, phone)
}

// 演示使用联通来发送短信(继承父类SMS)
type ChinaUnicomSMS struct {
	SMS
}

func (sms *ChinaUnicomSMS) send(content string, phone int) error {
	fmt.Printf("联通发送短信：%s,%d\n", content, phone)
	return nil
}

func NewChinaUnicomSMS() *ChinaUnicomSMS {
	// 这里有点绕，是因为 go 没有继承，用嵌套结构体的方法进行模拟
	// 这里将子类作为接口嵌入父类，就可以让父类的模板方法 Send 调用到子类的函数
	// 实际使用中，我们并不会这么写，都是采用组合+接口的方式完成类似的功能
	tel := &ChinaUnicomSMS{}
	tel.SMS = SMS{ISMS: tel}
	return tel
}
```

对应的单元测试：
```go
package template

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestSmsSens(t *testing.T) {
	chinaUnicomSms := NewChinaUnicomSMS()
	err := chinaUnicomSms.Send("hello", 123456789)
	assert.NoError(t, err)
}
```

## 策略模式

策略模式是指：定义一组算法类，将每个算法分别封装起来，让他们可以相互替换，这样就可以使算法的变化独立于使用他们的地方。

策略模式与工厂模式以及观察者模式的功能是一样的，都是为了 **解耦**，不同的是不同的设计模式解耦的对象不同。

- 策略模式：解耦的是策略的定义、创建、使用这三部分
- 工厂模式：解耦的是对象的创建和使用
- 观察者模式：解耦的是观察者和被观察者

策略模式在实现上来说包含一个策略接口和一组实现这个接口的策略类：

- 策略定义：所有的策略都需要实现策略的接口，用于达到解耦的目的。
- 策略创建：策略模式会包含一组策略吗，在使用他们的时候，一般会通过类型（type）来判断创建哪个策略来使用。在创建策略的时候也可以使用工厂模式来进行创建（查表法）。
- 策略使用：在使用策略的时候也可以通过配置文件的方式动态指定。

举个例子，我们在保存文件的时候，由于政策或者其他的原因可能需要选择不同的存储方式，敏感数据我们需要加密存储，不敏感的数据我们可以直接明文保存。

我们使用代码来模拟下：

```go
package strategy

import (
	"io/ioutil"
	"os"
)

// StorageStrategy 存储策略接口
type StorageStrategy interface {
	Save(name string, data []byte) error
}

// fileStorage 管理所有的策略
var strategys = map[string]StorageStrategy{
	"file":         &fileStorage{},
	"encrypt_file": &encryptFileStorage{},
}

// NewStorageStrategy 新建策略管理对象
func NewStorageStrategy(name string) (StorageStrategy, error) {
	if strategy, ok := strategys[name]; ok {
		return strategy, nil
	}
	return nil, nil
}

// fileStorage 文件存储策略
type fileStorage struct{}

// encryptFileStorage 加密文件存储策略
type encryptFileStorage struct{}

func (s *fileStorage) Save(name string, data []byte) error {
	return ioutil.WriteFile(name, data, os.ModeAppend)
}

func (s *encryptFileStorage) Save(name string, data []byte) error {
	// 进行加密
	data, err := encrypt(data)
	if err != nil {
		return err
	}
	return ioutil.WriteFile(name, data, os.ModeAppend)
}

func encrypt(data []byte) ([]byte, error) {
	// TODO 实现加密算法
	return data, nil
}
```

单元测试：

```go
package strategy

import (
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func TestStorageStrategy(t *testing.T) {
	Convey("正常数据", t, func() {
		data, sensitive := getData1()
		strategyType := "file"
		if sensitive {
			strategyType = "encrypt_file"
		}
		strategy, err := NewStorageStrategy(strategyType)
		So(err, ShouldBeNil)
		err = strategy.Save("./test.txt", data)
		So(err, ShouldBeNil)
	})

	Convey("异常数据", t, func() {
		data, sensitive := getData2()
		strategyType := "file"
		if sensitive {
			strategyType = "encrypt_file"
		}
		strategy, err := NewStorageStrategy(strategyType)
		So(err, ShouldBeNil)
		err = strategy.Save("./test.txt", data)
		So(err, ShouldBeNil)
	})
}

// 返回文件数据以及是否敏感
func getData1() ([]byte, bool) {
	return []byte("test"), true
}

// 返回文件数据以及是否敏感
func getData2() ([]byte, bool) {
	return []byte("test"), false
}
```

## 职责链模式

职责链模式会将请求的接收和发送解耦开来，让多个接收对象都有机会处理这个请求，将这些接收对象串联为一条链，并沿着这条链传递这个请求，直到链上的某个请求对象能够处理它为止。（同时也存在着一种变体的职责链模式可以让每个接收对象都能处理请求，通常用于系统框架的中间件中）

职责链模式主要的功能是**复用、扩展**，常见的使用场景包括**中间件、过滤器等**：在实际的项目开发中比较常用，特别是一些框架的开发中，可以利用职责链模式来提供框架的扩展功能，能够让框架的使用者在不修改源代码的情况下，基于扩展点定制框架的功能。

职责链模式主要的实现方式有：**链表、数组**

举个例子，假设我们现在有个校园论坛，由于社区规章制度、广告、法律法规的原因需要对用户的发言进行敏感词过滤，如果被判定为敏感词，那么这篇帖子将会被封禁。这其实是一个基本的职责链模式的演示，在职责链中遇到一个处理完成的后面的职责链就不再执行了。

代码实现：

```go
package chain

// SensitiveWordFilter 敏感词过滤器接口
type SensitiveWordFilter interface {
	Filter(content string) bool
}

// SensitiveWordFilterChain 敏感词过滤器职责链
type SensitiveWordFilterChain struct {
	filters []SensitiveWordFilter
}

// AddFilter 向过滤器链中添加一个过滤器
func (chain *SensitiveWordFilterChain) AddFilter(filter SensitiveWordFilter) {
	chain.filters = append(chain.filters, filter)
}

// DoFilter 执行过滤器链中所有的过滤器
func (chain *SensitiveWordFilterChain) DoFilter(content string) bool {
	for _, filter := range chain.filters {
		if filter.Filter(content) {
			return true
		}
	}
	return false
}

// 接下来创建两个演示的敏感词过滤器
type AdSensitiveWordFilter struct{}

func (filter *AdSensitiveWordFilter) Filter(content string) bool {
	// TODO 待实现
	return false
}

type PoliticalSensitiveWordFilter struct{}

func (filter *PoliticalSensitiveWordFilter) Filter(content string) bool {
	// TODO 待实现
	return true
}
```

单元测试：

```go
package chain

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestSensitiveWordFilterChain(t *testing.T) {
	chain := &SensitiveWordFilterChain{}
	chain.AddFilter(&AdSensitiveWordFilter{})
	assert.Equal(t, false, chain.DoFilter("广告"))
	chain.AddFilter(&PoliticalSensitiveWordFilter{})
	assert.Equal(t, true, chain.DoFilter("政治"))
}
```

### Gin 的中间件实现

我们直接看一下 `gin Context`  的实现，其中 `Next()` 方法就是主要的执行方法（这里其实就是我们最上面说到的职责链模式的变体，因为它会在每一个处理函数中进行处理，而不是第一个接收到就停止了）

```go
type Context struct {
    // ...

    // handlers 是一个包含执行函数的数组
    // type HandlersChain []HandlerFunc
	handlers HandlersChain
    // index 表示当前执行到哪个位置了
	index    int8

    // ...
}

// Next 会按照顺序将一个个中间件执行完毕
// 并且 Next 也可以在中间件中进行调用，达到请求前以及请求后的处理
// Next should be used only inside middleware.
// It executes the pending handlers in the chain inside the calling handler.
// See example in GitHub.
func (c *Context) Next() {
	c.index++
	for c.index < int8(len(c.handlers)) {
		c.handlers[c.index](c)
		c.index++
	}
}
```

### Echo 的中间件实现

Echo 框架中的 `Echo` 用来存储整个框架中所有用到的参数，其中 `middleware、premiddleware` 便存储了对应的中间件函数，在处理 http 请求的时候便会按照调用顺序来依次调用这些中间件（这里其实就是我们最上面说到的职责链模式的变体，因为它会在每一个处理函数中进行处理，而不是第一个接收到就停止了）：

```go
// Echo is the top-level framework instance.
Echo struct {
	// ...

	// 这里echo支持两种不同的中间件，和 gin 一样使用数组实现
	premiddleware    []MiddlewareFunc
	middleware       []MiddlewareFunc
		
	// ...
}

// echo会按照定义中间件的顺序执行对应的中间件
// 类似于栈的应用，因此无需像 gin 那样使用角标来控制应该执行哪一个中间件
func applyMiddleware(h HandlerFunc, middleware ...MiddlewareFunc) HandlerFunc {
	for i := len(middleware) - 1; i >= 0; i-- {
		h = middleware[i](h)
	}
	return h
}
```

## 状态模式

状态模式通过将事件触发的状态转移和动作执行，拆分到不同的状态中，来避免分支判断逻辑。

状态模式通常用于实现 **状态机**，状态机通常应用在**游戏、工作流引擎**等领域中。

下面简单介绍下**有限状态机（FSM）**，主要组成：**状态、事件、动作**，其中事件也成为转移条件（Transition condition），同时事件也会触发**状态的转移**以及**动作的执行**。

有限状态机的实现方式：

- 分支逻辑法：当状态和逻辑比较少的时候可以使用，假如状态和逻辑比较复杂的时候使用这种方式来实现会有比较多的 if/else
- 查表法：对于状态很多、状态转移逻辑比较复杂的状态机来说，查表法比较适合，常应用在游戏中。
- 状态模式：对于状态不多，状态转移也比较简单，但是事件触发执行的动作包含的业务逻辑可能比较复杂的状态机来说，首选推荐使用状态模式实现，常应用在电商、外卖中。同时，引入状态模式来写状态机会引入比较多的结构体，并且改动代码的时候如果要新增或者删除某一个状态的话，修改也需要在其他状态的结构体方法中修改，因此这种实现方式不太实用于状态太多或者状态经常变更的情况。

举个工作流的例子，在企业内部或者是学校我们经常会看到很多审批流程，假设我们有一个报销的流程: 员工提交报销申请 -> 直属部门领导审批 -> 财务审批 -> 结束。在这个审批流中，处在不同的环节就是不同的状态，而流程的审批、驳回就是不同的事件。

代码实现：

```go
package state

import "fmt"

// IState 状态接口，定义每一个状态执行的动作
type IState interface {
	// 审批通过
	Approval(m *Machine)
	// 审批驳回
	Reject(m *Machine)
	// 获取状态名称
	GetName() string
}

// Machine 状态机对象
type Machine struct {
	state IState
}

// SetState 设置状态
func (m *Machine) SetState(state IState) {
	m.state = state
}

// GetStateName 获取当前状态的名称
func (m *Machine) GetStateName() string {
	return m.state.GetName()
}

// Approval 审批通过
func (m *Machine) Approval() {
	m.state.Approval(m)
}

// 审批驳回
func (m *Machine) Reject() {
	m.state.Reject(m)
}

// 接下来需要设置一些对应的状态

// 直属领导审批
type leaderApproveState struct{}

func (s *leaderApproveState) Approval(m *Machine) {
	fmt.Println("直属领导审批通过")
	m.SetState(GetFinanceApproveState())
}

func (s *leaderApproveState) GetName() string {
	return "直属领导审批"
}

func (s *leaderApproveState) Reject(m *Machine) {

}

func GetLeaderApproveState() IState {
	return &leaderApproveState{}
}

// 财务审批
type financeApproveState struct{}

func (s *financeApproveState) Approval(m *Machine) {
	fmt.Println("财务审批通过")
	fmt.Println("财务开始打款")
}

func (s *financeApproveState) GetName() string {
	return "财务审批"
}

func (s *financeApproveState) Reject(m *Machine) {
	m.SetState(GetLeaderApproveState())
}

func GetFinanceApproveState() IState {
	return &financeApproveState{}
}
```

单元测试：

```go
package state

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestMachine(t *testing.T) {
	m := &Machine{state: GetLeaderApproveState()}
	assert.Equal(t, "直属领导审批", m.GetStateName())
	m.Approval()
	assert.Equal(t, "财务审批", m.GetStateName())
	m.Reject()
	assert.Equal(t, "直属领导审批", m.GetStateName())
	m.Approval()
	assert.Equal(t, "财务审批", m.GetStateName())
	m.Approval()
}
```

## 迭代器模式

迭代器模式通常用于遍历对象（其实很多语言都已经内置这种模式，例如Java中的iterator，但是GO没有），迭代器模式将集合对象的遍历操作从集合类中拆分出来，放到迭代器类中，让两者的职责更加单一。

迭代器模式需要通过**容器**来实现，容器通过 iterator() 方法来创建迭代器，而一个迭代器的需要支持 `hasNext()、next()、currentItem()、remove()`等基本方法，待遍历的容器对象通过依赖注入的方式传递到迭代器类中。

迭代器模式的相关优点：

- 迭代器模式封装集合内部复杂的数据结构，开发者不需要了解如何遍历，直接使用容器内部提供的迭代器即可
- 迭代器模式将集合对象的遍历操作从集合类中拆分出去，放到迭代器类中，让两者的职责更加单一，满足**单一职责原则**
- 迭代器模式让添加新的遍历算法更加容易，更符合**开放封闭原则**
- 因为迭代器都实现了相同的接口，在开发中，基于接口而非实现编程，替换迭代器也变得更加容易，符合**依赖倒置原则**

下面实现一个自定义数组类型的例子：

```go
package iterator

// Iterator 迭代器接口
type Iterator interface {
	HasNext() bool
	Next()
	CurrentItem() interface{}
}

// ArrayInt 数组容器
type ArrayInt []int

func (a ArrayInt) Iterator() Iterator {
	return &ArrayIntIterator{a, 0}
}

// ArrayIntIterator 数组容器对应的迭代器
type ArrayIntIterator struct {
	arrayInt ArrayInt
	index    int
}

func (i *ArrayIntIterator) HasNext() bool {
	return i.index < len(i.arrayInt)-1
}

func (i *ArrayIntIterator) Next() {
	i.index++
}

func (i *ArrayIntIterator) CurrentItem() interface{} {
	return i.arrayInt[i.index]
}
```

单元测试：

```go
package iterator

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestArrayIntIterator(t *testing.T) {
	arrayInt := ArrayInt{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
	iterator := arrayInt.Iterator()
	i := 0
	for iterator.HasNext() {
		assert.Equal(t, arrayInt[i], iterator.CurrentItem())
		iterator.Next()
		i++
	}
}
```

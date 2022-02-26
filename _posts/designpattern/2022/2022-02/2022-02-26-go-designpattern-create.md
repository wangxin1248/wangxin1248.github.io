---
layout: post
title:  "Golang设计模式（二）：创建型设计模式"
date:  2022-02-26
desc: "设计模式非常重要，特别是在一些系统框架设计上发挥了奠定性的作用，本文就来介绍常见的几种设计模式在 Golang 语言中的实现"
keywords: "设计模式,设计原则,Go"
categories: [Design Pattern]
tags: [设计模式]
---
# 创建型设计模式

本文将介绍常见的创建型设计模式在 go 语言上的实现，包括如下几个设计模式：

- 单例模式
- 工厂模式
- 建造者模式

## 单例模式

定义：一个类只允许创建一个对象（实例），那这个类就是一个单例类。这种设计模式就叫做单例设计模式，简称单例模式。

用法：在有些业务场景中，一些数据在系统中只应该保存一份，那么就适合设计为单例类。

单例模式的唯一性是保证在**进程间**唯一。如果想要在线程间保证唯一性的话就需要通过获取线程id来确保，但是在go中主要使用携程，并且协程的id并没有暴漏出来。而想要在集群环境中保证唯一性可以通过外部共享存储锁（文件）的方式来进行。

单例模式主要存在的问题：
- 对OOP的特性支持不友好
- 会隐藏类之间的依赖关系
- 对代码扩展不友好
- 对代码的可测性不友好（可以通过将单例类作为参数传递给需要使用的方法解决可观测性的问题）
- 不支持有参数的构造函数

实现一个单例模式需要注意的地方：
- 构造函数是private访问权限
- 考虑对象创建时的线程安全问题
- 考虑是否支持延迟加载
- 考虑getInstance的性能问题（是否加锁）

单例模式的实现方式：

1、**饿汉式（推荐使用）**
- 类加载的时候instance实例就已经创建好了
- instance的创建过程是线程安全的
- 不支持延迟加载
- 初始化的时候可能比较长（启动慢总比用户访问慢要好）

```go
package singleton

// Singleton 饿汉式单例
type Singleton struct{}

var singleton *Singleton

func init() {
	singleton = &Singleton{}
}

// GetInstance 获取实例
func GetInstance() *Singleton {
	return singleton
}

```

2、懒汉式
- 在getInstance的时候才去创建对象
- instance的创建过程需要加锁
- 支持延迟加载
- 不支持高并发

3、懒汉式（双重检测）
- 在懒汉式的基础上，将类级别的锁改为方法级别的锁
- 相对于懒汉式锁的粒度更小，不会每次都去获取锁

```go
package singleton

import "sync"

var (
	lazySingleton *Singleton
	once = &sync.Once{}
)

// GetLazyInstance 懒汉式（双重检测）
func GetLazyInstance() {
	if lazySingleton == nil {
		once.Do(func() {
			lazySingleton = &Singleton{}
		})
	}
	return lazySingleton
}
```

4、静态内部类
- 在java中可以通过创建一个静态内部类的方式实现单例模式
- 线程安全并且支持延迟加载

5、枚举
- 在java中可以通过枚举的方式实现单例模式

针对单例模式实现的懒汉式和饿汉式两种方式的性能进行测试：

```go
package singleton

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetInstance(t *testing.T) {
	assert.Equal(t, GetInstance(), GetInstance())
}

func BenchmarkGetinstanceParallel(b *testing.B) {
	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			if GetInstance() != GetInstance() {
				b.Errorf("test fail")
			}
		}
	})
}


package singleton

import (
	"testing"
	"github.com/stretchr/testify/assert"
)

func TestGetLazyInstance(t *testing.T) {
	assert.Equal(t,GetLazyInstance(),GetLazyInstance())
}

func BenchmarkGetLazyInstanceParallel(b *testing.B) {
	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			if GetLazyInstance() != GetLazyInstance() {
				b.Errorf("test fail")
			}
		}
	})
}
```

测试结果（可以看到饿汉式的效果好于懒汉式的）：

```go
=== RUN   TestGetInstance
--- PASS: TestGetInstance (0.00s)
=== RUN   TestGetLazyInstance
--- PASS: TestGetLazyInstance (0.00s)
goos: linux
goarch: amd64
pkg: designpattern/01_singleton
cpu: Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz
BenchmarkGetinstanceParallel
BenchmarkGetinstanceParallel-4          1000000000               0.4962 ns/op          0 B/op          0 allocs/op
BenchmarkGetLazyInstanceParallel
BenchmarkGetLazyInstanceParallel-4      656599860                1.856 ns/op           0 B/op          0 allocs/op
PASS
ok      designpattern/01_singleton      1.971s
```

## 工厂模式

本文实现的工厂模式包括常见的简单工厂、工厂方法、抽象工厂、DI容器的实现。

使用工厂模式的优点：
- 封装变化：创建逻辑有可能变化，封装成工厂类之后，创建逻辑的变更对调用者透明。
- 代码复用：创建代码抽离到独立的工厂类之后可以复用。
- 隔离复杂性：封装复杂的创建逻辑，调用者无需了解如何创建对象。
- 控制复杂度：将创建代码抽离出来，让原本的函数或者类指责更单一，代码更简洁。

### 简单工厂

由于GO语言本身的特性导致其并没有相应的构造函数，一般而言采用 `New***` 的方法创建对象/接口，当返回的是一个**接口**的时候就属于简单工厂模式。

示例代码：

```go
package factory

// IRuleConfigParser 接口
type IRuleConfigParser interface {
	Parse(data []byte)
}

// jsonRuleConfigParser 实现类
type jsonRuleConfigParser struct {
}

// Parse jsonRuleConfigParser 实现类实现接口方法
func (j jsonRuleConfigParser) Parse(data []byte) {
	panic("implement me")
}

// yamlRuleConfigParser 实现类
type yamlRuleConfigParser struct {
}

// Parse yamlRuleConfigParser实现类实现接口方法
func (y yamlRuleConfigParser) Parse(data []byte) {
	panic("implement me")
}

func NewIRuleConfigParser(t string) IRuleConfigParser {
	switch t {
	case "json":
		return jsonRuleConfigParser{}
	case "yaml":
		return yamlRuleConfigParser{}
	}
	return nil
}
```

单元测试：

```go
package factory

import (
	"reflect"
	"testing"
)

func TestNewIRuleConfigParser(t *testing.T) {
	tests := []struct {
		name string
		args string
		want IRuleConfigParser
	}{
		{
			name: "json",
			args: "json",
			want: jsonRuleConfigParser{},
		},
		{
			name: "yaml",
			args: "yaml",
			want: yamlRuleConfigParser{},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := NewIRuleConfigParser(tt.args); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("NewIRuleConfigParser() = %v, want %v", got, tt.want)
			}
		})
	}
}
```

### 工厂方法

当对象的创建逻辑比较复杂，不只是简单的new一下就可以，而是需要组合其他类对象，做各种初始化操作的时候，推荐使用工厂方法模式，将复杂的创建逻辑拆分到多个工厂类中，让每个工厂类都不至于过于复杂。

示例代码：

```go
package factory

// IRuleConfigParser 接口
type IRuleConfigParser interface {
	Parser(data []byte)
}

// jsonRuleConfigParser 对象
type jsonRuleConfigParser struct {
}

// Parser jsonRuleConfigParser 对象实现方法
func (J jsonRuleConfigParser) Parser(data []byte) {
	panic("implement me")
}

// yamlRuleConfigParser 对象
type yamlRuleConfigParser struct {
}

// Parser yamlRuleConfigParser 对象实现方法
func (Y yamlRuleConfigParser) Parser(data []byte) {
	panic("implement me")
}

// IRuleConfigParserFactory 简单工厂接口
type IRuleConfigParserFactory interface {
	CreateParser() IRuleConfigParser
}

// yamlRuleConfigParserFactory yamlRuleConfigParser 对象工厂方法
type yamlRuleConfigParserFactory struct {
}

// CreateParser yamlRuleConfigParserFactory对象方法
func (y yamlRuleConfigParserFactory) CreateParser() IRuleConfigParser {
	return yamlRuleConfigParser{}
}

// jsonRuleConfigParserFactory jsonRuleConfigParser 对象工厂方法
type jsonRuleConfigParserFactory struct {
}

// CreateParser jsonRuleConfigParserFactory对象方法
func (j jsonRuleConfigParserFactory) CreateParser() IRuleConfigParser {
	return jsonRuleConfigParser{}
}

// NewIRuleConfigParserfactory 简单工厂方法
func NewIRuleConfigParserfactory(t string) IRuleConfigParserFactory {
	switch t {
	case "json":
		return jsonRuleConfigParserFactory{}
	case "yaml":
		return yamlRuleConfigParserFactory{}
	}
	return nil
}
```

单元测试：

```go
package factory

import (
	"reflect"
	"testing"
)

func TestNewIRuleConfigParserFactory(t *testing.T) {
	tests := []struct {
		name string
		args string
		want IRuleConfigParserFactory
	}{
		{
			name: "json",
			args: "json",
			want: jsonRuleConfigParserFactory{},
		},
		{
			name: "yaml",
			args: "yaml",
			want: yamlRuleConfigParserFactory{},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := NewIRuleConfigParserfactory(tt.args); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("TestNewIRuleConfigParserFactory failed want=%s,got=%s", tt.want, got)
			}
		})
	}
}
```

### 抽象工厂

一个工厂方法可以创建相关联的多个类的时候就是抽象工厂模式，这个不常用

示例代码：

```go
package factory

// IRuleConfigParser 接口
type IRuleConfigParser interface {
	Parse(data []byte)
}

// jsonRuleConfigParser IRuleConfigParser 接口实现类
type jsonRuleConfigParser struct{}

// Parse jsonRuleConfigParser实现方法
func (j jsonRuleConfigParser) Parse(data []byte) {
	panic("implement me")
}

// ISystemConfigParser 接口
type ISystemConfigParser interface {
	ParseSystem(data []byte)
}

// jsonSystemConfigParser ISystemConfigParser 接口实现类
type jsonSystemConfigParser struct{}

// ParseSystem jsonSystemConfigParser实现方法
func (j jsonSystemConfigParser) ParseSystem(data []byte) {
	panic("implement me")
}

// IConfigParserFactory 工厂方法接口
type IConfigParserFactory interface {
	CreateRuleParser() IRuleConfigParser
	CreateSystemParser() ISystemConfigParser
}

// jsonConfigParserFactory IConfigParserFactory 工厂方法接口实现类
type jsonConfigParserFactory struct{}

// CreateRuleParser jsonConfigParserFactory实现方法
func (j jsonConfigParserFactory) CreateRuleParser() IRuleConfigParser {
	return jsonRuleConfigParser{}
}

// CreateSystemParser jsonConfigParserFactory实现方法
func (j jsonConfigParserFactory) CreateSystemParser() ISystemConfigParser {
	return jsonSystemConfigParser{}
}
```

单元测试：
```go
package factory

import (
	"reflect"
	"testing"
)

func Test_jsonConfigParserFactory_CreateRuleParser(t *testing.T) {
	tests := []struct {
		name string
		want IRuleConfigParser
	}{
		{
			name: "json",
			want: jsonRuleConfigParser{},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			j := jsonConfigParserFactory{}
			if got := j.CreateRuleParser(); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("CreateRuleParser() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_jsonConfigParserFactory_CreateSystemParser(t *testing.T) {
	tests := []struct {
		name string
		want ISystemConfigParser
	}{
		{
			name: "json",
			want: jsonSystemConfigParser{},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			j := jsonConfigParserFactory{}
			if got := j.CreateSystemParser(); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("CreateSystemParser() = %v, want %v", got, tt.want)
			}
		})
	}
}
```

### DI（Dependency Injection，依赖注入）容器

基本的工厂模式中一个工厂类只负责某个类对象或者某一组相关类对象（继承自同一个抽象类或者接口的子类）的创建；而DI容器负责的是**整个应用中所有类对象的创建**。

DI的核心功能：
- 配置解析
- 对象创建
	- 涉及工厂模式
	- 利用反射创建对象
	- 利用递归解决对象依赖
- 对象生命周期管理

对于DI来说，最重要的就是如何解决**循环依赖**的问题，主要有如下两种方式：
- 构造器方式
	- 无法解决，抛出异常
	- 可以使用一个map缓存创建的对象，如果发现已存在则表示有循环依赖
- setter方式：利用单例模式+缓存的方式来实现

golang 现有的依赖注入框架:

- 使用反射实现的: https://github.com/uber-go/dig
- 使用 generate 实现的: https://github.com/google/wire

下面将通过反射实现一个类似 dig 简单的 demo，在课程里面的例子是读取配置文件，然后进行生成，下面提供是通过 provider 进行构建依赖关系。

示例代码：

```go
package di

import (
	"fmt"
	"reflect"
)

// Container DI 容器
type Container struct {
	// 假设一种类型只能有一个 provider 提供
	providers map[reflect.Type]provider

	// 缓存以生成的对象
	results map[reflect.Type]reflect.Value
}

type provider struct {
	value reflect.Value

	params []reflect.Type
}

// New 创建一个容器
func New() *Container {
	return &Container{
		providers: map[reflect.Type]provider{},
		results:   map[reflect.Type]reflect.Value{},
	}
}

// isError 判断是否是 error 类型
func isError(t reflect.Type) bool {
	if t.Kind() != reflect.Interface {
		return false
	}
	return t.Implements(reflect.TypeOf(reflect.TypeOf((*error)(nil)).Elem()))
}

// Provide 对象提供者，需要传入一个对象的工厂方法，后续会用于对象的创建
func (c *Container) Provide(constructor interface{}) error {
	v := reflect.ValueOf(constructor)

	// 仅支持函数 provider
	if v.Kind() != reflect.Func {
		return fmt.Errorf("constructor must be a func")
	}

	vt := v.Type()

	// 获取参数
	params := make([]reflect.Type, vt.NumIn())
	for i := 0; i < vt.NumIn(); i++ {
		params[i] = vt.In(i)
	}

	// 获取返回值
	results := make([]reflect.Type, vt.NumOut())
	for i := 0; i < vt.NumOut(); i++ {
		results[i] = vt.Out(i)
	}

	provider := provider{
		value:  v,
		params: params,
	}

	// 保存不同类型的 provider
	for _, result := range results {
		// 判断返回值是不是 error
		if isError(result) {
			continue
		}

		if _, ok := c.providers[result]; ok {
			return fmt.Errorf("%s had a provider", result)
		}

		c.providers[result] = provider
	}

	return nil
}

// Invoke 函数执行入口
func (c *Container) Invoke(function interface{}) error {
	v := reflect.ValueOf(function)

	// 仅支持函数 provider
	if v.Kind() != reflect.Func {
		return fmt.Errorf("constructor must be a func")
	}

	vt := v.Type()

	// 获取参数
	var err error
	params := make([]reflect.Value, vt.NumIn())
	for i := 0; i < vt.NumIn(); i++ {
		params[i], err = c.buildParam(vt.In(i))
		if err != nil {
			return err
		}
	}

	v.Call(params)

	// 获取 providers
	return nil
}

// buildParam 构建参数
// 1. 从容器中获取 provider
// 2. 递归获取 provider 的参数值
// 3. 获取到参数之后执行函数
// 4. 将结果缓存并且返回结果
func (c *Container) buildParam(param reflect.Type) (val reflect.Value, err error) {
	if result, ok := c.results[param]; ok {
		return result, nil
	}

	provider, ok := c.providers[param]
	if !ok {
		return reflect.Value{}, fmt.Errorf("can not found provider: %s", param)
	}

	params := make([]reflect.Value, len(provider.params))
	for i, p := range provider.params {
		params[i], err = c.buildParam(p)
	}

	results := provider.value.Call(params)
	for _, result := range results {
		// 判断是否报错
		if isError(result.Type()) && !result.IsNil() {
			return reflect.Value{}, fmt.Errorf("%s call err: %+v", provider, result)
		}

		if !isError(result.Type()) && !result.IsNil() {
			c.results[result.Type()] = result
		}
	}
	return c.results[param], nil
}
```

我们这里的实现比较粗糙，但是作为一个 demo 理解 di 容器也足够了，和 dig 相比还缺少很多东西，并且有许多的问题，例如 依赖关系，一种类型如果有多个 provider 如何处理等等等等。
可以看到我们总共就三个函数

- Provide: 获取对象工厂，并且使用一个 map 将对象工厂保存
- Invoke: 执行入口
- buildParam: 核心逻辑，构建参数
	- 从容器中获取 provider
	- 递归获取 provider 的参数值
	- 获取到参数之后执行函数
	- 将结果缓存并且返回结果

测试代码：

```go
package main

import (
	"fmt"

	di "github.com/mohuishou/go-design-pattern/02_factory/024_di"
)

// A 依赖关系 A -> B -> C
type A struct {
	B *B
}

// NewA NewA
func NewA(b *B) *A {
	return &A{
		B: b,
	}
}

// B B
type B struct {
	C *C
}

// NewB NewB
func NewB(c *C) *B {
	return &B{C: c}
}

// C C
type C struct {
	Num int
}

// NewC NewC
func NewC() *C {
	return &C{
		Num: 1,
	}
}

func main() {
	container := di.New()
	if err := container.Provide(NewA); err != nil {
		panic(err)
	}
	if err := container.Provide(NewB); err != nil {
		panic(err)
	}
	if err := container.Provide(NewC); err != nil {
		panic(err)
	}

	err := container.Invoke(func(a *A) {
		fmt.Printf("%+v: %d", a, a.B.C.Num)
	})
	if err != nil {
		panic(err)
	}
}
```

## 建造者模式（Builder Pattern）

建造者模式，是将一个复杂的对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。创建者模式隐藏了复杂对象的创建过程，它把复杂对象的创建过程加以抽象，通过子类继承或者重载的方式，动态的创建具有复合属性的对象。

使用场景：

- 类中的属性比较多
- 类的属性之间有一定的依赖关系，或者是约束条件
- 存在必选和非必选的属性
- 希望创建不可变的对象

其和工厂模式一样都是属于创建性设计模式，其主要的区别有：

- 工厂模式：用于创建类型相关的不同对象
- 建造者模式：用于创建参数复杂的同一对象

其实在 golang 中对于创建类参数比较多的对象的时候，常见的做法是必填参数直接传递，可选参数通过传递可变的方法进行创建。

### 传统的建造者模式

首先使用 golang 来实现传统的建造者模式：

```go
package builder

import (
	"errors"
	"fmt"
)

const (
	defaultMaxTotal = 10
	defaultMaxIdle  = 9
	defaultMinIdle  = 1
)

// ResourcePoolConfig 所要建造的对象类型，属性为私有属性
type ResourcePoolConfig struct {
	name     string
	maxTotal int
	maxIdle  int
	minIdle  int
}

// ResourcePoolConfigBuilder 用于创建 ResourcePoolConfig
type ResourcePoolConfigBuilder struct {
	name     string
	maxTotal int
	maxIdle  int
	minIdle  int
}

// 下面是对应的参数设置
func (b *ResourcePoolConfigBuilder) SetName(name string) error {
	if name == "" {
		return fmt.Errorf("name can not be empty")
	}
	b.name = name
	return nil
}

func (b *ResourcePoolConfigBuilder) SetMinIdle(minIdle int) error {
	if minIdle < 0 {
		return fmt.Errorf("max tatal cannot < 0, input: %d", minIdle)
	}
	b.minIdle = minIdle
	return nil
}

func (b *ResourcePoolConfigBuilder) SetMaxIdle(maxIdle int) error {
	if maxIdle < 0 {
		return fmt.Errorf("max tatal cannot < 0, input: %d", maxIdle)
	}
	b.maxIdle = maxIdle
	return nil
}

func (b *ResourcePoolConfigBuilder) SetMaxTotal(maxTotal int) error {
	if maxTotal <= 0 {
		return fmt.Errorf("max tatal cannot <= 0, input: %d", maxTotal)
	}
	b.maxTotal = maxTotal
	return nil
}

// 为 ResourcePoolConfigBuilder 提供一个开放的创建方法 Build
func (b *ResourcePoolConfigBuilder) Build() (*ResourcePoolConfig, error) {
	if b.name == "" {
		return nil, errors.New("name can not be empty")
	}

	// 设置默认值
	if b.minIdle == 0 {
		b.minIdle = defaultMinIdle
	}

	if b.maxIdle == 0 {
		b.maxIdle = defaultMaxIdle
	}

	if b.maxTotal == 0 {
		b.maxTotal = defaultMaxTotal
	}

	if b.maxTotal < b.maxIdle {
		return nil, fmt.Errorf("max total(%d) cannot < max idle(%d)", b.maxTotal, b.maxIdle)
	}

	if b.minIdle > b.maxIdle {
		return nil, fmt.Errorf("max idle(%d) cannot < min idle(%d)", b.maxIdle, b.minIdle)
	}

	return &ResourcePoolConfig{
		name:     b.name,
		maxTotal: b.maxTotal,
		maxIdle:  b.maxIdle,
		minIdle:  b.minIdle,
	}, nil
}
```

单元测试：

```go
package builder

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestResourcePoolConfigBuilder_Build(t *testing.T) {
	tests := []struct {
		name    string
		builder *ResourcePoolConfigBuilder
		want    *ResourcePoolConfig
		wantErr bool
	}{
		{
			name: "name empty",
			builder: &ResourcePoolConfigBuilder{
				name:     "",
				maxTotal: 0,
			},
			want:    nil,
			wantErr: true,
		},
		{
			name: "maxIdle < minIdle",
			builder: &ResourcePoolConfigBuilder{
				name:     "test",
				maxTotal: 0,
				maxIdle:  10,
				minIdle:  20,
			},
			want:    nil,
			wantErr: true,
		},
		{
			name: "success",
			builder: &ResourcePoolConfigBuilder{
				name: "test",
			},
			want: &ResourcePoolConfig{
				name:     "test",
				maxTotal: defaultMaxTotal,
				maxIdle:  defaultMaxIdle,
				minIdle:  defaultMinIdle,
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := tt.builder.Build()
			require.Equalf(t, tt.wantErr, err != nil, "Build()error = %v,wanterr %v", err, tt.wantErr)
			assert.Equal(t, tt.want, got)
		})
	}
}
```

通过上面的代码可以看到，使用 golang 编写建造者模式的代码会非常复杂，这也是他的一个缺点，所以如果不是参数的校验逻辑很复杂的情况下一般我们在 go 中都不会采用这种方式，而是会采用另一种方式。

### GO常用的参数传递方法

```go
package builder

import "fmt"

type ResourcePoolConfigOption struct {
	maxTotal int
	maxIdle  int
	minIdle  int
}

type ResourcePoolConfigOptFunc func(option *ResourcePoolConfigOption)

func NewResourcePoolConfig(name string, opts ...ResourcePoolConfigOptFunc) (*ResourcePoolConfig, error) {
	if name == "" {
		return nil, fmt.Errorf("name can not be empty")
	}

	// 兜底对象
	option := &ResourcePoolConfigOption{
		maxTotal: 10,
		maxIdle:  9,
		minIdle:  1,
	}

	for _, opt := range opts {
		opt(option)
	}

	if option.maxTotal < 0 || option.maxIdle < 0 || option.minIdle < 0 {
		return nil, fmt.Errorf("args err, option: %v", option)
	}

	if option.maxTotal < option.maxIdle || option.minIdle > option.maxIdle {
		return nil, fmt.Errorf("args err, option: %v", option)
	}

	return &ResourcePoolConfig{
		name:     name,
		maxTotal: option.maxTotal,
		maxIdle:  option.maxIdle,
		minIdle:  option.minIdle,
	}, nil
}
```

单元测试：

```go
package builder

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNewResourcePoolConfig(t *testing.T) {
	type args struct {
		name string
		opts []ResourcePoolConfigOptFunc
	}
	tests := []struct {
		name    string
		args    args
		want    *ResourcePoolConfig
		wantErr bool
	}{
		{
			name: "name empty",
			args: args{
				name: "",
			},
			want:    nil,
			wantErr: true,
		},
		{
			name: "success",
			args: args{
				name: "test",
				opts: []ResourcePoolConfigOptFunc{
					func(option *ResourcePoolConfigOption) {
						option.minIdle = 2
					},
				},
			},
			want: &ResourcePoolConfig{
				name:     "test",
				maxTotal: 10,
				maxIdle:  9,
				minIdle:  2,
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := NewResourcePoolConfig(tt.args.name, tt.args.opts...)
			require.Equalf(t, tt.wantErr, err != nil, "error = %v, wantErr %v", err, tt.wantErr)
			assert.Equal(t, tt.want, got)
		})
	}
}
```

其实可以看到，绝大多数情况下直接使用 Go 常用的参数传递方法就可以了，并且在编写公共库的时候，强烈建议入口的参数都可以这么传递，这样可以最大程度的保证我们公共库的兼容性，避免在后序更新的时候出现破坏性的更新情况。

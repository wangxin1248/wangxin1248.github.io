---
layout: post
title:  "Golang设计模式（三）：结构型设计模式"
date:  2022-03-20
desc: "设计模式非常重要，特别是在一些系统框架设计上发挥了奠定性的作用，本文就来介绍常见的几种设计模式在 Golang 语言中的实现"
keywords: "设计模式,设计原则,Go"
categories: [Design Pattern]
tags: [设计模式]
---

目录：
- 目录
{:toc #markdown-toc}
# 结构型设计模式

本文将介绍设计模式中的结构型设计模式，主要介绍如下几种常见的设计模式：

- 代理模式
- 桥接模式
- 装饰器模式
- 适配器模式

## 代理模式

代理模式是指在不改变原始类代码的基础上，通过引入代理类来给原始类增加功能（附加的功能和原有类功能没有强关联性）的设计模式。

代理模式的主要应用场景：

- 业务系统的非功能性需求开发：监控、统计、鉴权、限流、事务
- RPC
- 缓存

代理模式可以分为静态代理模式和动态代理模式两种：

**静态代理模式**：

- 代理类和源类实现相同的接口，每个类都单独编辑一个代理类；
- 一方面，需要在代理中将源类中的所有方法都实现一遍，并且为每个方法都附加功能类的代码逻辑；
- 另一方面，如果要添加附加功能的类不止一个，那么我们需要针对每一个源类都实现一个代理类。

**动态代理模式**：

- 动态代理模式一般基于**反射**来实现；
- 不会针对原始类来编写代理类，而是在原始类运行的时候动态的为其创建对应的代理类，然后在代码中使用代理类来替换原始类。

接下来通过 golang 实现静态代理，由于 Golang 和 java 的差异性，我们无法比较方便的利用反射实现动态代理，但是我们可以利用 **go generate** 实现类似的效果，并且这样实现有两个比较大的好处，一个是有静态代码检查，我们在编译期间就可以及早发现问题，第二个是性能会更好。

### 静态代理模式

```go
package proxy

import (
	"log"
	"time"
)

type IUser interface {
	Login(username, password string) error 
}

// 源类
type User struct {}

func (u *User)Login(username, password string) error {
	return nil
}

// 代理类
type ProxyUser struct{
	user *User
}

func NewProxyUser(user *User) *ProxyUser{
	return &ProxyUser{
		user: user
	}
}

func (u *ProxyUser)Login(username, password string) error {
	// befor 增加一些统计的逻辑
	start := time.Now()

	// 这里是原有的逻辑
	if err := u.user.Login(username,password); err != nil{
		return err
	}

	// after 这里也有一些监控统计的逻辑
	log.Printf("user log cost time: %s",time.Now().Sub(start))
	return nil
}
```

单元测试：

```go
package proxy

import (
	"testing"
	"github.com/stretchr/testify/require"
)

func TestProxyUser_Login(t *testing.T){
	proxyUser := NewProxyUser(&User{})
	err := proxyUser.Login("admin","password")

	require.Nil(t,err)
}
```

### 动态代理模式

动态代理模式相比较于静态代理模式，其大大的提高了我们的生产力，将我们从繁杂的重复代码中解放出来。

而在 golang 中，有一个 generate 命令，其可以帮助我们实现相同的功能，因此我们可以尝试使用 go generate 来实现类型动态代理的效果。

我们在代码上使用 `@proxy 接口名` 来标注这个类要生成一个对应的代理类，这样我们使用 go generate 扫描struct的时候便可以为其生成一个代理类，并且实现相同的接口，这个接口就是注释中指定的接口。

```go
// user用户
@proxy IUser
type User struct{

}
```

接下来便使用 go generate 来实现这个动态代理的效果，实现思路：

- 读取文件, 获取文件的 ast 语法树
- 通过 NewCommentMap 构建 node 和 comment 的关系
- 通过 comment 是否包含 @proxy 接口名 的接口，判断该节点是否需要生成代理类
- 通过 Lookup 方法找到接口
- 循环获取接口的每个方法的，方法名、参数、返回值信息
- 将方法信息，包名、需要代理类名传递给构建好的模板文件，生成代理类
- 最后用 format 包的方法格式化源代码

实现代码：

```go
package proxy

import (
	"bytes"
	"fmt"
	"go/ast"
	"go/format"
	"go/parser"
	"go/token"
	"strings"
	"text/template"
)

func generate(file string) (string, error) {
	fset := token.NewFileSet() // positions are relative to fset
	f, err := parser.ParseFile(fset, file, nil, parser.ParseComments)
	if err != nil {
		return "", err
	}

	// 获取代理需要的数据
	data := proxyData{
		Package: f.Name.Name,
	}

	// 构建注释和 node 的关系
	cmap := ast.NewCommentMap(fset, f, f.Comments)
	for node, group := range cmap {
		// 从注释 @proxy 接口名，获取接口名称
		name := getProxyInterfaceName(group)
		if name == "" {
			continue
		}

		// 获取代理的类名
		data.ProxyStructName = node.(*ast.GenDecl).Specs[0].(*ast.TypeSpec).Name.Name

		// 从文件中查找接口
		obj := f.Scope.Lookup(name)

		// 类型转换，注意: 这里没有对断言进行判断，可能会导致 panic
		t := obj.Decl.(*ast.TypeSpec).Type.(*ast.InterfaceType)

		for _, field := range t.Methods.List {
			fc := field.Type.(*ast.FuncType)

			// 代理的方法
			method := &proxyMethod{
				Name: field.Names[0].Name,
			}

			// 获取方法的参数和返回值
			method.Params, method.ParamNames = getParamsOrResults(fc.Params)
			method.Results, method.ResultNames = getParamsOrResults(fc.Results)

			data.Methods = append(data.Methods, method)
		}
	}

	// 生成文件
	tpl, err := template.New("").Parse(proxyTpl)
	if err != nil {
		return "", err
	}

	buf := &bytes.Buffer{}
	if err := tpl.Execute(buf, data); err != nil {
		return "", err
	}

	// 使用 go fmt 对生成的代码进行格式化
	src, err := format.Source(buf.Bytes())
	if err != nil {
		return "", err
	}

	return string(src), nil
}

// getParamsOrResults 获取参数或者是返回值
// 返回带类型的参数，以及不带类型的参数，以逗号间隔
func getParamsOrResults(fields *ast.FieldList) (string, string) {
	var (
		params     []string
		paramNames []string
	)

	for i, param := range fields.List {
		// 循环获取所有的参数名
		var names []string
		for _, name := range param.Names {
			names = append(names, name.Name)
		}

		if len(names) == 0 {
			names = append(names, fmt.Sprintf("r%d", i))
		}

		paramNames = append(paramNames, names...)

		// 参数名加参数类型组成完整的参数
		param := fmt.Sprintf("%s %s",
			strings.Join(names, ","),
			param.Type.(*ast.Ident).Name,
		)
		params = append(params, strings.TrimSpace(param))
	}

	return strings.Join(params, ","), strings.Join(paramNames, ",")
}

func getProxyInterfaceName(groups []*ast.CommentGroup) string {
	for _, commentGroup := range groups {
		for _, comment := range commentGroup.List {
			if strings.Contains(comment.Text, "@proxy") {
				interfaceName := strings.TrimLeft(comment.Text, "// @proxy ")
				return strings.TrimSpace(interfaceName)
			}
		}
	}
	return ""
}

// 生成代理类的文件模板
const proxyTpl = `
package {{.Package}}

type {{ .ProxyStructName }}Proxy struct {
	child *{{ .ProxyStructName }}
}

func New{{ .ProxyStructName }}Proxy(child *{{ .ProxyStructName }}) *{{ .ProxyStructName }}Proxy {
	return &{{ .ProxyStructName }}Proxy{child: child}
}

{{ range .Methods }}
func (p *{{$.ProxyStructName}}Proxy) {{ .Name }} ({{ .Params }}) ({{ .Results }}) {
	// before 这里可能会有一些统计的逻辑
	start := time.Now()

	{{ .ResultNames }} = p.child.{{ .Name }}({{ .ParamNames }})

	// after 这里可能也有一些监控统计的逻辑
	log.Printf("user login cost time: %s", time.Now().Sub(start))

	return {{ .ResultNames }}
}
{{ end }}
`

type proxyData struct {
	// 包名
	Package string
	// 需要代理的类名
	ProxyStructName string
	// 需要代理的方法
	Methods []*proxyMethod
}

// proxyMethod 代理的方法
type proxyMethod struct {
	// 方法名
	Name string
	// 参数，含参数类型
	Params string
	// 参数名
	ParamNames string
	// 返回值
	Results string
	// 返回值名
	ResultNames string
}
```

单元测试：

```go
package proxy

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_generate(t *testing.T) {
	want := `package proxy

type UserProxy struct {
	child *User
}

func NewUserProxy(child *User) *UserProxy {
	return &UserProxy{child: child}
}

func (p *UserProxy) Login(username, password string) (r0 error) {
	// before 这里可能会有一些统计的逻辑
	start := time.Now()

	r0 = p.child.Login(username, password)

	// after 这里可能也有一些监控统计的逻辑
	log.Printf("user login cost time: %s", time.Now().Sub(start))

	return r0
}
`
	got, err := generate("./static_proxy.go")
	require.Nil(t, err)
	assert.Equal(t, want, got)
}
```

## 桥接模式

桥接模式是指将类的抽象和实现解耦，让他们可以独立变化。即一个类存在两个（或多个）独立变化的维度，使得我们可以通过组合的方式让这两个（或多个）独立变化的维度实现扩展。

一个比较典型的例子就是：监控告警，在监控告警当中有不同的告警类型有不同的通知类型，将告警类型和通知类型进行拆分形成两个类，将通知类型作为参数传递给告警类型即可。

很多设计模式都是将一个庞大的类进行拆分形成许多细小的类，然后在通过某种更合理的方式进行组合。

代码实现：

```go
package bridge

// IMsgSender IMsgSender
type IMsgSender interface {
	Send(msg string) error
}

// EmailMsgSender 发送邮件
// 可能还有 电话、短信等各种实现
type EmailMsgSender struct {
	emails []string
}

// NewEmailMsgSender NewEmailMsgSender
func NewEmailMsgSender(emails []string) *EmailMsgSender {
	return &EmailMsgSender{emails: emails}
}

// Send Send
func (s *EmailMsgSender) Send(msg string) error {
	// 这里去发送消息
	return nil
}

// INotification 通知接口
type INotification interface {
	Notify(msg string) error
}

// ErrorNotification 错误通知
// 后面可能还有 warning 各种级别
type ErrorNotification struct {
	sender IMsgSender
}

// NewErrorNotification NewErrorNotification
func NewErrorNotification(sender IMsgSender) *ErrorNotification {
	return &ErrorNotification{sender: sender}
}

// Notify 发送通知
func (n *ErrorNotification) Notify(msg string) error {
	return n.sender.Send(msg)
}
```

单元测试：
```go
func TestErrorNotification_Notify(t *testing.T) {
	sender := NewEmailMsgSender([]string{"test@test.com"})
	n := NewErrorNotification(sender)
	err := n.Notify("test msg")

	assert.Nil(t, err)
}
```

## 装饰器模式

装饰器模式：通过组合的方式来代替继承，主要用于处理继承关系过于复杂的情况。主要的作用是用来给原始类增加功能。

适配器模式和代理模式在代码上没有什么区别，主要的区别在于装饰器模式是为类提供具有相关性功能，而代理模式是为类提供不相关的功能。

代码实现：

下面是一个简单的画画的例子，原本的 square 只有基础的画画的能力，ColorSquare可以为其加上颜色的功能：

```go
package decorator

// IDraw IDraw
type IDraw interface {
	Draw() string
}

// Square 正方形
type Square struct{}

// Draw Draw
func (s Square) Draw() string {
	return "this is a square"
}

// ColorSquare 有颜色的正方形
type ColorSquare struct {
	square IDraw
	color  string
}

// NewColorSquare NewColorSquare
func NewColorSquare(square IDraw, color string) ColorSquare {
	return ColorSquare{color: color, square: square}
}

// Draw Draw
func (c ColorSquare) Draw() string {
	return c.square.Draw() + ", color is " + c.color
}
```

测试：
```go
func TestColorSquare_Draw(t *testing.T) {
	sq := Square{}
	csq := NewColorSquare(sq, "red")
	got := csq.Draw()
	assert.Equal(t, "this is a square, color is red", got)
}
```


## 适配器模式

适配器模式的主要功能就是用来做适配，使用该模式可以将不兼容的接口转变为可兼容的接口，让原本因为不兼容而不能在一起工作的类可以一起工作。

适配器模式按照实现方式可以分为 **类适配器、对象适配器**两种：

- 类适配器：继承实现
- 对象适配器：组合实现

对于所需要适配的接口数量不多的情况下两种实现方式都可以，但是对于实现接口数量较多的情况下对于需要大量更改的情况下建议使用 **对象适配器**，而不需要大量更改的情况下建议使用 **类适配器**。

该模式主要的应用场景是对于接口不兼容的情况下进行兼容改造：

- 封装有缺陷的接口设计
- 统一多个类的接口设计
- 替换依赖的外部系统
- 兼容老版本接口
- 适配不同格式的数据

适配器模式与其他几种设计模式的区别：

- 代理模式：代理模式在不改变原始类接口定义的基础上，为原始类提供代理类定义，主要的目的在于**访问控制**，而非加强功能，这是其和装饰器模式最大的不同。
- 桥接模式：桥接模式是将接口部分和实现部分相分离，从而将他们以更加容易、独立的方式进行改变。
- 装饰器模式：装饰器模式在不改变原始类定义的基础上对原始类的功能进行增强，并且支持多个装饰器的嵌套使用。
- 适配器模式：适配器模式是一种事后的补救策略，适配器提供和原始类不同的接口，而代理模式、装饰器模式都是提供的和原始类相同的接口。

代码示例：

假设我现在有一个运维系统，需要分别调用阿里云和 AWS 的 SDK 创建主机，两个 SDK 提供的创建主机的接口不一致，此时就可以通过适配器模式，将两个接口统一。

```go
package adapter

import "fmt"

// ICreateServer 创建云主机
type ICreateServer interface {
	CreateServer(cpu, mem float64) error
}

// AWSClient aws sdk
type AWSClient struct{}

// RunInstance 启动实例
func (c *AWSClient) RunInstance(cpu, mem float64) error {
	fmt.Printf("aws client run success, cpu： %f, mem: %f", cpu, mem)
	return nil
}

// AwsClientAdapter 适配器
type AwsClientAdapter struct {
	Client AWSClient
}

// CreateServer 启动实例
func (a *AwsClientAdapter) CreateServer(cpu, mem float64) error {
	a.Client.RunInstance(cpu, mem)
	return nil
}

// AliyunClient aliyun sdk
type AliyunClient struct{}

// CreateServer 启动实例
func (c *AliyunClient) CreateServer(cpu, mem int) error {
	fmt.Printf("aws client run success, cpu： %d, mem: %d", cpu, mem)
	return nil
}

// AliyunClientAdapter 适配器
type AliyunClientAdapter struct {
	Client AliyunClient
}

// CreateServer 启动实例
func (a *AliyunClientAdapter) CreateServer(cpu, mem float64) error {
	a.Client.CreateServer(int(cpu), int(mem))
	return nil
}
```

单元测试：

```go
package adapter

import (
	"testing"
)

func TestAliyunClientAdapter_CreateServer(t *testing.T) {
	// 确保 adapter 实现了目标接口
	var a ICreateServer = &AliyunClientAdapter{
		Client: AliyunClient{},
	}

	a.CreateServer(1.0, 2.0)
}

func TestAwsClientAdapter_CreateServer(t *testing.T) {
	// 确保 adapter 实现了目标接口
	var a ICreateServer = &AwsClientAdapter{
		Client: AWSClient{},
	}

	a.CreateServer(1.0, 2.0)
}
```

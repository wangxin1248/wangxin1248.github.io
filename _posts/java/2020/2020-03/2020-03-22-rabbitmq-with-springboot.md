---
layout: post
title:  "SpringBoot 整合 RabbitMQ 开发配置"
date:  2020-03-22
desc: "介绍如何在 SpringBoot 项目中整合 RabbitMQ"
keywords: "Java,SpringBoot,RabbitMQ"
categories: [Java]
tags: [Java,SpringBoot]
---
# SpringBoot And RabbitMQ

## RabbitMQ

MQ全称为Message Queue，即消息队列， RabbitMQ 是由 erlang 语言开发，基于 AMQP（Advanced Message Queue 高级消息队列协议）协议实现的消息队列，它是一种应用程序之间的通信方法，消息队列在分布式系统开 发中应用非常广泛。RabbitMQ 官方地址：[http://www.rabbitmq.com/](http://www.rabbitmq.com/)

在项目程序的开发中，消息队列主要有如下的应用场景：

- 任务异步处理： 将不需要同步处理的并且耗时长的操作由消息队列通知消息接收方进行异步处理。提高了应用程序的响应时间。 
- 应用程序解耦合：MQ相当于一个中介，生产方通过MQ与消费方交互，它将应用程序进行解耦合。

而 RabbitMQ 的优点：

- 使用简单，功能强大。 
- 基于 AMQP 协议。 
- 社区活跃，文档完善。 
- 高并发性能好，这主要得益于 Erlang 语言。 
- Spring Boot 默认已集成 RabbitMQ。

基于以上的优点，RabbitMQ 经常在项目中被使用到。下面介绍如何在 Spring Boot 中使用 RabbitMQ。

## Spring Boot项目配置

### 依赖配置

这里选择基于 Spring-Rabbit 去操作 RabbitMQ [https://github.com/spring-projects/spring-amqp](https://github.com/spring-projects/spring-amqp)

使用 spring-boot-starter-amqp 会自动添加spring-rabbit 依赖，如下：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-logging</artifactId>
</dependency>
```

### 应用参数

配置 application.yml 如下：

```xml
server:
  port: 44000
spring:
  application:
    name: test-rabbitmq-producer
  rabbitmq:
    host: 192.168.116.129
    port: 5672
    username: admin
    password: admin
    virtualHost: /
```

## RabbitMQ项目开发

### RabbitMQ配置 RabbitConﬁg

定义 RabbitConﬁg 类，配置 Exchange、Queue、及绑定交换机。

```java
@Configuration
public class RabbitmqConfig {
    // 声明交换机和队列
    public static final String QUEUE_INFORM_EMAIL = "queue_inform_email";
    public static final String QUEUE_INFORM_SMS = "queue_inform_sms";
    public static final String EXCHANGE_TOPICS_INFORM="exchange_topics_inform";
    public static final String ROUTINGKEY_EMAIL="inform.#.email.#";
    public static final String ROUTINGKEY_SMS="inform.#.sms.#";

    // 声明TOPICS工作模式的交换机
    @Bean(EXCHANGE_TOPICS_INFORM)
    public Exchange EXCHANGE_TOPICS_INFORM(){
        // durable(true) 表面重启之后交换机还在
        return ExchangeBuilder.topicExchange(EXCHANGE_TOPICS_INFORM).durable(true).build();
    }

    // 声明QUEUE_INFORM_EMAIL队列
    @Bean(QUEUE_INFORM_EMAIL)
    public Queue QUEUE_INFORM_EMAIL(){
        return new Queue(QUEUE_INFORM_EMAIL);
    }
    // 声明QUEUE_INFORM_SMS队列
    @Bean(QUEUE_INFORM_SMS)
    public Queue QUEUE_INFORM_SMS(){
        return new Queue(QUEUE_INFORM_SMS);
    }

    // 交换机与QUEUE_INFORM_EMAIL队列绑定
    @Bean
    public Binding BINDING_QUEUE_INFORM_EMAIL(@Qualifier(QUEUE_INFORM_EMAIL) Queue queue,
                                              @Qualifier(EXCHANGE_TOPICS_INFORM) Exchange exchange){
        return BindingBuilder.bind(queue).to(exchange).with(ROUTINGKEY_EMAIL).noargs();
    }
    // 交换机与QUEUE_INFORM_SMS队列绑定
    @Bean
    public Binding BINDING_QUEUE_INFORM_SMS(@Qualifier(QUEUE_INFORM_SMS) Queue queue,
                                            @Qualifier(EXCHANGE_TOPICS_INFORM) Exchange exchange){
        return BindingBuilder.bind(queue).to(exchange).with(ROUTINGKEY_SMS).noargs();
    }
}
```

### 生产者 Producer

为了方便发送消息，这里使用测试类来实现生产者发送消息。

```java
@SpringBootTest
@RunWith(SpringRunner.class)
public class Producer05 {
    @Autowired
    RabbitTemplate rabbitTemplate;
    // 使用rabbitTemplate来发送消息
    @Test
    public void testSendEmail(){
        String message = "send email to user";
        /**
         * 参数
         * 1。交换机名称
         * 2。routingKey
         * 3。消息内容
         */
        rabbitTemplate.convertAndSend(RabbitmqConfig.EXCHANGE_TOPICS_INFORM,"inform.email",message);
    }
}
```

### 消费者 Consumer

Spring 提供了 @RabbitListener 注解来监听指定的队列，当队列中有消息时便执行所注解的方法。

```java
@Component
public class ReceiveHandler {
    // 监听email队列
    @RabbitListener(queues = {RabbitmqConfig.QUEUE_INFORM_EMAIL})
    public void receiveEmail(String msg, Message message, Channel channel){
        System.out.println(msg);
    }
    // 监听sms队列
    @RabbitListener(queues = {RabbitmqConfig.QUEUE_INFORM_SMS})
    public void receiveSms(String msg, Message message, Channel channel){
        System.out.println(msg);
    }
}
```

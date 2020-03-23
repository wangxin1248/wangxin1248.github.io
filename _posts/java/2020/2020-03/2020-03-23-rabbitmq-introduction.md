---
layout: post
title:  "RabbitMQ 介绍"
date:  2020-03-23
desc: "RabbitMQ原理介绍与使用"
keywords: "Java,SpringBoot,RabbitMQ"
categories: [Java]
tags: [Java,RabbitMQ]
---
# RabbitMQ

MQ 全称为 Message Queue，即消息队列， RabbitMQ 是由 erlang 语言开发，基于AMQP（Advanced Message Queue 高级消息队列协议）协议实现的消息队列，它是一种应用程序之间的通信方法，消息队列在分布式系统开发中应用非常广泛。RabbitMQ官方地址：  [http://www.rabbitmq.com/](http://www.rabbitmq.com/)

RabbitMQ相比较其他的 MQ 软件（ActiveMQ、ZeroMQ、Kafka、MetaMQ、RocketMQ、Redis）的优势在于：

- 使得简单，功能强大。 
- 基于AMQP协议。 
- 社区活跃，文档完善。 
- 高并发性能好，这主要得益于Erlang语言。
- Spring Boot默认已集成RabbitMQ

## RabbitMQ 工作原理

下图是RabbitMQ的基本结构：

![6](/assets/images/2020/2020-03/6.png)

其中：

- **Broker**：消息队列服务进程，此进程包括两个部分：Exchange 和 Queue，是 RabbitMQ的核心组成部分。 
- **Exchange**：消息队列交换机，按一定的规则将消息路由转发到某个队列，对消息进行过虑。
- **Queue**：消息队列，存储消息的队列，消息到达队列并转发给指定的消费方。 
- **Producer**：消息生产者，即生产方客户端，生产方客户端将消息发送到MQ。 
- **Consumer**：消息消费者，即消费方客户端，接收MQ转发的消息。

其中 Producer 和 Consumer 便是我们消息的生产方和消费方，也就是我们的应用程序。Exchange 是 RabbitMQ 将生产方生产的消息按照一定规则发送到指定的消费方。全程无需生产方和消费方直接进行交互。因此便降低了生产方和消费方的耦合度，将之前的同步通信流程改为了异步通信流程。

因此，RabbitMQ 便有如下的使用场景：

- 任务异步处理：将不需要同步处理的并且耗时长的操作由消息队列通知消息接收方进行异步处理，提高了应用程序的响应时间。 
- 应用程序解耦合：MQ相当于一个中介，生产方通过MQ与消费方交互，它将应用程序进行解耦合。

其中我们的发送消息的**生产者**通过 RabbitMQ 与接收消息的消费方进行消息通信的流程如下：

1、生产者和 Broker 建立 TCP 连接。 

2、生产者和 Broker 建立 Channel(通道)。

3、生产者通过 Channel 将消息发送给 Broker，由Exchange(交换机) 将消息进行转发。

4、Exchange 将消息转发到指定的 Queue(队列)。

而消息的接收方**消费者**获取消息的流程如下：

1、消费者和 Broker 建立 TCP 连接。

2、消费者和 Broker 建立通道 

3、消费者监听指定的 Queue。

4、当有消息到达 Queue 时 Broker 默认将消息推送给消费者。

5、消费者接收到消息。

## RabbitMQ 安装

RabbitMQ 的安装即对应的配置请参考；[Ubuntu 18.04 安装 RabbitMQ](https://wangxin1248.github.io/linux/2020/03/ubuntu-install-rabbitmq.html)

## RabbitMQ HelloWorld

Hello World程序的流程如下：

![7](/assets/images/2020/2020-03/7.png)

只创建一个生产者和一个消费者。生产者发送消息到 RabbitMQ ，然后消费者从 RabbitMQ 中读取消息。

注意生产者和消费者需要使用相同的 queue 才能正常通信。

### 生产者

```java
public class Producer01 {
    private static final String QUEUE = "HelloWorld";
    public static void main(String[] args) throws IOException, TimeoutException {
        // 通过连接工厂创建新的连接对象和mq建立连接
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 设置连接工厂的相关参数
        connectionFactory.setHost("192.168.116.129");// ip地址
        connectionFactory.setPort(5672);// 端口
        connectionFactory.setUsername("admin");// 用户名
        connectionFactory.setPassword("admin");// 密码
        // 设置虚拟机，一个mq的服务可以设置多个虚拟机，每个虚拟机就相当于一个独立的mq
        connectionFactory.setVirtualHost("/");

        // 建立新连接
        Connection connection = connectionFactory.newConnection();
        // 创建会话channel，生产者和mq服务所有的通信都在channel中完成
        Channel channel = connection.createChannel();
        // 声明队列，如果队列在mq中没有则创建
        /**
         * 参数
         * 1。queue：队列名称
         * 2。durable：是否持久化，mq重启后队列还在
         * 3。exclusive：是否独占连接，队列只允许在该连接中访问，如果连接关闭队列自动删除，如果将此参数设置为true，可用于临时队列的创建
         * 4。autoDelete：自动删除队列，队列不使用时自动删除此队列，如果将此参数和exclusive参数设置为true就可以实现临时队列（队列不用了自动删除）
         * 5。Map<String,Object> arguments：设置队列的扩展参数
         */
        channel.queueDeclare(QUEUE,true,false,false,null);
        // 所要发送的消息内容
        String message = "hello eorld wang xin";
        // 发送消息
        /**
         * 参数
         * 1。exchange：交换机，如果不指定将使用mq的默认交换机（设置为""）
         * 2。routingKey：路由key，交换机根据路由key来将消息转发到指定的队列，如果使用默认交换机，routingKey设置为队列的名称
         * 3。props：消息的属性
         * 4。body：消息内容
         */
        channel.basicPublish("",QUEUE,null,message.getBytes());
        System.out.println("send to mq"+message);

        // 关闭流
        channel.close();
        connection.close();
    }
}
```

### 消费者

```java
public class Consumer01 {
    private static final String QUEUE = "HelloWorld";
    public static void main(String[] args) throws IOException, TimeoutException {
        // 通过连接工厂创建新的连接对象和mq建立连接
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 设置连接工厂的相关参数
        connectionFactory.setHost("192.168.116.129");// ip地址
        connectionFactory.setPort(5672);// 端口
        connectionFactory.setUsername("admin");// 用户名
        connectionFactory.setPassword("admin");// 密码
        // 设置虚拟机，一个mq的服务可以设置多个虚拟机，每个虚拟机就相当于一个独立的mq
        connectionFactory.setVirtualHost("/");
        // 建立连接
        Connection connection = connectionFactory.newConnection();
        // 建立channel
        Channel channel = connection.createChannel();
        // 声明队列，如果队列在mq中没有则创建
        /**
         * 参数
         * 1。queue：队列名称
         * 2。durable：是否持久化，mq重启后队列还在
         * 3。exclusive：是否独占连接，队列只允许在该连接中访问，如果连接关闭队列自动删除，如果将此参数设置为true，可用于临时队列的创建
         * 4。autoDelete：自动删除队列，队列不使用时自动删除此队列，如果将此参数和exclusive参数设置为true就可以实现临时队列（队列不用了自动删除）
         * 5。Map<String,Object> arguments：设置队列的扩展参数
         */
        channel.queueDeclare(QUEUE,true,false,false,null);

        // 创建消费者方法
        DefaultConsumer consumer = new DefaultConsumer(channel){
            /**
             * 消费者接收消息时调用此方法
             * @param consumerTag 消费者的标签，在channel.basicConsume()去指定
             * @param envelope 消息包的内容，可从中获取消息id，消息routingkey，交换机，消息和重传标志 (收到消息失败后是否需要重新发送)
             * @param properties 消息属性
             * @param body 消息内容
             * @throws IOException
             */
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                // 交换机
                String exchange = envelope.getExchange();
                // 路由key
                String routingKey = envelope.getRoutingKey();
                // 消息id
                long deliveryTag = envelope.getDeliveryTag();
                // 消息内容
                String msg = new String(body,"utf-8");
                System.out.println("receive message.." + msg);
            }
        };
        // 监听队列
        /**
         * 参数
         * 1。queue：队列名称
         * 2。autoACK：自动回复，当消费者接受到消息后要告诉
         * 3。消费消息的方法，消费者接收到消息后调用此方法
         */
        channel.basicConsume(QUEUE,true,consumer);
    }
}
```

## RabbitMQ 工作模式

RabbitMQ 共有以下几种工作模式 ： 
- Work queues：工作队列模式
- Publish/Subscribe：发布订阅模式
- Routing：路由模式
- Topics：通配符模式
- Header：Header 模式
- RPC：RPC 模式

### Work queues

![8](/assets/images/2020/2020-03/8.png)

work queues 与入门程序相比，多了一个消费端，两个消费端共同消费同一个队列中的消息。 

#### 应用场景

对于任务过重或任务较多情况使用工作队列可以提高任务处理的速度。 

#### 测试

1、使用入门程序，启动多个消费者。 

2、生产者发送多个消息。 

结果： 

1、一条消息只会被一个消费者接收； 

2、rabbit采用**轮询**的方式将消息是平均发送给消费者的； 

3、消费者在处理完某条消息后，才会收到下一条消息。

### Publish/subscribe

![9](/assets/images/2020/2020-03/9.png)

发布订阅模式： 

1、每个消费者监听自己的队列。 

2、生产者将消息发给 broker，由交换机将消息转发到绑定此交换机的每个队列，每个绑定交换机的队列都将接收到消息。

#### 测试

案例：用户通知

当用户充值成功或转账完成系统通知用户，通知方式有短信、邮件多种方法。

##### 生产者

```java
public class Producer02 {
    private static final String QUEUE_INFORM_EMAIL = "queue_inform_email";
    private static final String QUEUE_INFORM_SMS = "queue_inform_sms";
    private static final String EXCHANGE_FANOUT_INFORM="exchange_fanout_inform";
    public static void main(String[] args) throws IOException, TimeoutException {
        // 通过连接工厂创建新的连接对象和mq建立连接
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 设置连接工厂的相关参数
        connectionFactory.setHost("192.168.116.129");// ip地址
        connectionFactory.setPort(5672);// 端口
        connectionFactory.setUsername("admin");// 用户名
        connectionFactory.setPassword("admin");// 密码
        // 设置虚拟机，一个mq的服务可以设置多个虚拟机，每个虚拟机就相当于一个独立的mq
        connectionFactory.setVirtualHost("/");

        // 建立新连接
        Connection connection = connectionFactory.newConnection();
        // 创建会话channel，生产者和mq服务所有的通信都在channel中完成
        Channel channel = connection.createChannel();

        // 声明队列，如果队列在mq中没有则创建
        channel.queueDeclare(QUEUE_INFORM_EMAIL,true,false,false,null);
        channel.queueDeclare(QUEUE_INFORM_SMS,true,false,false,null);

        // 声明交换机
        /** 参数
         * 1。交换机名称
         * 2。交换机类型
         * fanout：发布订阅模式
         * topic：通配符模式
         * direct：路由模式
         * headers：headers模式
         */
        channel.exchangeDeclare(EXCHANGE_FANOUT_INFORM, BuiltinExchangeType.FANOUT);

        // 将路由与交换机进行绑定
        /** 参数明细
         * 1。队列名称
         * 2。交换机名称
         * 3。路由key
         */
        channel.queueBind(QUEUE_INFORM_EMAIL,EXCHANGE_FANOUT_INFORM,"");
        channel.queueBind(QUEUE_INFORM_SMS,EXCHANGE_FANOUT_INFORM,"");

        // 开始发送消息
        String message = "send a message";
        for(int i=0;i<5;i++){
            channel.basicPublish(EXCHANGE_FANOUT_INFORM,"",null,message.getBytes());
            System.out.println(message);
        }
        channel.close();
        connection.close();
    }
}
```

##### 消费者

邮件消费者

```java
public class Consumer02Email {
    private static final String QUEUE_INFORM_EMAIL = "queue_inform_email";
    private static final String EXCHANGE_FANOUT_INFORM="exchange_fanout_inform";
    public static void main(String[] args) throws IOException, TimeoutException {
        // 通过连接工厂创建新的连接对象和mq建立连接
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 设置连接工厂的相关参数
        connectionFactory.setHost("192.168.116.129");// ip地址
        connectionFactory.setPort(5672);// 端口
        connectionFactory.setUsername("admin");// 用户名
        connectionFactory.setPassword("admin");// 密码
        // 设置虚拟机，一个mq的服务可以设置多个虚拟机，每个虚拟机就相当于一个独立的mq
        connectionFactory.setVirtualHost("/");
        // 建立连接
        Connection connection = connectionFactory.newConnection();
        // 建立channel
        Channel channel = connection.createChannel();
        // 声明队列，如果队列在mq中没有则创建
        /**
         * 参数
         * 1。queue：队列名称
         * 2。durable：是否持久化，mq重启后队列还在
         * 3。exclusive：是否独占连接，队列只允许在该连接中访问，如果连接关闭队列自动删除，如果将此参数设置为true，可用于临时队列的创建
         * 4。autoDelete：自动删除队列，队列不使用时自动删除此队列，如果将此参数和exclusive参数设置为true就可以实现临时队列（队列不用了自动删除）
         * 5。Map<String,Object> arguments：设置队列的扩展参数
         */
        channel.queueDeclare(QUEUE_INFORM_EMAIL,true,false,false,null);

        // 声明交换机
        /** 参数
         * 1。交换机名称
         * 2。交换机类型
         * fanout：发布订阅模式
         * topic：通配符模式
         * direct：路由模式
         * headers：headers模式
         */
        channel.exchangeDeclare(EXCHANGE_FANOUT_INFORM, BuiltinExchangeType.FANOUT);

        // 将路由与交换机进行绑定
        /** 参数明细
         * 1。队列名称
         * 2。交换机名称
         * 3。路由key
         */
        channel.queueBind(QUEUE_INFORM_EMAIL,EXCHANGE_FANOUT_INFORM,"");
        // 创建消费者方法
        DefaultConsumer consumer = new DefaultConsumer(channel){
            /**
             * 消费者接收消息时调用此方法
             * @param consumerTag 消费者的标签，在channel.basicConsume()去指定
             * @param envelope 消息包的内容，可从中获取消息id，消息routingkey，交换机，消息和重传标志 (收到消息失败后是否需要重新发送)
             * @param properties 消息属性
             * @param body 消息内容
             * @throws IOException
             */
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                // 交换机
                String exchange = envelope.getExchange();
                // 路由key
                String routingKey = envelope.getRoutingKey();
                // 消息id
                long deliveryTag = envelope.getDeliveryTag();
                // 消息内容
                String msg = new String(body,"utf-8");
                System.out.println("receive message.." + msg);
            }
        };
        // 监听队列
        /**
         * 参数
         * 1。queue：队列名称
         * 2。autoACK：自动回复，当消费者接受到消息后要告诉
         * 3。消费消息的方法，消费者接收到消息后调用此方法
         */
        channel.basicConsume(QUEUE_INFORM_EMAIL,true,consumer);
    }
}
```

短信消费者

```java
public class Consumer02Sms {
    private static final String QUEUE_INFORM_SMS = "queue_inform_sms";
    private static final String EXCHANGE_FANOUT_INFORM="exchange_fanout_inform";
    public static void main(String[] args) throws IOException, TimeoutException {
        // 通过连接工厂创建新的连接对象和mq建立连接
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 设置连接工厂的相关参数
        connectionFactory.setHost("192.168.116.129");// ip地址
        connectionFactory.setPort(5672);// 端口
        connectionFactory.setUsername("admin");// 用户名
        connectionFactory.setPassword("admin");// 密码
        // 设置虚拟机，一个mq的服务可以设置多个虚拟机，每个虚拟机就相当于一个独立的mq
        connectionFactory.setVirtualHost("/");
        // 建立连接
        Connection connection = connectionFactory.newConnection();
        // 建立channel
        Channel channel = connection.createChannel();
        // 声明队列，如果队列在mq中没有则创建
        /**
         * 参数
         * 1。queue：队列名称
         * 2。durable：是否持久化，mq重启后队列还在
         * 3。exclusive：是否独占连接，队列只允许在该连接中访问，如果连接关闭队列自动删除，如果将此参数设置为true，可用于临时队列的创建
         * 4。autoDelete：自动删除队列，队列不使用时自动删除此队列，如果将此参数和exclusive参数设置为true就可以实现临时队列（队列不用了自动删除）
         * 5。Map<String,Object> arguments：设置队列的扩展参数
         */
        channel.queueDeclare(QUEUE_INFORM_SMS,true,false,false,null);

        // 声明交换机
        /** 参数
         * 1。交换机名称
         * 2。交换机类型
         * fanout：发布订阅模式
         * topic：通配符模式
         * direct：路由模式
         * headers：headers模式
         */
        channel.exchangeDeclare(EXCHANGE_FANOUT_INFORM, BuiltinExchangeType.FANOUT);

        // 将路由与交换机进行绑定
        /** 参数明细
         * 1。队列名称
         * 2。交换机名称
         * 3。路由key
         */
        channel.queueBind(QUEUE_INFORM_SMS,EXCHANGE_FANOUT_INFORM,"");
        // 创建消费者方法
        DefaultConsumer consumer = new DefaultConsumer(channel){
            /**
             * 消费者接收消息时调用此方法
             * @param consumerTag 消费者的标签，在channel.basicConsume()去指定
             * @param envelope 消息包的内容，可从中获取消息id，消息routingkey，交换机，消息和重传标志 (收到消息失败后是否需要重新发送)
             * @param properties 消息属性
             * @param body 消息内容
             * @throws IOException
             */
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                // 交换机
                String exchange = envelope.getExchange();
                // 路由key
                String routingKey = envelope.getRoutingKey();
                // 消息id
                long deliveryTag = envelope.getDeliveryTag();
                // 消息内容
                String msg = new String(body,"utf-8");
                System.out.println("receive message.." + msg);
            }
        };
        // 监听队列
        /**
         * 参数
         * 1。queue：队列名称
         * 2。autoACK：自动回复，当消费者接受到消息后要告诉
         * 3。消费消息的方法，消费者接收到消息后调用此方法
         */
        channel.basicConsume(QUEUE_INFORM_SMS,true,consumer);
    }
}
```

#### 思考

1、publish/subscribe 与 work queues 有什么区别？

**区别**： 

1）work queues不用定义交换机，而publish/subscribe需要定义交换机。 

2）publish/subscribe的生产方是面向交换机发送消息，work queues的生产方是面向队列发送消息(底层使用默认 交换机)。 

3）publish/subscribe需要设置队列和交换机的绑定，work queues不需要设置，实质上work queues会将队列绑定到默认的交换机。 

**相同点**： 

两者实现的发布/订阅的效果是一样的，多个消费端监听同一个队列不会重复消费消息，都是通过轮询的方式接收消息。

2、实质工作用什么？ publish/subscribe 还是work queues？

建议使用 publish/subscribe，发布订阅模式比工作队列模式更强大，并且发布订阅模式可以指定自己专用的交换机。

### Routing

![10](/assets/images/2020/2020-03/10.png)

路由模式： 

1、每个消费者监听自己的队列，并且设置routingkey。 

2、生产者将消息发给交换机，由交换机根据routingkey来转发消息到指定的队列。

3、routingkey是决定消息发送到哪个队列的关键。

#### 测试

继续使用上面的案例进行测试，只不过添加对应的 routingkey

##### 生产者

```java
public class Producer03 {
    private static final String QUEUE_INFORM_EMAIL = "queue_inform_email";
    private static final String QUEUE_INFORM_SMS = "queue_inform_sms";
    private static final String EXCHANGE_ROUTING_INFORM="exchange_routing_inform";
    public static final String ROUTINGKEY_EMAIL="inform_email";
    public static final String ROUTINGKEY_SMS="inform_sms";
    public static void main(String[] args) throws IOException, TimeoutException {
        // 通过连接工厂创建新的连接对象和mq建立连接
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 设置连接工厂的相关参数
        connectionFactory.setHost("192.168.116.129");// ip地址
        connectionFactory.setPort(5672);// 端口
        connectionFactory.setUsername("admin");// 用户名
        connectionFactory.setPassword("admin");// 密码
        // 设置虚拟机，一个mq的服务可以设置多个虚拟机，每个虚拟机就相当于一个独立的mq
        connectionFactory.setVirtualHost("/");

        // 建立新连接
        Connection connection = connectionFactory.newConnection();
        // 创建会话channel，生产者和mq服务所有的通信都在channel中完成
        Channel channel = connection.createChannel();

        // 声明队列，如果队列在mq中没有则创建
        channel.queueDeclare(QUEUE_INFORM_EMAIL,true,false,false,null);
        channel.queueDeclare(QUEUE_INFORM_SMS,true,false,false,null);

        // 声明交换机
        /** 参数
         * 1。交换机名称
         * 2。交换机类型
         * fanout：发布订阅模式
         * topic：通配符模式
         * direct：路由模式
         * headers：headers模式
         */
        channel.exchangeDeclare(EXCHANGE_ROUTING_INFORM, BuiltinExchangeType.DIRECT);

        // 将路由与交换机进行绑定
        /** 参数明细
         * 1。队列名称
         * 2。交换机名称
         * 3。路由key
         */
        channel.queueBind(QUEUE_INFORM_EMAIL,EXCHANGE_ROUTING_INFORM,ROUTINGKEY_EMAIL);
        channel.queueBind(QUEUE_INFORM_SMS,EXCHANGE_ROUTING_INFORM,ROUTINGKEY_SMS);

        // 开始发送消息
        String message = "send a email";
        for(int i=0;i<5;i++){
            /**
             * 参数
             * 1。exchange：交换机，如果不指定将使用mq的默认交换机（设置为""）
             * 2。routingKey：路由key，交换机根据路由key来将消息转发到指定的队列，如果使用默认交换机，routingKey设置为队列的名称
             * 3。props：消息的属性
             * 4。body：消息内容
             */
            channel.basicPublish(EXCHANGE_ROUTING_INFORM,ROUTINGKEY_EMAIL,null,message.getBytes());
            System.out.println(message);
        }
        channel.close();
        connection.close();
    }
}
```

##### 消费者

邮件消费者

```java
public class Consumer03Email {
    private static final String QUEUE_INFORM_EMAIL = "queue_inform_email";
    private static final String EXCHANGE_ROUTING_INFORM="exchange_routing_inform";
    public static final String ROUTINGKEY_EMAIL="inform_email";
    public static void main(String[] args) throws IOException, TimeoutException {
        // 通过连接工厂创建新的连接对象和mq建立连接
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 设置连接工厂的相关参数
        connectionFactory.setHost("192.168.116.129");// ip地址
        connectionFactory.setPort(5672);// 端口
        connectionFactory.setUsername("admin");// 用户名
        connectionFactory.setPassword("admin");// 密码
        // 设置虚拟机，一个mq的服务可以设置多个虚拟机，每个虚拟机就相当于一个独立的mq
        connectionFactory.setVirtualHost("/");
        // 建立连接
        Connection connection = connectionFactory.newConnection();
        // 建立channel
        Channel channel = connection.createChannel();
        // 声明队列，如果队列在mq中没有则创建
        /**
         * 参数
         * 1。queue：队列名称
         * 2。durable：是否持久化，mq重启后队列还在
         * 3。exclusive：是否独占连接，队列只允许在该连接中访问，如果连接关闭队列自动删除，如果将此参数设置为true，可用于临时队列的创建
         * 4。autoDelete：自动删除队列，队列不使用时自动删除此队列，如果将此参数和exclusive参数设置为true就可以实现临时队列（队列不用了自动删除）
         * 5。Map<String,Object> arguments：设置队列的扩展参数
         */
        channel.queueDeclare(QUEUE_INFORM_EMAIL,true,false,false,null);

        // 声明交换机
        /** 参数
         * 1。交换机名称
         * 2。交换机类型
         * fanout：发布订阅模式
         * topic：通配符模式
         * direct：路由模式
         * headers：headers模式
         */
        channel.exchangeDeclare(EXCHANGE_ROUTING_INFORM, BuiltinExchangeType.DIRECT);

        // 将路由与交换机进行绑定
        /** 参数明细
         * 1。队列名称
         * 2。交换机名称
         * 3。路由key
         */
        channel.queueBind(QUEUE_INFORM_EMAIL,EXCHANGE_ROUTING_INFORM,ROUTINGKEY_EMAIL);
        // 创建消费者方法
        DefaultConsumer consumer = new DefaultConsumer(channel){
            /**
             * 消费者接收消息时调用此方法
             * @param consumerTag 消费者的标签，在channel.basicConsume()去指定
             * @param envelope 消息包的内容，可从中获取消息id，消息routingkey，交换机，消息和重传标志 (收到消息失败后是否需要重新发送)
             * @param properties 消息属性
             * @param body 消息内容
             * @throws IOException
             */
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                // 交换机
                String exchange = envelope.getExchange();
                // 路由key
                String routingKey = envelope.getRoutingKey();
                // 消息id
                long deliveryTag = envelope.getDeliveryTag();
                // 消息内容
                String msg = new String(body,"utf-8");
                System.out.println("receive message.." + msg);
            }
        };
        // 监听队列
        /**
         * 参数
         * 1。queue：队列名称
         * 2。autoACK：自动回复，当消费者接受到消息后要告诉
         * 3。消费消息的方法，消费者接收到消息后调用此方法
         */
        channel.basicConsume(QUEUE_INFORM_EMAIL,true,consumer);
    }
}
```

短信消费者

```java
public class Consumer03Sms {
    private static final String QUEUE_INFORM_SMS = "queue_inform_sms";
    private static final String EXCHANGE_ROUTING_INFORM="exchange_routing_inform";
    public static final String ROUTINGKEY_SMS="inform_sms";
    public static void main(String[] args) throws IOException, TimeoutException {
        // 通过连接工厂创建新的连接对象和mq建立连接
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 设置连接工厂的相关参数
        connectionFactory.setHost("192.168.116.129");// ip地址
        connectionFactory.setPort(5672);// 端口
        connectionFactory.setUsername("admin");// 用户名
        connectionFactory.setPassword("admin");// 密码
        // 设置虚拟机，一个mq的服务可以设置多个虚拟机，每个虚拟机就相当于一个独立的mq
        connectionFactory.setVirtualHost("/");
        // 建立连接
        Connection connection = connectionFactory.newConnection();
        // 建立channel
        Channel channel = connection.createChannel();
        // 声明队列，如果队列在mq中没有则创建
        /**
         * 参数
         * 1。queue：队列名称
         * 2。durable：是否持久化，mq重启后队列还在
         * 3。exclusive：是否独占连接，队列只允许在该连接中访问，如果连接关闭队列自动删除，如果将此参数设置为true，可用于临时队列的创建
         * 4。autoDelete：自动删除队列，队列不使用时自动删除此队列，如果将此参数和exclusive参数设置为true就可以实现临时队列（队列不用了自动删除）
         * 5。Map<String,Object> arguments：设置队列的扩展参数
         */
        channel.queueDeclare(QUEUE_INFORM_SMS,true,false,false,null);

        // 声明交换机
        /** 参数
         * 1。交换机名称
         * 2。交换机类型
         * fanout：发布订阅模式
         * topic：通配符模式
         * direct：路由模式
         * headers：headers模式
         */
        channel.exchangeDeclare(EXCHANGE_ROUTING_INFORM, BuiltinExchangeType.DIRECT);

        // 将路由与交换机进行绑定
        /** 参数明细
         * 1。队列名称
         * 2。交换机名称
         * 3。路由key
         */
        channel.queueBind(QUEUE_INFORM_SMS,EXCHANGE_ROUTING_INFORM,ROUTINGKEY_SMS);
        // 创建消费者方法
        DefaultConsumer consumer = new DefaultConsumer(channel){
            /**
             * 消费者接收消息时调用此方法
             * @param consumerTag 消费者的标签，在channel.basicConsume()去指定
             * @param envelope 消息包的内容，可从中获取消息id，消息routingkey，交换机，消息和重传标志 (收到消息失败后是否需要重新发送)
             * @param properties 消息属性
             * @param body 消息内容
             * @throws IOException
             */
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                // 交换机
                String exchange = envelope.getExchange();
                // 路由key
                String routingKey = envelope.getRoutingKey();
                // 消息id
                long deliveryTag = envelope.getDeliveryTag();
                // 消息内容
                String msg = new String(body,"utf-8");
                System.out.println("receive message.." + msg);
            }
        };
        // 监听队列
        /**
         * 参数
         * 1。queue：队列名称
         * 2。autoACK：自动回复，当消费者接受到消息后要告诉
         * 3。消费消息的方法，消费者接收到消息后调用此方法
         */
        channel.basicConsume(QUEUE_INFORM_SMS,true,consumer);
    }
}
```

#### 思考

1、Routing 模式和 Publish/subscibe 有啥区别？

Routing 模式要求队列在绑定交换机时要指定routingkey，消息会转发到符合 routingkey 的队列。

### Topics

路由模式： 

1、每个消费者监听自己的队列，并且设置带**通配符**的routingkey。 

2、生产者将消息发给broker，由交换机根据routingkey来转发消息到指定的队列。

其中，通配符的格式为：

- 符号“#”可以匹配多个词语。
- 符号“*”可以匹配一个词语。

#### 测试

使用路由模式来实现前面的案例，并实现根据用户的通知设置去通知用户，设置接收 Email 的用户只接收 Email，设置接收 sms 的用户只接收 sms，设置两种通知类型都接收的则两种通知都有效。

##### 生产者

```java
public class Producer04 {
    private static final String QUEUE_INFORM_EMAIL = "queue_inform_email";
    private static final String QUEUE_INFORM_SMS = "queue_inform_sms";
    private static final String EXCHANGE_TOPICS_INFORM="exchange_topics_inform";
    public static final String ROUTINGKEY_EMAIL="inform.#.email.#";
    public static final String ROUTINGKEY_SMS="inform.#.sms.#";
    public static void main(String[] args) throws IOException, TimeoutException {
        // 通过连接工厂创建新的连接对象和mq建立连接
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 设置连接工厂的相关参数
        connectionFactory.setHost("192.168.116.129");// ip地址
        connectionFactory.setPort(5672);// 端口
        connectionFactory.setUsername("admin");// 用户名
        connectionFactory.setPassword("admin");// 密码
        // 设置虚拟机，一个mq的服务可以设置多个虚拟机，每个虚拟机就相当于一个独立的mq
        connectionFactory.setVirtualHost("/");

        // 建立新连接
        Connection connection = connectionFactory.newConnection();
        // 创建会话channel，生产者和mq服务所有的通信都在channel中完成
        Channel channel = connection.createChannel();

        // 声明队列，如果队列在mq中没有则创建
        channel.queueDeclare(QUEUE_INFORM_EMAIL,true,false,false,null);
        channel.queueDeclare(QUEUE_INFORM_SMS,true,false,false,null);

        // 声明交换机
        /** 参数
         * 1。交换机名称
         * 2。交换机类型
         * fanout：发布订阅模式
         * topic：通配符模式
         * direct：路由模式
         * headers：headers模式
         */
        channel.exchangeDeclare(EXCHANGE_TOPICS_INFORM, BuiltinExchangeType.TOPIC);

        // 将路由与交换机进行绑定
        /** 参数明细
         * 1。队列名称
         * 2。交换机名称
         * 3。路由key
         */
        channel.queueBind(QUEUE_INFORM_EMAIL,EXCHANGE_TOPICS_INFORM,ROUTINGKEY_EMAIL);
        channel.queueBind(QUEUE_INFORM_SMS,EXCHANGE_TOPICS_INFORM,ROUTINGKEY_SMS);

        // 开始发送消息
        String message = "send a email to user";
        for(int i=0;i<5;i++){
            /**
             * 参数
             * 1。exchange：交换机，如果不指定将使用mq的默认交换机（设置为""）
             * 2。routingKey：路由key，交换机根据路由key来将消息转发到指定的队列，如果使用默认交换机，routingKey设置为队列的名称
             * 3。props：消息的属性
             * 4。body：消息内容
             */
            channel.basicPublish(EXCHANGE_TOPICS_INFORM,"inform.email",null,message.getBytes());
            System.out.println(message);
        }
        String message1 = "send a sms to user";
        for(int i=0;i<5;i++){
            /**
             * 参数
             * 1。exchange：交换机，如果不指定将使用mq的默认交换机（设置为""）
             * 2。routingKey：路由key，交换机根据路由key来将消息转发到指定的队列，如果使用默认交换机，routingKey设置为队列的名称
             * 3。props：消息的属性
             * 4。body：消息内容
             */
            channel.basicPublish(EXCHANGE_TOPICS_INFORM,"inform.sms",null,message1.getBytes());
            System.out.println(message1);
        }
        String message2 = "send a email and sms to user";
        for(int i=0;i<5;i++){
            /**
             * 参数
             * 1。exchange：交换机，如果不指定将使用mq的默认交换机（设置为""）
             * 2。routingKey：路由key，交换机根据路由key来将消息转发到指定的队列，如果使用默认交换机，routingKey设置为队列的名称
             * 3。props：消息的属性
             * 4。body：消息内容
             */
            channel.basicPublish(EXCHANGE_TOPICS_INFORM,"inform.email.sms",null,message2.getBytes());
            System.out.println(message2);
        }
        channel.close();
        connection.close();
    }
}
```

##### 消费者

邮件消费者

```java
public class Consumer04Email {
    private static final String QUEUE_INFORM_EMAIL = "queue_inform_email";
    private static final String EXCHANGE_TOPICS_INFORM="exchange_topics_inform";
    public static final String ROUTINGKEY_EMAIL="inform.#.email.#";
    public static void main(String[] args) throws IOException, TimeoutException {
        // 通过连接工厂创建新的连接对象和mq建立连接
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 设置连接工厂的相关参数
        connectionFactory.setHost("192.168.116.129");// ip地址
        connectionFactory.setPort(5672);// 端口
        connectionFactory.setUsername("admin");// 用户名
        connectionFactory.setPassword("admin");// 密码
        // 设置虚拟机，一个mq的服务可以设置多个虚拟机，每个虚拟机就相当于一个独立的mq
        connectionFactory.setVirtualHost("/");
        // 建立连接
        Connection connection = connectionFactory.newConnection();
        // 建立channel
        Channel channel = connection.createChannel();
        // 声明队列，如果队列在mq中没有则创建
        /**
         * 参数
         * 1。queue：队列名称
         * 2。durable：是否持久化，mq重启后队列还在
         * 3。exclusive：是否独占连接，队列只允许在该连接中访问，如果连接关闭队列自动删除，如果将此参数设置为true，可用于临时队列的创建
         * 4。autoDelete：自动删除队列，队列不使用时自动删除此队列，如果将此参数和exclusive参数设置为true就可以实现临时队列（队列不用了自动删除）
         * 5。Map<String,Object> arguments：设置队列的扩展参数
         */
        channel.queueDeclare(QUEUE_INFORM_EMAIL,true,false,false,null);

        // 声明交换机
        /** 参数
         * 1。交换机名称
         * 2。交换机类型
         * fanout：发布订阅模式
         * topic：通配符模式
         * direct：路由模式
         * headers：headers模式
         */
        channel.exchangeDeclare(EXCHANGE_TOPICS_INFORM, BuiltinExchangeType.TOPIC);

        // 将路由与交换机进行绑定
        /** 参数明细
         * 1。队列名称
         * 2。交换机名称
         * 3。路由key
         */
        channel.queueBind(QUEUE_INFORM_EMAIL,EXCHANGE_TOPICS_INFORM,ROUTINGKEY_EMAIL);
        // 创建消费者方法
        DefaultConsumer consumer = new DefaultConsumer(channel){
            /**
             * 消费者接收消息时调用此方法
             * @param consumerTag 消费者的标签，在channel.basicConsume()去指定
             * @param envelope 消息包的内容，可从中获取消息id，消息routingkey，交换机，消息和重传标志 (收到消息失败后是否需要重新发送)
             * @param properties 消息属性
             * @param body 消息内容
             * @throws IOException
             */
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                // 交换机
                String exchange = envelope.getExchange();
                // 路由key
                String routingKey = envelope.getRoutingKey();
                // 消息id
                long deliveryTag = envelope.getDeliveryTag();
                // 消息内容
                String msg = new String(body,"utf-8");
                System.out.println("receive message.." + msg);
            }
        };
        // 监听队列
        /**
         * 参数
         * 1。queue：队列名称
         * 2。autoACK：自动回复，当消费者接受到消息后要告诉
         * 3。消费消息的方法，消费者接收到消息后调用此方法
         */
        channel.basicConsume(QUEUE_INFORM_EMAIL,true,consumer);
    }
}
```

短信消费者

```java
public class Consumer04Sms {
    private static final String QUEUE_INFORM_SMS = "queue_inform_sms";
    private static final String EXCHANGE_TOPICS_INFORM="exchange_topics_inform";
    public static final String ROUTINGKEY_SMS="inform.#.sms.#";
    public static void main(String[] args) throws IOException, TimeoutException {
        // 通过连接工厂创建新的连接对象和mq建立连接
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 设置连接工厂的相关参数
        connectionFactory.setHost("192.168.116.129");// ip地址
        connectionFactory.setPort(5672);// 端口
        connectionFactory.setUsername("admin");// 用户名
        connectionFactory.setPassword("admin");// 密码
        // 设置虚拟机，一个mq的服务可以设置多个虚拟机，每个虚拟机就相当于一个独立的mq
        connectionFactory.setVirtualHost("/");
        // 建立连接
        Connection connection = connectionFactory.newConnection();
        // 建立channel
        Channel channel = connection.createChannel();
        // 声明队列，如果队列在mq中没有则创建
        /**
         * 参数
         * 1。queue：队列名称
         * 2。durable：是否持久化，mq重启后队列还在
         * 3。exclusive：是否独占连接，队列只允许在该连接中访问，如果连接关闭队列自动删除，如果将此参数设置为true，可用于临时队列的创建
         * 4。autoDelete：自动删除队列，队列不使用时自动删除此队列，如果将此参数和exclusive参数设置为true就可以实现临时队列（队列不用了自动删除）
         * 5。Map<String,Object> arguments：设置队列的扩展参数
         */
        channel.queueDeclare(QUEUE_INFORM_SMS,true,false,false,null);

        // 声明交换机
        /** 参数
         * 1。交换机名称
         * 2。交换机类型
         * fanout：发布订阅模式
         * topic：通配符模式
         * direct：路由模式
         * headers：headers模式
         */
        channel.exchangeDeclare(EXCHANGE_TOPICS_INFORM, BuiltinExchangeType.TOPIC);

        // 将路由与交换机进行绑定
        /** 参数明细
         * 1。队列名称
         * 2。交换机名称
         * 3。路由key
         */
        channel.queueBind(QUEUE_INFORM_SMS,EXCHANGE_TOPICS_INFORM,ROUTINGKEY_SMS);
        // 创建消费者方法
        DefaultConsumer consumer = new DefaultConsumer(channel){
            /**
             * 消费者接收消息时调用此方法
             * @param consumerTag 消费者的标签，在channel.basicConsume()去指定
             * @param envelope 消息包的内容，可从中获取消息id，消息routingkey，交换机，消息和重传标志 (收到消息失败后是否需要重新发送)
             * @param properties 消息属性
             * @param body 消息内容
             * @throws IOException
             */
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                // 交换机
                String exchange = envelope.getExchange();
                // 路由key
                String routingKey = envelope.getRoutingKey();
                // 消息id
                long deliveryTag = envelope.getDeliveryTag();
                // 消息内容
                String msg = new String(body,"utf-8");
                System.out.println("receive message.." + msg);
            }
        };
        // 监听队列
        /**
         * 参数
         * 1。queue：队列名称
         * 2。autoACK：自动回复，当消费者接受到消息后要告诉
         * 3。消费消息的方法，消费者接收到消息后调用此方法
         */
        channel.basicConsume(QUEUE_INFORM_SMS,true,consumer);
    }
}
```

#### 思考

1、本案例的需求使用 Routing 工作模式能否实现？

使用 Routing 模式也可以实现本案例，共设置三个 routingkey，分别是 email、sms、all，email队列绑定 email和 all，sms 队列绑定 sms和all，这样就可以实现上边案例的功能，实现过程比topics 复杂。 

Topic模式更多加强大，它可以实现 Routing、publish/subscirbe 模式的功能。

### Header

header 模式与 routing 不同的地方在于，header 模式取消 routingkey，使用 header 中的 key/value（键值对）匹配队列。 

### RPC

![12](/assets/images/2020/2020-03/12.png)

RPC 即客户端远程调用服务端的方法 ，使用 MQ 可以实现 RPC 的异步调用，基于Direct交换机实现，流程如下： 

1、客户端即是生产者就是消费者，向 RPC 请求队列发送 RPC 调用消息，同时监听 RPC 响应队列。 

2、服务端监听 RPC 请求队列的消息，收到消息后执行服务端的方法，得到方法返回的结果。

3、服务端将 RPC 方法的结果发送到 RPC 响应队列。

4、客户端（RPC调用方）监听 RPC 响应队列，接收到RPC调用结果。
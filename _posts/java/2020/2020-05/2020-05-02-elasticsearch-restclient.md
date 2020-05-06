---
layout: post
title:  "Elasticsearch(二) RestClient"
date:  2020-05-02
desc: "Elasticsearch 中提供了对索引进行管理的 CLient，本文重点介绍 RestClient，这也是目前 Elasticsearch 官方所推荐的客户端。"
keywords: "Java,RestClient,Elasticsearch"
categories: [Java]
tags: [Java,Elasticsearch]
---
# Elasticsearch 客户端

Elasticsearch 提供多种不同的客户端：

1、TransportClient

这是 Elasticsearch 提供的传统客户端，官方计划 8.0 版本删除此客户端。 

2、RestClient 

RestClient是官方推荐使用的，它包括两种：Java Low Level REST Client 和 Java High Level REST Client。

Elasticsearch 在6.0之后提供 Java High Level REST Client， 两种客户端官方更推荐使用 Java High Level REST Client，不过当前它还处于完善中，有些功能还没有。

本教程将使用 Java High Level REST Client 来执行 Elasticsearch 的相关操作。

## 项目准备

为了更好的进行演示 REST Client 的相关操作，创建一个 SpringBoot 项目来进行相关代码的编写。

创建好项目之后在项目中添加 Elasticsearch 的对应依赖（注意要和自己所安装的 Elasticsearch 版本相同）

```xml
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-high-level-client</artifactId>
    <version>7.6.2</version>
</dependency>
<dependency>
    <groupId>org.elasticsearch</groupId>
    <artifactId>elasticsearch</artifactId>
    <version>7.6.2</version>
</dependency>
```

接下来在项目的 application.yml 中配置 Elasticsearch 的相关信息：

```xml
xedu:
  elasticsearch:
    hostlist: ${eshostlist:192.168.116.129:9200} #节点ip 多个结点中间用逗号分隔
    course:
      index: xedu_course
      source_field: id,name,grade,mt,st,charge,valid,pic,qq,price,price_old,status,studymodel,teachmode,expires,pub_ time,start_time,end_time
```

之后专门创建一个配置类用来创建对应的 RestClient 对象

```java
@Configuration
public class ElasticsearchConfig {

    @Value("${xedu.elasticsearch.hostlist}")
    private String hostlist;

    // RestHighLevelClient
    @Bean
    public RestHighLevelClient restHighLevelClient(){
        //解析hostlist配置信息
        String[] split = hostlist.split(",");
        //创建HttpHost数组，其中存放es主机和端口的配置信息
        HttpHost[] httpHostArray = new HttpHost[split.length];
        for(int i=0;i<split.length;i++){
            String item = split[i];
            httpHostArray[i] = new HttpHost(item.split(":")[0], Integer.parseInt(item.split(":")[1]), "http");
        }
        //创建RestHighLevelClient客户端
        return new RestHighLevelClient(RestClient.builder(httpHostArray));
    }

    //项目主要使用RestHighLevelClient，对于低级的客户端暂时不用
    @Bean
    public RestClient restClient(){
        //解析hostlist配置信息
        String[] split = hostlist.split(",");
        //创建HttpHost数组，其中存放es主机和端口的配置信息
        HttpHost[] httpHostArray = new HttpHost[split.length];
        for(int i=0;i<split.length;i++){
            String item = split[i];
            httpHostArray[i] = new HttpHost(item.split(":")[0], Integer.parseInt(item.split(":")[1]), "http");
        }
        return RestClient.builder(httpHostArray).build();
    }

}
```

## Elasticsearch 数据管理

创建一个单元测试类来测试如下的一些功能，在单元测试类中注入对应的 RestHighLevelClient

```java
@SpringBootTest
@RunWith(SpringRunner.class)
public class TestElasticS {
    // 注入对应的es客户端，优先使用高等级客户端
    @Autowired
    RestHighLevelClient restHighLevelClient;
    @Autowired
    RestClient restClient;
}
```

### 创建索引库

```java
    @Test
    public void testCreateIndex() throws IOException {
        // 创建索引请求对象
        CreateIndexRequest createIndexRequest = new CreateIndexRequest("xedu_course");
        // 设置索引参数
        createIndexRequest.settings(Settings.builder().put("number_of_shards",1).put("number_of_replicas",0));
        // 设置映射
        createIndexRequest.mapping("{\n" +
                "\t\"properties\": {\n" +
                "\t\t\"name\": { \n" +
                "\t\t\t\"type\": \"text\", \n" +
                "\t\t\t\"analyzer\":\"ik_max_word\", \n" +
                "\t\t\t\"search_analyzer\":\"ik_smart\" \n" +
                "\t\t\t\n" +
                "\t\t}, \n" +
                "\t\t\"description\": {\n" +
                "\t\t\t\"type\": \"text\",\n" +
                "\t\t\t\"analyzer\":\"ik_max_word\",\n" +
                "\t\t\t\"search_analyzer\":\"ik_smart\" \n" +
                "\t\t\t\n" +
                "\t\t}, \n" +
                "\t\t\"studymodel\": {\n" +
                "\t\t\t\"type\": \"keyword\" \n" +
                "\t\t\t\n" +
                "\t\t}, \n" +
                "\t\t\"price\": {\n" +
                "\t\t\t\"type\": \"float\" \n" +
                "\t\t\t\n" +
                "\t\t}, \n" +
                "\t\t\"timestamp\": {\n" +
                "\t\t\t\"type\": \"date\",\n" +
                "\t\t\t\"format\": \"yyyy‐MM‐dd HH:mm:ss||yyyy‐MM‐dd||epoch_millis\" \n" +
                "\t\t\t\n" +
                "\t\t}\n" +
                "\t}\n" +
                "}", XContentType.JSON);
        // 创建索引
        AcknowledgedResponse response = restHighLevelClient.indices().create(createIndexRequest,RequestOptions.DEFAULT);
        System.out.println(response.isAcknowledged());
    }
```

### 删除索引库

```java
    @Test
    public void testDeleteIndex() throws IOException {
        // 删除索引请求对象
        DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest("xedu_course");
        // 删除索引
        AcknowledgedResponse response = restHighLevelClient.indices().delete(deleteIndexRequest,RequestOptions.DEFAULT);
        // 输出删除结果
        System.out.println(response.isAcknowledged());
    }
```

### 添加文档

```java
    @Test
    public void testAddDoc() throws IOException {
        // 准备json数据
        Map<String, Object> jsonMap = new HashMap<>();
        jsonMap.put("name", "spring cloud实战");
        jsonMap.put("description", "本课程主要从四个章节进行讲解： 1.微服务架构入门 2.spring cloud 基础入门 3.实战Spring Boot 4.注册中心eureka。");
        jsonMap.put("studymodel", "201001");
        SimpleDateFormat dateFormat =new SimpleDateFormat("yyyy‐MM‐dd HH:mm:ss");
        jsonMap.put("timestamp", dateFormat.format(new Date()));
        jsonMap.put("price", 5.6f);
        // 索引请求对象
        IndexRequest request = new IndexRequest("xedu_course");
        // 指定索引文档内容
        request.source(jsonMap);
        // 索引响应对象
        IndexResponse response = restHighLevelClient.index(request,RequestOptions.DEFAULT);
        // 获取返回结果
        System.out.println(response.getResult());
    }
```

### 更新文档

```java
    @Test
    public void updateDoc() throws IOException {
        // 更新请求对象
        UpdateRequest updateRequest = new UpdateRequest();
        updateRequest.index("xedu_course");
        updateRequest.type("_doc");
        updateRequest.id("3VEBbnEBoy54DVadJWzY");
        // 更新的数据文档
        updateRequest.doc(jsonBuilder()
                .startObject()
                .field("name", "spring cloud实战")
                .endObject());
        // 执行更新操作
        UpdateResponse update = restHighLevelClient.update(updateRequest,RequestOptions.DEFAULT);
        // 获取更新结果
        RestStatus status = update.status();
        System.out.println(status);

    }
```

### 删除文档

```java
    @Test
    public void testDelDoc() throws IOException {
        //删除文档id
        String id = "3VEBbnEBoy54DVadJWzY";
        //删除索引请求对象
        DeleteRequest deleteRequest = new DeleteRequest();
        deleteRequest.index("xedu_course");
        deleteRequest.type("_doc");
        deleteRequest.id(id);
        //响应对象
        DeleteResponse deleteResponse = restHighLevelClient.delete(deleteRequest,RequestOptions.DEFAULT);
        //获取响应结果
        DocWriteResponse.Result result = deleteResponse.getResult();
        System.out.println(result);
    }
```
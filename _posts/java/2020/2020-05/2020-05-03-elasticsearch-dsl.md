---
layout: post
title:  "Elasticsearch(三) DSL 搜索"
date:  2020-05-03
desc: "DSL(Domain Speciﬁc Language)是ES提出的基于json的搜索方式，在搜索时传入特定的json格式的数据来完成不同的搜索需求。"
keywords: "Java,DSL,Elasticsearch,搜索"
categories: [Java]
tags: [Java,Elasticsearch]
---
# Domain Speciﬁc Language

DSL(Domain Speciﬁc Language)是 Elasticsearch 提出的基于 json 的搜索方式，在搜索时传入特定的 json 格式的数据来完成不同的搜索需求。

DSL 比 URI 搜索方式功能强大，在项目中建议使用 DSL 方式来完成搜索。

## 数据准备

为了方便执行搜索，我们创建一些用于搜索的测试数据。使用 postman 来创建

首先创建 xedu_course 索引库。并创建如下映射：

```java
post   http://192.168.116.129:9200/xedu_course/_mapping
```

映射内容如下：

```json
{
    "properties": {
        "description": {
            "type": "text",
            "analyzer": "ik_max_word",
            "search_analyzer": "ik_smart"
        },
        "name": {
            "type": "text",
            "analyzer": "ik_max_word",
            "search_analyzer": "ik_smart"
        },
		"pic":{
			"type":"text",
			"index":false
		},
        "price": {
            "type": "float"
        },
        "studymodel": {
            "type": "keyword"
        },
        "timestamp": {
            "type": "date",
            "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
        }
    }
}
```

在索引中添加如下的测试数据：

```json
http://192.168.116.129:9200/xedu_course/_doc/1
{
"name": "Bootstrap开发",
"description": "Bootstrap是由Twitter推出的一个前台页面开发框架，是一个非常流行的开发框架，此框架集成了多种页面效果。此开发框架包含了大量的CSS、JS程序代码，可以帮助开发者（尤其是不擅长页面开发的程序人员）轻松的实现一个不受浏览器限制的精美界面效果。",
"studymodel": "201002",
"price":38.6,
"timestamp":"2018-04-25 19:11:35",
"pic":"group1/M00/00/00/wKhlQFs6RCeAY0pHAAJx5ZjNDEM428.jpg"
}
http://192.168.116.129:9200/xedu_course/_doc/2
{
"name": "java编程基础",
"description": "java语言是世界第一编程语言，在软件开发领域使用人数最多。",
"studymodel": "201001",
"price":68.6,
"timestamp":"2018-03-25 19:11:35",
"pic":"group1/M00/00/00/wKhlQFs6RCeAY0pHAAJx5ZjNDEM428.jpg"
}
http://192.168.116.129:9200/xedu_course/_doc/3
{
"name": "spring开发基础",
"description": "spring 在java领域非常流行，java程序员都在用。",
"studymodel": "201001",
"price":88.6,
"timestamp":"2018-02-24 19:11:35",
"pic":"group1/M00/00/00/wKhlQFs6RCeAY0pHAAJx5ZjNDEM428.jpg"
}
```

## 项目准备

我们使用 [Elasticsearch(二) RestClient](https://wangxin1248.github.io/java/2020/05/elasticsearch-restclient.html) 中创建的项目来进行我们的搜索测试。

重新创建一个新的单元测试类：

```java
@SpringBootTest
@RunWith(SpringRunner.class)
public class TestSearch {
    // 注入对应的es客户端，优先使用高等级客户端
    @Autowired
    RestHighLevelClient restHighLevelClient;
    @Autowired
    RestClient restClient;
}
```

## DSL 搜索

### 搜索全部记录

首先可以将索引库中所有的文件都查询出来，查询返回的结果说明： 

- took：本次操作花费的时间，单位为毫秒。 
- timed_out：请求是否超时 
- _shards：说明本次操作共搜索了哪些分片 
- hits：搜索命中的记录 
- hits.total ： 符合条件的文档总数 
- hits.hits ：匹配度较高的前N个文档 
- hits.max_score：文档匹配得分，这里为最高分 
- _score：每个文档都有一个匹配度得分，按照降序排列。 
- _source：显示了文档的原始内容。

```java
    @Test
    public void testSearchAll() throws IOException, ParseException {
        // 搜索请求对象
        SearchRequest searchRequest = new SearchRequest("xedu_course");
        // 搜索源构建对象
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        // 搜索方式
        // matchAllQuery搜索全部
        searchSourceBuilder.query(QueryBuilders.matchAllQuery());
        // 设置源字段过滤，第一个参数表示结果集包括哪些字段，第二个参数表示结果集不包括哪些字段
        searchSourceBuilder.fetchSource(new String[]{"name","studymodel","price","timestamp"},new String[]{});
        // 向搜索请求对象设置搜索源
        searchRequest.source(searchSourceBuilder);
        // 执行搜索
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        // 搜索结果
        SearchHits hits = searchResponse.getHits();
        // 匹配到的总记录数
        TotalHits totalHits = hits.getTotalHits();
        // 得到匹配高的文档
        SearchHit[] searchHits = hits.getHits();
        // 日期格式化对象
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for(SearchHit i : searchHits){
            // 文档的主键
            String id = i.getId();
            // 源文档内容
            Map<String,Object> map = i.getSourceAsMap();
            String name = (String) map.get("name");
            String studymodel = (String) map.get("studymodel");
            Double price = (Double) map.get("price");
            Date timestamp = dateFormat.parse((String) map.get("timestamp"));
            System.out.println(name);
            System.out.println(studymodel);
            System.out.println(price);
            System.out.println(timestamp);
        }
    }
```

### 分页搜索全部记录

Elasticsearch 支持分页查询，传入两个参数：from和size。 

- form：表示起始文档的下标，从0开始。 
- size：查询的文档数量。

```java
    @Test
    public void testSearchPage() throws IOException, ParseException {
        // 搜索请求对象
        SearchRequest searchRequest = new SearchRequest("xedu_course");
        // 搜索源构建对象
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        // 当前页码
        int page = 1;
        // 每页显示记录数
        int size = 1;
        // 当前页码数据起始角标
        int from = (page-1)*size;
        // 设置分页起始角标
        searchSourceBuilder.from(from);
        // 设置当前也的显示数据量
        searchSourceBuilder.size(size);
        // 搜索方式
        // matchAllQuery搜索全部
        searchSourceBuilder.query(QueryBuilders.matchAllQuery());
        // 设置源字段过滤，第一个参数表示结果集包括哪些字段，第二个参数表示结果集不包括哪些字段
        searchSourceBuilder.fetchSource(new String[]{"name","studymodel","price","timestamp"},new String[]{});
        // 向搜索请求对象设置搜索源
        searchRequest.source(searchSourceBuilder);
        // 执行搜索
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        // 搜索结果
        SearchHits hits = searchResponse.getHits();
        // 匹配到的总记录数
        TotalHits totalHits = hits.getTotalHits();
        // 得到匹配高的文档
        SearchHit[] searchHits = hits.getHits();
        // 日期格式化对象
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for(SearchHit i : searchHits){
            // 文档的主键
            String id = i.getId();
            // 源文档内容
            Map<String,Object> map = i.getSourceAsMap();
            String name = (String) map.get("name");
            String studymodel = (String) map.get("studymodel");
            Double price = (Double) map.get("price");
            Date timestamp = dateFormat.parse((String) map.get("timestamp"));
            System.out.println(name);
            System.out.println(studymodel);
            System.out.println(price);
            System.out.println(timestamp);
        }
    }
```

### Term Query

Term Query 为精确查询，在搜索时会整体匹配关键字，不再将关键字分词。

```java
    @Test
    public void testTermSearch() throws IOException, ParseException {
        // 搜索请求对象
        SearchRequest searchRequest = new SearchRequest("xedu_course");
        // 搜索源构建对象
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        // 当前页码
        int page = 1;
        // 每页显示记录数
        int size = 1;
        // 当前页码数据起始角标
        int from = (page-1)*size;
        // 设置分页起始角标
        searchSourceBuilder.from(from);
        // 设置当前也的显示数据量
        searchSourceBuilder.size(size);
        // 搜索方式
        // termQuery按照关键字来查询
        searchSourceBuilder.query(QueryBuilders.termQuery("name","spring"));
        // 设置源字段过滤，第一个参数表示结果集包括哪些字段，第二个参数表示结果集不包括哪些字段
        searchSourceBuilder.fetchSource(new String[]{"name","studymodel","price","timestamp"},new String[]{});
        // 向搜索请求对象设置搜索源
        searchRequest.source(searchSourceBuilder);
        // 执行搜索
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        // 搜索结果
        SearchHits hits = searchResponse.getHits();
        // 匹配到的总记录数
        TotalHits totalHits = hits.getTotalHits();
        // 得到匹配高的文档
        SearchHit[] searchHits = hits.getHits();
        // 日期格式化对象
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for(SearchHit i : searchHits){
            // 文档的主键
            String id = i.getId();
            // 源文档内容
            Map<String,Object> map = i.getSourceAsMap();
            String name = (String) map.get("name");
            String studymodel = (String) map.get("studymodel");
            Double price = (Double) map.get("price");
            Date timestamp = dateFormat.parse((String) map.get("timestamp"));
            System.out.println(name);
            System.out.println(studymodel);
            System.out.println(price);
            System.out.println(timestamp);
        }
    }
```

### 根据id搜索

Elasticsearch 提供根据多个id值匹配的方法

```java
    @Test
    public void testTermSearchById() throws IOException, ParseException {
        // 搜索请求对象
        SearchRequest searchRequest = new SearchRequest("xedu_course");
        // 搜索源构建对象
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        String[] ids = new String[]{"1","2"};
        // 搜索方式
        // termsQuery按照id查询，注意是termsQuery，中间有个s
        searchSourceBuilder.query(QueryBuilders.termsQuery("_id",ids));
        // 设置源字段过滤，第一个参数表示结果集包括哪些字段，第二个参数表示结果集不包括哪些字段
        searchSourceBuilder.fetchSource(new String[]{"name","studymodel","price","timestamp"},new String[]{});
        // 向搜索请求对象设置搜索源
        searchRequest.source(searchSourceBuilder);
        // 执行搜索
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        // 搜索结果
        SearchHits hits = searchResponse.getHits();
        // 匹配到的总记录数
        TotalHits totalHits = hits.getTotalHits();
        // 得到匹配高的文档
        SearchHit[] searchHits = hits.getHits();
        // 日期格式化对象
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for(SearchHit i : searchHits){
            // 文档的主键
            String id = i.getId();
            // 源文档内容
            Map<String,Object> map = i.getSourceAsMap();
            String name = (String) map.get("name");
            String studymodel = (String) map.get("studymodel");
            Double price = (Double) map.get("price");
            Date timestamp = dateFormat.parse((String) map.get("timestamp"));
            System.out.println(name);
            System.out.println(studymodel);
            System.out.println(price);
            System.out.println(timestamp);
        }
    }
```

### Match Query

Match Query 即全文检索，它的搜索方式是先将搜索字符串分词，再使用各各词条从索引中搜索。 

Match Query 与 Term Query 区别是 Match Query 在搜索前先将搜索关键字分词，再拿各各词语去索引中搜索。

```java
    @Test
    public void testmatchQuery() throws IOException, ParseException {
        // 搜索请求对象
        SearchRequest searchRequest = new SearchRequest("xedu_course");
        // 搜索源构建对象
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        String[] ids = new String[]{"1","2"};
        // 搜索方式
        // matchQuery，对文本进行分词搜索
        searchSourceBuilder.query(QueryBuilders.matchQuery("description","Spring开发").minimumShouldMatch("80%"));
        // 设置源字段过滤，第一个参数表示结果集包括哪些字段，第二个参数表示结果集不包括哪些字段
        searchSourceBuilder.fetchSource(new String[]{"name","studymodel","price","timestamp"},new String[]{});
        // 向搜索请求对象设置搜索源
        searchRequest.source(searchSourceBuilder);
        // 执行搜索
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        // 搜索结果
        SearchHits hits = searchResponse.getHits();
        // 匹配到的总记录数
        TotalHits totalHits = hits.getTotalHits();
        // 得到匹配高的文档
        SearchHit[] searchHits = hits.getHits();
        // 日期格式化对象
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for(SearchHit i : searchHits){
            // 文档的主键
            String id = i.getId();
            // 源文档内容
            Map<String,Object> map = i.getSourceAsMap();
            String name = (String) map.get("name");
            String studymodel = (String) map.get("studymodel");
            Double price = (Double) map.get("price");
            Date timestamp = dateFormat.parse((String) map.get("timestamp"));
            System.out.println(name);
            System.out.println(studymodel);
            System.out.println(price);
            System.out.println(timestamp);
        }
    }
```

### Multi Query

MultiMatchQuery 可以结合多种查询搜索条件：

```java
    @Test
    public void testMultiMatchQuery() throws IOException, ParseException {
        // 搜索请求对象
        SearchRequest searchRequest = new SearchRequest("xedu_course");
        // 搜索源构建对象
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        String[] ids = new String[]{"1","2"};
        // 搜索方式
        // MultiMatchQuery，多个条件匹配
        searchSourceBuilder.query(QueryBuilders.multiMatchQuery("spring框架","name","description").
                field("name",10).
                minimumShouldMatch("50%"));
        // 设置源字段过滤，第一个参数表示结果集包括哪些字段，第二个参数表示结果集不包括哪些字段
        searchSourceBuilder.fetchSource(new String[]{"name","studymodel","price","timestamp"},new String[]{});
        // 向搜索请求对象设置搜索源
        searchRequest.source(searchSourceBuilder);
        // 执行搜索
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        // 搜索结果
        SearchHits hits = searchResponse.getHits();
        // 匹配到的总记录数
        TotalHits totalHits = hits.getTotalHits();
        // 得到匹配高的文档
        SearchHit[] searchHits = hits.getHits();
        // 日期格式化对象
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for(SearchHit i : searchHits){
            // 文档的主键
            String id = i.getId();
            // 源文档内容
            Map<String,Object> map = i.getSourceAsMap();
            String name = (String) map.get("name");
            String studymodel = (String) map.get("studymodel");
            Double price = (Double) map.get("price");
            Date timestamp = dateFormat.parse((String) map.get("timestamp"));
            System.out.println(name);
            System.out.println(studymodel);
            System.out.println(price);
            System.out.println(timestamp);
        }
    }
```

### 布尔查询

布尔查询对应于 Lucene 的 BooleanQuery查询，实现将多个查询组合起来。 

三个参数： 

- must：文档必须匹配must所包括的查询条件，相当于 “AND” 
- should：文档应该匹配should所包括的查询条件其中的一个或多个，相当于 "OR" 
- must_not：文档不能匹配must_not所包括的该查询条件，相当于“NOT”

```java
    @Test
    public void testBooleanQuery() throws IOException, ParseException {
        // 搜索请求对象
        SearchRequest searchRequest = new SearchRequest("xedu_course");
        // 搜索源构建对象
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        String[] ids = new String[]{"1","2"};
        // multiBuilder查询条件
        MultiMatchQueryBuilder multiBuilder = QueryBuilders.multiMatchQuery("spring框架", "name", "description").
                field("name", 10).
                minimumShouldMatch("50%");
        // term查询条件
        TermQueryBuilder termBuilder = QueryBuilders.termQuery("studymodel", "201001");
        // 布尔查询条件
        BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
        boolQueryBuilder.must(multiBuilder);
        boolQueryBuilder.must(termBuilder);
        // 搜索方式
        // boolQuery，and 查询
        searchSourceBuilder.query(boolQueryBuilder);
        // 设置源字段过滤，第一个参数表示结果集包括哪些字段，第二个参数表示结果集不包括哪些字段
        searchSourceBuilder.fetchSource(new String[]{"name","studymodel","price","timestamp"},new String[]{});
        // 向搜索请求对象设置搜索源
        searchRequest.source(searchSourceBuilder);
        // 执行搜索
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        // 搜索结果
        SearchHits hits = searchResponse.getHits();
        // 匹配到的总记录数
        TotalHits totalHits = hits.getTotalHits();
        // 得到匹配高的文档
        SearchHit[] searchHits = hits.getHits();
        // 日期格式化对象
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for(SearchHit i : searchHits){
            // 文档的主键
            String id = i.getId();
            // 源文档内容
            Map<String,Object> map = i.getSourceAsMap();
            String name = (String) map.get("name");
            String studymodel = (String) map.get("studymodel");
            Double price = (Double) map.get("price");
            Date timestamp = dateFormat.parse((String) map.get("timestamp"));
            System.out.println(name);
            System.out.println(studymodel);
            System.out.println(price);
            System.out.println(timestamp);
        }
    }
```

### 过滤器

过虑是针对搜索的结果进行过虑，过虑器主要判断的是文档是否匹配，不去计算和判断文档的匹配度得分，所以过虑器性能比查询要高，且方便缓存，推荐尽量使用过虑器去实现查询或者过虑器和查询共同使用。 

过虑器在布尔查询中使用，下边是在搜索结果的基础上进行过虑：

```java
    @Test
    public void testFilerQuery() throws IOException, ParseException {
        // 搜索请求对象
        SearchRequest searchRequest = new SearchRequest("xedu_course");
        // 搜索源构建对象
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        String[] ids = new String[]{"1","2"};
        // multiBuilder查询条件
        MultiMatchQueryBuilder multiBuilder = QueryBuilders.multiMatchQuery("spring框架", "name", "description").
                field("name", 10).
                minimumShouldMatch("50%");
        // 布尔查询条件
        BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
        boolQueryBuilder.must(multiBuilder);
        // 设置查询过滤器
        boolQueryBuilder.filter(QueryBuilders.termQuery("studymodel","201001"));
        boolQueryBuilder.filter(QueryBuilders.rangeQuery("price").lte(100).gte(90));
        // 搜索方式
        // boolQuery，and 查询
        searchSourceBuilder.query(boolQueryBuilder);
        // 设置源字段过滤，第一个参数表示结果集包括哪些字段，第二个参数表示结果集不包括哪些字段
        searchSourceBuilder.fetchSource(new String[]{"name","studymodel","price","timestamp"},new String[]{});
        // 向搜索请求对象设置搜索源
        searchRequest.source(searchSourceBuilder);
        // 执行搜索
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        // 搜索结果
        SearchHits hits = searchResponse.getHits();
        // 匹配到的总记录数
        TotalHits totalHits = hits.getTotalHits();
        // 得到匹配高的文档
        SearchHit[] searchHits = hits.getHits();
        // 日期格式化对象
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for(SearchHit i : searchHits){
            // 文档的主键
            String id = i.getId();
            // 源文档内容
            Map<String,Object> map = i.getSourceAsMap();
            String name = (String) map.get("name");
            String studymodel = (String) map.get("studymodel");
            Double price = (Double) map.get("price");
            Date timestamp = dateFormat.parse((String) map.get("timestamp"));
            System.out.println(name);
            System.out.println(studymodel);
            System.out.println(price);
            System.out.println(timestamp);
        }
    }
```

### 排序

可以在字段上添加一个或多个排序，支持在 keyword、date、ﬂoat 等类型上添加，text 类型的字段上不允许添加排序。

```java
    @Test
    public void testQuerySort() throws IOException, ParseException {
        // 搜索请求对象
        SearchRequest searchRequest = new SearchRequest("xedu_course");
        // 搜索源构建对象
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        // 布尔查询条件
        BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
        // 设置查询过滤器
        boolQueryBuilder.filter(QueryBuilders.rangeQuery("price").lte(100).gte(0));
        // 搜索方式
        // boolQuery，and 查询
        searchSourceBuilder.query(boolQueryBuilder);
        // 设置源字段过滤，第一个参数表示结果集包括哪些字段，第二个参数表示结果集不包括哪些字段
        searchSourceBuilder.fetchSource(new String[]{"name","studymodel","price","timestamp"},new String[]{});
        // 设置查询结果排序
        searchSourceBuilder.sort("studymodel", SortOrder.DESC);//学习模式降序
        searchSourceBuilder.sort("price",SortOrder.ASC);//价格升序
        // 向搜索请求对象设置搜索源
        searchRequest.source(searchSourceBuilder);
        // 执行搜索
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        // 搜索结果
        SearchHits hits = searchResponse.getHits();
        // 匹配到的总记录数
        TotalHits totalHits = hits.getTotalHits();
        // 得到匹配高的文档
        SearchHit[] searchHits = hits.getHits();
        // 日期格式化对象
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for(SearchHit i : searchHits){
            // 文档的主键
            String id = i.getId();
            // 源文档内容
            Map<String,Object> map = i.getSourceAsMap();
            String name = (String) map.get("name");
            String studymodel = (String) map.get("studymodel");
            Double price = (Double) map.get("price");
            Date timestamp = dateFormat.parse((String) map.get("timestamp"));
            System.out.println(name);
            System.out.println(studymodel);
            System.out.println(price);
            System.out.println(timestamp);
        }
    }
```

### 高亮显示

高亮显示可以将搜索结果一个或多个字突出显示，以便向用户展示匹配关键字的位置。 

在搜索语句中添加 highlight 即可实现，如下：

```java
    @Test
    public void testHighLight() throws IOException, ParseException {
        // 搜索请求对象
        SearchRequest searchRequest = new SearchRequest("xedu_course");
        // 搜索源构建对象
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        String[] ids = new String[]{"1","2"};
        // 搜索方式
        // matchQuery，对文本进行分词搜索
        searchSourceBuilder.query(QueryBuilders.matchQuery("name","开发").minimumShouldMatch("80%"));
        // 设置源字段过滤，第一个参数表示结果集包括哪些字段，第二个参数表示结果集不包括哪些字段
        searchSourceBuilder.fetchSource(new String[]{"name","studymodel","price","timestamp"},new String[]{});

        // 设置高亮对象
        HighlightBuilder highlightBuilder = new HighlightBuilder();
        highlightBuilder.preTags("<tag>");//设置高亮前缀
        highlightBuilder.postTags("</tag>");//设置高亮后缀
        highlightBuilder.fields().add(new HighlightBuilder.Field("name"));//设置高亮对象
        searchSourceBuilder.highlighter(highlightBuilder);//将高亮设置到搜索对象上

        // 向搜索请求对象设置搜索源
        searchRequest.source(searchSourceBuilder);
        // 执行搜索
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        // 搜索结果
        SearchHits hits = searchResponse.getHits();
        // 匹配到的总记录数
        TotalHits totalHits = hits.getTotalHits();
        // 得到匹配高的文档
        SearchHit[] searchHits = hits.getHits();
        // 日期格式化对象
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for(SearchHit i : searchHits){
            // 文档的主键
            String id = i.getId();
            // 源文档内容
            Map<String,Object> map = i.getSourceAsMap();
            String name = (String) map.get("name");

            // 取出高亮设置内容字段
            Map<String, HighlightField> highlightFields = i.getHighlightFields();
            if(highlightFields != null){
                // 对于属性中的高亮内容
                HighlightField highlightField = highlightFields.get("name");
                if(highlightField != null){
                    Text[] texts = highlightField.getFragments();//获取高亮内容
                    StringBuffer sb = new StringBuffer();
                    // 拼接高亮内容
                    for(Text text : texts){
                        sb.append(text);
                    }
                    // 替换原name
                    name = sb.toString();
                }
            }
            String studymodel = (String) map.get("studymodel");
            Double price = (Double) map.get("price");
            Date timestamp = dateFormat.parse((String) map.get("timestamp"));
            System.out.println(name);
            System.out.println(studymodel);
            System.out.println(price);
            System.out.println(timestamp);
        }
    }
```

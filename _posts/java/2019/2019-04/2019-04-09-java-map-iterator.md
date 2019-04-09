---
layout: post
title:  "Java 中对 Map 进行遍历的四种方式"
date:  2019-04-09
desc: "在java中遍历Map共有四种方式。接下来我们来看一下这些方法的优缺点，以下方法适用于任何Map实现（HashMap, TreeMap, LinkedHashMap, Hashtable, 等等）"
keywords: "Java,Map,iterator,遍历"
categories: [Java]
tags: [Java,Map,iterator]
---
# 如何在 Java 中遍历 Map 对象

## 方法一：for-each 遍历 entrySet()

使用方法：

- entrySet()：Returns a Set view of the mappings contained in this map.

```java
Map<Integer, Integer> map = new HashMap<Integer, Integer>();

for(Map.Entry<Integer, Integer> entry : map.entrySet()){
    System.out.println("key is "+entry.getKey()+"; value is "+entry.getValue());
}
```

说明：

- for-each 循环在 java 5 中被引入所以该方法只能应用于java 5 或更高的版本中。
- 如果遍历的是一个空的 Map 对象，for-each 循环将抛出 NullPointerException。

## 方法二：for-each 遍历 key 和 value

使用的方法：

- keySet()：Returns a Set view of the keys contained in this map.
- values()：Returns a Collection view of the values contained in this map.

```java
Map<Integer, Integer> map = new HashMap<Integer, Integer>();

for(Integer key : map.keySet()){
    System.out.println("key is : "+key);
}

for(Integer value : map.values()){
    System.out.println("value is : "+value);
}
```

说明：

- 如果只需要 Map 中的键或者值，则可以通过 keySet 或 values 来实现遍历，而不是用 entrySet。
- 该方法比 entrySet 遍历在性能上稍好（快了10%），而且代码更加干净。

## 方法三：使用 iterator 遍历

使用方法：

- iterator()：Returns an iterator over the elements in this set.

```java
Map<Integer, Integer> map = new HashMap<Integer, Integer>();
Iterator<Map.entrySet<Integer, Integer>> iterator = map.entrySet().iterator();

while(iterator.hashNext()){
    Map.entrySet<Integer, Integer> entry = iterator.next();
    System.out.println("key is "+entry.getKey()+"; value is "+entry.getValue());
}
```

说明：

- 可以在 keySet 和 values 上应用同样的方法。
- 在老版本 java 中这是惟一遍历 Map 的方式。
- 可以在遍历时调用 iterator.remove() 来删除 entry（如果在 for-each 遍历中尝试使用此方法，结果是不可预测的）。
- 从性能方面看，该方法类同于 for-each 遍历（即方法二）的性能。

## 方法四：通过 key 来寻找 value

```java
Map<Integer, Integer> map = new HashMap<Integer, Integer>();

for(Integer key : map.keySet()){
    System.out.println("key is : "+key);
    System.out.println("value is : "+map.get(key));
}
```

说明：

- 该方法的效率是最慢的，因为通过 key 来取值是非常慢的。

## 总结

- 仅需要键 keys 或值 values 请使用方法二。
- 如果你使用的语言版本低于java 5，或是打算在遍历时删除 entry ，必须使用方法三。
- 其他情况下推荐直接使用方法一。
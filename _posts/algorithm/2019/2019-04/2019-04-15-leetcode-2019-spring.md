---
layout: post
title:  "2019 力扣杯-全国高校春季编程大赛-题目解析"
date:  2019-04-15
desc: "2019 力扣杯-全国高校春季编程大赛-题目解析"
keywords: "LeetCode,刷题算法,C++,2019 力扣杯-全国高校春季编程大赛"
categories: [Algorithm]
tags: [LeetCode,算法,C++]
---
# 2019 力扣杯-全国高校春季编程大赛(初赛)
## 1. 易混淆数

### 题目描述

给定一个数字 N，当它满足以下条件的时候返回 true：

把原数字旋转180°以后得到新的数字。

如 0, 1, 6, 8, 9 旋转 180° 以后，得到了新的数字 0, 1, 9, 8, 6 。

2, 3, 4, 5, 7 旋转 180° 后,得到的不是数字。

易混淆数字 (confusing number) 就是一个数字旋转180°以后，得到和原来不同的数字，且新数字的每一位都是有效的。

示例 1：

![image](https://assets.leetcode.com/uploads/2019/03/23/1268_1.png)

```
输入：6
输出：true
解释： 
把 6 旋转 180° 以后得到 9，9 是有效数字且 9!=6 。
```

示例 2：

![image](https://assets.leetcode.com/uploads/2019/03/23/1268_2.png)

```
输入：89
输出：true
解释: 
把 89 旋转 180° 以后得到 68，86 是有效数字且 86!=89 。
```

示例 3：

![image](https://assets.leetcode.com/uploads/2019/03/26/1268_3.png)

```
输入：11
输出：false
解释：
把 11 旋转 180° 以后得到 11，11 是有效数字但是值保持不变，所以 11 不是易混淆数字。 
```

示例 4：

![image](https://assets.leetcode.com/uploads/2019/03/23/1268_4.png)

```
输入：25
输出：false
解释：
把 25 旋转 180° 以后得到的不是数字。
```

### 解题思路

### 代码

```cpp
class Solution {
public:
    bool confusingNumber(int N) {
        if(N==1){
            return false;
        }
        int m = 0;
        int n_1 = N;
        while(N>0){
            m = m*10;
            int n = N%10;
            if(n == 5|n==2|n==3|n==4|n==7){
                return false;
            }else if(n==1){
                m += 1;
            }else if(n==6){
                m += 9;
            }else if(n==9){
                m += 6;
            }
            N = N/10;
        }
        if(m==n_1){
            return false;
        }else{
            return true;
        }
    }
};
```

## 2. 校园自行车分配

### 题目描述

在由 2D 网格表示的校园里有 n 位工人（worker）和 m 辆自行车（bike），n <= m。所有工人和自行车的位置都用网格上的 2D 坐标表示。

我们需要为每位工人分配一辆自行车。在所有可用的自行车和工人中，我们选取彼此之间曼哈顿距离最短的工人自行车对  (worker, bike) ，并将其中的自行车分配給工人。如果有多个 (worker, bike) 对之间的曼哈顿距离相同，那么我们选择工人索引最小的那对。类似地，如果有多种不同的分配方法，则选择自行车索引最小的一对。不断重复这一过程，直到所有工人都分配到自行车为止。

给定两点 p1 和 p2 之间的曼哈顿距离为 Manhattan(p1, p2) = |p1.x - p2.x| + |p1.y - p2.y|。

返回长度为 n 的向量 ans，其中 a[i] 是第 i 位工人分配到的自行车的索引（从 0 开始）。

示例 1：

![image](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/03/16/1261_example_1_v2.png)

```
输入：workers = [[0,0],[2,1]], bikes = [[1,2],[3,3]]
输出：[1,0]
解释：
工人 1 分配到自行车 0，因为他们最接近且不存在冲突，工人 0 分配到自行车 1 。所以输出是 [1,0]。
```

示例 2：

![image](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/03/16/1261_example_2_v2.png)

```
输入：workers = [[0,0],[1,1],[2,0]], bikes = [[1,0],[2,2],[2,1]]
输出：[0,2,1]
解释：
工人 0 首先分配到自行车 0 。工人 1 和工人 2 与自行车 2 距离相同，因此工人 1 分配到自行车 2，工人 2 将分配到自行车 1 。因此输出为 [0,2,1]。
```

提示：

- 0 <= workers[i][j], bikes[i][j] < 1000
- 所有工人和自行车的位置都不相同。
- 1 <= workers.length <= bikes.length <= 1000

### 解题思路

### 代码

```cpp
#include <cmath>
class Solution {
public:
    vector<int> assignBikes(vector<vector<int>>& workers, vector<vector<int>>& bikes) {
        vector<int> result(workers.size(), -1);
        
        // 开始分别判断距离
        // 车
        for(int i=0;i<bikes.size();i++){
            int worker = 0;
            int worker_old = 0;
            int bike_dis = 9999999;
            int flag = false;
            // 人
            for(int j=0;j<workers.size();j++){
                if(result[j] == -1){
                    int dis = abs(bikes[i][0]-workers[j][0])+abs(bikes[i][1]-workers[j][1]);
                    //cout<<"i is :"<<i<<"j is :"<<j<<"dis is :"<<dis<<endl;
                    if(dis<bike_dis){
                        bike_dis = dis;
                        worker = j;
                        flag = true;
                    }
                }
            }
            // 有人有了车
            if(flag){
                result[worker] = i;
            }
        }
        
        return result;
    }
};
```

## 3. 最小化舍入误差以满足目标

### 题目描述

给定一系列价格 [p1,p2...,pn] 和一个目标 target，将每个价格 pi 舍入为 Roundi(pi) 以使得舍入数组 [Round1(p1),Round2(p2)...,Roundn(pn)] 之和达到给定的目标值 target。每次舍入操作 Roundi(pi) 可以是向下舍 Floor(pi) 也可以是向上入 Ceil(pi)。

如果舍入数组之和无论如何都无法达到目标值 target，就返回 -1。否则，以保留到小数点后三位的字符串格式返回最小的舍入误差，其定义为 Σ |Roundi(pi) - (pi)|（ i 从 1 到 n ）。

示例 1：

```
输入：prices = ["0.700","2.800","4.900"], target = 8
输出："1.000"
解释： 
使用 Floor，Ceil 和 Ceil 操作得到 (0.7 - 0) + (3 - 2.8) + (5 - 4.9) = 0.7 + 0.2 + 0.1 = 1.0 。
```

示例 2：

```
输入：prices = ["1.500","2.500","3.500"], target = 10
输出："-1"
解释：
达到目标是不可能的。
```

提示：

1. 1 <= prices.length <= 500
2. 表示价格的每个字符串 prices[i] 都代表一个介于 0 和 1000 之间的实数，并且正好有 3 个小数位。
3. target 介于 0 和 1000000 之间。

### 解题思路

### 代码

## 4. 从始点到终点的所有路径

### 题目描述

给定有向图的边 edges，以及该图的始点 source 和目标终点 destination，确定从始点 source 出发的所有路径是否最终结束于目标终点 destination，即：

从始点 source 到目标终点 destination 存在至少一条路径
如果存在从始点 source 到没有出边的节点的路径，则该节点就是路径终点。
从始点source到目标终点 destination 可能路径数是有限数字
当从始点 source 出发的所有路径都可以到达目标终点 destination 时返回 true，否则返回 false。

示例 1：

![image](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/03/21/485_example_1.png)

```cpp
输入：n = 3, edges = [[0,1],[0,2]], source = 0, destination = 2
输出：false
说明：节点 1 和节点 2 都可以到达，但也会卡在那里。
```

示例 2：

![image](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/03/21/485_example_2.png)

```cpp
输入：n = 4, edges = [[0,1],[0,3],[1,2],[2,1]], source = 0, destination = 3
输出：false
说明：有两种可能：在节点 3 处结束，或是在节点 1 和节点 2 之间无限循环。
```

示例 3：

![image](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/03/21/485_example_3.png)

```cpp
输入：n = 4, edges = [[0,1],[0,2],[1,3],[2,3]], source = 0, destination = 3
输出：true
```

示例 4：

![image](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/03/21/485_example_4.png)

```cpp
输入：n = 3, edges = [[0,1],[1,1],[1,2]], source = 0, destination = 2
输出：false
说明：从始点出发的所有路径都在目标终点结束，但存在无限多的路径，如 0-1-2，0-1-1-2，0-1-1-1-2，0-1-1-1-1-2 等。
```

示例 5：

![image](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/03/21/485_example_5.png)

```cpp
输入：n = 2, edges = [[0,1],[1,1]], source = 0, destination = 1
输出：false
说明：在目标节点上存在无限的自环。
```

提示：

1. 给定的图中可能带有自环和平行边。
2. 图中的节点数 n 介于 1 和 10000 之间。
3. 图中的边数在 0 到 10000 之间。
4. 0 <= edges.length <= 10000
5. edges[i].length == 2
6. 0 <= source <= n - 1
7. 0 <= destination <= n - 1

### 解题思路

### 代码
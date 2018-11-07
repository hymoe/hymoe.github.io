---
layout: post
title: 基础算法：归并排序（python实现）
categories: algorithm
permalink: 
tags: 基础算法 归并排序
excerpt: 本文使用python实现O(nlogn)级别的归并排序，包括递归和自顶向上两种实现方式。同时进行一些优化。
---

## 算法原理

归并算法体现了分而治之的思想，使用递归实现的主要逻辑为：

> 将数组不断向下递归形成左右两个子部分，分别对左右两个子部分进行“有序数组合并”。

其中的“有序数组合并”的主要逻辑为：

> 比较两个数组最左端（最小）的元素，选取较小的元素，放置到合并后的数组中。不断重复上述操作，完成合并。

归并排序也可使用自底向上的非递归思路。上述递归的目的是划分左右两个子部分，事实上也可以控制间隔手动划分：

> 从数组中依次取2个，执行有序数组合并；之后从数组中每次取4个，执行有序数组合并；之后取8个，以此类推。

## 算法实现

#### 归并排序的递归实现

{%- highlight python -%}
def merge_sort(unsorted_array, left = -1, right = -1):
    if left == -1 or right == -1:
        left = 0
        right = len(unsorted_array) - 1

    if left == right:
        return
    
    mid = (right + left) / 2

    merge_sort(unsorted_array, left, mid)
    merge_sort(unsorted_array, mid+1, right)
    merge_sort_sub(unsorted_array, left, right)
{%- endhighlight -%}

对应的有序数组合并的实现如下：

{%- highlight python -%}
def merge_sort_sub(sub_array, left, right):
    if left == right:
        return
    tmp = sub_array[left:right+1]

    mid = (right - left) / 2

    i, j = 0, 0

    while(left + i + j <= right):
        if i > mid:
            sub_array[left + i + j] = tmp[mid + 1 + j]
            j += 1
        elif left + mid + 1 + j > right:
            sub_array[left + i + j] = tmp[i]
            i += 1 
        elif tmp[i] > tmp[mid + 1 + j]:
            sub_array[left + i + j] = tmp[mid + 1 + j]
            j += 1
        else:
            sub_array[left + i + j] = tmp[i]
            i += 1
{%- endhighlight -%}

归并排序将一个数组递归划分为`[left， mid]`和`[mid+1， right]`两个部分。划分到最后时，两个部分均只剩余一个数字，因此可以看作有序数组进行合并。合并后的有序数组继续向上合并，从而完成整体排序过程。

实现过程中需要注意的地方有两处。其一是有序数组合并时的数组标号，需要注意划分后的第二个部分是从`mid+1`开始的。其二是两个有序数组中可能有一个已经全部放入合并后数组，因此循环中要对其进行判断。

#### 归并排序的自底向上实现

{%- highlight python -%}
def merge_sort_bottom_up(unsorted_array):
    interval = 2
    while interval < len(unsorted_array):
        for i in range(len(unsorted_array) / interval):
            merge_sort_sub(unsorted_array, i*interval, i*interval + interval - 1)
        if len(unsorted_array) - (len(unsorted_array) / interval) * interval > interval / 2:
            merge_sort_sub(unsorted_array, (len(unsorted_array) / interval) * interval, len(unsorted_array) - 1, interval / 2 - 1)
        interval += interval
    merge_sort_sub(unsorted_array, 0, len(unsorted_array) - 1, interval / 2 - 1)
{%- endhighlight -%}

自底向上的归并排序，主要难度在于剩余元素的处理。上述代码中`For`循环内为对于指定间隔的合并，执行`For`循环之后，还要考虑数组内的剩余元素。

例如对于长度为7的数组，第一轮完成后剩余1个元素，第二轮完成后剩余3个元素，显然要对剩余的3个元素按照`2|1`分组的形式进行合并。观察数组划分的方式，可以得出下述事实：

> 本轮剩余元素个数 = （上轮间隔数 + 上轮剩余元素个数） or 上轮剩余元素个数

对于剩余元素超过上一轮间隔数的情况，均可按照`上一轮间隔数|剩余个数`的分组形式进行排序；如果剩余元素不足上一轮间隔数，无需排序，因为这些元素一定在前面的某轮完成了排序。例如，对于长度为21的元素，第4轮(`interval=16`)剩余长度为5，不足上一轮间隔数(`interval=8`)，那么本轮无需对其进行排序。在第三轮(`interval=8`)，大于上一轮间隔数(`interval=4`)，因此要在本轮完成排序。

*考虑到上述分析中主要考虑上轮间隔，因此也可以用上轮间隔作为循环和判断依据，从而简化代码逻辑。*


## 算法优化

归并排序有三个可以优化的地方：
1. 由于插入排序对于近乎有序的数组有着较好的排序性能，可以在归并排序的规模较小时使用插入排序。**注意本条优化只在理论上有效，对于具体的python实现，并没有产生可见的性能差距。**
2. 判断`array[mid]`和`array[mid+1]`的大小关系，如果`array[mid] < array[mid+1]`，此时无需额外进行“合并有序数组”操作。
   {%- highlight javascript -%}
    if unsorted_array[mid] > unsorted_array[mid+1]:
        merge_sort_sub(unsorted_array, left, right)
   {%- endhighlight -%}
3. 合并有序数组的操作中，每次都要创建了临时数组`tmp`，用于保存本轮需要排序的元素。由于每轮需要排序的数组个数最多也就是数组总长度，因此可以事先创建大小为数组总长度的临时数组。

## 算法测试

本文出现的代码均已经过正确性测试，对于性能进行测试的结果如下:

{%- highlight text -%}
创建测试数组

对于插入排序：
1000大小数组耗时:0.050563s
10000大小数组耗时:4.687425s
1000大小随机范围较小数组耗时:0.034940s
1000大小近乎有序数组耗时:0.009147s
.
对于优化后的插入排序：
1000大小数组耗时:0.032783s
10000大小数组耗时:3.548733s
1000大小随机范围较小数组耗时:0.024523s
1000大小近乎有序数组耗时:0.008046s
.
对于归并排序：
1000大小数组耗时:0.006505s
10000大小数组耗时:0.045558s
1000大小随机范围较小数组耗时:0.003792s
1000大小近乎有序数组耗时:0.003171s
.
对于自底向下的归并排序：
1000大小数组耗时:0.002848s
10000大小数组耗时:0.047435s
1000大小随机范围较小数组耗时:0.002838s
1000大小近乎有序数组耗时:0.002759s
.
对于选择排序：
1000大小数组耗时:0.031863s
10000大小数组耗时:3.178632s
1000大小随机范围较小数组耗时:0.027421s
1000大小近乎有序数组耗时:0.029083s
.
对于优化后的选择排序：
1000大小数组耗时:0.025373s
10000大小数组耗时:2.602780s
1000大小随机范围较小数组耗时:0.022562s
1000大小近乎有序数组耗时:0.022578s
.
----------------------------------------------------------------------
Ran 6 tests in 14.595s

OK
{%- endhighlight -%}

显然归并排序可以在更短的时间内处理更多的数据。由于自底向上的实现没有使用递归，对于一些情况可能更加适用。


## 算法复杂度

归并排序向下递归划分的过程一共划分为$ log(N) $层。其中每层需要进行$ O(N) $级别的有序数组合并的操作。（显然，对于总长度为$ k $的两个有序数组，完成合并需要$ O(k) $时间。）因此，总体的时间复杂度为$ O(Nlog(N)) $。

由于有序数组合并过程需要额外的空间，且空间大小为数组总长度，因此空间复杂度为$ O(N) $。另外，存在原地归并算法，不需要额外空间。
---
layout: post
title: 基础算法：快速排序（python实现）
categories: algorithm
permalink: 
tags: 基础算法 快速排序
excerpt: 本文使用python实现一个最常用的排序算法，快速排序。同时对其进行优化，引入三路快排解决重复元素的问题。
---

## 算法原理

快速排序是一个具有较高性能的排序算法，其主要思想如下：

> 对数组中的某个元素，确定其在数组中的排序位置，即在其之前的所有元素均小于该元素，在其之后的均大于该元素。对小元素组和大元素组同样执行该过程，直到全部执行完毕。

每次递归确定一个元素的排序位置，核心在于确定大元素组和小元素组。设待处理元素为left，本次循环元素i，大元素组的第一个元素为j：

数组元素可看作该分组 ：

| left | less group |(j)--->greater group | i |other| right |

初始时刻大小元素组均为空，随着i不断后移，逐渐填充两个元素组。按照如下思路进行处理：

> 如果`array[i] >= array[left]`, 将i归入greater_group；如果`array[i] < array[left]`，将i和j交换。

分组完成后交换`array[left]`和小元素组最后元素，即可确定`array[left]`元素在排序数组中的位置。

## 算法实现

快速排序使用分治思想对划分的大元素组和小元素组进行分别处理：
{%- highlight python -%}
def quick_sort(unsorted_array, left = -1, right = -1):
    if left == -1 and right == -1:
        left = 0
        right = len(unsorted_array) - 1
    if left >= right:
        return
    p = quick_sort_partition(unsorted_array, left, right)
    quick_sort(unsorted_array, left, p - 1)
    quick_sort(unsorted_array, p + 1, right)
{%- endhighlight -%}

注意递归返回的条件`left >= right`，当两者相等时，待排序数组只有一个元素，因此无需排序；当`left > right`时，表示待排序数组为空，等价于使用：
{%- highlight python -%}
    if left != p:
        quick_sort(unsorted_array, left, p - 1)
    if right != p:
        quick_sort(unsorted_array, p + 1, right)
{%- endhighlight -%}

快速排序的辅助函数实现如下：
{%- highlight python -%}
def quick_sort_partition(unsorted_array, left, right):
    random_p = random.randint(left, right)
    unsorted_array[left], unsorted_array[random_p] = unsorted_array[random_p], unsorted_array[left]

    v = unsorted_array[left]

    last_of_less_group = left

    for i in range(left, right + 1):
        if(v > unsorted_array[i]):
            last_of_less_group += 1
            unsorted_array[last_of_less_group], unsorted_array[i] = unsorted_array[i], unsorted_array[last_of_less_group]
    unsorted_array[left], unsorted_array[last_of_less_group] = unsorted_array[last_of_less_group], unsorted_array[left]

    return last_of_less_group
{%- endhighlight -%}

其中包含了一个典型优化，**随机选择待处理元素**。这是由于对于近乎有序数组，快速排序划分的两个子数组一长一短，这种不平衡的划分会增加时间复杂度，最坏情况会达到$ O(N^2) $。

之后按照前述方式确定元素在排序数组中的位置。除此之外，还可以使用挖坑填数的方式从两端向中间寻找位置，详见下文两路快排。

## 算法优化

快排有诸多优化方式：

1. 随机选择待处理元素。
2. 在元素较少的时候，使用插入排序作为代替，较少递归开销。
3. 双路快排，通过打乱相等元素，解决重复元素造成划分不平衡的问题。
4. 三路快排，通过明确划分出相等元素，进一步解决上述问题。

### 双路快排

对于前文介绍的单路快排，如果数组中存在大量重复元素，在某轮递归处理中，将会出现大量`array[left]==array[i]`的情况，这些相等的数值会被放到大元素组，从而造成划分的不平衡。为了解决这个问题，采用如下思路：

> 从数组左端开始构造小元素组，从右端构造大元素组，直到两边都遇到不属于该元素组的元素，将这两个元素交换。其中等于`array[left]`（待确定排序位置的元素）的情况也进行交换。

通过这种方式，等于`array[left]`的元素被尽可能地分散到两个分组中。

例如，对于数组`[1, 2, 2, 3, 1, 1, 1, 1, 0, 0, 0, 1, 1, 2, 2]`。
- 双路交换后变为`[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 3, 2, 2, 2, 2]`，返回的划分点位置为6(0为起始)。
- 如果为单路交换，结果为`[0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 3, 1, 1, 2, 2]`, 返回的划分点位置为3。
- 如果将下述双路快排中`unsorted_array[i] < v`和`unsorted_array[j] > v`改为`unsorted_array[i] <= v`和`unsorted_array[j] >= v`，此时对于相等的情况不交换。结果为`[0, 0, 0, 1, 1, 1, 1, 1, 3, 2, 2, 1, 1, 2, 2]`, 返回的划分点位置为3。

显然，后两种情况都产生了不平衡的划分。

{%- highlight python -%}
def quick_sort_partition_two_way(unsorted_array, left, right):
    random_p = random.randint(left, right)
    unsorted_array[left], unsorted_array[random_p] = unsorted_array[random_p], unsorted_array[left]

    v = unsorted_array[left]

    i = left + 1
    j = right
    while True:
        while i <= right and unsorted_array[i] < v:
            i += 1
        while j >= left + 1 and unsorted_array[j] > v:
            j -= 1
        if i >= j:
            break
        unsorted_array[i], unsorted_array[j] = unsorted_array[j], unsorted_array[i]
        i += 1
        j -= 1
    unsorted_array[left], unsorted_array[j] = unsorted_array[j], unsorted_array[left]
    return j
{%- endhighlight -%}

注意，`while i <= right and unsorted_array[i] < v:`这一行不可以先判断元素大小再判断数组越界，这样会出现数组访问越界错误，当前写法利用了“与”运算如果前面为False则不再考虑后面的特性。

### 三路快排

上述双路快排只是尽可能的解决了重复元素的问题，三路快排通过显式的将数组划分为三组，有效解决了重复元素的问题。划分的三组为大于`array[left]`，小于`array[left]`，等于`array[left]`。其主要思路与前述两个快排类似：

> 每轮递归中，对于当前元素i，如果小于目标，放到左边的less_group，如果大于目标，放到右边的greater_group，如果等于目标，放到中间。之后对两边的大小分组继续递归，直到排序完成。

使用python的`partition函数`实现如下：
{%- highlight python -%}
def quick_sort_partition_three_way(unsorted_array, left, right):
    random_p = random.randint(left, right)
    unsorted_array[left], unsorted_array[random_p] = unsorted_array[random_p], unsorted_array[left]
    
    last_of_less_group = left
    first_of_greater_group = right + 1

    v = unsorted_array[left]
    i = left + 1

    while i < first_of_greater_group:
        if unsorted_array[i] < v:
            unsorted_array[last_of_less_group + 1], unsorted_array[i] = unsorted_array[i], unsorted_array[last_of_less_group + 1]
            i += 1
            last_of_less_group += 1
        elif unsorted_array[i] > v:
            unsorted_array[i], unsorted_array[first_of_greater_group - 1] = unsorted_array[first_of_greater_group - 1], unsorted_array[i]
            first_of_greater_group -= 1
        else:
            i += 1
    
    unsorted_array[left], unsorted_array[last_of_less_group] = unsorted_array[last_of_less_group], unsorted_array[left]
    return last_of_less_group, first_of_greater_group
{%- endhighlight -%}

上述实现较为简单，其中需要注意的地方在于`unsorted_array[i] > v`的情况时，不需要进行`i += 1`，这是由于换过来的元素大小不定，需要在当前位置继续比较。而对于`unsorted_array[i] < v`的情况，交换过来的`array[last_of_less_group + 1]`一定等于`v`，因此可以前往下一个元素。


## 算法测试

本文涉及代码均通过正确性测试。以下是性能测试结果：
{%- highlight markdown -%}
创建测试数组

对于快速排序：
100000大小数组耗时:0.484760s
1000000大小数组耗时:7.085851s
100000大小随机范围较小数组耗时: **stack overflow**
100000大小近乎有序数组耗时:0.386866s
.
对于双路快速排序：
100000大小数组耗时:0.327692s
1000000大小数组耗时:4.167595s
100000大小随机范围较小数组耗时:0.328271s
100000大小近乎有序数组耗时:0.257662s
.
对于三路快速排序：
100000大小数组耗时:0.467874s
1000000大小数组耗时:6.011800s
100000大小随机范围较小数组耗时:0.032722s
100000大小近乎有序数组耗时:0.472250s
.
对于归并排序：
100000大小数组耗时:0.684923s
1000000大小数组耗时:7.055477s
100000大小随机范围较小数组耗时:0.613237s
100000大小近乎有序数组耗时:0.473848s
.
----------------------------------------------------------------------
Ran 4 tests in 37.741s

OK
{%- endhighlight -%}

首先值得注意的是，如果对10000大小随机范围[0-3]的数组进行单路快排，会出现栈溢出。此时重复元素过多，划分过于不平衡，递归次数过多。

整体而言，快速排序具有很好的性能，尤其双路快排拥有最快的性能，但三路快排对存在大量重复元素有着更好的性能，因此被许多编程语言作为默认排序方法。*另外，Python的默认排序方法为TimeSort，其性能更为优秀。*

## 算法复杂度

时间复杂度为$ O(Nlog(N)) $，空间复杂度为$ O(1) $。

## 有趣的实现

来源于网络的一则**单行**快排python实现，可以看作上文单路快排，且不含优化的版本。

{%- highlight python -%}
        quicksort = lambda l: quicksort([i for i in l[1:] if i < l[0]]) + [l[0]] + quicksort([j for j in l[1:] if j >= l[0]]) if l else []
{%- endhighlight -%}
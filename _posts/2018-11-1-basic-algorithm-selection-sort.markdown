---
layout: post
title: "基础算法：选择排序（python实现）"
categories: algorithm
permalink: 
tags: 基础算法 选择排序
excerpt: 使用python实现一个简单的排序算法，选择排序。
---

## 算法原理

选择排序是一种十分简单的排序算法，其主要思路为：

> 从数组中选择最小的元素，放到数组的第一位；选择数组中第二小的元素，放到数组第二位。以此类推。

## 算法实现

{%- highlight python -%}
def selection_sort(unsorted_array):
    for index_i in range(len(unsorted_array)):
        min_index = index_i
        for index_j in range(index_i, len(unsorted_array)):
            if(unsorted_array[index_j] < unsorted_array[min_index]):
                min_index = index_j
        unsorted_array[index_i], unsorted_array[min_index] = unsorted_array[min_index], unsorted_array[index_i]
{%- endhighlight -%}

上述函数使用两层循环完成选择排序过程。内层循环查找第i小的元素；外层循环选择数组的第i位，之后将第i小的元素放置到该位置。

其中数组位置交换使用了Python的一个语法糖，使用`a, b = b, a`的形式进行元素交换，其过程相当于先将等式右值打包(`pack`)为临时元组(`tuple`)`tmp=(b, a)`，之后将元组中的内容解包(`unpack`)赋给相应变量`a, b=tmp`。

## 算法优化

在进行内层循环时，不止寻找第i小的元素，同时寻找第i大的元素，分别放到数组的第i位和倒数第i位。

{%- highlight python -%}
def selection_sort_optimization(unsorted_array):
    for index_i in range(len(unsorted_array) / 2):
        left = index_i
        right = len(unsorted_array) - index_i - 1
        if(unsorted_array[left] > unsorted_array[right]):
            unsorted_array[left], unsorted_array[right] = unsorted_array[right], unsorted_array[left]
        min_index = left
        max_index = right
        for index_j in range(left + 1, right):
            if(unsorted_array[index_j] < unsorted_array[min_index]):
                    min_index = index_j
            if(unsorted_array[index_j] > unsorted_array[max_index]):
                    max_index = index_j
        unsorted_array[left], unsorted_array[min_index] = unsorted_array[min_index], unsorted_array[left]
        unsorted_array[right], unsorted_array[max_index] = unsorted_array[max_index], unsorted_array[right]
        left += 1
        right -= 1
{%- endhighlight -%}

具体实现中，先确定左右边界，使左右边界上的数有序。注意，由于内层循环无法修改左右边界的值，因此要先将两者的顺序确定。之后内层循环寻找最大最小值，放置到边界上。

上述实现将外层循环次数减半，但数组交换的次数增加（上述代码实测增加约25%），整体优化的效果不明显。

## 算法测试

编写单元测试函数，分别对上述两个函数进行正确性及性能测试。正确性测试通过，性能测试的结果如下：
{%- highlight python -%}
创建测试数组

对于选择排序：
1000大小数组耗时:0.043887s
10000大小数组耗时:3.096830s
1000大小随机范围较小数组耗时:0.028132s
1000大小近乎有序数组耗时:0.027849s
.
对于优化后的选择排序：
1000大小数组耗时:0.033144s
10000大小数组耗时:2.713395s
1000大小随机范围较小数组耗时:0.028247s
1000大小近乎有序数组耗时:0.023623s
.
----------------------------------------------------------------------
Ran 2 tests in 6.076s

OK
{%- endhighlight -%}

分别使用1000个随机数和10000个随机数进行测试，耗时成指数级上升。对于近乎有序的数组没有明显优势。

## 复杂度分析

对于优化前的选择排序算法，由于使用了两层循环遍历，时间复杂度为$ O(N^2) $；由于使用数组内部的原地交换，不使用额外空间，空间复杂度$ O(1) $。

对于优化后的选择排序算法，循环的次数下降，但整体来看还是需要两层循环遍历，因此是一个常数级的优化，时间复杂度仍为$ O(N^2) $；由于使用数组内部的原地交换，不使用额外空间，空间复杂度$ O(1) $。


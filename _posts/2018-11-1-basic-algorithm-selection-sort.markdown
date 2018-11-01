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

其中数组位置交换使用了Python的一个语法糖，使用`a, b = b, a`的形式进行元素交换，刚过程相当于先将等式右值打包(`pack`)为临时元组(`tuple`)`tmp=(b, a)`，之后将元组中的内容解包(`unpack`)赋给相应变量`a, b=tmp`。

## 复杂度分析

由于使用了两层循环遍历，时间复杂度为$ O(N^2) $；由于使用数组内部的原地交换，不使用额外空间，空间复杂度$ O(1) $。


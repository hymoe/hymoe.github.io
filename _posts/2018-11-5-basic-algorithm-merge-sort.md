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

## 算法实现

归并排序的实现如下：

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

归并排序将一个数组递归划分为`\[left， mid\]`和`\[mid+1， right\]`两个部分。划分到最后时，两个部分均只剩余一个数字，因此可以看作有序数组进行合并。合并后的有序数组继续向上合并，从而完成整体排序过程。

实现过程中需要注意的地方有两处。其一是有序数组合并时的数组标号，需要注意划分后的第二个部分是从`mid+1`开始的。其二是两个有序数组中可能有一个已经全部放入合并后数组，因此循环中要对其进行判断。

## 算法优化

归并排序有两个可以优化的地方：
1. 由于插入排序对于近乎有序的数组有着较好的排序性能，可以在归并排序的规模较小时使用插入排序。
2. 判断`array\[mid\]`和`array\[mid+1\]`的大小关系，如果`array\[mid\] < array\[mid+1\]`，此时无需额外进行“合并有序数组”操作。

## 算法复杂度

归并排序向下递归划分的过程一共划分为$ log(N) $层。其中每层需要进行$ O(N) $级别的有序数组合并的操作。（显然，对于总长度为$ k $的两个有序数组，完成合并需要$ O(k) $时间。）因此，总体的时间复杂度为$ O(Nlog(N)) $。

由于有序数组合并过程需要额外的空间，且空间大小为数组总长度，因此空间复杂度为$ O(N) $。
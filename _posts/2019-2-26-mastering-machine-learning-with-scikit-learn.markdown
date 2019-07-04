---
layout: post
title: 《Mastering Machine Learning With scikit-learn》记录
categories: books
permalink: 
tags: Scikit-learn 机器学习 读书
excerpt: 本文为阅读《Mastering Machine Learning With scikit-learn》一书之后的简单记录，该书介绍了机器学习算法的具体使用方法。
---

## 书籍简介

> **Mastering Machine Learning With scikit-learn**
> ISBN 978-1-78398-836-5
> 作者 Gavin Hackeling

《Mastering Machine Learning With scikit-learn》一书介绍了机器学习领域的主要算法，利用python的机器学习算法库Scikit-learn给出具体的使用实例。该书侧重点在于机器学习算法的工程实践，对于算法主要使用直观和定性的方法进行阐述。*整体阅读较为容易。*

## 数据处理

使用Scikit-learn可以很方便的将向量数据划分为测试集和训练集。

{%- highlight python -%}
    from sklearn.model_selection import train_test_split
    X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)
{%- endhighlight -%}

通常需要使用Pandas读取数据。例如对于包含一系列数据的csv文件，可以使用下面的方式读取。

{%- highlight python -%}
    import pandas as pd
    csv = pd.read_csv("tmp.csv")
    csv = csv[csv["帧ID"]!="0x000000f1"] #数据筛选
    csv = csv.loc[:, ["时间标识","帧ID","数据(HEX)"]] #保留部分列
    csv["label"] = None #创建空白列
    for index, row in csv.iterrows():
        pass #这里可以修改行数据，例如填充上面创建的“label”
    y=csv["label"] #提取数据，可以用于Scikit-learn
{%- endhighlight -%}

还可以使用matplotlib进行作图。

{%- highlight python -%}
    import matplotlib.pyplot as plt
    plt.figure()
    plt.plot(csv["x"],csv["y"])
    plt.show()
{%- endhighlight -%}

## 线性回归

使用线性回归、多项式回归对数据点进行曲线拟合。线性回归存在的典型问题是容易过拟合，解决方案通常使用岭回归（Ridge regression）和LASSO（Least Absolute Shrinkage and Selection Operator）方法，向损失函数中增加惩罚项。

使用Scikit-learn调用回归器十分简单，只需通过如下方式即可使用回归器完成模型构建。
{%- highlight python -%}
    regressor.fit(X_train, y_train)
    y_predictions = regressor.predict(X_test)
    regressor.score(X_test, y_test) 
{%- endhighlight -%}

典型的线性回归包括：

{%- highlight python -%}
    from sklearn.linear_model import LinearRegression
    from sklearn.linear_model import SGDRegressor
{%- endhighlight -%}

## 特征提取

为了进行回归/分类操作，首先需要将文本、图像数据转换为特征向量。

对于文本数据，可以使用的特征如下：

{%- highlight javascript -%}
    from sklearn.feature_extraction import DictVectorizer #将不同的类别构建成字典，字典序号作为特征
    from sklearn.feature_extraction.text import CountVectorizer #将文章中的词语及出现次数作成字典，将每句话的出现了哪些单词作为特征。
{%- endhighlight -%}

对于CountVectorizer，通常需要剔除stop word，然后进行词干提取（Stemming）和词形还原（lemmatization）。

{%- highlight javascript -%}
    from nltk.stem.wordnet import WordNetLemmatizer
    lemmatizer = WordNetLemmatizer()
    print lemmatizer.lemmatize('gathering', 'v')

    from nltk.stem import PorterStemmer
    stemmer = PorterStemmer()
    print stemmer.stem('gathering')
{%- endhighlight -%}


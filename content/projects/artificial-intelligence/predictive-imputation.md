---
title: "Predictive Imputation"
specialty: "Machine Learning"
summary: "Constructed a tool for data classification and imputation, predicting new data through the
implementation of machine learning algorithms including K-means, basic-means, linear regression, and random forests, using
Python libraries (scikit-learn, pandas)."
tags: ["AI", "Python", "scikit-learn", "pandas"]
heroImage: "/images/cover-photos/Missing Value Estimation.png"
galleryDirectory: "/images/ai-ml/predictiveimputation"
---

Split into 2 parts. Missing Value Estimation and Classification.

For Missing Value Estimation, we implemented a basic mean imputation and a mean imputation based on k means. For the basic means estimation, we replaced missing values with the mean of their respective columns. For the imputation based on k-means, we implemented a k-means algorithm to group the data, and then for the data with missing values, replaced said values with the mean within their group of their respective columns.

For Classification, before functions could be applied, each dataset had to be preprocessed (cleaning up missing values, scaling features, feature selection, etc.). Once the data was cleaned, we tested the training set using a linear regression method of classification and a random forest method of classification and used the accuracy measure to gauge which one was optimal for the dataset.
Our function then returns that result. 
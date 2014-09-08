# -*- coding: utf-8 -*-
import numpy as np
import pandas
import random
import datetime
import cPickle

from scipy.stats.stats import pearsonr
from sklearn.metrics import mean_squared_error
from sklearn import svm, metrics, preprocessing
from sklearn import cross_validation
from sklearn import ensemble
from sklearn.preprocessing import OneHotEncoder, Imputer, StandardScaler

from shared import *

data = pandas.read_csv("../data/bins/train.csv")


to_predict = "amount"
predictors = data[filter(lambda x:x != to_predict,data.columns)]
X= predictors
Y= data[to_predict]

# scale
scaler = StandardScaler().fit(X)
X = scaler.fit_transform(X,Y)

print "shufling"
index = np.random.permutation(range(len(X)))
X = X[index]
Y = Y.ix[index]

print "learning"
# params = {"n_estimators": 500, "max_depth": 9, "min_samples_split": 1,
#           "learning_rate": 0.01, "loss": "ls", "verbose": 1}
# regressor = ensemble.GradientBoostingRegressor(**params)
regressor = ensemble.RandomForestRegressor(n_estimators=10, max_depth=9, min_samples_split=2, min_samples_leaf=1, max_features='auto', bootstrap=True, oob_score=False, random_state=None, verbose=1)

# scores = cross_validation.cross_val_score(regressor, x_norm, y, cv=3)
# print("Accuracy: %0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2))

size = 9*len(X)/10
regressor.fit(X[:size],Y[:size])
expected = Y[size:]
predicted = regressor.predict(X[size:])
pearson = pearsonr(expected, predicted)[0]
print "Pearson coefficient: %s" % str(pearson)
print "MSE : %s" % np.sqrt(mean_squared_error(expected, predicted))


# save model to disk
with open('../data/bins/model.pkl', 'wb') as fid:
    cPickle.dump(regressor, fid)
with open('../data/bins/scaler.pkl', 'wb') as fid:
    cPickle.dump(scaler, fid)

     
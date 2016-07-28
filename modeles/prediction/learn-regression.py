#!/usr/bin/python

import pandas as pd
import datetime
import dateutil.parser
import json
import math
import os
from sklearn.tree import DecisionTreeRegressor
from sklearn.tree import export_graphviz
from sklearn import metrics
from sklearn import svm
from sklearn import cross_validation

def json_from_file(relative_path):
    with open(os.path.dirname(os.path.abspath(__file__)) + "/" + relative_path) as fs:
        return json.load(fs)

# Loading sensors' datas
places = json_from_file("../sensors/all_places_infos.json")

X   = pd.DataFrame()
y   = pd.DataFrame()
clf = DecisionTreeRegressor()

for place in places:
    try:
        df = pd.read_csv("dataset_sensor-" + str(place["id"]) + ".csv", index_col = "Date")
    except:
        continue

    if (df.shape[0] < 250):
        continue

    df["id"] = place["id"]
    X = X.append(df)
    y = y.append(df[["Nb_measured"]])

print "Scoring..."
del X["Level"]
del X["Nb_measured"]
cv = cross_validation.ShuffleSplit(X.shape[0], test_size = 0.2, random_state = 0, n_iter = 4)
scores = cross_validation.cross_val_score(clf, X, y["Nb_measured"], scoring = "mean_squared_error", cv = cv)
print("   Mean error of %0.2f (+/- %0.2f)" % (math.sqrt(-scores.mean()), math.sqrt(scores.std() if scores.std() >= 0 else -scores.std()) * 2))

clf.fit(X, y)
predictions = clf.predict(X)
for i, measure in enumerate(y["Nb_measured"]):
    if math.pow(measure - predictions[i], 2) > scores.mean() * -3:
        print ' ' + str(measure) + ' - ' + str(predictions[i])

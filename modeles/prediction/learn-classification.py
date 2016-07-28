#!/usr/bin/python

import pandas as pd
import datetime
import dateutil.parser
import json
import os
from sklearn.tree import DecisionTreeClassifier
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
clf = svm.SVC(kernel = 'linear', C = 1)

for place in places:
    try:
        df = pd.read_csv("dataset_sensor-" + str(place["id"]) + ".csv", index_col = "Date")
    except:
        continue

    if (df.shape[0] < 250):
        continue

    df["id"] = place["id"]
    X = X.append(df)
    y = y.append(df[["Level"]])

print "Scoring..."
del X["Level"]
del X["Nb_measured"]
cv = cross_validation.ShuffleSplit(X.shape[0], test_size = 0.2, random_state = 0, n_iter = 4)
scores = cross_validation.cross_val_score(clf, X, y["Level"], scoring = "f1_weighted", cv = cv)
if (scores.mean() < 0.8):
    print("   Accuracy: %0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2))
else:
    print("   Accuracy: %0.3f (+/- %0.3f)" % (scores.mean(), scores.std() * 2))

dt = DecisionTreeClassifier()
X_train, X_test, y_train, y_test = cross_validation.train_test_split(X, y, test_size = 0.2, random_state = 0)
y_pred = dt.fit(X_train, y_train).predict(X_test)
cm = metrics.confusion_matrix(y_test, y_pred)

print
print "Confusion matrix:"
print cm

with open('tree.dot', 'w') as dotfile:
    export_graphviz(
        dt,
        dotfile,
        feature_names=X.columns)

#!/usr/bin/env python
# -*- coding: utf-8 -*-
import numpy as np
import pandas
import random
import datetime

from scipy.stats.stats import pearsonr
from sklearn.metrics import mean_squared_error
from sklearn import svm, metrics, preprocessing
from sklearn import cross_validation
from sklearn import ensemble
from sklearn.preprocessing import OneHotEncoder, Imputer, StandardScaler


data = pandas.read_csv("data/learning_table.csv")

selected_features = [
"year",
"month",
"dayofweek",
"dayofyear",
"Label",
"L",
"M",
"Me",
"J",
"V",
"S",
"D",
"D_DV",
"D_FER",
"D_GRAV",
"D_ENC",
"D_BOIS",
"D_CART",
"D_D3E",
"D_PLAST",
"D_TEXT",
"D_DASRI",
"DD_HM",
"DD_PILES",
"DD_DMS",
"D_PRO",
"mean_freq",
"ALTITUDE",
"AREA",
"GRANDE_SURFACE_DE_BRICOLAGE",
"MAISONS_EN_2010",
"APPARTEMENTS_EN_2010",
"POP_MENAGES_EN_2010",
"CENTRE_EQUESTRE",
"TERRAIN_DE_GRANDS_JEUX",
"ENTREPRISES_EN_2012",
"ETS_DE_L_INDUSTRIE_EN_2012",
"ETS_DE_LA_CONSTRUCTION_EN_2012",
"POPULATION_EN_2010",
"SUPERFICIE_(EN_KM_)",
"POP_0-14_ANS_EN_2010",
"POP_15-29_ANS_EN_2010",
"POP_30-44_ANS_EN_2010",
"POP_45-59_ANS_EN_2010",
"POP_60-74_ANS_EN_2010",
"POP_75_ANS_OU_PLUS_EN_2010",
"DEFM_CAT_ABC_AU_31_DECEMBRE_2011",
"DEFM_CAT_ABC_DE_MOINS_DE_25_ANS_AU_31_DECEMBRE_2011",
"DEFM_CAT_ABC_DE_25_49_ANS_AU_31_DECEMBRE_2011",
"DEFM_CAT_ABC_DE_50_ANS_OU_PLUS_AU_31_DECEMBRE_2011",
"EFFECTIF_INDUSTRIE",
"EFFECTIF_CONSTRUCTION",
"EFFECTIF_COMMERCE_TRANSPORTS_ET_SERVICES_DIVERS",
"EFFECTIF_ADMINISTRATION_PUBLIQUE_ENSEIGNEMENT_SANTE_ET_ACTION_SOCIALE",
"RESIDENCES_SECONDAIRES_EN_2010",
"PLATRIER_PEINTRE",
"MENUISIER",
"_CHARPENTIER",
"_SERRURIER",
"PLOMBIER",
"_COUVREUR",
"_CHAUFFAGISTE",
"ELECTRICIEN",
"ENTREPRISE_GENERALE_DU_BATIMENT",
"COIFFURE",
"VETERINAIRE",
"NB_ISF",
"MEAN_ISF",
"PAC",
"AOC"
]

to_predict = "frequence"

# data = data[data["Label"] == "Ambares-et-Lagrave"]
data = data.dropna(subset=["frequence"]+selected_features)
# data = data.fillna(0)
data.index = range(len(data))
predictors = data[selected_features]

# deal with categorical features
def category_encode(dataframe, name):
    labels = set(dataframe.ix[:, name])
    int_conversion = {value : i for (value, i) in zip(labels, range(len(labels)))}
    values = dataframe[name].apply(lambda x: int_conversion[x])
    encoder = OneHotEncoder()
    encoder.fit([[x] for x in values])
    added_frame = pandas.DataFrame(encoder.transform([[x] for x in values]).todense())
    output1 = dataframe.drop(name, axis=1)
    output = pandas.merge(output1,added_frame,how="left", on=output1.index).drop("key_0", axis=1)
    return (output, output.columns)

# (X, labels) = category_encode(predictors, "Label")
labels = set(predictors.ix[:, "Label"])
int_conversion = {value : i for (value, i) in zip(labels, range(len(labels)))}
predictors["Label"] = predictors["Label"].apply(lambda x: int_conversion[x])
X = predictors
labels = predictors.columns
# X = category_encode(X, "MOA")
Y = data[to_predict]

# deal with missing values
imputer = Imputer(missing_values="NaN", strategy="mean", axis=0)
imputer.fit(X)
Imputer(axis=0, copy=True, missing_values="NaN", strategy="mean", verbose=0)
X = imputer.transform(X)

# scale
scaler = StandardScaler().fit(X)
X = scaler.fit_transform(X,Y)

print "shufling"
index = np.random.permutation(range(len(X)))
X = X[index]
Y = Y[index]

print "learning"
params = {"n_estimators": 500, "max_depth": 9, "min_samples_split": 1,
          "learning_rate": 0.01, "loss": "ls", "verbose": 1}
regressor = ensemble.GradientBoostingRegressor(**params)

# scores = cross_validation.cross_val_score(regressor, x_norm, y, cv=3)
# print("Accuracy: %0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2))

size = 9*len(X)/10
regressor.fit(X[:size],Y[:size])
expected = Y[size:]
predicted = regressor.predict(X[size:])
pearson = pearsonr(expected, predicted)[0]
print "Pearson coefficient: %s" % str(pearson)
print "MSE : %s" % np.sqrt(mean_squared_error(expected, predicted))


# plt.plot(range(len(expected)), expected, "b")
# plt.plot(range(len(expected)), predicted, "r")
# plt.show()

# plot next week
nb_days = 100
dates = [datetime.date.today() + datetime.timedelta(days=i) for i in range(0, nb_days)]
decheteries = list(set(data["Label"]))
defaults = []
for label in decheteries:
    a = data[data["Label"] == label]
    a = a[selected_features]
    a["Label"] = a["Label"].apply(lambda x: int_conversion[x])
    defaults += [a.ix[a.index[0]]]

Xfuture = []
for default in defaults:
    for date in dates:
        x = np.array(default)
        x[0] = date.year
        x[1] = date.month
        x[2] = date.weekday()
        x[3] = date.timetuple().tm_yday
        Xfuture += [x]

Xfuture = np.array(Xfuture)
predictedfuture = regressor.predict(Xfuture)
Z = predictedfuture.reshape(len(decheteries),nb_days)
# plt.pcolor(Z, edgecolors='k', linewidths=1)
# plt.show()

# output predictions
dates_string=map(lambda x: x.strftime("%Y-%m-%d"),dates)
output = pandas.DataFrame(Z, columns=dates_string, index=decheteries)
output.index.name = "decheterie"
output.to_csv("data/predictions.csv")

feature_importance = regressor.feature_importances_
feature_importance = 100.0 * (feature_importance / feature_importance.max())
sorted_idx = np.argsort(feature_importance)[::-1]
print "100 most important features:"
i=1
for f,w in zip(labels[sorted_idx], feature_importance[sorted_idx]):
    print "%d) %s : %f" % (i, f, w)
    i+=1
    if i > 100: break


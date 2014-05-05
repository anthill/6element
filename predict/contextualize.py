#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pandas
import glob
import re
import datetime
from datetime import date, timedelta as td
import numpy as np

daily = pandas.read_csv("data/temporal_daily.csv",index_col=0, parse_dates=[0])

# unpivot table (date, decheterie1, decheterie2,...) => (date, nom_decheterie, affluence)
N, K = daily.shape
data = {'frequence' : daily.values.ravel('F'),
        'nom_decheterie' : np.asarray(daily.columns).repeat(N),
        'date' : np.tile(np.asarray(daily.index), K)}
learning_table = pandas.DataFrame(data, columns=['date', 'nom_decheterie', 'frequence'])

# adding a year for the predictions
startdate = date(2014,1,1)
enddate = date(2014,12,31)
delta = enddate - startdate
next_year = [startdate + td(days=i) for i in range(delta.days + 1)]
decheteries=  list(set(learning_table["nom_decheterie"]))
dates, nom_decheteries = [],[]
for decheterie in decheteries:
	for d in next_year:
		dates += [d]
		nom_decheteries += [decheterie]

learning_table = learning_table.append(pandas.DataFrame({"date":dates,"nom_decheterie":nom_decheteries,"frequence":np.NaN*np.ones(len(nom_decheteries))}), ignore_index=True)

learning_table["year"] = learning_table["date"].apply(lambda x: x.year)
learning_table["month"] = learning_table["date"].apply(lambda x: x.month)
learning_table["dayofmonth"] = learning_table["date"].apply(lambda x: x.day)
learning_table["dayofweek"] = learning_table["date"].apply(lambda x: x.dayofweek)
learning_table["dayofyear"] = learning_table["date"].apply(lambda x: x.dayofyear)

def add_previous_activity(df, name, timedelta):
	df.index = zip(df.nom_decheterie, df.date)
	shifted_copy = df[["frequence",]].rename(columns={"frequence": name})
	shifted_copy.index = zip(df.nom_decheterie, map(lambda x: x + timedelta, df.date))
	return pandas.merge(df, shifted_copy, left_index=True, how="left", right_index=True)


# learning_table = add_previous_activity(learning_table, "prev_week", datetime.timedelta(days = 7))

def add_previous_activity2(df, name, diff):
	df.index = zip(df.nom_decheterie, df.year, df.month, df.dayofmonth)
	shifted_copy = df[["frequence",]].rename(columns={"frequence": name})
	shifted_copy.index = zip(df.nom_decheterie, map(lambda x : x+diff, df.year), df.month, df.dayofmonth)
	return pandas.merge(df, shifted_copy, left_index=True, how="left", right_index=True)

learning_table = add_previous_activity2(learning_table,"prev_year", 1)
# we replace missing values from 2013 by zero
learning_table["prev_year"] = learning_table["prev_year"].fillna(0)

# from http://catalogue.datalocale.fr/dataset/liste-ctd-cg33/resource/aaafb2dd-feb3-43e2-8b5b-50bb66da75f9
data = pandas.read_csv("data/Opendata_Decheteries_v2.csv", sep=",")
data = data[["Label","Code_Insee", "MOA", "M_CodePostal", "M_Commune", "L", "M", \
	"Me", "J", "V", "S", "D", "D_DV", "D_FER", "D_GRAV", "D_ENC", "D_BOIS", \
	"D_CART", "D_D3E", "D_PLAST", "D_TEXT", "D_DASRI", "DD_HM", "DD_PILES", \
	"DD_DMS", "D_PRO","LAT", "LON"]]
data.replace("VRAI",1, inplace=1)
data.replace("FAUX",0, inplace=1)


corresponds = {
	"Ambares": "Ambares-et-Lagrave",
	"Ambes": "Ambès",
	"Bassens" : "Bassens",
	"Blanquefort": "Blanquefort",
	"Bordeaux Bastide": "Bordeaux - Bastide",
	"Bordeaux Deschamps" : "Bordeaux - Bastide",
	"Bordeaux Queyries": "Bordeaux - Bastide",
	"Bordeaux Paludate": "Bordeaux - Paludate",
	"Bordeaux Surcouf": "Bordeaux - Surcouf",
	"Bordeaux Nord": "Bordeaux - Surcouf",
	"Bruges": "Bruges",
	# "Eysines Mermoz" : ,
	"Gradignan" : "Gradignan",
	"merignac": "Mérignac",
	"Pessac": "Pessac - Beutre",
	"Pessac Gutenberg": "Pessac - Gutemberg",
	"Saint medard": "Saint-Médard-en-Jalles",
	"taillan":"Taillan-Médoc",
	"villenave":"Villenave-d'Ornon",
	"St Mariens" : "Saint-Mariens",
	"St Gervais": "Saint-Gervais",
	"St Paul" :"Saint-Paul",
	"St Aubin":"Saint-aubin-de-Blaye",
}

def clean_name(x):
	if x in corresponds.keys():
		return corresponds[x]
	else:
		return np.NaN

learning_table["Label"] = learning_table["nom_decheterie"].apply(clean_name)
learning_table = learning_table.dropna(subset=["Label"]).drop("nom_decheterie", axis=1)
learning_table = pandas.merge(learning_table, data, how="left", on="Label")

# mean frequence
mean_freq = learning_table[["Label","frequence"]].groupby("Label").mean()
mean_freq["Label"] = mean_freq.index
mean_freq.columns = ["mean_freq", "Label"]
learning_table = pandas.merge(learning_table, mean_freq, how="left", on="Label")

# context from commune
learning_table["INSEE_CODE"] = learning_table["Code_Insee"].apply(int)
learning_table = learning_table.drop("Code_Insee", axis=1)
context = pandas.read_csv("data/french_communes_indicators.gz", sep=",", compression="gzip")
def clean(x):
	try:
		return int(x)
	except:
		return np.NaN

context["INSEE_CODE"] = context["INSEE_CODE"].apply(clean)
context = context.dropna(subset=["INSEE_CODE"])
learning_table = pandas.merge(learning_table, context, how="left", on="INSEE_CODE")


learning_table.to_csv("data/learning_table.csv", index = False)


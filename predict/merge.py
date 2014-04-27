#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pandas
import glob
import re
import datetime
import numpy as np

# merging datasets
data_cub = pandas.read_csv("original_data/cub_dechets.csv", sep=",", parse_dates=[0])

months = {"janvier":1, "fevrier":2, "mars":3, "avril":4, "mai":5, "juin":6, "juillet":7, "aout":8, "septembre": 9, "octobre":10, "novembre":11,"decembre":12}
files = glob.glob("original_data/smicval/HG*.csv")
data_smicval = pandas.DataFrame(columns=["St Mariens", "St Gervais", "St Paul", "St Aubin", "Date"])
for filename in files:
	year = re.search("HG(\d+)\.csv", filename).group(1)
	partial_data = pandas.read_csv(filename, sep=",")
	partial_data["year"] = year
	partial_data["month"] = partial_data["Mois"].apply(lambda x: months[x.lower().replace(" ", "")])
	def to_date(row):
		return datetime.datetime(int(row["year"]), int(row["month"]), int(row["Jour"]))
	partial_data["Date"] = partial_data.apply(to_date, axis=1)
	partial_data = partial_data.drop(["Mois", "NOM_JOUR", "Jour", "year", "month"],axis=1)
	data_smicval = data_smicval.append(partial_data)

data = data_cub.merge(data_smicval,how="left",on="Date")
data.index = data["Date"]
data = data.drop(["Date"], axis=1)
# remove rows where we have no values
data = data.dropna(how="all")
# cleaning values

def cleaner(x):
	try:
		return float(x)
	except:
		return np.NaN

for col in data.columns:
	data[col] = data[col].apply(cleaner)

data=data.sort_index()
# data = data.dropna(axis=1)
data.to_csv("data/temporal_daily.csv")

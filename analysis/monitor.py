#!/usr/bin/python

from matplotlib.pyplot import figure, show
import datetime
import dateutil.parser
import json
import numpy as npy
import os
import pylab as plt
import sys
import urllib

if (len(sys.argv) < 2):
    print "Usage: " + sys.argv[0] + " captor_id"
    print
    print " `-> Prints the hours when too many measures were took for the captor whose id was given in argument."
    print "     A graph is built with one curve by day displaying the number of measures by hour"
    print
    exit()

captor = sys.argv[1]

secret_json = os.path.dirname(os.path.abspath(__file__)) + "/../PRIVATE.json"
with open(secret_json) as configuration_json:
    configuration = json.load(configuration_json)

url = configuration["data_source"] + "/measurements/places?ids=" + captor + "&types=wifi"
measures = json.loads(urllib.urlopen(url).read())
measures.sort(key=lambda arr: arr["date"])

X = range(0, 24)
res = X[:]
last = datetime.datetime.fromtimestamp(0)
before = last
for i in range(0, len(X)):
    res[i] = 0

for i in range(0, len(measures)):
    if (dateutil.parser.parse(measures[i]["date"]).day > last.day) or (dateutil.parser.parse(measures[i]["date"]).month > last.month):
        plt.plot(X, res)
        for j in range(0, len(X)):
            if ((res[j] < 12) and (res[j] > 0)) or (j == 5):
                print "Lack of measures on day " + last.strftime("%Y-%m-%d") + ", at " + str(j) + " o'clock, with " + str(res[j]) + " measures"
            elif (res[j] > 12):
                print "Too many measures on day " + last.strftime("%Y-%m-%d") + ", at " + str(j) + " o'clock, with " + str(res[j]) + " measures"
            res[j] = 0

    res[dateutil.parser.parse(measures[i]["date"]).hour] += 1

    if (int(last.strftime("%Y%m%d%H")) != int(dateutil.parser.parse(measures[i]["date"]).strftime("%Y%m%d%H"))):
        before = last
        last = dateutil.parser.parse(measures[i]["date"])

plt.show()

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
    print "Usage: " + sys.argv[0] + " place_id"
    print
    print " `-> Prints the hours when too many measures were took for the place whose id was given in argument."
    print "     A graph is built with one curve by day displaying the number of measures by hour"
    print
    exit()

place_id = sys.argv[1]

# Opening configuration, needed for selecting the API's source
secret_json = os.path.dirname(os.path.abspath(__file__)) + "/../PRIVATE.json"
with open(secret_json) as configuration_json:
    configuration = json.load(configuration_json)

# Loading measures for the selected place, and sorting them by date
# beacause we will need to process each measure in order
url = configuration["data_source"] + "/measurements/places?ids=" + place_id + "&types=wifi"
measures = json.loads(urllib.urlopen(url).read())
measures.sort(key = lambda arr: arr["date"])

X = range(0, 24)
res = [0] * len(X)
last = datetime.datetime.fromtimestamp(0)
before = last

# Processing for each measure
for measure in measures:
    measure_date = dateutil.parser.parse(measure["date"])

    # If the date has changed, we have to process the last day's data
    if (measure_date.day > last.day) or (measure_date.month > last.month):

        # Adding plot to the chart
        plt.plot(X, res)
        
        # Display contradictions in measures counts, by hour
        for index, nb_in_an_hour in enumerate(res):
            date_log = last.strftime("%Y-%m-%d") + ", at " + str(index) + " o'clock, with " + str(nb_in_an_hour) + " measures"
            if ((nb_in_an_hour < 12) and (nb_in_an_hour > 0)):
                print "Lack of measures on day " + date_log
            elif (nb_in_an_hour > 12):
                print "Too many measures on day " + date_log
            res[index] = 0

    # Counting the measure on the current day, in the concerned hour
    res[measure_date.hour] += 1

    if (int(last.strftime("%Y%m%d%H")) != int(measure_date.strftime("%Y%m%d%H"))):
        before = last
        last = measure_date

plt.show()

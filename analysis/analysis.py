#!/usr/bin/python

from matplotlib.pyplot import figure, show
import datetime
import dateutil.parser
import json
import numpy as npy
import os
import pprint
import sys
import urllib
#import pylab as plt

if (len(sys.argv) == 1 or sys.argv[1] == "-h"):
    print "Usage: " + sys.argv[0] + " json_output [csv_output]"
    print
    print " `-> Print the analysis as json into the json_output file, and,"
    print "     if another file is given, write as CSV the informations concerning"
    print "     the maximum amount of WiFi devices measured by day, by captor, into"
    print "     the csv_output file."
    print
    exit()

secret_json = os.path.dirname(os.path.abspath(__file__)) + "/../PRIVATE.json"
with open(secret_json) as configuration_json:
    configuration = json.load(configuration_json)

pp = pprint.PrettyPrinter(indent=4)
allinfos_url = configuration["data_source"] + "/allPlacesInfos"
allinfos = json.loads(urllib.urlopen(allinfos_url).read())
allcaptors = []
base = datetime.datetime.today()

opening_hours_url = configuration["data_source"] + "/sensor/getAll?s=" + configuration["secret"]
opening_hours = json.loads(urllib.urlopen(opening_hours_url).read())

csv_output = open("/dev/null", "w+")
if (len(sys.argv) > 2):
    csv_output = open(sys.argv[2], "w+")

def nb_measures_expected(captor_id, hour, month, day):
    hour += 1
    if (month > 3) or (month == 3 and day > 27):
        hour += 1
    for captor in opening_hours:
        if (captor["installed_at"] == captor_id):
            if ((hour >= captor["start_hour"]) and (hour < captor["stop_hour"])):
                if (hour == captor["start_hour"]):
                    return 11
                return 12
            return 0
    return 0

csv_output.write("Place, Captor ID")
max_all_days = {}
for x in range(0, 300):
    csv_output.write(", " + (base - datetime.timedelta(days = x)).strftime("%Y-%m-%d"))
    max_all_days[x] = 0
csv_output.write("\n")

for captor in allinfos:
    csv_output.write(captor["name"].encode('utf-8') + ", " + str(captor["id"]))
    print "Processing captor: \"" + captor["name"].encode('utf-8') + "\"..."
    url = configuration["data_source"] + "/measurements/places?ids=" + str(captor["id"]) + "&types=wifi"
    measures = json.loads(urllib.urlopen(url).read())
    measures.sort(key = lambda arr: arr["date"])

    X = range(0, 24)

    date_list = {}
    for x in range(0, 300):
        date_list[(base - datetime.timedelta(days = x)).strftime("%Y-%m-%d")] = []

    last = dateutil.parser.parse("1970-01-01T00:00:00.000Z")
    before = last
    res = [0 for i in range(0, len(X))]
    nb_duplicatas = [0 for i in range(0, len(X))]
    values = [0 for i in range(0, len(X))]
    maximums = []

    for i in range(0, len(measures)):
        if (i > 0) and ((dateutil.parser.parse(measures[i]["date"]).day > last.day)
                or (dateutil.parser.parse(measures[i]["date"]).month > last.month)):
            #plt.plot(X, res)
            max_in_day = 0
            for j in range(0, len(X)):
                if (values[j] > max_in_day):
                    max_in_day = values[j]
                max_all_days[(base.date() - last.date()).days] = max_in_day

                date_list[last.strftime("%Y-%m-%d")].append({
                    "datetime" : last.strftime("%Y-%m-%dT") + str(j) + ":00:00.000Z",
                    "expected" : nb_measures_expected(captor["id"], j, last.month, last.day),
                    "nb" : res[j],
                    "nb_uniques" : res[j] - nb_duplicatas[j],
                    "max_measures" : values[j]})

                res[j] = 0
                nb_duplicatas[j] = 0
                values[j] = 0

        res[dateutil.parser.parse(measures[i]["date"]).hour] += 1
        if (values[dateutil.parser.parse(measures[i]["date"]).hour] < len(measures[i]["value"])):
            values[dateutil.parser.parse(measures[i]["date"]).hour] = len(measures[i]["value"])

        if (len(maximums) < 10) or (maximums[0]["nb"] < len(measures[i]["value"])):
            maximums.append({
                "nb" : len(measures[i]["value"]),
                "date" : dateutil.parser.parse(measures[i]["date"]).strftime("%Y-%m-%dT")})
            maximums.sort(key = lambda arr: arr["nb"])
            if (len(maximums) > 10):
                maximums = maximums[len(maximums) - 10:]

        if (before == dateutil.parser.parse(measures[i]["date"])):
            nb_duplicatas[dateutil.parser.parse(measures[i]["date"]).hour] += 1
        before = dateutil.parser.parse(measures[i]["date"])
        if (int(last.strftime("%Y%m%d%H")) != int(dateutil.parser.parse(measures[i]["date"]).strftime("%Y%m%d%H"))):
            last = dateutil.parser.parse(measures[i]["date"])

    allcaptors.append({
        "captor" : captor["id"],
        "name" : captor["name"].encode("utf-8"),
        "measures" : date_list,
        "max_measures" : maximums})

    for x in range(0, 300):
        csv_output.write(", " + str(max_all_days[x]))
    csv_output.write("\n");

    #plt.title("Captor " + str(captor["id"]) + " - " + captor["name"])
    #plt.figure()

#plt.show()

json_output = open(sys.argv[1], 'w+')
json_output.write(json.dumps(allcaptors))

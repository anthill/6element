#!/usr/bin/python

from matplotlib.pyplot import figure, show
import datetime
import dateutil.parser
import json
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
    print "     the maximum amount of WiFi devices measured by day, by sensor, into"
    print "     the csv_output file."
    print
    exit()

secret_json = os.path.dirname(os.path.abspath(__file__)) + "/../PRIVATE.json"
with open(secret_json) as configuration_json:
    configuration = json.load(configuration_json)

pp = pprint.PrettyPrinter(indent=4)
places_url = configuration["data_source"] + "/allPlacesInfos"
places = json.loads(urllib.urlopen(places_url).read())
allsensors = []
base = datetime.datetime.today()

opening_hours_url = configuration["data_source"] + "/sensor/getAll?s=" + configuration["secret"]
opening_hours = json.loads(urllib.urlopen(opening_hours_url).read())

csv_output = open("/dev/null", "w+")
if (len(sys.argv) > 2):
    csv_output = open(sys.argv[2], "w+")

def nb_measures_expected(place_id, hour, month, day):
    hour += 1
    if (month > 3) or (month == 3 and day > 27):
        hour += 1
    for sensor in opening_hours:
        if (sensor["installed_at"] == place_id):
            if ((hour >= sensor["start_hour"]) and (hour < sensor["stop_hour"])):
                if (hour == sensor["start_hour"]):
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

for sensor in places:
    csv_output.write(sensor["name"].encode('utf-8') + ", " + str(sensor["id"]))
    print "Processing sensor: \"" + sensor["name"].encode('utf-8') + "\"..."
    url = configuration["data_source"] + "/measurements/places?ids=" + str(sensor["id"]) + "&types=wifi"
    measures = json.loads(urllib.urlopen(url).read())
    measures.sort(key = lambda arr: arr["date"])

    X = range(0, 24)

    date_list = {}
    for x in range(0, 300):
        date_list[(base - datetime.timedelta(days = x)).strftime("%Y-%m-%d")] = []

    last = dateutil.parser.parse("1970-01-01T00:00:00.000Z")
    before = last
    res = [0] * len(X)
    nb_duplicatas = [0] * len(X)
    values = [0] * len(X)
    maximums = []

    for measure in enumerate(measures):
        measure_date = dateutil.parser.parse(measure["date"])
        if (i > 0) and ((measure_date.day > last.day)
                or (measure_date.month > last.month)):
            #plt.plot(X, res)
            max_in_day = 0
            for j in range(0, len(X)):
                if (values[j] > max_in_day):
                    max_in_day = values[j]
                max_all_days[(base.date() - last.date()).days] = max_in_day

                date_list[last.strftime("%Y-%m-%d")].append({
                    "datetime" : last.strftime("%Y-%m-%dT") + str(j) + ":00:00.000Z",
                    "expected" : nb_measures_expected(sensor["id"], j, last.month, last.day),
                    "nb" : res[j],
                    "nb_uniques" : res[j] - nb_duplicatas[j],
                    "max_measures" : values[j]})

                res[j] = 0
                nb_duplicatas[j] = 0
                values[j] = 0

        res[measure_date.hour] += 1
        if (values[measure_date.hour] < len(measure["value"])):
            values[measure_date.hour] = len(measure["value"])

        if (len(maximums) < 10) or (maximums[0]["nb"] < len(measure["value"])):
            maximums.append({
                "nb" : len(measure["value"]),
                "date" : measure_date.strftime("%Y-%m-%dT")})
            maximums.sort(key = lambda arr: arr["nb"])
            if (len(maximums) > 10):
                maximums = maximums[len(maximums) - 10:]

        if (before == measure_date):
            nb_duplicatas[measure_date.hour] += 1
        before = measure_date
        if (int(last.strftime("%Y%m%d%H")) != int(measure_date.strftime("%Y%m%d%H"))):
            last = measure_date

    allsensors.append({
        "sensor" : sensor["id"],
        "name" : sensor["name"].encode("utf-8"),
        "measures" : date_list,
        "max_measures" : maximums})

    for x in range(0, 300):
        csv_output.write(", " + str(max_all_days[x]))
    csv_output.write("\n");

    #plt.title("Captor " + str(sensor["id"]) + " - " + sensor["name"])
    #plt.figure()

#plt.show()

print "Writing JSON..."
json_output = open(sys.argv[1], 'w+')
json_output.write(json.dumps(allsensors))

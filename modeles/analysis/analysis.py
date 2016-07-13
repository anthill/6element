#!/usr/bin/python

from multiprocessing import Pool
import datetime
import dateutil.parser
import grequests
import json
import os
import pprint
import sys
import urllib

# Help message
if (len(sys.argv) == 1 or sys.argv[1] == "-h"):
    print "Usage: " + sys.argv[0] + " json_output [csv_output]"
    print
    print " `-> Print the analysis as json into the json_output file, and,"
    print "     if another file is given, write as CSV the informations concerning"
    print "     the maximum amount of WiFi devices measured by day, by sensor, into"
    print "     the csv_output file."
    print
    exit()

def json_from_file(relative_path):
    with open(os.path.dirname(os.path.abspath(__file__)) + "/" + relative_path) as fs:
        return json.load(fs)

# Loading all sensors' datas
places = json_from_file("/../sensors/all_places_infos.json")
opening_hours = json_from_file("../sensors/opening_hours.json")

allsensors = []
base = datetime.datetime.today()
pp = pprint.PrettyPrinter(indent = 4)
X = range(0, 24)

# Analyzing dates up to 300 days back
date_list = {}
for x in range(0, 300):
    date_list[(base - datetime.timedelta(days = x)).strftime("%Y-%m-%d")] = []

# This function returns the expected number of measures at a specific hour (UTC) from a particular date
# It considers the jet lag from France, from summer or winter
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

# Creating streams to prepare the download of data in JSON from the API
def retrieve_sensors_data(sensor):
    # Loading all the measures and sorting them by date, to process them in order
    url = configuration["data_source"] + "/measurements/places?ids=" + str(sensor["id"]) + "&types=wifi"
    return grequests.get(url)

# Processing statistics from the JSON got from the API
def process_sensor(sensor, measures):
    # If there was an error retrieving data (via the API)
    if len(measures) == 0:
        print "Fatal error retrieving sensor data for \"" + sensor["name"].encode('utf-8') + "\""
        return ("", "")

    print "Processing sensor: \"" + sensor["name"].encode('utf-8') + "\"..."

    # Inits
    last = dateutil.parser.parse("1970-01-01T00:00:00.000Z")
    before = last
    maximums = []
    nb_duplicatas = [0] * len(X)
    res = [0] * len(X)
    values = [0] * len(X)
    max_all_days = [0] * 300

    for i, measure in enumerate(measures):
        measure_date = dateutil.parser.parse(measure["date"])
        if (i > 0) and ((measure_date.day > last.day)
                or (measure_date.month > last.month)):

            max_in_day = 0
            for j in range(0, len(X)):

                # Retrieving the maximum of WiFi emitters in a day
                if (values[j] > max_in_day):
                    max_in_day = values[j]
                max_all_days[(base.date() - last.date()).days] = max_in_day

                # Appending this hours' datas to the JSON
                date_list[last.strftime("%Y-%m-%d")].append({
                    "datetime" : last.strftime("%Y-%m-%dT") + str(j) + ":00:00.000Z",
                    "expected" : nb_measures_expected(sensor["id"], j, last.month, last.day),
                    "nb" : res[j],
                    "nb_uniques" : res[j] - nb_duplicatas[j],
                    "max_measures" : values[j]})

                # Reset
                res[j] = 0
                nb_duplicatas[j] = 0
                values[j] = 0

        # Counting the number of measures, and getting the maximum of WiFi emitters by hour
        res[measure_date.hour] += 1
        if (values[measure_date.hour] < len(measure["value"])):
            values[measure_date.hour] = len(measure["value"])

        # Modifying array of maximums
        if (len(maximums) < 10) or (maximums[0]["nb"] < len(measure["value"])):
            maximums.append({
                "nb" : len(measure["value"]),
                "date" : measure_date.strftime("%Y-%m-%dT")})
            maximums.sort(key = lambda arr: arr["nb"])
            if (len(maximums) > 10):
                maximums = maximums[len(maximums) - 10:]

        # Checking if we've got measures from the same date twice
        if (before == measure_date):
            nb_duplicatas[measure_date.hour] += 1
        before = measure_date
        if (int(last.strftime("%Y%m%d%H")) != int(measure_date.strftime("%Y%m%d%H"))):
            last = measure_date

    # Appending to JSON all data of the concerned sensor
    json_content = {
        "sensor"       : sensor["id"],
        "name"         : sensor["name"].encode("utf-8"),
        "measures"     : date_list,
        "max_measures" : maximums}

    # Printing maximums of WiFi emitters for these 300 days back
    csv_content = sensor["name"].encode('utf-8') + "," + str(sensor["id"])
    for x in range(0, 300):
        csv_content += "," + str(max_all_days[x])
    csv_content += "\n"

    return (json_content, csv_content)

# This function will output into files given in parameters
def final_writes(res):
    final_json = []

    # Opening the CSV file to save measures' counts to
    csv_output = open("/dev/null", "w+")
    if (len(sys.argv) > 2):
        csv_output = open(sys.argv[2], "w+")

    # Printing head of the CSV
    csv_output.write("Place, Captor ID")
    for x in range(0, 300):
        csv_output.write("," + (base - datetime.timedelta(days = x)).strftime("%Y-%m-%d"))
    csv_output.write("\n")

    # Printing body of the CSV and building JSON
    for json_data, csv_data in res:
        csv_output.write(csv_data)
        final_json.append(json_data)

    # Opening and writing JSON to save stats to
    print "Writing JSON..."
    json_output = open(sys.argv[1], 'w+')
    json_output.write(json.dumps(final_json))

# This function will be given as parameter to the thread pool
def parallelize(sensor):
    return process_sensor(sensor, json_from_file("../sensors/sensor-" + str(sensor["id"]) + "_wifi.json"))

# Processing datas in multithread
processed_sensors_res = Pool(len(places) / 2).map(parallelize, places)
final_writes(processed_sensors_res)

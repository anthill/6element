#!/usr/bin/python

from multiprocessing import Pool
import pandas as pd
import datetime
import dateutil.parser
import json
import os
import sys

# Help message
if (len(sys.argv) == 1 or sys.argv[1] == "-h") and 0 == 1:
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

    url = configuration["data_source"] + "/measurements/places?ids=" + str(sensor["id"]) + "&types=wifi"
    return grequests.get(url)

def retrieve_hour(measure):
    date = dateutil.parser.parse(measure["date"])
    return date.strftime("%Y-%m-%dT%H:00:00.000Z")

def retrieve_nb_measured(measure):
    return len(measure["value"])

# Processing statistics from the JSON got from the API
def process_sensor(sensor, measures):
    measures

    if (len(measures) == 0):
        print "No measures acquired for " + sensor["name"].encode("utf-8") + ", aborting process for the sensor..."
        return (None)

    print "Processing sensor: \"" + sensor["name"].encode("utf-8") + "\"..."

    # Building dataset
    df = pd.DataFrame(data = list(zip(map(retrieve_hour, measures), map(retrieve_nb_measured, measures))), columns = ["Date", "Nb measured"])
    df["Expected"] = df.apply(lambda df: nb_measures_expected(sensor["id"], dateutil.parser.parse(df["Date"]).hour, dateutil.parser.parse(df["Date"]).month, dateutil.parser.parse(df["Date"]).day), axis = 1)
    df = df[df["Expected"] > 0]
    df = df.groupby("Date").median()
    del df["Expected"]

    # Output the mean number of people spotted by hour
    df.to_excel("dataset_sensor-" + str(sensor["id"]) + ".xls")

    return (df)

# This function will be given as parameter to the thread pool
def parallelize(sensor):
    return process_sensor(sensor, json_from_file("../sensors/sensor-" + str(sensor["id"]) + "_wifi.json"))

# Processing datas in multithread
processed_sensors_res = Pool(len(places) / 2).map(parallelize, places)

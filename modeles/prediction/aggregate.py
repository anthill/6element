#!/usr/bin/ipython

from multiprocessing import Pool
import pandas as pd
import datetime
import dateutil.parser
import json
import os
import sys
import math

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
week_day = {"Mon": 0,
        "Tue": 1,
        "Wed": 2,
        "Thu": 3,
        "Fri": 4,
        "Sat": 5,
        "Sun": 6}

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
    date = date - datetime.timedelta(minutes = date.minute, seconds = date.second, microseconds = date.microsecond)
    return date

def retrieve_nb_measured(measure):
    return len(measure["value"])

def get_level(median, nb):
    if (nb <= median):
        return (0)
    if (nb <= 2 * median):
        return (1)
    return (2)

def get_prev(df, date):
    date = date - datetime.timedelta(hours = 1)
    if (date in df.index):
        return df.loc[date]["Nb_measured"]
    return 0

# Processing statistics from the JSON got from the API
def process_sensor(sensor, measures):

    # If no measures were retrieved
    if (len(measures) == 0):
        print "No measures acquired for " + sensor["name"].encode("utf-8") + ", aborting process for the sensor..."
        return (None)

    print "Processing sensor: \"" + sensor["name"].encode("utf-8") + "\"..."

    # Building dataset
    df = pd.DataFrame(data = list(zip(map(retrieve_hour, measures), map(retrieve_nb_measured, measures))), columns = ["Date", "Nb_measured"])
    median = math.ceil(df["Nb_measured"].median() + 0.01)
    df = df.groupby("Date").mean()

    # Removing measures when it's closed
    df["Expected"] = df.apply(lambda row: nb_measures_expected(sensor["id"], row.name.hour, row.name.month, row.name.day), axis = 1)
    df = df[df["Expected"] > 0]
    del df["Expected"]

    # Adding features
    df["Previous"] = df.apply(lambda row: get_prev(df, row.name), axis = 1)
    df["Day_of_week"] = df.apply(lambda row: week_day[row.name.strftime("%a")], axis = 1)
    df["Hour_of_day"] = df.apply(lambda row: row.name.hour, axis = 1)
    df["Month"] = df.apply(lambda row: row.name.month, axis = 1)
    df["Level"] = df.apply(lambda row: get_level(median, row["Nb_measured"]), axis = 1)

    # Output the mean number of people spotted by hour
    df.to_csv("dataset_sensor-" + str(sensor["id"]) + ".csv")

    return (df)

# This function will be given as parameter to the thread pool
def parallelize(sensor):
    return process_sensor(sensor, json_from_file("../sensors/sensor-" + str(sensor["id"]) + "_wifi.json"))

# Processing datas in multithread
processed_sensors_res = Pool(len(places) / 2).map(parallelize, places)

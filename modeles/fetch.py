#!/usr/bin/python

import urllib
import os
import json

def save_to_file(relative_path, data):
    fs = open(os.path.dirname(os.path.abspath(__file__)) + "/" + relative_path, 'w+')
    fs.write(data)

def retrieve_data(sensor):
    data = json.loads(urllib.urlopen(configuration["data_source"] + "/measurements/places?ids=" + str(sensor["id"]) + "&types=wifi").read())
    data.sort(key = lambda arr: arr["date"])
    return json.dumps(data)

# Loading configuration, needed for data_source and secret
secret_json = os.path.dirname(os.path.abspath(__file__)) + "/../PRIVATE.json"
with open(secret_json) as configuration_json:
    configuration = json.load(configuration_json)

# Fetching infos of all places
places_url = configuration["data_source"] + "/allPlacesInfos"
places = urllib.urlopen(places_url).read()
save_to_file("sensors/all_places_infos.json", places)


# Retrieving datas of opening hours of each places
opening_hours_url = configuration["data_source"] + "/sensor/getAll?s=" + configuration["secret"]
save_to_file("sensors/opening_hours.json", urllib.urlopen(opening_hours_url).read())

map(lambda sensor: save_to_file("sensors/sensor-" + str(sensor["id"]) + "_wifi.json", retrieve_data(sensor)), json.loads(places))

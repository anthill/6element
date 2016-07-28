#!/usr/bin/python
# coding: utf8

from BeautifulSoup import BeautifulSoup
import datetime
import grequests
import json
import os
import sys
import pandas
import re
import urllib2

def parse(day, month, year):
    # try:
        soup = BeautifulSoup(urllib2.urlopen("http://www.meteociel.fr/temps-reel/obs_villes.php?code2=7510&jour2=%s&mois2=%s&annee2=%s&envoyer=OK" % (day, month-1, year)).read())

        a = soup('table', {'width': '100%', "border":"1", "cellpadding":"1" ,"cellspacing":"0", "bordercolor":"#C0C8FE" ,"bgcolor":"#EBFAF7"})[0]

        b = a.findAll("tr")

        output = pandas.DataFrame(columns=['windchill', 'humidex', 'visibility', 'pressure', 'precipitation', 'temperature', 'hour', 'gust', 'humidity', 'nebulosity', 'wind'])
        for line in b[1:]:
            rows = line.findAll("td")
            values = map(lambda x: x.text, rows)


            if values[11] == "aucune":
                precipitation = 0.0
            else:
                try:
                    precipitation = float(values[11].split(" ")[0])
                except:
                    precipitation = 0.0

            try:
                nebulosity = int(values[1].split("/")[0])
            except:
                nebulosity = 0

            weather = 0
            if " faible" in values[2]:
                weather = 1
            if u" modéré" in values[2]:
                weather = 2
            if " fort" in values[2]:
                weather = 3

            weather_type = 0
            if " pluie" in values[2]:
                weather_type = 1
            if " neige" in values[2]:
                weather_type = 2

            try:
                visibility = float(values[3].split(" ")[0])
            except:
                visibility = 0.

            try:
                temperature = float(values[4].split(" ")[0])
            except:
                temperature = 0.

            try:
                humidity = float(values[5][:2])
            except:
                humidity = 0.

            try:
                humidex = float(values[6])
            except:
                humidex = 0.

            try:
                windchill = float(values[7].split(" ")[0])
            except:
                windchill = 0.

            try:
                wind = float(values[9].split(" ")[0])
            except:
                wind = 0.

            try:
                gust = float(values[9].split("(")[1].split(" ")[0])
            except:
                gust = 0.

            try:
                pressure = float(values[10].split(" ")[0])
            except:
                pressure = 0.

            output = output.append({"hour": int(values[0].split(" ")[0]),
                "nebulosity": nebulosity,
                "visibility": visibility,
                "temperature": temperature,
                "humidity": humidity,
                "humidex": humidex,
                "windchill": windchill,
                "wind": wind,
                "gust": gust,
                "pressure": pressure,
                "precipitation": precipitation,
                "weather": weather + weather_type,
                "weather_quality": weather,
                "weather_type": weather_type
            }, ignore_index=True)

        return output.sort_values(by = "hour")
    # except Exception,e:
    #     print "error: ", day, month, year
    #     print e
    #     return pandas.DataFrame(columns=['windchill', 'humidex', 'visibility', 'pressure', 'precipitation', 'temperature', 'hour', 'gust', 'humidity', 'nebulosity', 'wind'])


def save_to_file(relative_path, data):
    print "   - Saving into " + relative_path
    fs = open(os.path.dirname(os.path.abspath(__file__)) + "/" + relative_path, 'w+')
    fs.write(data)

def order_data(res):
    data = json.loads(res)
    data.sort(key = lambda arr: arr["date"])
    return json.dumps(data)

# Loading configuration, needed for data_source and secret
secret_json = os.path.dirname(os.path.abspath(__file__)) + "/../PRIVATE.json"
with open(secret_json) as configuration_json:
    configuration = json.load(configuration_json)

print
print "Fetching infos of all places..."
places_url = configuration["data_source"] + "/allPlacesInfos"
places = urllib2.urlopen(places_url).read()
print "  Saving..."
save_to_file("sensors/all_places_infos.json", places)


print
print "Retrieving datas of openinging hours of all places"
opening_hours_url = configuration["data_source"] + "/sensor/getAll?s=" + configuration["secret"]
print "  Saving..."
save_to_file("sensors/opening_hours.json", urllib2.urlopen(opening_hours_url).read())

json_places = json.loads(places)


print
print "Fetching measures for each places..."
requests = map(lambda place: grequests.get(configuration["data_source"] + "/measurements/places?ids=" + str(place["id"]) + "&types=wifi"), json_places)
results = grequests.map(requests)
print "  Saving..."
map(lambda (index, result): save_to_file("sensors/sensor-" + str(json_places[index]["id"]) + "_wifi.json", order_data(result.content)), enumerate(results))

print
print "Fetching infos of each places..."
places_infos_requests = map(lambda place: grequests.get("http://6element.fr/place/" + str(place["id"])), json_places)
places_infos = grequests.map(places_infos_requests)
print "  Saving..."
map(lambda (index, result): save_to_file("sensors/opening_hours-" + str(json_places[index]["id"]) + ".json", result.content), enumerate(places_infos))

print
print "Fetching weather forecasts"
startdate = datetime.date(2015,10,1)
enddate = datetime.datetime.now().date()
delta = enddate - startdate
days = [startdate + datetime.timedelta(days=i) for i in range(delta.days + 1)]
weather_forecast = {}

for i, mydate in enumerate(days):
    sys.stdout.write('\r  ' + str(i * 100 / len(days) + 1) + '%')
    sys.stdout.flush()
    res = parse(mydate.day, mydate.month, mydate.year)
    try:
        weather_forecast[str(mydate.year)]
    except:
        weather_forecast[str(mydate.year)] = {}
    try:
        weather_forecast[str(mydate.year)][str(mydate.month)]
    except:
        weather_forecast[str(mydate.year)][str(mydate.month)] = {}
    res["day"]= mydate.day
    res["month"] = mydate.month
    res["year"] = mydate.year
    res.set_index("hour")
    weather_forecast[str(mydate.year)][str(mydate.month)][str(mydate.day)] = json.loads(res.to_json())

sys.stdout.write('\r')
sys.stdout.flush()
save_to_file("./sensors/weather.json", json.dumps(weather_forecast))

print
print "Done!"

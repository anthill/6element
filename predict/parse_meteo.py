import urllib2
from BeautifulSoup import BeautifulSoup
import re
import pandas
from datetime import date, timedelta as td

def parse(day, month, year):
    try:
        soup = BeautifulSoup(urllib2.urlopen("http://www.meteociel.fr/temps-reel/obs_villes.php?code2=7510&jour2=%s&mois2=%s&annee2=%s&envoyer=OK" % (day, month-1, year)).read())

        a = soup('table', {'width': '100%', "border":"1", "cellpadding":"1" ,"cellspacing":"0", "bordercolor":"#C0C8FE" ,"bgcolor":"#EBFAF7"})[0]

        b = a.findAll("tr")

        output = pandas.DataFrame(columns=['windchill', 'humidex', 'visibility', 'pressure', 'precipitation', 'temperature', 'hour', 'gust', 'humidity', 'nebulosity', 'wind'])
        for line in b[1:]:
            rows = line.findAll("td")
            values = map(lambda x: x.text, rows)


            if values[11] == "aucune":
                precipitation=0.0
            else:
                precipitation = float(values[11].split(" ")[0])

            output = output.append( {"hour": int(values[0].split(" ")[0]),
            "nebulosity": int(values[1].split("/")[0]),
            "visibility": float(values[3].split(" ")[0]),
            "temperature": float(values[4].split(" ")[0]),
            "humidity": float(values[5][:2]),
            "humidex": float(values[6]),
            "windchill": float(values[7].split(" ")[0]),
            "wind": float(values[9].split(" ")[0]),
            "gust": float(values[9].split("(")[1].split(" ")[0]),
            "pressure": float(values[10].split(" ")[0]),
            "precipitation": precipitation
            }, ignore_index=True)

        return output
    except:
        return pandas.DataFrame(columns=['windchill', 'humidex', 'visibility', 'pressure', 'precipitation', 'temperature', 'hour', 'gust', 'humidity', 'nebulosity', 'wind'])


startdate = date(2006,1,1)
enddate = date(2014,5,1)
delta = enddate - startdate
days = [startdate + td(days=i) for i in range(delta.days + 1)]

final = pandas.DataFrame(columns=["year","month","day", 'windchill', 'humidex', 'visibility', 'pressure', 'precipitation', 'temperature', 'hour', 'gust', 'humidity', 'nebulosity', 'wind'])
for mydate in days:
    print mydate
    res = parse(mydate.day, mydate.month, mydate.year)
    res["day"]= mydate.day
    res["month"] = mydate.month
    res["year"] = mydate.year
    final = final.append(res, ignore_index=True)


final.to_csv("data/meteo.csv", index=False)

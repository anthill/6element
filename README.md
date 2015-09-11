# 6element

6element is a open innovation project of waste optimisation. **[Learn more](http://ants.builders/pages/6element.html)**


The 6element server's goal is to receive data from distant sensors, to store it and to provide interfaces for data visualisation and sensor-administration.

*You can find the source code for sensors in [6brain](https://github.com/anthill/6brain)*

In order to do so, the server is composed of 4 docker containers communicating with each other.

### The database.

This is the memory of the server. It stores every places informations, what sensors are attached to them, but also measurements and status from theses sensors.

### The reception server (or TCP endpoint).

Its role is to act as a door between internal containers and distant sensors.

It receives data from sensors, stores it into the database, and then send it to the appropriate web-server (admin or map).

It can also receive some commands to send to a sensor from the admin server.

### The Map server.

It's the web server wich handle the measurement visualisation through a map.

### The Admin server.

It's the web server which provide an administration interface for sensors. Admins can add/delete places, add/delete sensors, send commands, see sensors status...


### In short :

Here's a schema showing the server architecture, with technologies and port used for communication.

![Image Alt](https://docs.google.com/drawings/d/11Lo_nfxXwXgdULOm_AK2A0_dp0pDNQIAllBRFUpYLJ8/pub?w=960&h=720)



## Getting started :

* Install [docker](https://docs.docker.com/) and [docker-compose](http://docs.docker.com/compose/install/)

* Make sure to have the port 5100 opened.

* clone the repository :

```
git clone git@github.com:anthill/6element.git
cd 6element
```

* Install [Node](https://github.com/nodesource/distributions#installation-instructions), then [gulp](http://gulpjs.com/) on your machine

```
npm install gulp -g
```


* Copy / Create the file `core/PRIVATE.json` containing

```
{
	"secret": "...", // Key for the admin url
    "mapbox_token": "...",
    "mapId": "..."
}
```

* Install dependencies locally (this is mainly to enable automated lint functionality)

````
cd core
npm install
````

* build the docker containers : 

```
gulp rebuild-db
docker-compose -f compose-prod.yml build
docker-compose -f compose-prod.yml up
```

* Build the database : `gulp rebuild-db`

	*When it says you that the database has been reseted, you can stop it.*

* Start the server : `docker-compose -f compose-prod.yml up -d`


## Daily dev routine

````js
gulp dev # This starts the docker dev containers (with volume to code in host) and watches files for rebuild in host
````







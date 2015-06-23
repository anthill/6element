## Scope

6element is a open innovation project of waste optimisation.
[Learn more](http://ants.builders/pages/6element.html)

### Running in dev mode

To have automatic reload of the server and rebuild of the frontend use:
```
docker-compose -f compose-dev.yml build
docker-compose -f compose-dev.yml up
```

### Pushing in production

First stop and clean:

```
docker-compose -f compose-prod.yml stop
docker-compose -f compose-prod.yml rm
```

then you only need to:

```
docker-compose -f compose-prod.yml build --no-cache
docker-compose -f compose-prod.yml up --no-deps -d
```

#### Getting started

Initialization

You can install [npm](https://github.com/nodesource/distributions#install-nodejs) 
and [docker](https://docs.docker.com/installation/ubuntulinux/#installing-docker-on-ubuntu)


````
git clone git@github.com:anthill/6element.git
cd 6element
npm install
````

Then, you must copy create the missing file

````
cp client/src/mapbox-credentials.json.example client/src/mapbox-credentials.json
````

Sign up to [mapbox](https://www.mapbox.com/)

Copy your default API access token and paste it in `/client/srcmapbox-creadentials.json` 

Create a new map (or use the default one) and copy its map ID and paste it in the same file.


````
npm run watch
````

In a new console

```
npm start
````

You can now open the returned URL




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

To create the db:

```
docker-compose -f compose-init.yml up
```
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

Then, you must copy/create the missing file `PRIVATE.json` situated in the `app` folfer containing:

````
{
    "twiliossi": "...",
    "twiliopwd": "...",
    "mapbox_token": "...",
    "mapId": "..."
}
````


````
npm run watch
````

In a new console

```
npm start
````

You can now open the returned URL




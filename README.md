# Scope

6element is a open innovation project of waste optimisation.
[Learn more](http://ants.builders/pages/6element.html)

## Getting started

### Preambule

Install [node and npm](https://github.com/nodesource/distributions#install-nodejs) and [docker](https://docs.docker.com/installation/ubuntulinux/#installing-docker-on-ubuntu)

````
git clone git@github.com:anthill/6element.git
cd 6element
npm install
````

Then, you must copy/create the missing file `PRIVATE.json` situated in the `app` folder containing:

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

## Running in dev mode

To have automatic reload of the server and rebuild of the frontend use:
```
docker-compose -f compose-dev.yml build
docker-compose -f compose-dev.yml up
```

### Anytime the database model is changed

Run `node-sql-generate` to re-generate `database/management/declarations.js`. To do so, enter the `6element` container (`docker exec -ti CONTAINER_ID bash` + maybe do `cd app`) and run `npm run sql-generate`.



## Pushing to production

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






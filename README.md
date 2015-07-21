# Scope

6element is a open innovation project of waste optimisation.
[Learn more](http://ants.builders/pages/6element.html)

### Getting started

#### Preambule

````
git clone git@github.com:anthill/6element.git
cd 6element
````

Copy/create the missing file `PRIVATE.json` situated in the `app` folder containing:

````
{
    "twiliossi": "...",
    "twiliopwd": "...",
    "mapbox_token": "...",
    "mapId": "..."
}
````

## Running in dev mode

To have automatic reload of the server and rebuild of the frontend use as well as fake data automatically populated:

```
docker-compose -f compose-dev.yml build
docker-compose -f compose-dev.yml up
```

## Pushing to production

First build the database separately:

```
docker-compose -f compose-init.yml up
```

then you only need to:

```
docker-compose -f compose-prod.yml up -d
```






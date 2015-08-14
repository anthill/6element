# Scope

6element is a open innovation project of waste optimisation.
[Learn more](http://ants.builders/pages/6element.html)

### Getting started

#### Preambule

````
git clone git@github.com:anthill/6element.git
cd 6element
````

Copy/create the missing file `PRIVATE.json` situated in the `core` folder containing:

````
{
    "twiliossi": "...",
    "twiliopwd": "...",
    "mapbox_token": "...",
    "mapId": "..."
}
````

Install dependencies locally (this is mainly to enable automated lint functionality)
````
cd core
npm install
````


## Running in dev mode

To have automatic reload of the server and rebuild of the frontend use as well as fake data automatically populated:

```
docker-compose -f compose-dev.yml build
docker-compose -f compose-dev.yml up
```

## Pushing to production

If you want to clear (and lose all the data) because you changed the schema or for whatever reason you can drop and create the db as well as rewrite the `declaration.js`:

```
docker-compose -f rebuild-db.yml up
```

To load some data at initialisation just specify, in the `rebuild-db.yml`, the path of the dump placed in the `app/data/backups` folder (it will automatically do the job).

When you only want to restart the service use:

```
docker-compose -f compose-prod.yml up -d
```






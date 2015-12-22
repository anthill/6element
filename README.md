# 6element

6element is a open innovation project of waste optimisation. **[Learn more](https://medium.com/ants-blog/6element-534ffbe2a60f#.wd3yf7ez6)**

## Getting started


### Dependencies

Install:
* Docker
* Node.js

the use `npm install` to install all the dependencies.
Create a `Tokens.json` following the [example](Tokens.example.json)



### Initialize the database

There are two way of loading the places in the db.

#### Load with files

Put your datafiles in `data`, then do:

```
npm run serve-dev

# then in another window
docker exec 6elementdev_api_1 tools/init-database.js
docker exec 6elementdev_api_1 tools/loadFiles.js
```

in production you can use `npm run start` and change the names of the containers in the exec commands.

#### Load from a backup

In dev, `./backups` is linked to `/backups` and in prod, `/data/6element/backups` is linked to `/backups` where automatic backups (at 3AM) are persisted.
At anytime you can backup the db using

```
docker exec 6elementdev_api_1 tools/backup.js > backups/test.sql
```

to load it back **you must put it in your backups folder and give the path inside the container**:

```
docker exec 6elementdev_api_1 tools/restore.js /backups/test.sql
```

you can also use a gziped file (comming from the automated backup for example).


### Running the app

#### Daily routine in dev

```
npm run start-dev 
```


### Deploying in production

````
npm run prod
````



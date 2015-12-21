# 6element

6element is a open innovation project of waste optimisation. **[Learn more](https://medium.com/ants-blog/6element-534ffbe2a60f#.wd3yf7ez6)**


## Getting started

### Dependencies

Install:
* Docker
* Node.js


### First use

````
npm install
````

#### Initialize the database

Put your datafiles in `data`, then do:

```
npm run serve-dev # or npm run serve-prod in production environment

# then in another window
docker exec 6element_backup_1 tools/init-database.js
docker-compose -f docker-compose-load-db.yml up
```

Create a `Tokens.json` following the [example](Tokens.example.json)


### Daily routine in dev

```
npm run start-dev 
```


### Deploying in production

````
npm start
````


## Database management

A backup-specific docker service is available to be used by a host machine to take care of backups

### Create tables (and drop everything beforehand)

```
docker exec 6element_backup_1 tools/init-database.js
```


### Backup from outside of the container (initaited by a user)

```
docker exec 6element_backup_1 tools/backup.js > backups/.bak
```

`docker exec 6element_backup_1 tools/backup.js` outputs the backup to stdout and is **not compressed**.
What to do with the backup data (file, send to the network, etc.) and when to generate it (daily basis in a cron tab, once, etc.) is left to the caller.

### Automatic backups

A cron job will make a backup everyday at 3AM.

### Restore

The backup docker service has a directory where it expects a single backup file for restore use at `/usr/6element-backups/6element.sql.gz` (in the container, so you don't need to know about this). However, you should provide in the docker-compose file which directory in the host machine corresponds to this directory

```
docker exec 6element_backup_1 tools/restore.js
```


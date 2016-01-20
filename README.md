# 6element

6element is a open innovation project of waste optimisation. **[Learn more](https://medium.com/ants-blog/6element-534ffbe2a60f#.wd3yf7ez6)**

## Getting started


### Dependencies

Install:
* Node.js
* Postgresql

the use `npm install` to install all the dependencies.
Create a `PRIVATE.json` following the [example](PRIVATE.example.json)



### Initialize the database

In the psql console (just type `psql` to access it), you can init your db with:

```
alter user postgres password 'toto';
CREATE DATABASE element OWNER postgres;
```

In your regular console:

```
node tools/init-database.js
```

you can always use `psql` separately to load and dump data:

```
psql -p5432 -U postgres -d element < Desktop/latest.sql
```

### Running the app

#### Daily routine in dev

```
npm run dev 
```


### Deploying in production

````
npm run prod
````



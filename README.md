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

Put your datafiles in `data`, then do:

```
docker-compose -f docker-compose-init-db.yml rm -f
docker-compose -f docker-compose-init-db.yml up
docker-compose -f docker-compose-load-db.yml up
```

Create a `Tokens.json` following the [example](Tokens.example.json)


### Daily routine in dev

```
npm run start-dev 
```


### Deploying in production

````
npm run start-prod
````
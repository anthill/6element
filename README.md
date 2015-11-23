# 6element

6element is a open innovation project of waste optimisation. **[Learn more](http://ants.builders/pages/6element.html)**


## Getting started

Put your datafiles in `data` by doing:

```
docker-compose -f docker-compose-init-db.yml rm -f
docker-compose -f docker-compose-init-db.yml up
docker-compose -f docker-compose-load-db.yml up
docker-compose up --force-recreate
```

Create a `Tokens.json` following the [example](Tokens.example.json)

Add 


then watch the change in your frontend files while you're coding

```
npm install
npm run watch
```

and watch the server 

```
sudo npm install nodemon -g
nodemon --watch server server/index.js
```


simple start

```
npm start
```
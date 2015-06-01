## Scope

6element is a open innovation project of waste optimisation.
[Learn more](http://ants.builders/pages/6element.html)


### Contributing

#### Getting started

Initialization

You can install [npm] (https://github.com/nodesource/distributions#install-nodejs) 
and [docker] (https://docs.docker.com/installation/ubuntulinux/#installing-docker-on-ubuntu)


````
git clone git@github.com:anthill/6element.git
cd 6element
npm install
docker pull postgres:9.4
````

Then, you must copy create the missing file

````
cd 6element/client/src
cp mapbox mapbox-creadentials.json.example mapbox-creadentials.json
````

Sign up to [mapbox](https://www.mapbox.com/), a free app using OpenStreetMap. 
Copy your default API access token and paste it in mapbox-creadentials.json

Create a new map (or use the default one) and copy its map ID and paste it in the same file.


````
cd home/6element/
npm run watch
````

In a new consol

````
npm start

````

You can now open the URL return




"use strict";

require('es6-shim');
var turf = require('turf');

var FileToObjects = function(dir, file, request){
  return new Promise(function(resolve, reject){

    fs.readFile(path.join(dir,file), 'utf8', function (err, data) {
      
      if ( err !== null ){ 
          console.log(file, '', err);
          reject(err);
      }
      else
      {
        var doc = JSON.parse(data);
        var objects = [];
        for (var key in doc) {
          	if (doc.hasOwnProperty(key)) {
          		var object = doc[key];
          		var lat = object.geometry.coordinates.lat;
          		var lon = object.geometry.coordinates.lon;
          		if(request.square.minLat <= lat &&
          			lat <= request.square.maxLat &&
          			request.square.minLon <= lon &&
          			lon <= request.square.maxLon){
          			var match = false;
				      for (var category in object.properties.objects) {
				          if (object.properties.objects.hasOwnProperty(category)) {
				            if(object.properties.objects[category] === 1){
				            	if(request.categories.indexOf(category) !== -1){
				            		match = true;
				            		break;
				            	}
				            }
				        }
				      }

				      if(match){

				      	var line = {
							  "type": "Feature",
							  "properties": {},
							  "geometry": {
							    "type": "LineString",
							    "coordinates": [ [lat, lon], request.geoloc ]
							  }
							};
							object["distance"] = turf.lineDistance(line, 'kilometers');
	          			objects.push(object);
				      }
          		}
          	}
        }
        //console.log(file, ":", objects.length, 'objecs to save');

        resolve(objects);
      }
    });
  });
}

var bodyParser	= require('body-parser');
var express 	= require('express');
var app 		= express();
var fs = require('fs');
var path = require('path');
var server 	= require('http').createServer(app);

app.use(bodyParser.json({limit: '1000mb'}));
app.use(bodyParser.urlencoded({extended: true}))

app.use('/', express.static(__dirname + '/..' + '/web'));

app.post('/search', function(req, res){
	
	var data = req.body;
	if(data === null){
		console.log("-> request without parameters");
		return;
	} 

	var result = {
		radius: data.radius,
		categories: data.categories,
		placeName: data.placeName,
		geoloc: [data.geoloc.lat, data.geoloc.lon],
		square: {}, 
		objects: []
	}
	var point = {
	  "type": "Feature",
	  "properties": {
	    "marker-color": "#0f0"
	  },
	  "geometry": {
	    "type": "Point",
	    "coordinates": [data.geoloc.lat, data.geoloc.lon]
	  }
	};
	
	var distance = Math.sqrt(Math.pow(data.radius,2)*2);
	var units = 'kilometers';
	var leftDown = turf.destination(point, distance, 225, units).geometry.coordinates;
	var rightUp = turf.destination(point, distance, 45, units).geometry.coordinates;
	result.square = {
		minLat: leftDown[0],
		maxLat: rightUp[0],
		minLon: leftDown[1],
		maxLon: rightUp[1]
	};
	
	var dir = path.join(__dirname,'data');

	var files = fs.readdirSync(dir);
	//console.log('->', files.length, 'files to parse');

	var results = [];
	Promise.all(files
	.filter(function(file){
	  return (path.extname(file) === '.json'); 
	})
	.map(function(file){
		return FileToObjects(dir, file, result)
	  	.then(function(objects){
			Array.prototype.push.apply(result.objects, objects);
	  	})
	}))
	.then(function(){
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(result));
	});

})

server.listen(33000);
console.log('Server started on', 33000);

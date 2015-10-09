"use strict";

var turf = require('turf');
var path = require('path');
var fs   = require('fs');
var Utils = require("./utils.js");


var FileToObjects = function(dir, file, index, request){
    
    return new Promise(function(resolve, reject){

        var color = Utils.colors[index];

        fs.readFile(path.join(dir,file), 'utf8', function (err, data) {
          
            if ( err !== null ){ 
                console.log(file, '', err);
                reject(err);
            } else {

                var doc = JSON.parse(data);
                var objects = [];
                Object.keys(doc).forEach(function(key){

                    var object = doc[key];
                    var lat = object.geometry.coordinates.lat;
                    var lon = object.geometry.coordinates.lon;
                    
                    if(request.square.minLat <= lat &&
                        lat <= request.square.maxLat &&
                        request.square.minLon <= lon &&
                        lon <= request.square.maxLon){

                        var match = false;
                        if(request.categories.length === 1 && 
                            request.categories[0] === 'All'){
                            match = true;
                        } else {
                            match = Object.keys(object.properties.objects)
                            .some(function(category){
                                return object.properties.objects[category] === 1 &&
                                    request.categories.indexOf(category) !== -1;
                            });
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
                            object["color"] = color;
                            object["file"] = path.basename(file);
                            object["rate"] = Math.floor((Math.random() * 6));
                            objects.push(object);
                        }
                    }
                });              
                //console.log(file, ":", objects.length, 'objecs to save');
                resolve(objects);
            }
        });
    });
}

module.exports = function(req, res){

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
    
    var distance = data.radius * Math.SQRT2;
    var units = 'kilometers';
    var leftDown = turf.destination(point, distance, 225, units).geometry.coordinates;
    var rightUp = turf.destination(point, distance, 45, units).geometry.coordinates;
    result.square = {
        minLat: leftDown[0],
        maxLat: rightUp[0],
        minLon: leftDown[1],
        maxLon: rightUp[1]
    };
    
    var dir = path.join(__dirname,'../data/');

    var files = fs.readdirSync(dir);
    //console.log('->', files.length, 'files to parse');

    Promise.all(files
    .filter(function(file){
      return (path.extname(file) === '.json'); 
    })
    .map(function(file, index){
        return FileToObjects(dir, file, index, result)
        .then(function(objects){
            Array.prototype.push.apply(result.objects, objects);
        })
    }))
    .then(function(){
        result.objects = result.objects
        .sort(function(o1,o2){
            return (o1.distance-o2.distance);
        })
        .slice(0, 100);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    })
    .catch(function(err){
        console.error(err);
        res.status(500).send(err);
    });
}
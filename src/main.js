'use strict';

window.Symbol = require('core-js/modules/es6.symbol');
window.Symbol.iterator = require('core-js/fn/symbol/iterator');

require('es6-shim');
var React = require('react');
var ReactDOM = require('react-dom');
//var L = require('leaflet');
var page = require('page');
var queryString = require('query-string');

//var addIconPulse = require('./js/addIconPulse');
//addIconPulse(L);

//var Tokens = require('../Tokens.json');
//var googleMapsApi = require( 'google-maps-api' )( Tokens.google_token, ['places']);

// var getRawPlace = require('./js/prepareServerAPI')(require('./js/sendReq')).getRawPlace;
var getPlacesByOperator = require('./js/prepareServerAPI')(require('./js/sendReq')).getPlacesByOperator;

// var mapScreen =  require('./views/mapScreen');
// var placeScreen =  require('./views/placeScreen');
var operatorScreen =  require('./views/operatorScreen');

var props = require('../common/layoutData');
//props.leaflet = L;
//props.googleMapsApi = googleMapsApi;


// page("/", function (context){
// 	var qp = queryString.parse(context.querystring);

//     if (qp.maxLat && qp.maxLon && qp.minLon && qp.minLat) {
//         props.boundingBox = {
//             'maxLat': qp.maxLat,
//             'minLat': qp.minLat,
//             'maxLon': qp.maxLon,
//             'minLon': qp.minLon
//         }
//     }
//     else if (qp.lon && qp.lat)
//         props.geoloc = { lon: Number(qp.lon), lat: Number(qp.lat)};

//     if (qp.category){
//         props.category = qp.category;
//     }

//     ReactDOM.render( 
//         React.createElement(mapScreen, props), document.getElementById('reactHere')  
//     );
// });

var operatorRoute = function (context){

    var name = "all";
    if (context.params.name)
        name = context.params.name;

    var qp = queryString.parse(context.querystring);

    if (qp.date)
        props.date = qp.date;

    if (!props.places){
        // if data is not in the page, fetch it
        getPlacesByOperator(name).then(function(result){
            props.operator = result;
            ReactDOM.render( 
                React.createElement(operatorScreen, props), document.getElementById('reactHere')
            );

        })
        .catch(function(error){
            console.log("Error in place: ", error);
        });
    } else {
        ReactDOM.render( 
            React.createElement(operatorScreen, props), document.getElementById('reactHere')
        );
    }

}
page("/", operatorRoute);

page("/operator/:name", operatorRoute);

page("/operateur/:name", operatorRoute)

page("/index.html", "/");

// page("/place/:placeId", function (context){
//     var placeId = context.params.placeId;

//     getRawPlace(placeId).then(function(result){

//         props.detailedObject = result;
//         ReactDOM.render( 
//             React.createElement(placeScreen, props), document.getElementById('reactHere')
//         );

//     })
//     .catch(function(error){
//         console.log("Error in place: ", error);
//     });

    
// });

document.addEventListener('DOMContentLoaded', function l(){
    document.removeEventListener('DOMContentLoaded', l);

    var initDataElement = document.querySelector('script#init-data');
    var initDataStr = initDataElement.textContent.trim();
    
    if(initDataElement && initDataStr.length >= 2){
        var data = JSON.parse(initDataStr);
        for (var attrname in data) { props[attrname] = data[attrname]; }
        initDataElement.remove();
    }

    page();
});

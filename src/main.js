'use strict';

window.Symbol = require('core-js/modules/es6.symbol');
window.Symbol.iterator = require('core-js/fn/symbol/iterator');

require('es6-shim');
var React = require('react');
var ReactDOM = require('react-dom');
var L = require('leaflet');
var page = require('page');
var queryString = require('query-string');

var addIconPulse = require('./js/addIconPulse');
addIconPulse(L);

var Tokens = require('../Tokens.json');
var googleMapsApi = require( 'google-maps-api' )( Tokens.google_token, ['places']);

var Layout =  require('./views/layout.js');

var props = require('../common/layoutData');
props.leaflet = L;
props.googleMapsApi = googleMapsApi;


page("/", function (ctx){
	var qp = queryString.parse(ctx.querystring);

    if (qp.maxLat && qp.maxLon && qp.minLon && qp.minLat) {
        props.boundingBox = {
            'maxLat': qp.maxLat,
            'minLat': qp.minLat,
            'maxLon': qp.maxLon,
            'minLon': qp.minLon
        }
    }
    else if (qp.lon && qp.lat)
        props.geoloc = { lon: Number(qp.lon), lat: Number(qp.lat)};

    if (qp.category){
        props.category = qp.category;
    }
    ReactDOM.render( 
        React.createElement(Layout, props), document.getElementById('reactHere')
    );
});

page("/index.html", "/");

page("/place/:placeId", function (){
    ReactDOM.render( 
        React.createElement(Layout, props), document.getElementById('reactHere')
    );
});

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

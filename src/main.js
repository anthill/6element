'use strict';


//console.log('test');

var React = require('react');
var Application = React.createFactory(require('./Components/Application.js'));


/*var now= new Date();
var day = now.getDay();
var beginingHour = parseInt(schedule[day][1]["start"])/100;
var beginingMin = parseInt(schedule[day][1]["start"])%100;
var endingHour = parseInt(schedule[day][2]["end"])/100;
var endingMin = parseInt(schedule[day][1]["end"])%100;

var date = moment(year : now.getFullYear(), month : now.getMonth() , day : now.getDate(),
                hour : beginingHour, minute : beginingMin);
    */

var rcFake = {
    name: "Verac",
    
    favourite: true,
    
    open: true,
    
    schedule: [
        [
            //"monday", 
            "lundi",
            {start: "0900", end: "1200"},
            {start: "1400", end: "1800"}
        ],
        [
            //"tuesday",
            "mardi",
            {start: "0900", end: "1200"},
            {start: "1400", end: "1800"}
        ],
        [
            //"wednesday",
            "mercredi",
            {start: "0900", end: "1200"},
            {start: "1400", end: "1800"}
        ],
        [
            //"thursday",
            "jeudi",
            {start: "0900", end: "1200"},
            {start: "1400", end: "1800"}
        ],
        [
            //"friday",
            "vendredi",
            {start: "0900", end: "1200"},
            {start: "1400", end: "1800"}
        ],
        [
            //"saturday",
            "samedi",
            {start: "0900", end: "1200"},
            {start: "1400", end: "1800"}
        ],
        [
            //"sunday",
            "dimanche",
            {start: undefined, end: undefined},
            {start: undefined, end: undefined}
        ]
     ],
     
    crowd: [
        {
            date : "2015-06-30T09:00:00",
            mesure :15/* Math.floor((Math.random()*25))*/
        },
        
        {
            date : "2015-06-30T09:15:00",
            mesure : 15
        },
        {
            date : "2015-06-30T09:30:00",
            mesure : 15
        },
        {
            date : "2015-06-30T09:45:00",
            mesure : 15
        },
        {
            date : "2015-06-30T10:00:00",
            mesure : 15
        },
        
        {
            date : "2015-06-30T10:15:00",
            mesure : 15
        },
        {
            date : "2015-06-30T10:30:00",
            mesure : 15
        },
        {
            date : "2015-06-30T10:45:00",
            mesure : 15
        },
        {
            date : "2015-06-30T11:00:00",
            mesure : 15
        },
        
        {
            date : "2015-06-30T11:15:00",
            mesure : 15
        },
        {
            date : "2015-06-30T11:30:00",
            mesure : 15
        },
        {
            date : "2015-06-30T11:45:00",
            mesure : 15
        },
        {
            date : "2015-06-30T14:00:00",
            mesure : 15
        },
        
        {
            date : "2015-06-30T14:15:00",
            mesure : 15
        },
        {
            date : "2015-06-30T14:30:00",
            mesure : 15
        },
        {
            date : "2015-06-30T14:45:00",
            mesure : 15
        },
        {
            date : "2015-06-30T15:00:00",
            mesure : 15
        },
        
        {
            date : "2015-06-30T15:15:00",
            mesure : 15
        },
        {
            date : "2015-06-30T15:30:00",
            mesure : 15
        },
        {
            date : "2015-06-30T15:45:00",
            mesure : 15
        },
        {
            date : "2015-06-30T16:00:00",
            mesure : 15
        },
        
        {
            date : "2015-06-30T16:15:00",
            mesure : 15
        },
        {
            date : "2015-06-30T16:30:00",
            mesure : 15
        },
        {
            date : "2015-06-30T16:45:00",
            mesure : 15
        },
        {
            date : "2015-06-30T17:00:00",
            mesure : 15
        },
        
        {
            date : "2015-06-30T17:15:00",
            mesure : 15
        },
        {
            date : "2015-06-30T17:30:00",
            mesure : 15
        },
        {
            date : "2015-06-30T17:45:00",
            mesure : 15
        },
    ],
    
    maxSize : 20,
    
    wastes: 
    [
        {
            type: "green waste",
            status: "unavaiable"
        },
        {
            type: "wood",
            status: "avaiable"
        },
        {
            type: "cardboard",
            status: "avaiable"
        }
    ],
    
    address: {
        number: 5,
        typeRoad: 'ld',
        nameRoad: 'Teycheres',
        PC: 33240,
        town: 'Verac'
    },
    
    coords: {
        lat: -0.4586,
        long: 4.4586
    },
    
    owner: "SMICVAL",
    
    phone: "0505050505"
};

// Initial rendering
React.render(new Application({
    rcFake: rcFake,
}), document.body);
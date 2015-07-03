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
    
    //####################################################################################################
    // NEVER CHANGE
    name: "Verac",
    
    favourite: true,
    
    open: true,
    
    // opened intervall in UTC
    schedule: {
        //monday
        0:  [
            {start: "0900", end: "1200"},
            {start: "1400", end: "1800"}
        ],
        // tuesday
        1:  [
            {start: "0900", end: "1200"},
            {start: "1400", end: "1800"}
        ],
        2 : [
            {start: "0900", end: "1200"},
            {start: "1400", end: "1800"}
        ],
        3: [
            {start: "0900", end: "1200"},
            {start: "1400", end: "1800"}
        ],
        4 : [
            {start: "0900", end: "1200"},
            {start: "1400", end: "1800"}
        ],
        5 : [
            {start: "0900", end: "1200"},
            {start: "1400", end: "1800"}
        ]
    },  
    
    maxSize : 23,   
    
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
    
    phone: "0505050505",
     
    //#################################################################################################"
    // CHANGE EACH 5mn
    crowd: [
        //local - 2h
        {
            date : "2015-07-03T07:00:00Z",
            value : 15,
        },
        
        {
            date : "2015-07-03T07:15:00Z",
            value : 10
        },
        {
            date : "2015-07-03T07:30:00Z",
            value : 5
        },
        {
            date : "2015-07-03T07:45:00Z",
            value : 12
        },
        {
            date : "2015-07-03T08:00:00Z",
            value : 20
        },
        
        {
            date : "2015-07-03T08:15:00Z",
            value : 15
        },
        {
            date : "2015-07-03T08:30:00Z",
            value : 18
        },
        {
            date : "2015-07-03T08:45:00Z",
            value : 25
        },
        {
            date : "2015-07-03T09:00:00Z",
            value : 30
        },
        
        {
            date : "2015-07-03T09:15:00Z",
            value : 20
        },
        {
            date : "2015-07-03T09:30:00Z",
            value : 16
        },
        {
            date : "2015-07-03T09:45:00Z",
            value : 15
        },
        /*{
            date : "2015-07-03T10:00:00Z",
            value : 15
        },
        
        {
            date : "2015-07-03T10:15:00Z",
            value : 15
        },
        {
            date : "2015-07-03T10:30:00Z",
            value : 15
        },
        {
            date : "2015-07-03T10:45:00Z",
            value : 15
        },
        {
            date : "2015-07-03T11:00:00Z",
            value : 20
        },
        
        {
            date : "2015-07-03T11:15:00Z",
            value : 15
        },
        {
            date : "2015-07-03T11:30:00Z",
            value : 15
        },
        {
            date : "2015-07-03T11:45:00Z",
            value : 15
        },
        */
        {
            date : "2015-07-03T12:00:00Z",
            value : 14
        },
        
        {
            date : "2015-07-03T12:15:00Z",
            value : 13
        },
        {
            date : "2015-07-03T12:30:00Z",
            value : 10
        },
        {
            date : "2015-07-03T12:45:00Z",
            value : 8
        },
        {
            date : "2015-07-03T13:00:00Z",
            value : 16
        },
        
        {
            date : "2015-07-03T11:13:00Z",
            value : 18
        },
        {
            date : "2015-07-03T13:30:00Z",
            value : 15
        },
        {
            date : "2015-07-03T13:45:00Z",
            value : 13
        },
        {
            date : "2015-07-03T14:00:00Z",
            value : 10
        },
        
        {
            date : "2015-07-03T14:15:00Z",
            value : 19
        },
        {
            date : "2015-07-03T14:30:00Z",
            value : 22
        },
        {
            date : "2015-07-03T14:45:00Z",
            value : 18
        },
        {
            date : "2015-07-03T15:00:00Z",
            value : 15
        },
        
        {
            date : "2015-07-03T15:15:00Z",
            value : 20
        },
        {
            date : "2015-07-03T15:30:00Z",
            value : 25
        },
        {
            date : "2015-07-03T15:45:00Z",
            value : 15
        }/*,
        {
            date : "2015-07-03T16:00:00",
            value : 15
        },
        
        {
            date : "2015-07-03T16:15:00",
            value : 15
        },
        {
            date : "2015-07-03T16:30:00",
            value : 15
        },
        {
            date : "2015-07-03T16:45:00",
            value : 15
        },
        {
            date : "2015-07-03T17:00:00",
            value : 15
        },
        
        {
            date : "2015-07-03T17:15:00",
            value : 15
        },
        {
            date : "2015-07-03T17:30:00",
            value : 15
        },
        {
            date : "2015-07-03T17:45:00",
            value : 15
        },*/
    ],
    
    
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
};


// Initial rendering
React.render(new Application({
    rcFake: rcFake,
}), document.body);
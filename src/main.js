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
        //UTC
        //monday
        0:  [
            {start: "0700", end: "1000"},
            {start: "1200", end: "1600"}
        ],
        // tuesday
        1:  [
            {start: "0700", end: "1000"},
            {start: "1200", end: "1600"}
        ],
        2 : [
            {start: "0700", end: "1000"},
            {start: "1200", end: "1600"}
        ],
        3: [
            {start: "0700", end: "1000"},
            {start: "1200", end: "1600"}
        ],
        4 : [
            {start: "0700", end: "1000"},
            {start: "1200", end: "1600"}
        ],
        5 : [
            {start: "0700", end: "1000"},
            {start: "1200", end: "1600"}
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
            date : "2015-07-07T07:00:00Z",
            value : 15,
        },
        
        {
            date : "2015-07-07T07:15:00Z",
            value : 10
        },
        {
            date : "2015-07-07T07:30:00Z",
            value : 5
        },
        {
            date : "2015-07-07T07:45:00Z",
            value : 12
        },
        {
            date : "2015-07-07T08:00:00Z",
            value : 20
        },
        
        {
            date : "2015-07-07T08:15:00Z",
            value : 15
        },
        {
            date : "2015-07-07T08:30:00Z",
            value : 18
        },
        {
            date : "2015-07-07T08:45:00Z",
            value : 25
        },
        {
            date : "2015-07-07T09:00:00Z",
            value : 30
        },
        
        {
            date : "2015-07-07T09:15:00Z",
            value : 20
        },
        {
            date : "2015-07-07T09:30:00Z",
            value : 16
        },
        {
            date : "2015-07-07T09:45:00Z",
            value : 15
        },
        /*{
            date : "2015-07-07T10:00:00Z",
            value : 15
        },
        
        {
            date : "2015-07-07T10:15:00Z",
            value : 15
        },
        {
            date : "2015-07-07T10:30:00Z",
            value : 15
        },
        {
            date : "2015-07-07T10:45:00Z",
            value : 15
        },
        {
            date : "2015-07-07T11:00:00Z",
            value : 20
        },
        
        {
            date : "2015-07-07T11:15:00Z",
            value : 15
        },
        {
            date : "2015-07-07T11:30:00Z",
            value : 15
        },
        {
            date : "2015-07-07T11:45:00Z",
            value : 15
        },
        */
        {
            date : "2015-07-07T12:00:00Z",
            value : 14
        },
        
        {
            date : "2015-07-07T12:15:00Z",
            value : 13
        },
        {
            date : "2015-07-07T12:30:00Z",
            value : 10
        },
        {
            date : "2015-07-07T12:45:00Z",
            value : 8
        },
        {
            date : "2015-07-07T13:00:00Z",
            value : 16
        },
        
        {
            date : "2015-07-07T11:13:00Z",
            value : 18
        },
        {
            date : "2015-07-07T13:30:00Z",
            value : 15
        },
        {
            date : "2015-07-07T13:45:00Z",
            value : 13
        },
        {
            date : "2015-07-07T14:00:00Z",
            value : 10
        },
        
        {
            date : "2015-07-07T14:15:00Z",
            value : 19
        },
        {
            date : "2015-07-07T14:30:00Z",
            value : 22
        },
        {
            date : "2015-07-07T14:45:00Z",
            value : 18
        },
        {
            date : "2015-07-07T15:00:00Z",
            value : 15
        },
        
        {
            date : "2015-07-07T15:15:00Z",
            value : 20
        },
        {
            date : "2015-07-07T15:30:00Z",
            value : 25
        },
        {
            date : "2015-07-07T15:45:00Z",
            value : 15
        }/*,
        {
            date : "2015-07-07T16:00:00",
            value : 15
        },
        
        {
            date : "2015-07-07T16:15:00",
            value : 15
        },
        {
            date : "2015-07-07T16:30:00",
            value : 15
        },
        {
            date : "2015-07-07T16:45:00",
            value : 15
        },
        {
            date : "2015-07-07T17:00:00",
            value : 15
        },
        
        {
            date : "2015-07-07T17:15:00",
            value : 15
        },
        {
            date : "2015-07-07T17:30:00",
            value : 15
        },
        {
            date : "2015-07-07T17:45:00",
            value : 15
        },*/
    ],
    
    
    wastes: 
    //type never change
    //status does
    
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
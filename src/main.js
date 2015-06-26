'use strict';


console.log('test');

var React = require('react');
var Application = React.createFactory(require('./Components/Application.js'));

var rcFake = {
    name: "Verac",
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
    open: true,
    favourite: false,
    schedule: {
        monday : [
            {start: "0900", end: "1200"},
            {start: "1400", end: "1800"}
        ],
        tuesday : [
            {start: "0900", end: "1200"},
            {start: "1400", end: "1800"}
        ],
        wednesday : [
            {start: "0900", end: "1200"},
            {start: "1400", end: "1800"}
        ],
        thursday : [
            {start: "0900", end: "1200"},
            {start: "1400", end: "1800"}
        ],
        friday : [
            {start: "0900", end: "1200"},
            {start: "1400", end: "1800"}
        ],
        saturday : [
            {start: "0900", end: "1200"},
            {start: "1400", end: "1800"}
        ],
        sunday : [
            {start: undefined, end: undefined},
            {start: undefined, end: undefined}
        ]
    },
    //date: now.getDate(),
    affluence: [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
    dechets: [
        {
            type: "green waste",
            status: "full"
        },
        {
            type: "wood",
            status: "risky"
        },
        {
            type: "cardboard",
            status: "OK"
        }
    ]
};

// Initial rendering
React.render(new Application({
    rcFake: rcFake,
}), document.body);
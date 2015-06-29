'use strict';

require('es6-shim');



var ant1 = {
    id: 0,
    name: 'ant1',
    place: 'St Mariens',
    latLng: {
        lat: 48.38232,
        long: -0.45623
    },
    phone: '99999999',
    ip: '192.111.112.23',
    signal: 12,
    registration: 2,
    quipuStatus: '3G_connected',
    senseStatus: 'sleeping'
};

var ant2 = {
    id: 1,
    name: 'ant2',
    place: 'St Denis',
    latLng: {
        lat: 48.38632,
        long: -0.45123
    },
    phone: '99999999',
    ip: '192.111.112.22',
    signal: 14,
    registration: 3,
    quipuStatus: 'initialized',
    senseStatus: 'recording'
};

module.exports = [ant1, ant2];
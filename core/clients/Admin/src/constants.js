'use strict';

var keyMirror = require('keymirror');

var senseStatus = keyMirror({
    SLEEPING: null,
    MONITORING: null,
    RECORDING: null
});

var quipuStatus = keyMirror({
    UNINITIALIZED: null,
    INITIALIZED: null,
    CONNECTED3G: null,
    TUNNELLING: null
});

module.exports = {
    senseStatus: senseStatus,
    quipuStatus: quipuStatus
};

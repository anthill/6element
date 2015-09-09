'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var actionTypes = require('../Constants/actionTypes.js');

var localStorageUtils = require('../Utils/localStorageUtils.js');

module.exports = {

    changeRC: function(id) {
        dispatcher.dispatch({
            type: actionTypes.CHANGE_RC,
            selectedRC: id
        });

        localStorageUtils.saveDisplayState({
            activeRC: id
        });
    }

};

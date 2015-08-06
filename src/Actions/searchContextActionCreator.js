'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var K = require('../Constants/constants.js');
var actionTypes = K.actionTypes;

module.exports = {

    update: function(delta) {        
        dispatcher.dispatch({
            type: actionTypes.UPDATE_SEARCH_CONTEXT,
            delta: delta
        });
    }

};

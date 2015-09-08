'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var actionTypes = require('../Constants/actionTypes.js');

module.exports = {

    update: function(delta) {        
        dispatcher.dispatch({
            type: actionTypes.UPDATE_SEARCH_CONTEXT,
            delta: delta
        });
    }

};

'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var actionTypes = require('../Constants/actionTypes.js');

var localAPIUtils = require('../Utils/localAPIUtils.js');

module.exports = {

    changeRC: function(id) {
        dispatcher.dispatch({
            type: actionTypes.CHANGE_RC,
            selectedRC: id
        });

        localAPIUtils.saveDisplayState({
            activeRC: id
        });
    }

};

'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;

//var actionTypes = require('../Constants/actionTypes.js');

var user; // string


var userStore = Object.assign({}, EventEmitter.prototype, {

    changeUser: function(u){
        user = u;
    },

    get: function(){
        return user;
    }

});

userStore.dispatchToken = dispatcher.register(function(action) {

    switch(action.type) {

        /*case actionTypes.XXX:
            
            break;*/

        default:
          // do nothing
    }

});

module.exports = userStore;

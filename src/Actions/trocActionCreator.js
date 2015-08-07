'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var K = require('../Constants/constants.js');
var actionTypes = K.actionTypes;

// var localAPIUtils = require('../Utils/localAPIUtils.js');

module.exports = {

    changeTrocStatus: function(id, status) {
        dispatcher.dispatch({
            type: actionTypes.CHANGE_TROC_STATUS,
            id: id,
            status: status
        });

        // DB UPDATE TO DO => localhost
    },

    changeProposalStatus: function(trocId, proposalId, status) {
        dispatcher.dispatch({
            type: actionTypes.CHANGE_PROPOSAL_STATUS,
            trocId: trocId,
            proposalId: proposalId,
            status: status
        });

        // DB UPDATE TO DO => localhost
    },

    togglePrivacyStatus: function(trocId){
        dispatcher.dispatch({
            type: actionTypes.TOGGLE_PRIVACY_STATUS,
            trocId: trocId
        });

        // DB UPDATE TO DO => localhost
        // here, adId would be needed in order to find the corresponding ad in the DB, since trocs don't exist outside the client

    },

    removeTroc: function(id){
        dispatcher.dispatch({
            type: actionTypes.REMOVE_TROC,
            id: id
        });

        // DB UPDATE TO DO => localhost
    }

};

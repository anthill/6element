'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var actionTypes = require('../Constants/actionTypes.js');

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
    },

    applyTrocFilter: function(filter, value) {
        dispatcher.dispatch({
            type: actionTypes.APPLY_TROC_FILTERS,
            filter: filter,
            value: value
        });
    },

    createTroc: function(troc) {
        console.log('CREATING TROC', troc);

        dispatcher.dispatch({
            type: actionTypes.CREATE_TROC,
            newTroc: troc
        });
    },

    modifyTroc: function(troc) {
        console.log('MODIFYING TROC', troc);

        dispatcher.dispatch({
            type: actionTypes.MODIFY_TROC,
            adData: troc
        });
    }

};

'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;

var constants = require('../Constants/constants.js');
var actionTypes = constants.actionTypes;

var CHANGE_EVENT = 'change';

var _trocMap; // Map: id -> Troc
/*

Interface Troc
{
    id: string,
    myAd: Ad,
    proposals: [{
        ad: Ad,
        state: POTENTIAL / INTERESTED / CHOSEN / REFUSED / DISCARDED / COMPLETED 
    }],
    direction: GIVE / NEED
    state: DRAFT / PENDING / ONGOING / ACCEPTED / CLOSED / CANCELED
}

*/

function _changeTrocStatus(trocId, status){
    var troc = _trocMap.get(trocId);
    troc.status = status;
}

function _changeProposalStatus(trocId, proposalId, status){
    var troc = _trocMap.get(trocId);
    var proposal = troc.proposalMap.get(proposalId);
    proposal.status = status;
}

function _togglePrivacyStatus(trocId){
    var troc = _trocMap.get(trocId);
    troc.myAd.isPrivate = !troc.myAd.isPrivate;
}

var TrocStore = Object.assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    get: function(id){
        return _trocMap.get(id);
    },

    getAll: function(){
        var trocs = [];
        _trocMap.forEach(function(troc){
            trocs.push(troc);
        })
        return trocs;
    }

});

TrocStore.dispatchToken = dispatcher.register(function(action) {

    switch(action.type) {

        case actionTypes.LOAD_TROCS:
            _trocMap = action.trocMap;
            TrocStore.emitChange();
            break;

        case actionTypes.REMOVE_TROC:
            console.log('removing troc');
            _trocMap.delete(action.id);
            TrocStore.emitChange();
            break;

        case actionTypes.CHANGE_TROC_STATUS:
            console.log('changing troc status');
            _changeTrocStatus(action.id, action.status);
            TrocStore.emitChange();
            break;

        case actionTypes.CHANGE_PROPOSAL_STATUS:
            console.log('changing proposal status');
            _changeProposalStatus(action.trocId, action.proposalId, action.status);
            TrocStore.emitChange();
            break;

        case actionTypes.TOGGLE_PRIVACY_STATUS:
            console.log('toggling privacy status');
            _togglePrivacyStatus(action.trocId);
            TrocStore.emitChange();
            break;

        default:
          // do nothing
    }

});

module.exports = TrocStore;

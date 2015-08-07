'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;

// CONSTANTS
var actionTypes = require('../Constants/actionTypes.js');

// STORES
var TrocFilterStore = require('../Stores/trocFilterStore.js');


var CHANGE_EVENT = 'change';

var _trocMap; // Map: id -> Troc
/*

Interface Troc
{
    id: string,
    myAd: Ad,
    proposals: [{
        ad: Ad,
        status: POTENTIAL / INTERESTED / CHOSEN / REFUSED / DISCARDED / COMPLETED 
    }],
    direction: GIVE / NEED
    status: DRAFT / PENDING / ONGOING / ACCEPTED / FULFILLED / CANCELED
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

function _filter(filters){

    var trocs = [];

    _trocMap.forEach(function(troc){

        if(filters.every(function(filter){
            return filter(troc);
        }))
            trocs.push(troc);
    });

    console.log('trocs', trocs);
    return trocs;
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

    getFromCurrentFilters: function(){
        var filterMap = TrocFilterStore.getCurrentFilters();

        var filters = [];

        filterMap.forEach(function(filterFunction){
            filters.push(filterFunction);
        });

        return _filter(filters);
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

    dispatcher.waitFor([
        TrocFilterStore.dispatchToken
    ]);

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

        case actionTypes.APPLY_TROC_FILTERS:
            console.log('applying filters');
            TrocStore.getFromCurrentFilters();
            TrocStore.emitChange();
            break;

        default:
          // do nothing
    }

});

module.exports = TrocStore;

'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');

// CONSTANTS
var actionTypes = require('../Constants/actionTypes.js');

// STORES
var TrocFilterStore = require('../Stores/trocFilterStore.js');

var CHANGE_EVENT = 'change';

var _trocMap = new Immutable.Map(); // Map: id -> Troc

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

    _trocMap = _trocMap.set(troc.id, troc);
}

function _changeProposalStatus(trocId, proposalId, status){
    var troc = _trocMap.get(trocId);
    var proposal = troc.proposalMap.get(proposalId);
    proposal.status = status;

    _trocMap = _trocMap.set(troc.id, troc);
}

function _togglePrivacyStatus(trocId){
    var troc = _trocMap.get(trocId);
    troc.myAd.isPrivate = !troc.myAd.isPrivate;

    _trocMap = _trocMap.set(troc.id, troc);
}

function _filterTrocs(filters){

    var trocs = [];

    _trocMap.forEach(function(troc){

        if(filters.every(function(filter){
            return filter(troc);
        }))
            trocs.push(troc);
    });

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

        return _filterTrocs(filters);
    },

    getAll: function(){
        // var trocs = [];
        // _trocMap.forEach(function(troc){
        //     trocs.push(troc);
        // });
        return _trocMap;
    }

});

TrocStore.dispatchToken = dispatcher.register(function(action) {

    dispatcher.waitFor([
        TrocFilterStore.dispatchToken
    ]);

    switch(action.type) {

        case actionTypes.LOAD_TROCS:
            console.log('[TrocStore] loading trocs from localstorage', action.trocMap);
            _trocMap = new Immutable.Map(action.trocMap);
            TrocStore.emitChange();
            break;

        case actionTypes.CREATE_TROC:
            console.log('[TrocStore] creating troc');
            _trocMap = _trocMap.set(action.newTroc.id, action.newTroc);
            TrocStore.emitChange();
            break;

        case actionTypes.MODIFY_TROC:
            console.log('[TrocStore] modifying troc');
            _trocMap = _trocMap.set(action.troc.id, action.troc);
            TrocStore.emitChange();
            break;

        case actionTypes.REMOVE_TROC:
            console.log('[TrocStore] removing troc');
            _trocMap = _trocMap.delete(action.id);
            TrocStore.emitChange();
            break;

        case actionTypes.CHANGE_TROC_STATUS:
            console.log('[TrocStore] changing troc status');
            _changeTrocStatus(action.id, action.status);
            TrocStore.emitChange();
            break;

        case actionTypes.CHANGE_PROPOSAL_STATUS:
            console.log('[TrocStore] changing proposal status');
            _changeProposalStatus(action.trocId, action.proposalId, action.status);
            TrocStore.emitChange();
            break;

        case actionTypes.TOGGLE_PRIVACY_STATUS:
            console.log('[TrocStore] toggling privacy status');
            _togglePrivacyStatus(action.trocId);
            TrocStore.emitChange();
            break;

        case actionTypes.APPLY_TROC_FILTERS:
            console.log('[TrocStore] applying filters');
            TrocStore.getFromCurrentFilters();
            TrocStore.emitChange();
            break;

        default:
          // do nothing
    }

});

module.exports = TrocStore;

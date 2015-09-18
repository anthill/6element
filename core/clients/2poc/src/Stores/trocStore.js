'use strict';

var dispatcher = require('../Dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');

// CONSTANTS
var actionTypes = require('../Constants/actionTypes.js');
var directions = require('../Constants/directions.js');

// STORES
var TrocFilterStore = require('../Stores/trocFilterStore.js');
var CurrentUserStore = require('../Stores/currentUserStore.js');

var searchContextStore = require('../Stores/searchContextStore.js');

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

// function _changeProposalStatus(trocId, proposalId, status){
//     var troc = _trocMap.get(trocId);
//     var proposal = troc.proposals.find(function(prop){
//         return 
//     });
//     proposal.status = status;

//     _trocMap = _trocMap.set(troc.id, troc);
// }

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
        var filterMap = TrocFilterStore.getFilterFunctions();

        var filters = [];

        filterMap.forEach(function(filterFunction){
            filters.push(filterFunction);
        });

        return _filterTrocs(filters);
    },
    
    search: function(){
        var tff = searchContextStore.makeFilter();
        var trocs = [];
        
        _trocMap.forEach(function(troc){
            if(tff(troc))
                trocs.push(troc);
        });
        
        console.log('search', _trocMap.size, trocs.length);

        return trocs;
    },

    getAll: function(){
        // var trocs = [];
        // _trocMap.forEach(function(troc){
        //     trocs.push(troc);
        // });
        return _trocMap;
    },

    // eventually, change troc to ad. The current user has no reason to have access to the other person's troc
    // the current user should be answering to an ad (and corresponding troc is found server-side)
    apply: function(troc){
        
        var ad = {
            id: Math.random(),
            creator: CurrentUserStore.get(),
            content: {
              title: troc.myAd.content.title,
              categories: troc.myAd.categories,
              location: '',
              state: '',
              text: ''
            },
            direction: troc.myAd.direction === directions.GIVE ? directions.NEED : directions.GIVE,
            status: ''
        };

        var newTroc = {
            id: Math.random(),
            myAd: ad,
            proposals: [{
                ad: troc.myAd,
                status: ''
            }],
            direction: ad.direction,
            status: ''
        };

        troc.proposals.push({
            ad: ad,
            status: ''
        });

        _trocMap = _trocMap.set(newTroc.id, newTroc);

    },

    isUserAlreadyInterested: function(user, ad){
        var res = false;

        _trocMap.forEach(function(t){
            if(t.myAd.creator === user && t.proposals.some(function(proposal){
                console.log('prop ad', proposal, ad);

                return proposal.ad.id === ad.id
            }))
                res = true;
        });

        return res;
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

        // case actionTypes.CHANGE_PROPOSAL_STATUS:
        //     console.log('[TrocStore] changing proposal status');
        //     _changeProposalStatus(action.trocId, action.proposalId, action.status);
        //     TrocStore.emitChange();
        //     break;

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

        case actionTypes.EXPRESS_INTEREST: 
            console.log('[TrocStore] expressing interest', action.troc);
            TrocStore.apply(action.troc);
            TrocStore.emitChange();
            break;

        default:
          // do nothing
    }

});

module.exports = TrocStore;

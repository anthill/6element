"use strict";

var React = require('react');

// COMPONENTS


// STORES
var trocStore = require('../Stores/trocStore.js');
var searchContextStore = require('../Stores/searchContextStore.js');
var currentUserStore = require('../Stores/currentUserStore.js');

// ACTIONS
var displayActions = require('../Actions/displayActions');
var searchContextAction = require('../Actions/searchContextActions');
var trocActions = require('../Actions/trocActions');

// UTILS
var directions = require('../Constants/directions');


module.exports = React.createClass({

    displayName: 'SearchResults',

    getInitialState: function(){
        return {
            trocs: trocStore.search()
        };
    },
    
    updateResultsStatus: function(){
        this.setState({
            trocs: trocStore.search()
        })
    },

    componentDidMount: function() {
        trocStore.addChangeListener(this.updateResultsStatus);
        searchContextStore.on(searchContextStore.events.CHANGE, this.updateResultsStatus);
    },

    componentWillUnmount: function() {
        trocStore.removeChangeListener(this.updateResultsStatus);
        searchContextStore.removeListener(searchContextStore.events.CHANGE, this.updateResultsStatus);
    },

    
    render: function() {
        //var self = this;
        //var props = this.props;
        var state = this.state;
        
        var back = React.DOM.button({
            onClick: displayActions.goBack
        }, '⇚');
        
        var form = React.DOM.form({
            onSubmit: function(e){
                e.preventDefault();
            }
        }, 
            // mode switch
            React.DOM.div({className: 'mode-switch'}, 
                React.DOM.label({className: 'give'}, 
                    'Je me sépare',
                    React.DOM.input({
                        type: 'radio',
                        value: directions.GIVE,
                        name: 'direction',
                        defaultChecked: searchContextStore.get().get('direction') ? searchContextStore.get().get('direction') === directions.GIVE : true,
                        onChange: function(e){
                            searchContextAction.update({
                                'direction': e.target.value
                            })
                        }
                    })
                ),
                React.DOM.label({className: 'need'}, 
                    'Je récupère',
                    React.DOM.input({
                        type: 'radio',
                        value: directions.NEED,
                        name: 'direction',
                        defaultChecked: searchContextStore.get().get('direction') === directions.NEED,
                        onChange: function(e){
                            searchContextAction.update({
                                'direction': e.target.value
                            })
                        }
                    })
                )
            ),

            React.DOM.label({}, 
                'Quoi ?',
                React.DOM.input({
                    type: 'text',
                    id: 'what',
                    defaultValue: searchContextStore.get().get('what'),
                    onChange: function(e){
                        searchContextAction.update({
                            'what': e.target.value
                        })
                    }
                })
            ),

            React.DOM.label({},
                'Où ?',
                React.DOM.input({
                    type: 'text',
                    id: 'where',
                    defaultValue: searchContextStore.get().get('where'),
                    onChange: function(e){
                        searchContextAction.update({
                            'where': e.target.value
                        })
                    }
                })
            )
        );

        
        
        var results = React.DOM.ol({className: 'results'}, state.trocs
            .filter(function(t){
                return t.myAd.creator !== currentUserStore.get()
            })
            .map(function(troc){
                var userAlreadyInterested = trocStore.isUserAlreadyInterested(currentUserStore.get(), troc.myAd);

                return React.DOM.li({}, 
                    React.DOM.span({style: {"font-weight": "bold"}}, troc.myAd.content.title),
                    React.DOM.button({
                        onClick: function(){
                            trocActions.expressInterestIn(troc);
                        },
                        disabled: userAlreadyInterested
                    },
                        userAlreadyInterested ? 
                            'Déjà intéressé' : 
                            (searchContextStore.get().get('direction') === directions.NEED ?
                                'Je le veux !' :
                                "J'en donne un !")
                    ),
                    ' '
                    // React.DOM.span({}, troc.myAd.content.location)
                );
            })
        );
        
        
        

        return React.DOM.div({className: 'search-results'}, 
            back,
            form,
            results            
        );
    }
});

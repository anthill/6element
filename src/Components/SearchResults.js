"use strict";

var React = require('react');

// COMPONENTS


// STORES
var trocStore = require('../Stores/trocStore.js');
var searchContext = require('../Stores/searchContextStore.js');

// ACTIONS
var displayActions = require('../Actions/displayActions');
var searchContextAction = require('../Actions/searchContextActions');

// UTILS
var directions = require('../Constants/directions');


module.exports = React.createClass({

    displayName: 'SearchResults',

    getInitialState: function(){
        return {
            trocs: trocStore.search()
        };
    },

    onSearchContextChange: function(){
        this.setState({
            trocs: trocStore.search()
        })
    },
    
    componentDidMount: function() {
        searchContext.on(searchContext.events.CHANGE, this.onSearchContextChange);
    },

    componentWillUnmount: function() {
        searchContext.removeListener(searchContext.events.CHANGE, this.onSearchContextChange);
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
                        defaultChecked: searchContext.get().get('direction') === directions.GIVE,
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
                        defaultChecked: searchContext.get().get('direction') === directions.NEED,
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
                    defaultValue: searchContext.get().get('what'),
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
                    defaultValue: searchContext.get().get('where'),
                    onChange: function(e){
                        searchContextAction.update({
                            'where': e.target.value
                        })
                    }
                })
            )
        );

        
        var results = React.DOM.ol({className: 'results'}, state.trocs.map(function(troc){
            return React.DOM.li({}, 
                React.DOM.span({style: {"font-weight": "bold"}}, troc.myAd.content.title),
                ' '
                // React.DOM.span({}, troc.myAd.content.location)
            );
        }));
        
        
        

        return React.DOM.div({className: 'search-results'}, 
            back,
            form,
            results            
        );
    }
});

"use strict";

var React = require('react');

var displayActions = require('../Actions/displayActions');

var screenTypes = require('../Constants/screenTypes');
var directions = require('../Constants/directions');

var searchContextActions = require('../Actions/searchContextActions');
var searchContext = require('../Stores/searchContextStore.js');

module.exports = React.createClass({

    displayName: 'Home',

    getInitialState: function(){
        return {};//getStateFromStores();
    },
    
    render: function() {
        //var self = this;
        //var props = this.props;
        //var state = this.state;

        console.log('dir', searchContext.get().get('direction'),
            searchContext.get().get('direction') ? searchContext.get().get('direction') === directions.GIVE : true,
            searchContext.get().get('direction') === directions.NEED 
            )
        
        return React.DOM.div({className: 'home'},
            
            React.DOM.div({},
                // mode switch
                React.DOM.div({className: 'mode-switch'},
                    React.DOM.label({className: 'give'},
                        'Je me sépare',
                        React.DOM.input({
                            className: 'give',
                            type: 'radio',
                            value: directions.GIVE,
                            name: 'direction',
                            onChange: function(e){
                                searchContextActions.update({
                                    'direction': e.target.value
                                })
                            },
                            defaultChecked: searchContext.get().get('direction') ? searchContext.get().get('direction') === directions.GIVE : true
                        })
                    ),
                    React.DOM.label({className: 'need'},
                        'Je récupère',
                        React.DOM.input({
                            type: 'radio',
                            value: directions.NEED,
                            name: 'direction',
                            onChange: function(e){
                                searchContextActions.update({
                                    'direction': e.target.value
                                })
                            },
                            defaultChecked: searchContext.get().get('direction') === directions.NEED  
                        })
                    )
                ),
                React.DOM.label({},
                    'Quoi ?',
                    React.DOM.input({
                        type: 'text',
                        id: 'what',
                        onChange: function(e){
                            searchContextActions.update({
                                'what': e.target.value
                            })
                        }
                    })
                ),
                React.DOM.div({className: 'submit-group'},
                    React.DOM.button({
                        type: "submit"
                    }, "Aller en déchèterie"),
                    React.DOM.button({
                        type: "submit",
                        onClick: function(){
                            displayActions.goToScreen(screenTypes.SEARCH_RESULTS);
                        }
                    }, "Résultats"),
                    React.DOM.button({
                        type: "submit",
                        onClick: function(){
                            displayActions.goToScreen(screenTypes.AD_POST);
                        }
                    }, "Déposer une annonce")
                )
            )    
        )
    }
});

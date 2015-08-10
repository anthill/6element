"use strict";

var React = require('react');

var displayActions = require('../Actions/displayActions');

var screenTypes = require('../Constants/screenTypes');
var directions = require('../Constants/directions');

var searchContextActions = require('../Actions/searchContextActions');

module.exports = React.createClass({

    displayName: 'Home',

    getInitialState: function(){
        return {};//getStateFromStores();
    },
    
    render: function() {
        //var self = this;
        //var props = this.props;
        //var state = this.state;
        
        return React.DOM.div({className: 'home'},
            
            React.DOM.div({},
                // mode switch
                React.DOM.div({className: 'mode-switch'},
                    React.DOM.label({},
                        'Je me sépare',
                        React.DOM.input({
                            type: 'radio',
                            value: directions.GIVE,
                            name: 'direction',
                            onChange: function(e){
                                searchContextActions.update({
                                    'direction': e.target.value
                                })
                            }
                        })
                    ),
                    React.DOM.label({},
                        'Je récupère',
                        React.DOM.input({
                            type: 'radio',
                            value: directions.NEED,
                            name: 'direction',
                            onChange: function(e){
                                searchContextActions.update({
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
                        type: "submit"
                    }, "Voir les personnes qui cherchent (21)"),
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

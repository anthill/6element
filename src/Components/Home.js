"use strict";

var React = require('react');

var displayActions = require('../Actions/displayActionCreator');
var searchContext = require('../Actions/searchContextActionCreator')
var searchContextStore = require('../Stores/searchContextStore');

console.log(searchContextStore);

var K = require('../Constants/constants');


module.exports = React.createClass({

    displayName: 'Home',

    getInitialState: function(){
        return {};//getStateFromStores();
    },
    
    render: function() {
        //var self = this;
        //var props = this.props;
        //var state = this.state;
        
        return React.DOM.div({className: 'home'}, [
            
            React.DOM.form({
                onSubmit: function(e){
                    e.preventDefault();
                }
            }, [
                // mode switch
                React.DOM.div({className: 'mode-switch'}, [
                    React.DOM.label({}, 
                        'Je me sépare',
                        React.DOM.input({
                            type: 'radio',
                            value: 'give',
                            name: 'give-need',
                            onChange: function(e){
                                searchContext.update({
                                    'direction': e.target.value
                                })
                            }
                        })
                    ),
                    React.DOM.label({}, 
                        'Je récupère',
                        React.DOM.input({
                            type: 'radio',
                            value: 'need',
                            name: 'give-need',
                            onChange: function(e){
                                searchContext.update({
                                    'direction': e.target.value
                                })
                            }
                        })
                    )
                ]),
                
                React.DOM.label({}, 
                    'Quoi ?',
                    React.DOM.input({
                        type: 'text',
                        id: 'what',
                        onChange: function(e){
                            searchContext.update({
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
                            displayActions.goToScreen(K.screen.AD_POST);
                        }
                    }, "Déposer une annonce")
                )
            ])
            
        ])
        
    }
});

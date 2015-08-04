"use strict";

var React = require('react');

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
                    React.DOM.label({}, [
                        'Je me sépare',
                        React.DOM.input({
                            type: 'radio',
                            id: 'give-away',
                            name: 'give-search'
                        })
                    ]),
                    React.DOM.label({}, [
                        'Je récupère',
                        React.DOM.input({
                            type: 'radio',
                            id: 'search-for',
                            name: 'give-search'
                        })
                    ])
                ]),
                
                React.DOM.label({}, [
                    'Quoi ? ',
                    React.DOM.input({
                        type: 'text',
                        id: 'what'
                    })
                ]),
                
                React.DOM.div({className: 'submit-group'}, [
                    React.DOM.button({
                        type: "submit"
                    }, "Aller en déchèterie"),
                    React.DOM.button({
                        type: "submit"
                    }, "Voir les personnes qui cherchent (21)"),
                    React.DOM.button({
                        type: "submit"
                    }, "Déposer une annonce")
                ])
            ])
            
        ])
        
    }
});

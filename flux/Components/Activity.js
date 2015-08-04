"use strict";

var React = require('react');


module.exports = React.createClass({

    displayName: 'Activity',

    getInitialState: function(){
        return {};
    },
    
    render: function() {
        //var self = this;
        //var props = this.props;
        //var state = this.state;
        
        return React.DOM.div({className: 'activity'}, [
            
            React.DOM.form({}, [
                React.DOM.div({className: 'filter'}, [
                    React.DOM.label({}, [
                        'Je me sépare',
                        React.DOM.input({
                            type: 'checkbox',
                            id: 'give-away',
                            name: 'give-search'
                        })
                    ]),
                    React.DOM.label({}, [
                        'Je récupère',
                        React.DOM.input({
                            type: 'checkbox',
                            id: 'search-for',
                            name: 'give-search'
                        })
                    ])
                ]),

                React.DOM.input({
                    type: 'search',
                    id: 'search',
                    placeholder: 'Recherche'
                })
                
            ]),
            
            React.DOM.ol({}, [])
            
        ])
            
            
        
        
    }
});

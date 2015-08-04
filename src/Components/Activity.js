"use strict";

var React = require('react');

var ActivityItem = React.createFactory(require('./ActivityItem.js'));

var K = require('../Constants/constants.js');

var data = [
    {
        ad: {
            title: "Donne des collants neufs",
            private: true,
            type: K.adType.GIVE
        },
        proposals: [
            {name: 'David', message: 'yo'},
            {name: 'Romain', message: 'hi'},
            {name: 'Alex', message: "'sup"}
        ]
    },
    {
        ad: {
            title: "Récupère des chaussettes trouées",
            private: false,
            type: K.adType.NEED
        },
        proposals: [
            {name: 'Roxane', message: 'bla'},
            {name: 'Max', message: 'hey ya!'}
        ]
    }
]



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
                
                React.DOM.h1({}, 'Mes annonces'),

                React.DOM.input({
                    type: 'search',
                    id: 'search',
                    placeholder: 'Recherche'
                })
                
            ]),
            
            React.DOM.ol({className: "activity-items"}, 
                data.map(function(aItemData){
                    return new ActivityItem(aItemData);
                })
            )
            
        ])
            
            
        
        
    }
});

"use strict";

var React = require('react');

var displayActions = require('../Actions/displayActions.js');
var trocActions = require('../Actions/trocActions.js');
var searchContextStore = require('../Stores/searchContextStore.js');
var currentUserStore = require('../Stores/currentUserStore.js');

var directions = require('../Constants/directions.js');
var tabTypes = require('../Constants/tabTypes.js');
var screenTypes = require('../Constants/screenTypes.js');

module.exports = React.createClass({

    displayName: 'AdPost',

    getInitialState: function(){
        return {};
    },
    
    render: function() {
        
        var searchContext = searchContextStore.get();
        
        console.log('AdPost searchContextStore.get()', searchContext, searchContext.get('direction'), directions.GIVE, directions.NEED)
        
        // Do NOT use 'ad-post' as class name since it's blocked by AdBlock
        return React.DOM.div({className: "post-an-ad"}, 
            
            React.DOM.button({
                onClick: displayActions.goBack
            }, '⇚'),
            
            React.DOM.form({
                onSubmit: function(e){
                    e.preventDefault();

                    console.log('adpost submit', e.target);

                    var newAd = {
                        id: Math.random(),
                        creator: currentUserStore.get(),
                        isPrivate: false,
                        content: {
                            title: e.target.what.value,
                            categories: [],
                            location: e.target.where.value,
                            pics: undefined,
                            status: '',
                            text: ''
                        },
                        direction: e.target.direction.value,
                        status: 'ongoing'
                    };

                    var newTroc = {
                        id: Math.random(),
                        myAd: newAd,
                        proposalMap: [], // not a Map, but easier to call it that way for now
                        direction: e.target.direction.value,
                        status: 'ongoing'
                    };

                    trocActions.createTroc(newTroc);

                    console.log('ad posted by user', currentUserStore.get());

                    displayActions.goToScreen(screenTypes.MAIN);
                    displayActions.changeTab(tabTypes.ACTIVITY);
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
                            defaultChecked: searchContext.get('direction') ? searchContext.get('direction') === directions.GIVE : true
                        })
                    ),
                    React.DOM.label({className: 'need'}, 
                        'Je récupère',
                        React.DOM.input({
                            type: 'radio',
                            value: directions.NEED,
                            name: 'direction',
                            defaultChecked: searchContext.get('direction') === directions.NEED
                        })
                    )
                ),
                
                React.DOM.label({}, 
                    'Quoi ?',
                    React.DOM.input({
                        type: 'text',
                        name: 'what'
                    })
                ),
                
                React.DOM.label({},
                    'Où ?',
                    React.DOM.input({
                        type: 'text',
                        name: 'where'
                    })
                ),
                
                React.DOM.label({}, 
                    'Photo',
                    React.DOM.input({
                        type: 'file',
                        name: 'pic'
                    })
                ),
                
                React.DOM.div({className: 'submit-group'}, 
                    React.DOM.button({
                        type: "submit"
                    }, "Poster")
                )
            )
        )             
    }
    
});

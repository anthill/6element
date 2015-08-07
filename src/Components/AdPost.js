"use strict";

var React = require('react');

var displayActions = require('../Actions/displayActionCreator');
var searchContextStore = require('../Stores/searchContextStore');

var directions = require('../Constants/directions.js');

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
                }
            }, 
                // mode switch
                React.DOM.div({className: 'mode-switch'}, 
                    React.DOM.label({}, 
                        'Je me sépare',
                        React.DOM.input({
                            type: 'radio',
                            value: 'give',
                            name: 'direction',
                            defaultChecked: searchContext.get('direction') === directions.GIVE
                        })
                    ),
                    React.DOM.label({}, 
                        'Je récupère',
                        React.DOM.input({
                            type: 'radio',
                            value: 'need',
                            name: 'direction',
                            defaultChecked: searchContext.get('direction') === directions.NEED
                        })
                    )
                ),
                
                React.DOM.label({}, 
                    'Quoi ?',
                    React.DOM.input({
                        type: 'text',
                        id: 'what'
                    })
                ),
                
                React.DOM.label({},
                    'Où ?',
                    React.DOM.input({
                        type: 'text',
                        id: 'where'
                    })
                ),
                
                React.DOM.label({}, 
                    'Photo',
                    React.DOM.input({
                        type: 'file',
                        id: 'pic'
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

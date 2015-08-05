"use strict";

var React = require('react');

var displayActions = require('../Actions/displayActionCreator');

module.exports = React.createClass({

    displayName: 'AdPost',

    getInitialState: function(){
        return {};
    },
    
    render: function() {
        // Do NOT use 'ad-post' as class name since it's blocked by AdBlock
        return React.DOM.div({className: "post-an-ad"}, [
            
            React.DOM.button({
                onClick: displayActions.goBack
            }, '⇚'),
            
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
                            id: 'give',
                            name: 'give-need'
                        })
                    ]),
                    React.DOM.label({}, [
                        'Je récupère',
                        React.DOM.input({
                            type: 'radio',
                            id: 'need',
                            name: 'give-need'
                        })
                    ])
                ]),
                
                React.DOM.label({}, [
                    'Quoi ?',
                    React.DOM.input({
                        type: 'text',
                        id: 'what'
                    })
                ]),
                
                React.DOM.label({}, [
                    'Où ?',
                    React.DOM.input({
                        type: 'text',
                        id: 'where'
                    })
                ]),
                
                React.DOM.label({}, [
                    'Photo',
                    React.DOM.input({
                        type: 'file',
                        id: 'pic'
                    })
                ]),
                
                React.DOM.div({className: 'submit-group'}, [
                    React.DOM.button({
                        type: "submit"
                    }, "Poster")
                ])
            ])
        ])                 
    }
    
});

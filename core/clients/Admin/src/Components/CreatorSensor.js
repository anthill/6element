'use strict';

var React = require('react');

/*

interface SelectorProps{
    onCreateSensor: function()
}
interface SelectorState{

}


*/

var CreatorSensor = React.createClass({
    displayName: 'CreatorSensor',
    
    render: function() {
        // var self = this;
        var props = this.props;
        // var state = this.state;

        // console.log('CreatorSensor props', props);
        // console.log('CreatorSensor state', state);

        return React.DOM.div({className: 'creator'},
            React.DOM.ul({},
                React.DOM.li({}, 
                    React.DOM.div({}, "New sensor"),
                    React.DOM.form({
                        onSubmit: function(e){
                            e.preventDefault();

                            console.log('Creating Sensor');

                            props.onCreateSensor({
                                'name': e.target.sensorName.value,
                                'phone_number': e.target.Phone.value
                            });
                        }
                    },
                        React.DOM.input({
                            type: 'text',
                            name: 'sensorName',
                            placeholder: "Sensor's name"//,
                        }),
                        React.DOM.input({
                          type: 'text',
                          name: 'Phone',
                          placeholder: "Phone"
                        }),
                        React.DOM.input({
                          type: 'submit',
                          name: 'submit',
                          value: "Créer"
                        })
                    )
                )
            )
        );
    }
});

module.exports = CreatorSensor;

'use strict';

var React = require('react');

/*
interface Rcs Props{
    selectedRC : RC
}
interface Rcs State{
}
*/


var RcContent = React.createClass({
	displayName: 'RcContent',

    render: function() {
        
        var props = this.props;
        
        var content = undefined;
        var lis =[];
        
        if (props.selectedRC){
            content = {
                address: props.selectedRC.address,
                lat: props.selectedRC.coords.lat,
                long: props.selectedRC.coords.long,
                phone: props.selectedRC.phone,
                owner: props.selectedRC.owner
            };
            
            for (var field in content){
                var li = React.DOM.li({},
                    React.DOM.div({}, field),
                    React.DOM.div({}, content[field])
                );
                
                lis.push(li);
            };
        }
            
        return React.DOM.div({className: 'rcContent'}, 
            React.DOM.h1({}, 'Informations'), 
            React.DOM.ul({},
                lis
            )
        );       
    }
});


module.exports = RcContent;
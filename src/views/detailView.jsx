"use strict";

var React = require('react');
var Mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var DefaultRawTheme = Mui.Styles.LightRawTheme;
var Calendar  =  require('./calendar.js');
var Traffic  =  require('./traffic.js');
var Mui = require('material-ui');
var Colors = require('material-ui/lib/styles/colors');

var NotEmpty = function(field){
    if(typeof field === 'undefined') return false;
    if(field === null) return false;
    if(field === '') return false;
    return true;
}

module.exports = React.createClass({
    childContextTypes: {
        muiTheme: React.PropTypes.object
    },
    getChildContext: function() {
        return { muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme) };
    },
    render: function() {

        var self = this;
        var object = this.props.object;

        // Distance field
        var distance = (object.distance > 1000) ? 
            (object.distance/1000).toFixed(2) + " Km":
            Math.round(object.distance).toString() + " m";

        // Categories list
        console.log(object.properties);
        var list = (object.properties.bins !== undefined) ?
                    object.properties.bins :
                    object.properties.objects;
        var allowedJSX = Object.keys(list)
        .map(function(category, id){
            return (<li key={'allow'+id.toString()}><label className={(list[category] === "1")?"open":"closed"}>&bull;</label> {category}</li>);
        });

        // Address
        var coordinatesJSX = [];
        if(NotEmpty(object.properties.address_1)){
            coordinatesJSX.push(<span>{object.properties.address_1}</span>);
            coordinatesJSX.push(<br/>);
        }
        if(NotEmpty(object.properties.address_2)){
            coordinatesJSX.push(<span>{object.properties.address_2}</span>);
            coordinatesJSX.push(<br/>);
        }
        if(NotEmpty(object.properties.phone)){
            coordinatesJSX.push(<span><abbr title="phone">T:</abbr> {object.properties.phone}</span>);
            coordinatesJSX.push(<br/>);
        }
        if(coordinatesJSX.length === 0){
            coordinatesJSX.push(<span><em>Pas de coordonnées indiquées</em></span>);
            coordinatesJSX.push(<br/>);
        }

        var calendarJSX = "";
        var detailJSX = "";
        if(NotEmpty(object.properties.opening_hours)){

            calendarJSX = (<Calendar opening_hours={object.properties.opening_hours} />);
            var max = (object.measurements !== undefined) ? object.measurements.max: 0;
            var trafficJSX = (object.properties.pheromon_id !== undefined && 
                            object.properties.pheromon_id !== null) ?
                            (<Traffic opening_hours={object.properties.opening_hours} pheromonId={object.properties.pheromon_id} max={max}/>) 
                            :
                            (<p id="traffic"><em>Ce centre n&apos;est pas équipé de capteur d&apos;affluence</em></p>);  
            detailJSX = (
                <Mui.Tabs>
                    <Mui.Tab label="Affluence" style={{backgroundColor: Colors.blueGrey200}}>
                        <br/>
                        {trafficJSX}
                    </Mui.Tab>
                    <Mui.Tab label="Elements acceptés" style={{backgroundColor: Colors.blueGrey200}}>
                        <div id="allowedObjects" className="row clearfix styleRow">
                            <br/>
                            <ul>{allowedJSX}</ul>
                        </div>
                    </Mui.Tab>
                </Mui.Tabs>);
        }
        else
        {
            detailJSX = (
                <div id="allowedObjects" className="row clearfix styleRow">
                    <br/>
                    <ul>{allowedJSX}</ul>
                </div>);
        }

        // Final Object render
        return (
        <div className="fixedHeader fixedFooter">
            <div id="sheet">
                <Mui.Card id="detail">
                    <Mui.CardHeader 
                        title={object.properties.name} 
                        subtitle={object.file}
                        avatar={<Mui.Avatar style={{backgroundColor: object.color}}></Mui.Avatar>}
                        style={{textAlign: "left", overflow: "hidden"}}/>
                </Mui.Card>
                <table style={{width:"100%", backgroundColor: Colors.blueGrey100}}>
                    <tbody>
                        <tr>
                            <td id="address"style={{width:"50%", padding:"10px", verticalAlign: "top"}}>
                                <Mui.CardTitle title="Adresse" subtitle={coordinatesJSX}/>
                            </td>
                            <td id="accessTime" style={{width:"50%", padding:"10px", verticalAlign: "top"}}>
                                <Mui.CardTitle title="Horaires" subtitle={calendarJSX}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {detailJSX}
            </div>
        </div>);
    }
});
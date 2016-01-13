'use strict';

// done with http://gka.github.io/palettes/#colors=NavajoWhite,SandyBrown,OrangeRed,DarkRed|steps=7|bez=1|coL=0
var colorScale = [
	'#32cd32',
	'#5fd52f',
	'#7fdc2b',
	'#9ce427',
	'#b6eb22',
	'#cff21b',
	'#e7f811',
	'#ffff00',
	'#ffe800',
	'#ffd000',
	'#ffb800',
	'#ffa000',
	'#ff8500',
	'#ff6800',
	'#ff4500',
	'#ff0000'
];

module.exports = function getColor(v, min, max) {    
    var nbColors = colorScale.length;

    if(v <= min)
        return colorScale[0];
    
    if(v >= max)
        return colorScale[nbColors - 1];
    
    return colorScale[ Math.round((v - min) * (nbColors - 1)/(max - min)) ];
};

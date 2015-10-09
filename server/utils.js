"use strict";

var colors = [
	'#265846',
	'#077527',
	'#ED7AEB',
	'#D6DC7B',
	'#DF45A8',
	'#15F2AC',
	'#D75267',
	'#E923D4',
	'#EBB30F',
	'#214DFD',
	'#516B27',
	'#41B93D',
	'#79F879',
	'#2002A1',
	'#AA8750',
	'#7FD045',
	'#D8C458',
	'#79A67E',
	'#01760F',
	'#76561D',
	'#CFCE4B',
	'#2DB8DE',
	'#D9B0B3',
	'#7795D5',
	'#61927C',
	'#D35381'
];

module.exports = {
	colors: colors,
	GetRandomColor: function() {
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}
}

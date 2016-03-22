'use strict';

function getCurrentSearch(){

    var search = location.search.substring(1);
    search = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

    if(search.position === undefined) return undefined;
        
    var position = JSON.parse(search.position);

    return {lat: position[0], lon: position[1]};
}


function activateUncertified(){

	var btnUncertified = document.querySelector('#uncertified');
	var btnCertified = document.querySelector('#certified');
	btnUncertified.className = 'btn-active';
	btnCertified.className = 'btn-inactive';
}

function activateCertified(){

	var btnUncertified = document.querySelector('#uncertified');
	var btnCertified = document.querySelector('#certified');
	btnUncertified.className = 'btn-inactive';
	btnCertified.className = 'btn-active';
}

function showFilters(){
	document.querySelector('#show-filters').style.visibility = 'hidden';
	document.querySelector('#filters').style.visibility = 'visible';
}

function hideFilters(){
	document.querySelector('#show-filters').style.visibility = 'visible';
	document.querySelector('#filters').style.visibility = 'hidden';
}

'use strict';

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

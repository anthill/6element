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
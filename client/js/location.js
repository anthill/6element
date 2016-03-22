'use strict';

/* *** DISPLAY LOADING ***/
function displayLoading(){
    var nodeLog = document.getElementById('errorposition');
    if(nodeLog === null) return;
    var img = document.createElement('img');
    img.setAttribute('src', '../img/loading.gif');
    img.setAttribute('height', '64');
    img.setAttribute('width', '64');
    img.setAttribute('alt', 'chargement');
    nodeLog.innerHTML = '';
    nodeLog.appendChild(img);   
}

 function getCurrentSearch(){

    var search = location.search.substring(1);
    search = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

    if(search.position === undefined) return undefined;
        
    var position = JSON.parse(search.position);

    return {lat: position[0], lon: position[1]};
}

/*** AUTOLOCATION ***/

function getTarget(){
    var list = document.getElementsByClassName('btn-active');
    if(list.length > 0)
        return list[0].innerText === 'Déchèteries' ? 'decheteries' : 'alternatives';
    else
        return window.location.pathname.substr(window.location.pathname.lastIndexOf("/") + 1).split('.')[0];
}

function success(position){
    var now = new Date();
    var strDate = now.getDate().toString()+'-'+(now.getMonth()+1).toString()+'-'+now.getFullYear().toString();
    window.location.href = '/'+getTarget()+'.html?position=['+position.coords.latitude+','+position.coords.longitude+']&date='+strDate;
}

function error(error){
    var info = 'Erreur de géolocalisation : ';
        switch(error.code) {
        case error.TIMEOUT:
            info += 'Timeout !';
        break;
        case error.PERMISSION_DENIED:
            info += 'Vous n’avez pas donné la permission';
        break;
        case error.POSITION_UNAVAILABLE:
            info += 'La position n’a pu être déterminée';
        break;
        case error.UNKNOWN_ERROR:
            info += 'Erreur inconnue';
        break;
        }
    document.getElementById('errorposition').innerHTML = info;
}

function getCurrentPosition(){

    if(navigator.geolocation) {
        displayLoading();
        navigator.geolocation.getCurrentPosition(success, error);
    }
    else{
        alert('Ce navigateur ne supporte pas la géolocalisation');
    }
}

/*** GOOGLE AUTOCOMPLETE ***/
function initializeAutocomplete(id) {

    var element = document.getElementById(id);
    if (element) {

        /* Aquitaine bounding: doesn't work
        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(43.357, -1.785),
            new google.maps.LatLng(45.58, 1.116));*/

        var autocomplete = new google.maps.places.Autocomplete(element, { /*bounds: defaultBounds,*/ types: ['geocode'], componentRestrictions: {country: 'fr'} });
        google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChanged);
        google.maps.event.addDomListener(element, 'keydown', function(e) { 
            if (e.keyCode === 13) { 
                e.preventDefault(); 
            }
        }); 
    }
}

function onPlaceChanged() {
    var place = this.getPlace();
    
    if(place.geometry.location === undefined) return;

    //else console.log(place.geometry);
    displayLoading();

    var now = new Date();
    var strDate = now.getDate().toString()+'-'+(now.getMonth()+1).toString()+'-'+now.getFullYear().toString();
    window.location.href = '/'+getTarget()+'.html?position=['+place.geometry.location.lat()+','+place.geometry.location.lng()+']&date='+strDate;
}

initializeAutocomplete('where-input');

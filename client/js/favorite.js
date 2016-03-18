'use strict';

function setCookie(sName, sValue) {
    var today = new Date(), expires = new Date();
    expires.setTime(today.getTime() + (365*24*60*60*1000));// 1 year
    document.cookie = sName + '=' + encodeURIComponent(sValue) + ';expires=' + expires.toGMTString();
}

function getCookie(sName) {
    var oRegex = new RegExp('(?:; )?' + sName + '=([^;]*);?');
    if (oRegex.test(document.cookie)) {
            return decodeURIComponent(RegExp['$1']);
    } else {
            return undefined;
    }
}


function changeFavorite(e){
	var button = e.currentTarget;
	var isFavorite = button.class === 'place-favorite';
	button.class = isFavorite ? 'place-no-favorite' : 'place-favorite';
	e.currentTarget.firstChild.src = isFavorite ? '../img/no-favorite.svg' : '../img/favorite.svg';
	var id = button.id.replace('register-','');
	var cookie_places = getCookie('6element-places') || '';
	if(isFavorite) 	setCookie('6element-places', cookie_places.replace(id + ';',''));// remove place in cookie
	else 			setCookie('6element-places', cookie_places + id + ';');// add place in cookie

	ga('send', {
		hitType: 'event',
		eventCategory: 'Favorites',
		eventAction: 'changeFavorite',
		eventLabel: id + ':' + (isFavorite ? 'false' : 'true')
	});
}

function initializeAllFavorites(){
	
	// Initialize all as no favorite
	var list = document.getElementsByClassName('place-no-favorite');
	for(var i= 0; i<list.length; ++i){
		var button = list[i]; 
		button.addEventListener('click', function(e){
			changeFavorite(e);
		});
	}
	
	// Then read cookie and initialize favorites 
	var cookie_places = getCookie('6element-places');
	if(cookie_places !== undefined){
		var listIds = cookie_places.split(';');
		for(var i= 0; i<listIds.length; ++i){
			if(listIds[i] === '') continue;
			var button = document.getElementById('register-'+listIds[i]);
			if(button !== null){ 
				button.class = 'place-favorite';
				button.firstChild.src = '../img/favorite.svg'; 	
			}
		}
	}
}

function getFavorites(){

	if (navigator.cookieEnabled) {
        // Cookies allowed	
		var cookie_places = getCookie('6element-places');
		console.log(cookie_places);
		if(cookie_places !== undefined){
			
			// Parse cookie
			var listIds = [];
			var temp = cookie_places.split(';');
			for(var i= 0; i<temp.length; ++i){
				if(temp[i] !== '') listIds.push(temp[i]);
			}
			
			if(listIds.length > 0){
				var now = new Date();
				var strDate = now.getDate().toString()+'-'+(now.getMonth()+1).toString()+'-'+now.getFullYear().toString();
				window.location.href = '/decheteries.html?places=['+listIds.join(',')+']&date='+strDate;
			}
			else
				document.getElementById('errorposition').innerHTML = "Vous n'avez pas encore enregistré de déchèteries";
		}	
		else
			document.getElementById('errorposition').innerHTML = "Vous n'avez pas encore enregistré de déchèteries";

	} else {
		document.getElementById('errorposition').innerHTML = 'Votre navigateur ne prend pas en charge les cookies';
	}
}

initializeAllFavorites();

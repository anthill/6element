'use strict';

function setActivePanel(e){
	var button = e.srcElement.parentNode;
	var id = button.id.replace('activate-','');
	
	var panelCanvas = document.getElementById('panel-canvas-'+id);
	var panelInfos 	= document.getElementById('panel-infos-'+id);
	
	panelCanvas.className = panelCanvas.className === 'panel-active' ? 'panel-hidden' : 'panel-active';
	panelInfos.className  = panelInfos.className  === 'panel-active' ? 'panel-hidden' : 'panel-active';
	e.srcElement.src = panelCanvas.className === 'panel-active' ? '../img/infos.svg' : '../img/chart.svg'; 	
}

function initializeAllPanels(){
	var list = document.getElementsByClassName('place-infos');
	for(var i= 0; i<list.length; ++i){
		var button = list[i]; 
		button.addEventListener('click', setActivePanel);
	}
}

initializeAllPanels();

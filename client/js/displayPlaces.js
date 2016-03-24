'use strict';

(function(global){

    var markersLayer;

    var unselectMarker = function(){

        var preview = document.querySelector('#preview');
        if(preview !== null)
            preview.parentNode.removeChild(preview);
    }

   // Add a preview footer under the map when clicking marker
    var onClickMarker = function (e){
        
        var place = e.target.place;
        
        var preview = document.querySelector('#preview');
        if(preview !== null)
            preview.parentNode.removeChild(preview);

        // preview
        preview = document.createElement('nav');
        preview.setAttribute('id', 'preview');
        document.querySelector('#map').parentNode.appendChild(preview);

        // adapt-width
        var adaptWidth = document.createElement('div');
        adaptWidth.classList.add('adapt-width');
        preview.appendChild(adaptWidth);

        // place-header
        var placeHeader = document.createElement('ul');
        placeHeader.classList.add('place-header');
        adaptWidth.appendChild(placeHeader);

        // avatar
        var li = document.createElement('li');
        placeHeader.appendChild(li);
        var avatar = document.createElement('span');
        avatar.classList.add('place-avatar');
        li.appendChild(avatar);
        avatar.style.backgroundColor = place.properties.bins.length > 0 ? place.properties.bins[0].color : '#616161';

        // title
        li = document.createElement('li');
        placeHeader.appendChild(li);
        var title = document.createElement('span');
        title.classList.add('place-title');
        var distance = (place.properties.distance > 1000) ? (place.properties.distance/1000).toFixed(2) + ' Km' : 
                                                  Math.round(place.properties.distance).toString() + ' m';
        li.appendChild(title);

        var subtitle = place.properties.bins.map(function(bin){
            console.log(place);
            return bin.o.join(' - ');
        }).join(' - ');

        title.innerHTML = place.properties.name+' - '+distance+'<br/><span class="place-subtitle">'+subtitle+'</span>';

        // 2nd ul + icons
        var ul = document.createElement('ul');
        placeHeader.appendChild(ul);
        ul.style.float = 'right';
        ul.style.listStyleType = 'none';
        ul.innerHTML =  '<li><button class="place-infos"><img src="../img/infos.svg"/></button></li>';
        ul.innerHTML += '<li><button class="place-available"><img src="../img/available.svg"/></button></li>';
    }

    global.displayPlaces = function(centroid, map, places, filterValues){

        var allowed = [];
        var list = document.querySelectorAll('#filters li.child .checked');
        
        for(var i = 0; i< list.length; ++i ){
            allowed.push(list[i].nextSibling.nextSibling.innerText);
        }


        if(markersLayer){
            map.removeLayer(markersLayer);
            markersLayer = undefined;
        }

        var markers = places
        .filter(function(place){

            return (place.properties.bins === null) ? false :
            place.properties.bins
            .map(function(bin){
                return bin.o;
            })
            .reduceRight(function(a,b){
                return a.concat(b);
            }, [])
            .some(function(object){
                return (allowed.indexOf(object) !== -1);
            })

        })
        .map(function(place){

            var lat = place.geometry.coordinates.lat || place.geometry.coordinates[0];
            var lon = place.geometry.coordinates.lon || place.geometry.coordinates[1];

            var colors = place.properties.bins === null ? [] : place.properties.bins.map(function(bin){
                return bin.color;
            })

            var marker = undefined;
            if(colors.length < 2){
            
                var isCenter = (place.properties.type === 'centre');
                var options = {
                    color: 'black',
                    fill: true,
                    fillColor: colors[0] || '#616161', 
                    fillOpacity: 1,
                    radius: isCenter ? 10 : 7,
                    clickable: true,
                    weight: isCenter ? 5 : 3 
                };
                marker = new L.CircleMarker(new L.LatLng(lat, lon), options);
            }
            else 
            {

                var html = '<div><div class="leaflet-pointer"></div>';
                colors.slice(0,3).forEach(function(color){
                    html += '<div style="display:inline-block;width:17px;height:17px;background-color:'+color+';border:solid rgba(0,0,0,0.5) 3px;border-radius:50%; margin: 0;"></div>';    
                })
                if(colors.length > 3){
                    html += '<div class="leaflet-more">...</div>';                        
                }
                html += '</div>';


                var multiIcon = L.divIcon({
                    //iconUrl:     '/img/centroid.svg',
                    html: html,
                    iconSize:     [100, 40],
                    shadowSize:   [0, 0], // size of the shadow
                    iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
                    shadowAnchor: [10, 10], // the same for the shadow
                    popupAnchor:  [-3, -40] // point from which the popup should open relative to the iconAnchor
                });
                marker = new L.Marker([lat, lon], {icon: multiIcon});                
            }

            if(marker){

                marker['place'] = place;
                marker.on('click', onClickMarker); 
            } 
           
            return marker;
        });


        var CentroidIcon = L.Icon.Default.extend({
            options: {
                iconUrl:     '/img/centroid.svg',
                iconSize:     [40, 40],
                shadowSize:   [0, 0], // size of the shadow
                iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
                shadowAnchor: [10, 10], // the same for the shadow
                popupAnchor:  [-3, -40] // point from which the popup should open relative to the iconAnchor
            }
        });
        var centroid = new L.Marker(new L.LatLng(centroid.lat, centroid.lon), {icon: new CentroidIcon()});
        markers.push(centroid);
        centroid.addTo(map); 

        markersLayer = L.layerGroup(markers);
        map.addLayer(markersLayer);
        map.on('click', unselectMarker); 
    };

})(this);

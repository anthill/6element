'use strict';

(function(global){

    var markersLayer;

    var unselectMarker = function(){

        var preview = document.querySelector('#preview');
        if(preview !== null)
            preview.parentNode.removeChild(preview);
    }

    var updateBinById = function(e){

        // We need
        // - id
        // - osm or local database
        // for each bin: id, type, available, objects
        var ids = document.querySelectorAll('#preview .place-subtitle');
        if(ids.length === 0) return;

        var id = parseInt(ids[0].innerText.split(' - ')[0].substring(1));
        var certified = document.querySelector('#certified').className === 'btn-active';

        var list = document.querySelectorAll('#preview ul.bins li');
        var bins = [];
        for(var i = 0; i < list.length; ++i ){
            var li = list[i];
            var json = JSON.parse(li.childNodes[1].innerText);
            var available = li.classList.contains('border-open');

            if(li === e.currentTarget){
                // We switch it status
                available = !available;
                li.classList.remove(available ? 'border-closed' : 'border-open'); 
                li.classList.add(available ? 'border-open' : 'border-closed'); 
            }
            bins.push({id: json.id, t: json.t, a: available, o: json.o});
        } 
    
        // Send request
        fetch('/bins/updateById', {
            method: 'POST',
            body: JSON.stringify({
                id: id,
                certified: certified,
                bins: bins
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function(result){ 
            reloadMap();
        })
        .catch(function(error){
            console.error(error);
        })
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
        //adaptWidth.classList.add('overflow');
        preview.appendChild(adaptWidth);

        // place-header
        var placeHeader = document.createElement('ul');
        placeHeader.classList.add('place-header');
        adaptWidth.appendChild(placeHeader);

        // title
        var li = document.createElement('li');
        placeHeader.appendChild(li);
        
        var title = document.createElement('span');
        title.classList.add('place-title');
        var distance = (place.properties.distance > 1000) ? (place.properties.distance/1000).toFixed(2) + ' Km' : 
                                                  Math.round(place.properties.distance).toString() + ' m';
        title.innerHTML = place.properties.name || place.properties.type;
        title.innerHTML += '<br/><span class="place-subtitle">#'+place.properties.id+' - '+distance+'</span>';
        li.appendChild(title);


        li = document.createElement('li');
        placeHeader.appendChild(li);

        var legend = document.createElement('span');
        legend.classList.add('legend');
        legend.textContent = 'Cliquez sur chaque élément pour modifier sa disponibilité';
        li.appendChild(legend);

        var ul = document.createElement('ul');
        li.appendChild(ul);
        ul.style.float = 'left';
        ul.style.listStyleType = 'none';
        ul.classList.add('bins');

        place.properties.bins.forEach(function(bin){
            
            var li = document.createElement('li');
            ul.appendChild(li);
            li.innerHTML = '<span>'+translate(bin.t)+'</span><span class="hidden" style="display: none;">'+JSON.stringify(bin)+'</span>';
            li.classList.add(bin.a?'border-open':'border-closed');

            li.addEventListener('click', updateBinById)
        });
    }

    global.displayPlaces = function(centroid, map, places){

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
                return bin.o === undefined ? [] :
                bin.o.map(function(object){
                    return translate(object);
                });
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
            var strokeColors = place.properties.bins === null ? [] : place.properties.bins.map(function(bin){
                return bin.a ? 'rgba(0,153,5,0.5)' : 'rgba(255,0,0,0.5)';
            })

            var marker = undefined;
            if(colors.length < 2){
            
                var isCenter = (place.properties.type === 'centre');

                var options = {
                    color: strokeColors[0] ||'black',
                    opacity: 1,
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
                colors.slice(0,3).forEach(function(color, index){
                    html += '<div style="display:inline-block;width:17px;height:17px;background-color:'+color+';border:solid '+strokeColors[index]+' 3px;border-radius:50%; margin: 0;"></div>';    
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

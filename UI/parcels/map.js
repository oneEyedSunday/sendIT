// Initialize and add the map
function initMap() {
    // The location of Uluru
    const ikeja = {lat: 6.595680, lng: 3.337030};
    const ojota = {lat: 6.586300, lng: 3.382520};
    // The map, centered at Uluru
    const destInfo = new google.maps.InfoWindow({
        content: 'Destination'
    });
    const locationInfo = new google.maps.InfoWindow({
        content: '<div id="content"><div id="siteNotice"></div><h1 id="firstHeading" class="firstHeading">Present Location</h1></div>'
    });
    const map = new google.maps.Map(document.getElementById('map'), {zoom: 12, center: ikeja});

    const markertwo = new google.maps.Marker({
        position: new google.maps.LatLng(6.586300, 3.382520), 
        // ojota
        map: map,
        title: 'Ojota, Lagos'
      })

      var polyline = new google.maps.Polyline({
        // set desired options for color, opacity, width, etc.
        strokeColor:"#FF0000",  // blue (RRGGBB, R=red, G=green, B=blue)
        strokeOpacity: 0.4      // opacity of line
     });
        //   deleteMarkers(markersArray);

      // The marker, positioned at Uluru
    const marker = new google.maps.Marker({position: ikeja, map: map, title: 'Ikeja, Lagos'});
    markertwo.addListener('click', function() {
        destInfo.open(map, markertwo);
      });
    marker.addListener('click', function(){
        locationInfo.open(map,marker);
    })

    polyline.setMap(map);
    polyline.setPath([ojota, ikeja]);
}

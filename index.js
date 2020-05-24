window.markers = [];
window.position = {};

function initMap() {
  let myLatLng = { lat: 19.1239285, lng: 72.90944069999998 };


  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: myLatLng
  });

  if (window.position) {
    map.setCenter(window.position);
  }
  geocoder = new google.maps.Geocoder();

  for (let i = 0, length = markers.length; i < length; i++) {

    geocoder.geocode({ 'address': markers[i] }, function (results, status) {
      if (status === 'OK') {

        data = results[0].geometry.location;

        // Creating a marker and putting it on the map
        let marker = new google.maps.Marker({
          position: data,
          icon: 'corona.png',
          map: map,
          title: window.markers[i]
        });

        let infoWindow = new google.maps.InfoWindow();
        // Attaching a click event to the current marker
        google.maps.event.addListener(marker, "click", function (e) {
          infoWindow.setContent(window.markers[i]);
          infoWindow.open(map, marker);
        });
        // Creating a closure to retain the correct data 
        //Note how I pass the current data in the loop into the closure (marker, data)
        (function (marker, data) {

          // Attaching a click event to the current marker
          google.maps.event.addListener(marker, "click", function (e) {
            infoWindow.setContent(window.markers[i]);
            infoWindow.open(map, marker);
          });

        })(marker, data);
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
  
  marker = new google.maps.Marker({
    position: window.position,
    icon: 'location.png',
    map: map,
  });

  var radius = 1000;
      var position = marker.getPosition();

      var circle = new google.maps.Circle({
        center: position,
        radius: radius,
        fillColor: "#0000FF",
        fillOpacity: 0.1,
        map: map,
        strokeColor: "#FFFFFF",
        strokeOpacity: 0.1,
        strokeWeight: 2
      });
      
      // for radius code refrence
      //  https://stackoverflow.com/questions/33859607/how-to-add-circles-around-markers-on-google-maps-api


}

window.onload = () => {

  const url = "https://data.geoiq.io/dataapis/v1.0/covid/nearbyzones";
  const key = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtYWlsSWRlbnRpdHkiOiJvbmthYXIuc2FybGFAZ21haWwuY29tIn0.pMOwSBIYZsYsTC6NahozR1D5edXEV5vgY0bbHRiqPY8";
  let list = [];
  let lat, lng;

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  function success(pos) {
    let crd = pos.coords;
    lat = crd.latitude;
    lng = crd.longitude;
    window.position = {
      lat: lat,
      lng: lng
    };


    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        "key": key,
        "lng": lng,
        "lat": lat,
        "radius": 1000
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json();
    }).then(res => {
      console.log(res);
      window.markers = res.containmentZoneNames;
      initMap();
      return res.containmentZoneNames;
    }).catch(err => {
      console.error(err);
      alert('Some Error. Refresh the page');
    })
  }

  navigator.geolocation.getCurrentPosition(success, error);
}
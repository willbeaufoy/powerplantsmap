function initialize() {
	console.log('init')
  map = new google.maps.Map(document.getElementById('uk-map-canvas'), {
  	center: new google.maps.LatLng(53.90, -2.8),
		zoom: 6,
		mapTypeId: google.maps.MapTypeId.HYBRID
	});
}

google.maps.event.addDomListener(window, 'load', initialize);
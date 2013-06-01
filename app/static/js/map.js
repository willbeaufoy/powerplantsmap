var infoWindow = new google.maps.InfoWindow();
var DEFAULT_ICON_URL = '/static/img/20px-Powerplant_icon.png';
var map

function createMarker (coordinate, url, content) {
  var marker = new google.maps.Marker({
		map: map,
		position: coordinate,
		icon: new google.maps.MarkerImage(url)
  });
  google.maps.event.addListener(marker, 'click', function(event) {
		infoWindow.setPosition(coordinate);
		infoWindow.setContent(content);
		infoWindow.open(map);
  });
};

function fetchData() {
	var url = '/json-data?callback=?'
	console.log('fetchdata')
	$.ajax({
		url: url,
		dataType: 'jsonp',
		error: onError,
		success: onDataFetched
	});
}

function onError(jqXHR, textStatus, errorThrown) {
	console.log('error')
	console.log(jqXHR)
	console.log(textStatus)
	console.log(errorThrown)
}

function onDataFetched(data) {
	console.log('datafetched')
	console.log(data)
	//var rows = data['site1'];
	//console.log('Rows'+rows[2]);
	var site;
	var coordinate;  
	//console.log(data.length)
	//console.log(data.keys(o)) 
	for (var i in data) {
		//site = data[i][1]
		//console.log(site)
	// for(var i = 0 ; i < data.length ; i++) {
// 		row = data[i]
// 		site = row[1]
// 		console.log(site)
		console.log(data[i][1])
		console.log(data[i][2])
		console.log(data[i][3])
	  coordinate = new google.maps.LatLng(data[i][2],data[i][1]);
  iconUrl = DEFAULT_ICON_URL; //console.log('iconUrl'+iconUrl);
  content = "<strong>" + data[i][0] + "</strong><br><br>"; // Name
  content += "Type: " + data[i][6] + "<br>"; // Name
  content += "Max Output: " + data[i][7] + " MW<br>"; // Name
  content += "Built: " + data[i][8] + "<br>"; // Name
  //content += "Decommission date: " + data[i][7] + "<br>"; // Name
  //content += "Owner: " + data[i][8] + "<br>"; // Name
  if (iconUrl) {
		createMarker(coordinate, iconUrl, content);
  }
  else {
		createMarker(coordinate, DEFAULT_ICON_URL, content);
  }
	}
}

function initialize() {
	fetchData(); 
  map = new google.maps.Map(document.getElementById('uk-map-canvas'), {
		center: new google.maps.LatLng(53.90, -2.8),
		zoom: 6,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
}

google.maps.event.addDomListener(window, 'load', initialize);
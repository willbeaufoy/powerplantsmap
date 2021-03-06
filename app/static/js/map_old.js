var map;
var infoWindow = new google.maps.InfoWindow();
var baseurl = location.protocol + "//" + location.host + "/"
var icon_small = {x: 10, y: 8}
var icon_medium = {x: 17, y: 14}
var icon_large = {x: 30, y: 24}
var currentId = 0;
var uniqueId = function() {
    return ++currentId
}

var markers = {}

function createMarker (type, coordinate, iconurl, title, content) {

    var id = uniqueId()
    var icon_dims

    if(map.zoom > 11) {
        icon_dims = icon_large
    }

    else if(map.zoom > 7) {
        icon_dims = icon_medium
    }

    else {
        icon_dims = icon_small
    }

    if(iconurl.indexOf('default-marker.png') != -1) {
        var icon = iconurl
    }

    else {
        var icon = {
            url: iconurl,
            scaledSize: new google.maps.Size(icon_dims.x, icon_dims.y)
        }
    }

   var marker = new google.maps.Marker({
        id: id,
        title: title,
        map: map,
        position: coordinate,
        icon: icon
   })

    markers[id] = marker

    google.maps.event.addListener(marker, 'click', function(event) {
        infoWindow.setPosition(coordinate)
        infoWindow.setContent(content)
        infoWindow.open(map)
    })
}

function fetchData(country_ids, type_ids) {

    currentId = 0
    markers = {}

    console.log(country_ids)

    // Construct the URL
    var url = [baseurl + 'sites'];
    url.push('?');
    for(var n in country_ids) {
        url.push('&country_id=' + country_ids[n])
    }
    for(var n in type_ids) {
        url.push('&type_id=' + type_ids[n])
    }
    url.push('&callback=?');

    console.log(url.join(''))

    // Send the JSONP request using jQuery
    $.ajax({
        url: url.join(''),
        dataType: 'jsonp',
        error: onError,
        success: onDataFetched
    });
}

function onError(jqXHR, textStatus, errorThrown) {
    console.log('errorz')
    console.log(jqXHR)
    console.log(textStatus)
    console.log(errorThrown)
}

function onDataFetched(data) {
    var iconUrl
    var content
    var coordinate
    var category
    for (var i in data) {
        title = data[i]['name']
        type = data[i]['type']
        coordinate = new google.maps.LatLng(data[i]['latitude'],data[i]['longitude'])
        content = '<strong>'
        content += data[i]['url'] ? '<a href="' + data[i]['url'] + '">' : ''
        content += data[i]['name']
        content += data[i]['url'] ? '</a>' : ''
        content += '</strong><br>'
        content += "Type: " + data[i]['type']
        content += data[i]['subtype'] && data[i]['subtype'] != 'Unknown' ? " (" + data[i]['subtype'] + ")<br>" : '<br>'
        content += data[i]['capacity'] ? "Capacity: " + data[i]['capacity'] + " MW<br>" : ''
        content += data[i]['installation_year'] ? "Installed: " + data[i]['installation_year'] + "<br>" : ''
        content += data[i]['decommission_year'] ? "Decommission date: " + data[i]['decommission_year'] + "<br>" : ''
        content += data[i]['owner_name'] ? "Owner: " + data[i]['owner_name'] + "<br>" : ''
        content += data[i]['address'] ? "Address: " + data[i]['address'] + "<br>" : ''
        content += data[i]['website'] ? "More info: <a href='http://" + data[i]['website'] + "' target='_blank'>" + data[i]['website'] + "</a><br>" : ''
        iconUrl = data[i]['iconurl']
        createMarker(type, coordinate, iconUrl, title, content)
    }
}

function addZoomListeners() {

    function change_icon_size() {
        if(this.zoom > 7 && this.zoom <= 11 && this.previousZoom <= 7) {
            $.each(this.markers, function() {
                this.setIcon(icon = {
                    url: this.getIcon()['url'],
                    scaledSize: new google.maps.Size(icon_medium.x, icon_medium.y)
                })
            })
        }
        if(this.zoom <= 7 && this.previousZoom > 7) {
          $.each(this.markers, function() {
              this.setIcon(icon = {
                  url: this.getIcon()['url'],
                  scaledSize: new google.maps.Size(icon_small.x, icon_small.y)
              })
            })
        }
            if(this.zoom > 11 && this.previousZoom <= 11) {
                $.each(this.markers, function() {
                this.setIcon(icon = {
                    url: this.getIcon()['url'],
                    scaledSize: new google.maps.Size(icon_large.x, icon_large.y)
                })
            })
        }
        if(this.zoom <= 11 && this.previousZoom > 11) {
            $.each(this.markers, function() {
              this.setIcon(icon = {
                  url: this.getIcon()['url'],
                  scaledSize: new google.maps.Size(icon_medium.x, icon_medium.y)
              })
          })
        }

        this.previousZoom = this.zoom
    }

    google.maps.event.addListener(map, 'zoom_changed', change_icon_size)
}

function close_infowindow() {
    infoWindow.close()
}

function initialize() {

    var selected_countries = []
    $(':checkbox.country-filter').each(function() {
        if($(this).prop("checked", true)) {
            selected_countries.push(this.id)
        }
    })

    var selected_types = []
    $(':checkbox.type-filter').each(function() {
        if($(this).prop("checked", true)) {
            selected_types.push(this.id)
        }
    })

    fetchData(selected_countries, selected_types)

    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(53.90, -2.8),
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        previousZoom: 6,
        markers: markers
    })

    addZoomListeners()

    google.maps.event.addListener(map, 'click', close_infowindow)
}

google.maps.event.addDomListener(window, 'load', initialize);

/* Filter map results */
$(document).ready(function() {
    $(":checkbox.filter").change(function() {
        for(var key in markers) {
            var marker = markers[key]
                marker.setMap(null)
        }
        var selected_countries = []
        $(':checkbox.country-filter').each(function() {
            if($(this).prop("checked") == true) {
                selected_countries.push(this.id)
            }
        })
        var selected_types = []
        $(':checkbox.type-filter').each(function() {
            if($(this).prop("checked") == true) {
                selected_types.push(this.id)
            }
        })
        fetchData(selected_countries, selected_types)
        map.markers = markers
        //addZoomListeners()
        google.maps.event.addListener(map, 'click', close_infowindow)
    })

$('#select-location').submit(function(e) {
    var loadLocation
    loadLocation = $('#select-location-input').val()

    // Convert loadLocation into LatLng
    var geocoder = new google.maps.Geocoder()
    geocoder.geocode({
      'address': loadLocation,
    },
    function(results, status) {
      if(status == google.maps.GeocoderStatus.OK) {
         map.setCenter(results[0].geometry.location)
         map.setZoom(map.getZoom())
      }
    })
    e.preventDefault()
   })
})

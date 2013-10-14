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

function fetchData(country_ids, type_ids) {

    currentId = 0
    markers = {}

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
    })
}

function onDataFetched(data) {
    var iconUrl
    var content
    var coordinate
    var category
    for (var i in data) {
        title = data[i]['name']
        type = data[i]['type']
        lat = data[i]['latitude']
        lng = data[i]['longitude']
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
        createMarker(type, lat, lng, iconUrl, title, content)
    }
}

function onError(jqXHR, textStatus, errorThrown) {
    console.log('error')
    console.log(jqXHR)
    console.log(textStatus)
    console.log(errorThrown)
}

function createMarker (type, lat, lng, iconurl, title, content) {

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

    var icon = L.icon({
        iconUrl: iconurl,
        iconSize: [icon_dims.x, icon_dims.y]
    })
    console.log(title)
    console.log(lat)
    console.log(lng)

    var marker = L.marker([lat, lng], {icon: icon})

    console.log(marker)

    //markers[id] = marker

    marker.addTo(map)
}

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

map = L.map('map').setView([53.90, -2.8], 13)

L.tileLayer('http://{s}.tile.cloudmade.com/9b91c531221948e1882c8eecf589ea99/997/256/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 18
}).addTo(map)

fetchData(selected_countries, selected_types)

function closePopup() {
    //infoWindow.close()
}

map.on('click', closePopup)


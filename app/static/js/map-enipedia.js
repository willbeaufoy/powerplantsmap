var map;
var infoWindow = new google.maps.InfoWindow();
var baseurl = location.protocol + "//" + location.host + "/"
var markersurl = baseurl + "static/img/markers/"
var icon_small = {x: 10, y: 8}
var icon_medium = {x: 17, y: 14}
var icon_large = {x: 30, y: 24}
var currentId = 0;
var markers_ext = ".png"
var all_continents = []
var all_countries = []


var ep_wiki_url = "http://enipedia.tudelft.nl/wiki/"
var uniqueId = function() {
    return ++currentId
}

var markers = {}

function c(args) {
    console.log(args)
}

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

function fetchData(continent_ids, country_ids, fuel_type_ids) {

    currentId = 0
    markers = {}

    //Construct the URL
    // var url = [baseurl + 'sites'];
//     url.push('?');
//     for(var n in country_ids) {
//         url.push('&country_id=' + country_ids[n])
//     }
//     for(var n in type_ids) {
//         url.push('&type_id=' + type_ids[n])
//     }
//     url.push('&callback=?');
// 
//     console.log(url.join(''))

    var continents_query = ''
    var countries_query = ''
    var fuel_types_query = ''

    if(continent_ids[0] != 'All' && continent_ids[0] != 'None') {
        continents_query = "+++++%3Fplant+prop%3AContinent+a%3A" + continent_ids[0] + "+.%0D%0A"
    }

    if(country_ids[0] != 'All' && country_ids[0] != 'None') {
        countries_query = "+++++%3Fplant+prop%3ACountry+a%3A" + country_ids[0] + "+.%0D%0A"
    }
    
    if(fuel_type_ids[0] != 'All') {
        fuel_types_query = "+++++%3Fplant+prop%3AFuel_type+a%3A" + fuel_types[0] + " ++.%0D%0A"
    }
        
    var url = "http://enipedia.tudelft.nl/sparql/?default-graph-uri=&query=BASE+%3Chttp%3A%2F%2Fenipedia.tudelft.nl%2Fwiki%2F%3E%0D%0APREFIX+a%3A+%3Chttp%3A%2F%2Fenipedia.tudelft.nl%2Fwiki%2F%3E%0D%0APREFIX+prop%3A+%3Chttp%3A%2F%2Fenipedia.tudelft.nl%2Fwiki%2FProperty%3A%3E%0D%0APREFIX+cat%3A+%3Chttp%3A%2F%2Fenipedia.tudelft.nl%2Fwiki%2FCategory%3A%3E%0D%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0D%0APREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0Aselect+%3Fplant_name+%3Flatitude+%3Flongitude+%3Ffuel_used+%3FOutputMWh+%3Felec_capacity_MW+%3Fwikipedia_page+%3Fyear_built+%3Fowner_company+%3Fpower_plant_type+where+%7B%0D%0A" + continents_query + countries_query + fuel_types_query + "+++++%3Fplant+rdf%3Atype+cat%3APowerplant+.+%0D%0A+++++%3Fplant+rdfs%3Alabel+%3Fplant_name+.+%0D%0A+++++%3Fplant+prop%3ALatitude+%3Flatitude+.+%0D%0A+++++%3Fplant+prop%3ALongitude+%3Flongitude+.+%0D%0A+++++OPTIONAL%7B%3Fplant+prop%3AFuel_type+%3Ffuel_type+.%0D%0A++++++++++++++%3Ffuel_type+rdfs%3Alabel+%3Ffuel_used+%7D+.%0D%0A+++++OPTIONAL%7B%3Fplant+prop%3AWikipedia_page+%3Fwikipedia_page+%7D+.%0D%0A+++++OPTIONAL%7B%3Fplant+prop%3AYear_built+%3Fyear_built+%7D+.%0D%0A+++++OPTIONAL%7B%3Fplant+prop%3AOwner_company+%3Fowner_company+%7D+.%0D%0A+++++OPTIONAL%7B%3Fplant+prop%3APower_plant_type+%3Fpower_plant_type+%7D+.+%0D%0A+++++%3Fplant+prop%3AAnnual_Energyoutput_MWh+%3FOutputMWh+.+%0D%0A+++++OPTIONAL%7B%3Fplant+prop%3AGeneration_capacity_electrical_MW+%3Felec_capacity_MW+%7D.+%0D%0A%7D+order+by+%3Fplant+%3Ffuel_type&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on"


    // Send the JSONP request using jQuery
    var jqxhr = $.getJSON(url + "&callback=?", function(data) {
        //c(data)
    })
        .done(function(data) {
            c(data['results']['bindings'][0])
            var icon_url
            var content
            var coordinate
            var category
            for (var i in data['results']['bindings']) {
                title = data['results']['bindings'][i]['plant_name']['value']
                type = 1 //data['results']['bindings'][i]['type']
                coordinate = new google.maps.LatLng(data['results']['bindings'][i]['latitude']['value'],data['results']['bindings'][i]['longitude']['value'])
                content = '<strong>'
                content += '<a href="' + ep_wiki_url + data['results']['bindings'][i]['plant_name']['value'].replace(" ", "_") + '">'
                content += data['results']['bindings'][i]['plant_name']['value']
                content += '</a>'
                content += '</strong><br>'
                content += data['results']['bindings'][i]['fuel_used'] ? "Fuel: " + data['results']['bindings'][i]['fuel_used']['value'] : ''
                //content += data['results']['bindings'][i]['capacity'] ? "Capacity: " + data['results']['bindings'][i]['capacity'] + " MW<br>" : ''
                //content += data['results']['bindings'][i]['installation_year'] ? "Installed: " + data['results']['bindings'][i]['installation_year'] + "<br>" : ''
                //content += data['results']['bindings'][i]['decommission_year'] ? "Decommission date: " + data['results']['bindings'][i]['decommission_year'] + "<br>" : ''
                //content += data['results']['bindings'][i]['owner_name'] ? "Owner: " + data['results']['bindings'][i]['owner_name'] + "<br>" : ''
                //content += data['results']['bindings'][i]['address'] ? "Address: " + data['results']['bindings'][i]['address'] + "<br>" : ''
                //content += data['results']['bindings'][i]['website'] ? "More info: <a href='http://" + data['results']['bindings'][i]['website'] + "' target='_blank'>" + data['results']['bindings'][i]['website'] + "</a><br>" : ''
                content += data['results']['bindings'][i]['wikipedia_page'] ? data['results']['bindings'][i]['wikipedia_page']['value'] : ''
                if(data['results']['bindings'][i]['fuel_used']) {
                    icon_url = baseurl + "static/img/markers/" + data['results']['bindings'][i]['fuel_used']['value'].replace(" ", "-").toLowerCase() + "-marker.png"
                }
                else {
                    icon_url = baseurl + "static/img/markers/default-marker.png" //data['results']['bindings'][i]['iconurl']
                }
                createMarker(type, coordinate, icon_url, title, content)
            }        
        })
}

function onError(jqXHR, textStatus, errorThrown) {
    console.log('error')
    console.log(jqXHR)
    console.log(textStatus)
    console.log(errorThrown)
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

    //fetchData(selected_countries, selected_types)

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

    $.ajax({
        url: 'http://enipedia.tudelft.nl/sparql',
        type: 'POST', 
        data: {
            query: "BASE <http://enipedia.tudelft.nl/wiki/>\n" + 
                "PREFIX prop: <http://enipedia.tudelft.nl/wiki/Property:>\n" + 
                "PREFIX cat: <http://enipedia.tudelft.nl/wiki/Category:>\n" + 
                "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" + 
                "PREFIX fn: <http://www.w3.org/2005/xpath-functions#>\n" + 
                "select distinct(substr(str(?cont),33) as ?continent) where {\n" + 
                "  ?ppl rdf:type cat:Powerplant .\n" + 
                "  ?ppl prop:Continent ?cont .\n" + 
                "} order by ?continent",
            output: "json" 
        },
        dataType: 'jsonp',
        success: function(data) {
            //c(data)
            var continents_select = document.getElementById('continents')
            //c(continents_select)
            // Append blank option
            var option = document.createElement('option')
            option.setAttribute("value", "None")
            option.appendChild(document.createTextNode(""))
            continents_select.appendChild(option)
            
            // Append 'all' option
            var option = document.createElement('option')
            option.setAttribute("value", "All")
            option.appendChild(document.createTextNode("All"))
            continents_select.appendChild(option)
            
            var continents_options = data.results.bindings
            for (i = 0; i < continents_options.length; i++) {
                //c(continents_options[i].continent.value)
                all_continents.push(continents_options[i].continent.value)
                var option = document.createElement('option')
                // if (continents_options[i].continent.value == queryString["enipedia_continent"])
//                     opt.setAttribute("selected", "true")
                option.setAttribute("value", continents_options[i].continent.value)
                option.appendChild(document.createTextNode(continents_options[i].continent.value.replace("_", " ")))
                continents_select.appendChild(option)
            } 
        }
    })

    $.ajax({
        url: 'http://enipedia.tudelft.nl/sparql',
        type: 'POST', 
        data: {
            query: "BASE <http://enipedia.tudelft.nl/wiki/>\n" + 
                "PREFIX prop: <http://enipedia.tudelft.nl/wiki/Property:>\n" + 
                "PREFIX cat: <http://enipedia.tudelft.nl/wiki/Category:>\n" + 
                "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" + 
                "PREFIX fn: <http://www.w3.org/2005/xpath-functions#>\n" + 
                "select distinct(substr(str(?ctry),33) as ?country) where {\n" + 
                "  ?ppl rdf:type cat:Powerplant .\n" + 
                "  ?ppl prop:Country ?ctry .\n" + 
                "} order by ?country",
            output: "json" 
        },
        dataType: 'jsonp',
        success: function(data) {
            //c(data)
            var countries_select = document.getElementById('countries')
            //c(countries_select)
            // Append blank option
            var option = document.createElement('option')
            option.setAttribute("value", "None")
            option.appendChild(document.createTextNode(""))
            countries_select.appendChild(option)
            
            // Append 'all' option
            var option = document.createElement('option')
            option.setAttribute("value", "All")
            option.appendChild(document.createTextNode("All"))
            countries_select.appendChild(option)
            
            var countries_options = data.results.bindings
            for (i = 0; i < countries_options.length; i++) {
                //c(countries_options[i].country.value)
                all_countries.push(countries_options[i].country.value)
                var option = document.createElement('option')
                // if (countries_options[i].country.value == queryString["enipedia_country"])
//                     opt.setAttribute("selected", "true")
                option.setAttribute("value", countries_options[i].country.value)
                option.appendChild(document.createTextNode(countries_options[i].country.value.replace("_", " ")))
                countries_select.appendChild(option)
            } 
        }
    })
    
    //c(all_countries)
    
    $.ajax({
        url: 'http://enipedia.tudelft.nl/sparql',
        type: 'POST', 
        data: {
            query: "BASE <http://enipedia.tudelft.nl/wiki/>\n" + 
                "PREFIX prop: <http://enipedia.tudelft.nl/wiki/Property:>\n" + 
                "PREFIX cat: <http://enipedia.tudelft.nl/wiki/Category:>\n" + 
                "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" + 
                "PREFIX fn: <http://www.w3.org/2005/xpath-functions#>\n" + 
                "select distinct(substr(str(?ft),33) as ?fuel_type) where {\n" + 
                "  ?ppl rdf:type cat:Powerplant .\n" + 
                "  ?ppl prop:Fuel_type ?ft .\n" + 
                "} order by ?fuel_type",
            output: "json" 
        },
        dataType: 'jsonp',
        success: function(data) {
            //c(data)
            var fuel_types_ul = document.getElementById('fuel_types')
            //c(fuel_types_select)
            var li = document.createElement('li')
            li.appendChild(document.createTextNode(""))
            fuel_types_ul.appendChild(li)
            var fuel_types = data.results.bindings
            for (i = 0; i < fuel_types.length; i++) {
                //c(fuel_types[i].fuel_type.value)
                var li = document.createElement('li')
                var fuel_type_img = $("<img src='" + markersurl + fuel_types[i].fuel_type.value + markers_ext + "'>")
                $(li).append(fuel_type_img)
                // if (fuel_types_ul[i].fuel_type.value == queryString["enipedia_fuel_type"])
//                     opt.setAttribute("selected", "true")
                var fuel_type_label = document.createElement('label')
                li.appendChild(fuel_type_label)
                fuel_type_label.appendChild(document.createTextNode(fuel_types[i].fuel_type.value.replace("_", " ")))
                var fuel_type_checkbox = $("<input type='checkbox' name= '" + fuel_types[i].fuel_type.value + "' checked>")
                $(fuel_type_label).append(fuel_type_checkbox)
                fuel_types_ul.appendChild(li)
            } 
        }
    })
    
    $("select.plants").change(function() {
        for(var key in markers) {
            var marker = markers[key]
                marker.setMap(null)
        }
        selected_continents = []
        selected_countries = []
        selected_fuel_types = ['All']
        c($(this))
        if($(this).attr('id') == "continents") {
            $("select#countries option[value=None]").attr('selected', true)    
        }
        else if($(this).attr('id') == "countries") {
            $("select#continents option[value=None]").attr('selected', true)
        }
        
        $("select#continents option:selected").each(function() {
            c($(this).val())
            selected_continents.push($(this).val())
        })
        $("select#countries option:selected").each(function() {
            c($(this).val())
            selected_countries.push($(this).val())
        })
        
//         $("select#fuel_types option:selected").each(function() {   
//             selected_fuel_types.push($(this).val())
//         })
        c(selected_continents)
        c(selected_countries)

        //c(selected_fuel_types)
        fetchData(selected_continents, selected_countries, selected_fuel_types)
    })
    
    // $("select#continents").change(function() {
//         for(var key in markers) {
//             var marker = markers[key]
//                 marker.setMap(null)
//         }
//         selected_continents = []
//         selected_countries = []
//         selected_fuel_types = ['All']
//         $("select#continents option:selected").each(function() {   
//             selected_continents.push($(this).val())
//         })
// //         $("select#fuel_types option:selected").each(function() {   
// //             selected_fuel_types.push($(this).val())
// //         })
//         c(selected_continents)
//         //c(selected_fuel_types)
//         fetchData(selected_continents, selected_countries, selected_fuel_types)
//     })
//     
//     $("select#countries").change(function() {
//         selected_countries = []
//         selected_fuel_types = ['All']
//         $("select#countries option:selected").each(function() {   
//             selected_countries.push($(this).val())
//         })
// //         $("select#fuel_types option:selected").each(function() {   
// //             selected_fuel_types.push($(this).val())
// //         })
//         c(selected_countries)
//         //c(selected_fuel_types)
//         fetchData(selected_countries, selected_fuel_types)
//     })
    
    $("select#fuel_types").change(function() {
        selected_countries = []
        selected_fuel_types = []
        $("select#fuel_types option:selected").each(function() {   
            selected_fuel_types.push($(this).val())
        })
        $("select#countries option:selected").each(function() {   
            selected_countries.push($(this).val())
        })
        c(selected_countries)
        c(selected_fuel_types)
        fetchData(selected_countries, selected_fuel_types)
    })

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
        var selected_fuel_types = []
        $(':checkbox.type-filter').each(function() {
            if($(this).prop("checked") == true) {
                selected_fuel_types.push(this.id)
            }
        })
        fetchData(selected_countries, selected_fuel_types)
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
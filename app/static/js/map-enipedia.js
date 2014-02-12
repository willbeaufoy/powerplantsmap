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
var fuel_types_categories = {
    'biomass': ['Biofuel', 'Biogas', 'Biomass'],
    'other-fossil': ['Blast_Furnace_Gas', 'Peat', 'Petroleum_Coke'],
    'coal': ['Brown_Coal', 'Coal', 'Coal_Seam_Gas', 'Coal_Water_Mixture', 'Coke_Oven_Gas', 'Hard_Coal', 'Lignite'],
    'oil': ['Diesel', 'Diesel_Oil', 'Fuel_Oil', 'Gasoil', 'Heavy_Fuel_Oil', 'Naphtha', 'Oil', 'Residual_Fuel_Oil'],
    'geothermal': ['Geothermal'],
    'hydro': ['Hydro'],
    'other': ['Hydrogen'],
    'gas': ['Landfill_Gas', 'Natural_Gas'],
    'waste': ['Municipal_Solid_Waste', 'Refuse', 'Refuse_Derived_Fuel', 'Waste_Heat'],
    'nuclear': ['Nuclear'],
    'solar': ['Solar_Radiation'],
    'other-renewable': ['Tidal', 'Wave'],
    'wind': ['Wind'],
    'unknown': ['Unknown']
}

var ep_wiki_url = "http://enipedia.tudelft.nl/wiki/"
var uniqueId = function() {
    return ++currentId
}

var markers = {}
var spinner = '';

function c(args) {
    console.log(args)
}

function centerMap(location, zoom) {
    // Convert loadLocation into LatLng
    var geocoder = new google.maps.Geocoder()
    geocoder.geocode({
        'address': location,
    },
    function(results, status) {
        if(status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location)
            map.setZoom(zoom)
        }
    })
}

function createMarker (coordinate, iconurl, title, content, capacity) {

    var id = uniqueId()
    var icon_dims
    
    if($("input#toggle-relative-size").prop("checked")) {
        if(map.zoom > 11) {
            icon_dims = {x: capacity / 30, y: capacity / 30 * 0.8}
        }

        else if(map.zoom > 7) {
            icon_dims = {x: capacity / 60, y: capacity / 60 * 0.8}
        }

        else {
            icon_dims = {x: capacity / 100, y: capacity / 100 * 0.8}
        }
    }
    
    else {
        if(map.zoom > 11) {
            icon_dims = icon_large
        }

        else if(map.zoom > 7) {
            icon_dims = icon_medium
        }

        else {
            icon_dims = icon_small
        }
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

function fetchData(continents, countries, fuel_types, include_unknown_fuel_type) {

    currentId = 0
    markers = {}

    var continents_query = ''
    var countries_query = ''
    var fuel_types_query = ''
    var capacity_query = ''
    
    c(continents)
    if(continents[0] != 'All' && continents[0] != 'None') {
        centerMap(continents[0], 3)
        continents_query = "?plant prop:Continent a:" + continents[0] + " . \n"
    }
    //c(continents_query)
    c(countries)
    if(countries[0] != 'All' && countries[0] != 'None') {
        centerMap(countries[0], 5)
        countries_query = "     ?plant prop:Country a:" + countries[0] + " . \n"
    }
    //c(countries_query)


    c('fuel_types: ', fuel_types)
    if(include_unknown_fuel_type) {
        fuel_types_query += "OPTIONAL {"
    }
    fuel_types_query += "?plant prop:Fuel_type ?fuel_type . ?fuel_type rdfs:label ?fuel_used . \n"
    if(fuel_types[0] != 'All' && fuel_types[0] != 'None') {
        fuel_types_query += "FILTER("
        if(fuel_types.length < 1) {
            fuel_types_query += "?fuel_used = ''"
        }
        else {
            for(var n = 0; n < fuel_types.length; n++) {
                if(n > 0) {
                    fuel_types_query += " || "
                }
                fuel_types_query += "?fuel_used = '" + fuel_types[n] + "'"
            }
        }
        fuel_types_query += ")"
    }
    if(include_unknown_fuel_type) {
        fuel_types_query += "}"
    }
    fuel_types_query += "\n"
    //c(fuel_types_query)
    
    if($("input#toggle-relative-size").prop("checked")) {
        capacity_query = "?plant prop:Generation_capacity_electrical_MW ?elec_capacity_MW. \n"
    }
    else {
        capacity_query = "OPTIONAL{?plant prop:Generation_capacity_electrical_MW ?elec_capacity_MW }. \n"
    }
    
    var url = "http://enipedia.tudelft.nl/sparql/?default-graph-uri=&query="
    
    var query = "BASE <http://enipedia.tudelft.nl/wiki/>\n" +
        "PREFIX a: <http://enipedia.tudelft.nl/wiki/>\n" +
        "PREFIX prop: <http://enipedia.tudelft.nl/wiki/Property:>\n" +
        "PREFIX cat: <http://enipedia.tudelft.nl/wiki/Category:>\n" +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
        "select ?plant_name ?latitude ?longitude ?fuel_used ?OutputMWh ?elec_capacity_MW ?wikipedia_page ?year_built ?owner_company ?power_plant_type where { \n" +
            continents_query +
            countries_query +
            "?plant rdf:type cat:Powerplant . \n" +
            "?plant rdfs:label ?plant_name . \n" +
            "?plant prop:Latitude ?latitude . \n" +
            "?plant prop:Longitude ?longitude . \n" +
            fuel_types_query +
            "OPTIONAL{?plant prop:Wikipedia_page ?wikipedia_page } . \n" +
            "OPTIONAL{?plant prop:Year_built ?year_built } . \n" +
            "OPTIONAL{?plant prop:Owner_company ?owner_company } . \n" +
            "OPTIONAL{?plant prop:Power_plant_type ?power_plant_type } . \n" +
            "OPTIONAL{?plant prop:Annual_Energyoutput_MWh ?OutputMWh } . \n" +
            capacity_query +
        "} order by ?plant ?fuel_type"
    
    //c(query)
    query = encodeURIComponent(query)


    // Send the JSONP request using jQuery
    var jqxhr = $.getJSON(url + query + "&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on&callback=?", function(data) {
        //c(data)
    })
        .done(function(data) {
            //c(data['results']['bindings'][0])
            var icon_url
            var content
            var coordinate
            var category
            var capacity = ''
            for (var i in data['results']['bindings']) {
                title = data['results']['bindings'][i]['plant_name']['value']
                coordinate = new google.maps.LatLng(data['results']['bindings'][i]['latitude']['value'],data['results']['bindings'][i]['longitude']['value'])
                content = "<span class = 'plant-name'>"
                content += '<a href="' + ep_wiki_url + data['results']['bindings'][i]['plant_name']['value'] + '">'
                content += data['results']['bindings'][i]['plant_name']['value'].replace(" Powerplant", "")/*.replace(new RegExp("_", "g"), " ")*/
                content += '</a>'
                content += '</span><br>'
                content += data['results']['bindings'][i]['fuel_used'] ? "Energy source: " + data['results']['bindings'][i]['fuel_used']['value'] + "<br>" : ''
                if(data['results']['bindings'][i]['elec_capacity_MW']) {
                    capacity = data['results']['bindings'][i]['elec_capacity_MW']['value']
                    if(capacity.substring(capacity.length - 2) == ".0") capacity = capacity.substring(0, capacity.length - 2)
                    content += "Capacity: " + capacity + " MW<br>"
                }
                if(data['results']['bindings'][i]['year_built']) {
                    year_built = new Date(data['results']['bindings'][i]['year_built']['value']).getFullYear()
                    content += "Year built: " + year_built + "<br>"
                }
                if(data['results']['bindings'][i]['owner_company']) {
                    content += "Owner: " + data['results']['bindings'][i]['owner_company']['value'] + "<br>"
                }
                content += data['results']['bindings'][i]['wikipedia_page'] ? "<a href='" + data['results']['bindings'][i]['wikipedia_page']['value'] + "'><img src='/static/img/wikipedia.ico' width=20></a><br>" : ''
                if(data['results']['bindings'][i]['fuel_used']) {
                    icon_url = baseurl + "static/img/markers/" + data['results']['bindings'][i]['fuel_used']['value'].replace(" ", "-").toLowerCase() + "-marker.png"
                }
                else {
                    icon_url = baseurl + "static/img/markers/default-marker.png" //data['results']['bindings'][i]['iconurl']
                }
                createMarker(coordinate, icon_url, title, content, capacity)
            }
            spinner.stop()
        })
        .fail(function( jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            spinner.stop()
            alert( "Request Failed: " + err )
        })
}

function onError(jqXHR, textStatus, errorThrown) {
    alert('error')
    console.log(jqXHR)
    console.log(textStatus)
    console.log(errorThrown)
    spinner.stop()
}

function addZoomListeners() {

    function change_icon_size() {
        if(this.zoom > 7 && this.zoom <= 11 && this.previousZoom <= 7) {
            $.each(this.markers, function() {
                c(this)
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

    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(53.90, -2.8),
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        previousZoom: 6,
        markers: markers
    })
    
//     $('#map').height($(window).height() - $('header').outerHeight())
    $('#map').height($('#panel').outerHeight())
    
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
                option.appendChild(document.createTextNode(countries_options[i].country.value.replace(new RegExp("_", "g"), " ")))
                countries_select.appendChild(option)
            } 
        }
    })
    
    //c(all_countries)
    
    query = "BASE <http://enipedia.tudelft.nl/wiki/>\n" + 
                "PREFIX prop: <http://enipedia.tudelft.nl/wiki/Property:>\n" + 
                "PREFIX cat: <http://enipedia.tudelft.nl/wiki/Category:>\n" + 
                "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" + 
                "PREFIX fn: <http://www.w3.org/2005/xpath-functions#>\n" + 
                "select distinct(substr(str(?ft),33) as ?fuel_type) where {\n" + 
                "  ?ppl rdf:type cat:Powerplant .\n" + 
                "  ?ppl prop:Fuel_type ?ft .\n" + 
                "} order by ?fuel_type"
    c(query)
    $.ajax({
        url: 'http://enipedia.tudelft.nl/sparql',
        type: 'POST', 
        data: {
            query: query,
            output: "json" 
        },
        dataType: 'jsonp',
        success: function(data) {
            c(data)
            var fuel_types_ul = document.getElementById('fuel_types')
            //c(fuel_types_select)
            var li = document.createElement('li')
            li.appendChild(document.createTextNode(""))
            fuel_types_ul.appendChild(li)
            // For some reason the last element is a url, not a fuel type, so remove it
            data.results.bindings.pop()
            var fuel_types = data.results.bindings
            for (i = 0; i < fuel_types.length; i++) {
                for(cat in fuel_types_categories) {
                    if(fuel_types_categories[cat].indexOf(fuel_types[i].fuel_type.value) > -1) {
                        var parent_fuel_type = $('ul.fuel_types #' + cat + ' ul')
                        var parent_fuel_cat = cat
                        break
                    }
                    var parent_fuel_type = $('ul.fuel_types #unknown ul')
                }
                var li = $("<li></li>")
                var fuel_type_label = document.createElement('label')
                li.append(fuel_type_label)
                fuel_type_label.appendChild(document.createTextNode(fuel_types[i].fuel_type.value.replace(new RegExp("_", "g"), " ")))
                var fuel_type_checkbox = $("<input type='checkbox' name= '" + fuel_types[i].fuel_type.value.replace(new RegExp("_", "g"), " ") + "'class='lower l3 " + parent_fuel_cat + "' checked = 'true'>")
                // Still doesn't work
                fuel_type_checkbox.bind('change', function() {
                    c(this)
                    var classes = $(this).attr("class").split(" ");
                    c(classes)
                    var cat = classes[classes.length - 1];
                    c(cat)
                    c($('input.l2#' + cat))
                    if(!$(this).prop("checked")) {
                        $('input.l2#' + cat).prop("checked", false)
                        $(':checkbox#all').prop("checked", false)
                    }
                    else {
                        if($('input.lower.l3.' + cat).filter(':not(:checked)').length === 0) {
                            $('input.l2#' + cat).prop("checked", true)
                        }
                        if($('input.lower.l3').filter(':not(:checked)').length === 0) {
                            $(':checkbox#all').prop("checked", true)
                        }
                    }
                })
                $(fuel_type_label).append(fuel_type_checkbox)
                parent_fuel_type.append(li)
            } 
        }
    })
    
    function refresh() {
        for(var key in markers) {
            var marker = markers[key]
                marker.setMap(null)
        }
        
        var target = document.getElementById('spinner-container');
        spinner = new Spinner().spin(target);
        
        selected_continents = []
        selected_countries = []
        selected_fuel_types = []
        include_unknown_fuel_type = false
        
        $("select#continents option:selected").each(function() {
            selected_continents.push($(this).val())
        })
        $("select#countries option:selected").each(function() {
            selected_countries.push($(this).val())
        })
        
        if($('ul#fuel_types #all').prop("checked")) {
            selected_fuel_types = ['All']
        }
        else {
            $("input.l3:checked").each(function() {
                selected_fuel_types.push($(this).attr("name"))
            })
        }
        if($("input#unknown").prop("checked")) {
            include_unknown_fuel_type = true
        }
        
        fetchData(selected_continents, selected_countries, selected_fuel_types, include_unknown_fuel_type)
    }
    
    $("select.plants").change(function() {
        if($(this).attr('id') == "continents") {
            $("select#countries option[value=None]").attr('selected', true)
        }
        else if($(this).attr('id') == "countries") {
            $("select#continents option[value=None]").attr('selected', true)
        }        
        refresh()
    })
    
    $("#refresh").click(function() {
        refresh()
    })

    $('#select-location').submit(function(e) {
        var loadLocation
        loadLocation = $('#select-location-input').val()
        centerMap(loadLocation, map.getZoom())
        e.preventDefault()
    })
   
    $(':checkbox.broad').change(function() {
        if($(this).prop("checked")) {
            $(this).parent().next().find(':checkbox').prop("checked", true)
        }
        else {
            $(this).parent().next().find(':checkbox').prop("checked", false)
        }
    })
    
    
    // Ensure top level checkbox fits with l2 ones
    
    // var all_checked = true;
//     
    $(':checkbox.l2').change(function() {
        //c(this)
        if(!$(this).prop("checked")) {
            all_checked = false;
            $(':checkbox#all').prop("checked", false)
        }
        else if ($('input.l2').filter(':not(:checked)').length === 0) {
            all_checked = true;
            $(':checkbox#all').prop("checked", true)
        }
    })
    
    
    
    
//     $(':checkbox.lower').change(function() {
//         if(all_checked == true) {
//             all_checked = false;
//             $(':checkbox#all').prop("checked", false)
//         }
//         else {
//             $(':checkbox#all').prop("checked", true)
//             all_checked = true;
//         }
//     })
})
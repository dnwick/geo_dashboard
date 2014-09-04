/*Application configurations*/
$(".modal").draggable({
    handle: ".modal-header"
});

//Clear modal content for reuse the wrapper by other functions
$('body').on('hidden.bs.modal', '.modal', function () {
    $(this).removeData('bs.modal');
});

/*Map layer configurations*/
var map, featureList, boroughSearch = [], theaterSearch = [], museumSearch = [];

$("#loading").hide();

$(document).on("click", ".feature-name", function (e) {
    sidebarClick(parseInt($(this).attr('id')));
});

function sidebarClick(id) {
    map.addLayer(theaterLayer).addLayer(museumLayer);
    var layer = markerClusters.getLayer(id);
    markerClusters.zoomToShowLayer(layer, function () {
        map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
        layer.fire("click");
    });
    /* Hide sidebar and go to the map on small screens */
    if (document.body.clientWidth <= 767) {
        $("#sidebar").hide();
        map.invalidateSize();
    }
}


// TODO: use this method to load tileservers from backend database
getTileServers();
/* Basemap Layers */
var mapquestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
    maxZoom: 19,
    subdomains: ["otile1", "otile2", "otile3", "otile4"],
    attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});
var mapquestOAM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
    maxZoom: 18,
    subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
    attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
});
var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
    maxZoom: 18,
    subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
}), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
    maxZoom: 19,
    subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
    attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
})]);
/* Overlay Layers */
var highlight = L.geoJson(null);

var boroughs = L.geoJson(null, {
    style: function (feature) {
        return {
            color: "black",
            fill: false,
            opacity: 1,
            clickable: false
        };
    },
    onEachFeature: function (feature, layer) {
        boroughSearch.push({
            name: layer.feature.properties.BoroName,
            source: "Boroughs",
            id: L.stamp(layer),
            bounds: layer.getBounds()
        });
    }
});
//*temp_for_not_to_make_ajax*$.getJSON("data/boroughs.geojson", function (data) {
//  boroughs.addData(data);
//});

var subwayLines = L.geoJson(null, {
    style: function (feature) {
        if (feature.properties.route_id === "1" || feature.properties.route_id === "2" || feature.properties.route_id === "3") {
            return {
                color: "#ff3135",
                weight: 3,
                opacity: 1
            };
        }
        if (feature.properties.route_id === "4" || feature.properties.route_id === "5" || feature.properties.route_id === "6") {
            return {
                color: "#009b2e",
                weight: 3,
                opacity: 1
            };
        }
        if (feature.properties.route_id === "7") {
            return {
                color: "#ce06cb",
                weight: 3,
                opacity: 1
            };
        }
        if (feature.properties.route_id === "A" || feature.properties.route_id === "C" || feature.properties.route_id === "E" || feature.properties.route_id === "SI" || feature.properties.route_id === "H") {
            return {
                color: "#fd9a00",
                weight: 3,
                opacity: 1
            };
        }
        if (feature.properties.route_id === "Air") {
            return {
                color: "#ffff00",
                weight: 3,
                opacity: 1
            };
        }
        if (feature.properties.route_id === "B" || feature.properties.route_id === "D" || feature.properties.route_id === "F" || feature.properties.route_id === "M") {
            return {
                color: "#ffff00",
                weight: 3,
                opacity: 1
            };
        }
        if (feature.properties.route_id === "G") {
            return {
                color: "#9ace00",
                weight: 3,
                opacity: 1
            };
        }
        if (feature.properties.route_id === "FS" || feature.properties.route_id === "GS") {
            return {
                color: "#6e6e6e",
                weight: 3,
                opacity: 1
            };
        }
        if (feature.properties.route_id === "J" || feature.properties.route_id === "Z") {
            return {
                color: "#976900",
                weight: 3,
                opacity: 1
            };
        }
        if (feature.properties.route_id === "L") {
            return {
                color: "#969696",
                weight: 3,
                opacity: 1
            };
        }
        if (feature.properties.route_id === "N" || feature.properties.route_id === "Q" || feature.properties.route_id === "R") {
            return {
                color: "#ffff00",
                weight: 3,
                opacity: 1
            };
        }
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Division</th><td>" + feature.properties.Division + "</td></tr>" + "<tr><th>Line</th><td>" + feature.properties.Line + "</td></tr>" + "<table>";
            layer.on({
                click: function (e) {
                    $("#feature-title").html(feature.properties.Line);
                    $("#feature-info").html(content);
                    $("#featureModal").modal("show");
                    highlight.clearLayers().addLayer(L.circleMarker([e.latlng.lat, e.latlng.lng], {
                        stroke: false,
                        fillColor: "#00FFFF",
                        fillOpacity: 0.7,
                        radius: 10
                    }));
                }
            });
        }
        layer.on({
            mouseover: function (e) {
                var layer = e.target;
                layer.setStyle({
                    weight: 3,
                    color: "#00FFFF",
                    opacity: 1
                });
                if (!L.Browser.ie && !L.Browser.opera) {
                    layer.bringToFront();
                }
            },
            mouseout: function (e) {
                subwayLines.resetStyle(e.target);
            }
        });
    }
});
//*temp_for_not_to_make_ajax*$.getJSON("data/subways.geojson", function (data) {
//  subwayLines.addData(data);
//});

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 16
});

/* Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
var theaterLayer = L.geoJson(null);
var theaters = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: L.icon({
                iconUrl: "assets/img/theater.png",
                iconSize: [24, 28],
                iconAnchor: [12, 28],
                popupAnchor: [0, -25]
            }),
            title: feature.properties.NAME,
            riseOnHover: true
        });
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>Phone</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
            layer.on({
                click: function (e) {
                    $("#feature-title").html(feature.properties.NAME);
                    $("#feature-info").html(content);
                    $("#featureModal").modal("show");
                    highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                        stroke: false,
                        fillColor: "#00FFFF",
                        fillOpacity: 0.7,
                        radius: 10
                    }));
                }
            });
            $("#feature-list tbody").append('<tr style="cursor: pointer;"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name" id="' + L.stamp(layer) + '">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            theaterSearch.push({
                name: layer.feature.properties.NAME,
                address: layer.feature.properties.ADDRESS1,
                source: "Theaters",
                id: L.stamp(layer),
                lat: layer.feature.geometry.coordinates[1],
                lng: layer.feature.geometry.coordinates[0]
            });
        }
    }
});
//*temp_for_not_to_make_ajax*$.getJSON("data/DOITT_THEATER_01_13SEPT2010.geojson", function (data) {
//  theaters.addData(data);
//  map.addLayer(theaterLayer);
//});

var browserLatitude;
var browserLongitude;
function success(position) {
    browserLatitude  = position.coords.latitude;
    browserLongitude = position.coords.longitude;

    $.UIkit.notify({
        message: "Setting map view to browser location....",
        status: 'info',
        timeout: 3000,
        pos: 'top-center'
    });

    map.setView([browserLatitude,browserLongitude]);
    map.setZoom(13);
};

function error() {
    $.UIkit.notify({
        message: "Unable to find browser location!",
        status: 'warning',
        timeout: 3000,
        pos: 'top-center'
    });
};

navigator.geolocation.getCurrentPosition(success, error);

initializeMap();

function initializeMap(tileLayer) {
    if (typeof(tileLayer) === 'undefined') tileLayer = defaultOSM;
    if (typeof(map) !== 'undefined') map.remove();
    map = L.map("map", {
        zoom: 10,
        center: [6.934846, 79.851980],
        layers: [defaultOSM, boroughs, markerClusters, highlight],
        zoomControl: false,
        attributionControl: false
    });
}

/* Empty layer placeholder to add to layer control for listening when to add/remove museums to markerClusters layer */
var museumLayer = L.geoJson(null);
var museums = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: L.icon({
                iconUrl: "assets/img/museum.png",
                iconSize: [24, 28],
                iconAnchor: [12, 28],
                popupAnchor: [0, -25]
            }),
            title: feature.properties.NAME,
            riseOnHover: true
        });
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>Phone</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.ADRESS1 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
            layer.on({
                click: function (e) {
                    $("#feature-title").html(feature.properties.NAME);
                    $("#feature-info").html(content);
                    $("#featureModal").modal("show");
                    highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                        stroke: false,
                        fillColor: "#00FFFF",
                        fillOpacity: 0.7,
                        radius: 10
                    }));
                }
            });
            $("#feature-list tbody").append('<tr style="cursor: pointer;"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name" id="' + L.stamp(layer) + '">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            museumSearch.push({
                name: layer.feature.properties.NAME,
                address: layer.feature.properties.ADRESS1,
                source: "Museums",
                id: L.stamp(layer),
                lat: layer.feature.geometry.coordinates[1],
                lng: layer.feature.geometry.coordinates[0]
            });
        }
    }
});
//*temp_for_not_to_make_ajax*$.getJSON("data/DOITT_MUSEUM_01_13SEPT2010.geojson", function (data) {
//  museums.addData(data);
//});

/* Clear feature highlight when map is clicked */
map.on("click", function (e) {
    highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
    $.each(map._layers, function (index, layer) {
        if (layer.getAttribution) {
            $("#attribution").html((layer.getAttribution()));
        }
    });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
    position: "bottomright"
});
attributionControl.onAdd = function (map) {
    var div = L.DomUtil.create("div", "leaflet-control-attribution");
    div.innerHTML = "<a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
    return div;
};
map.addControl(attributionControl);

var fullscreenControl = L.control.fullscreen({
    position: 'bottomright'
}).addTo(map);

var zoomControl = L.control.zoom({
    position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
/* TODO: for reference only remove if not use */
//var locateControl = L.control.locate({
//    drawCircle: false,
//    showPopup: false,
//    setView: true,
//    keepCurrentZoomLevel: true,
//    metric: true,
//    locateOptions: {
//        maxZoom: 18,
//        watch: true,
//        enableHighAccuracy: true
//    }
//}).addTo(map);
//locateControl.locate();

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
    var isCollapsed = true;
} else {
    var isCollapsed = false;
}


//var precipitation = L.tileLayer.wms("http://sedac.ciesin.columbia.edu/geoserver/wms", {
//    layers: 'wildareas-v2:wildareas-v2-human-footprint-geographic',
//    format: 'image/png',
//    transparent: true,
//    opacity: 0.4
//});

var groupedOverlays = {
    "Web Map Service layers": {
    }
// For reference
//    ,
//    "Reference": {
//        "Boroughs": boroughs,
//        "Subway Lines": subwayLines
//    }
};
getWms();
var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
    collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
    $(this).select();
});

/* Typeahead search functionality */
var spatialObjects = new Bloodhound({
    datumTokenizer: function (d) {
        return Bloodhound.tokenizers.whitespace(d.value);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: $.map(currentSpatialObjects, function (currentSpatialObject) {
        return { value: currentSpatialObject.id };
    })
});
// kicks off the loading/processing of `local` and `prefetch`
spatialObjects.initialize();

$(function () {
    $('#searchbox').typeahead({
        hint : true,
        highlight : true,
        minLength : 1
    }, {
        name : 'spatialObjects',
        displayKey : 'value',
        source : spatialObjects.ttAdapter()
    }).on('typeahead:autocompleted', function($e, datum) {
        selected_value = datum["value"];
    }).on('typeahead:selected', function($e, datum) {
        selected_value = datum["value"];
        for (var spatialObject in currentSpatialObjects) {
            if (currentSpatialObjects[spatialObject].id == selected_value) {
                map.setView(currentSpatialObjects[spatialObject].marker.getLatLng(),16);
            }
        }
    });

});
//$(document).one("ajaxStop", function () {
//    $("#loading").hide();
//    /* Fit map to boroughs bounds */
//    map.fitBounds(boroughs.getBounds());
//    featureList = new List("features", {valueNames: ["feature-name"]});
//    featureList.sort("feature-name", {order:"asc"});
//
//    var boroughsBH = new Bloodhound({
//        name: "Boroughs",
//        datumTokenizer: function (d) {
//            return Bloodhound.tokenizers.whitespace(d.name);
//        },
//        queryTokenizer: Bloodhound.tokenizers.whitespace,
//        local: boroughSearch,
//        limit: 10
//    });
//
//    var theatersBH = new Bloodhound({
//        name: "Theaters",
//        datumTokenizer: function (d) {
//            return Bloodhound.tokenizers.whitespace(d.name);
//        },
//        queryTokenizer: Bloodhound.tokenizers.whitespace,
//        local: theaterSearch,
//        limit: 10
//    });
//
//    var museumsBH = new Bloodhound({
//        name: "Museums",
//        datumTokenizer: function (d) {
//            return Bloodhound.tokenizers.whitespace(d.name);
//        },
//        queryTokenizer: Bloodhound.tokenizers.whitespace,
//        local: museumSearch,
//        limit: 10
//    });
//
//    var geonamesBH = new Bloodhound({
//        name: "GeoNames",
//        datumTokenizer: function (d) {
//            return Bloodhound.tokenizers.whitespace(d.name);
//        },
//        queryTokenizer: Bloodhound.tokenizers.whitespace,
//        remote: {
//            url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
//            filter: function (data) {
//                return $.map(data.geonames, function (result) {
//                    return {
//                        name: result.name + ", " + result.adminCode1,
//                        lat: result.lat,
//                        lng: result.lng,
//                        source: "GeoNames"
//                    };
//                });
//            },
//            ajax: {
//                beforeSend: function (jqXhr, settings) {
//                    settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
//                    $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
//                },
//                complete: function (jqXHR, status) {
//                    $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
//                }
//            }
//        },
//        limit: 10
//    });
//    boroughsBH.initialize();
//    theatersBH.initialize();
//    museumsBH.initialize();
//    geonamesBH.initialize();
//
//    /* instantiate the typeahead UI */
//    $("#searchbox").typeahead({
//        minLength: 3,
//        highlight: true,
//        hint: false
//    }, {
//        name: "Boroughs",
//        displayKey: "name",
//        source: boroughsBH.ttAdapter(),
//        templates: {
//            header: "<h4 class='typeahead-header'>Boroughs</h4>"
//        }
//    }, {
//        name: "Theaters",
//        displayKey: "name",
//        source: theatersBH.ttAdapter(),
//        templates: {
//            header: "<h4 class='typeahead-header'><img src='assets/img/theater.png' width='24' height='28'>&nbsp;Theaters</h4>",
//            suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
//        }
//    }, {
//        name: "Museums",
//        displayKey: "name",
//        source: museumsBH.ttAdapter(),
//        templates: {
//            header: "<h4 class='typeahead-header'><img src='assets/img/museum.png' width='24' height='28'>&nbsp;Museums</h4>",
//            suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
//        }
//    }, {
//        name: "GeoNames",
//        displayKey: "name",
//        source: geonamesBH.ttAdapter(),
//        templates: {
//            header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
//        }
//    }).on("typeahead:selected", function (obj, datum) {
//        if (datum.source === "Boroughs") {
//            map.fitBounds(datum.bounds);
//        }
//        if (datum.source === "Theaters") {
//            if (!map.hasLayer(theaterLayer)) {
//                map.addLayer(theaterLayer);
//            }
//            map.setView([datum.lat, datum.lng], 17);
//            if (map._layers[datum.id]) {
//                map._layers[datum.id].fire("click");
//            }
//        }
//        if (datum.source === "Museums") {
//            if (!map.hasLayer(museumLayer)) {
//                map.addLayer(museumLayer);
//            }
//            map.setView([datum.lat, datum.lng], 17);
//            if (map._layers[datum.id]) {
//                map._layers[datum.id].fire("click");
//            }
//        }
//        if (datum.source === "GeoNames") {
//            map.setView([datum.lat, datum.lng], 14);
//        }
//        if ($(".navbar-collapse").height() > 50) {
//            $(".navbar-collapse").collapse("hide");
//        }
//    }).on("typeahead:opened", function () {
//        $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
//        $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
//    }).on("typeahead:closed", function () {
//        $(".navbar-collapse.in").css("max-height", "");
//        $(".navbar-collapse.in").css("height", "");
//    });
//    $(".twitter-typeahead").css("position", "static");
//    $(".twitter-typeahead").css("display", "block");
//});

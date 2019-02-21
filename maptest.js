var mapboxAccessToken = 'pk.eyJ1Ijoic2NiMDIwMTAiLCJhIjoiY2pzM2Y2eHdjMmVuaTQ1bzN6OGE3MnJrYiJ9.5QDjNpLmtS-Y9N3nP2rLdQ';

//style
function metrastyle() {
    return {
        weight: 2,
        opacity: 1,
        color: 'grey',
        fillOpacity: 0.7,
        fillColor: 'grey'
    };
}

function ctastyle(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.7,
        fillColor: 'black'
    };
}

//not in use
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: 'blue',
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

// functions
function getPi() {
    return Math.PI
}

//layers

var map = new L.Map("map", {
    center: new L.LatLng(41.8781, -87.6298),
    zoom: 8
});

var baselayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
})

var metra = L.geoJson(metradata, {
    style: metrastyle
});

var cta = L.geoJson(ctalines, {
    style: ctastyle
});
// //
// function onEachFeature(feature,layer) {
//     layer.on({
//         mouseover: highlightFeature,
//         mouseout: resetHighlight,
//         click: zoomToFeature
//     });
// }
// geojson = L.geoJson(countiesdata, {
//     style: style,
//     onEachFeature: onEachFeature
// }).addTo(map);
// //

// difference colors
function getColor(d) {
    return d > 90 ? '#800026' :
           d > 80  ? '#BD0026' :
           d > 70  ? '#E31A1C' :
           d > 50  ? '#FC4E2A' :
           d > 30   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(parseFloat(feature.properties.m_modshare) * 100),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}


var promise = $.getJSON("ringsectorswtransitboarding.json");
promise.then(function(data) {
    console.log('success')
    var pacestop = L.geoJson(data, {
        style:style
      }).addTo(map);
    var metrastop = L.geoJson(data, {
        filter: function(feature,layer) {
            return feature.properties.STAFLAG == 0;
        },
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                color:'blue'
            }).on('mouseover',function() {
                this.bindPopup(feature.properties.STATION).openPopup();
            });
        }
    });
    var ctastop = L.geoJson(data, {
        filter: function(feature,layer) {
            return feature.properties.STAFLAG == 1;
        },
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.TOTBRD / 900,
                color: 'black',
                fillColor: 'teal',
                fillOpacity: 0.5,
                opacity: 0.5,
                weight: 0
            }).on('mouseover',function() {
                this.bindPopup('<b>Station: </b>' + feature.properties.STATION + 
                '<br>' + '<b>Boardings: </b>' + feature.properties.TOTBRD).openPopup();
            });
        }
    });
    $("#metra").click(function() {
        map.addLayer(metrastop)
        map.removeLayer(ctastop)
        map.removeLayer(pacestop)
    });
    $("#pace").click(function() {
        map.addLayer(pacestop)
        map.removeLayer(ctastop)
        map.removeLayer(metrastop)
    });
    $("#cta").click(function() {
        map.addLayer(ctastop)
        map.removeLayer(metrastop)
        map.removeLayer(pacestop)
    });
});
//var transitstops = L.geoJson(stops, {
  //  pointToLayer: function (feature, latlng) {
    //    var popupOptions = {maxWidth: 200};
      //  var popupContent = "Station: " + feature.properties.STATION + "<br>" + feature.properties.TOTBRD;

//         function getOptions(properties) {
//             return {
//                 radius: properties.TOTBRD / 900,
//                 color: 'black',
//                 fillColor: 'teal',
//                 fillOpacity: 0.5,
//                 opacity: 0.5,
//                 weight: 0
//             };
//         }
//         return L.circleMarker(latlng, getOptions(feature.properties)).bindPopup(popupContent, popupOptions);
//     }
// });


//map
map.addLayer(baselayer);
map.addLayer(metra);
map.addLayer(cta);
//map.addLayer(transitstops);


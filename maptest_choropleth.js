
// https://leafletjs.com/examples/choropleth/
var mapboxAccessToken = 'pk.eyJ1Ijoic2NiMDIwMTAiLCJhIjoiY2pzM2Y2eHdjMmVuaTQ1bzN6OGE3MnJrYiJ9.5QDjNpLmtS-Y9N3nP2rLdQ';

// replace "toner" here with "terrain" or "watercolor"
var baselayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
})

var metra = L.geoJson(metradata, {style:style});
//var cta = L.geoJson(ctadata, {style:style});

var map = new L.Map("map", {
    center: new L.LatLng(41.8781, -87.6298),
    zoom: 8
});

// control that shows county info on hover

var info = L.control();

info.onAdd = function(map) {
    this._div = L.DomUtil.create('div','info');
    info.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>Test</h4>' + '<b>' + (props ?
        '<b>' + props.COUNTY + '</b><br />'
        :'hello');
};

info.addTo(map);

// difference colors
function getColor(d) {
    return d > 5000 ? '#800026' :
           d > 4000  ? '#BD0026' :
           d > 0.2  ? '#E31A1C' :
           d > 0.15  ? '#FC4E2A' :
           d > 0.1   ? '#FD8D3C' :
           d > 0.05   ? '#FEB24C' :
           d > 0   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.AREA),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    info.update(layer.feature.properties);

    //figure out how to keep metra lines on top?
    //if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
     //   layer.bringToFront();
    //}
}

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature,layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function(map) {
    var div = L.DomUtil.create('div','info legend'),
    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    labels = [],
    from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style = "background:' + getColor(from + 1) + '"></i>' + 
            from + (to ? '&ndash;' + to: '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;

};

geojson = L.geoJson(countiesdata, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

legend.addTo(map);
map.addLayer(baselayer);
map.addLayer(metra);

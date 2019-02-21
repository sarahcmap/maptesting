
// replace "toner" here with "terrain" or "watercolor"
var baselayer = new L.StamenTileLayer("toner-lite");

var map = new L.Map("map", {
    center: new L.LatLng(41.8781, -87.6298),
    zoom: 8
});

map.addLayer(baselayer);

var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g")
        .attr("class", "leaflet-zoom-hide");
                

// data comes in
d3.json("counties.geojson", function(error, collection) {
    if (error) throw error;

    var transform = d3.geo.transform({point: projectPoint}),
        path = d3.geo.path().projection(transform);

    var feature = g.selectAll("path")
        .data(collection.features)
        .enter()
        .append("path")
        .attr("d",path)
        .on('mouseover',mouseover)
        .on('mouseout',mouseout);

    map.on("zoom", reset);
    
    reset();

    function reset() {
        var bounds = path.bounds(collection),
            topLeft = bounds[0];
            bottomRight = bounds[1];
        
        svg .attr("width", bottomRight[0] - topLeft[0])
            .attr("height",bottomRight[1] - topLeft[1])
            .style("left",topLeft[0] + "px")
            .style("top",topLeft[1] + "px");

        g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

        feature.attr("d",path);

    }

    function projectPoint(x,y) {
        var point = map.latLngToLayerPoint(new L.LatLng(y,x));
        this.stream.point(point.x,point.y);
    }

    function mouseover(d){
        d3.select(this).style('fill','orange');
    }

    function mouseout(d){
        mapLayer.selectAll('path')
        .style('fill',)
    }
});

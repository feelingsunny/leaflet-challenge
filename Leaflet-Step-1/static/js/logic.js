// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data.features);
    createFeatures(data.features);
});

// Add legend information
var info = L.control({
    position: 'bottomright'
});

info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend"),
        grades = [1, 2, 3, 4, 5],
        labels = [];

    //Create a loop o go through the density intervals and generate labels
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    console.log('div' + div);

    return div;
};

// Add the info legend to the map
info.addTo(map);

// Create function to set color based on earthquake magnitudels

// Create function to create circular features
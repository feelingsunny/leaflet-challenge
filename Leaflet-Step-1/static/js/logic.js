// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data.features);
    createFeatures(data.features);
});

// Add legend information
let legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend"),
        grades = [1, 2, 3, 4, 5],
        labels = [];

    //Create a loop o go through the density intervals and generate labels
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    console.log('div' + div);
    return div;
};

// Create function to set color based on earthquake magnitudels
function getColor() {
    x = Math.ceil(c);
    switch (Math.ceil(x)) {
        case 1:
            return "chartreuse";
        case 2:
            return "greenyellow";
        case 3:
            return "gold";
        case 4:
            return "DarkOrange";
        case 5:
            return "Peru";
        default:
            return "red";
    }
}

// Create function to create circular features
function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                    radius: feature.properties.mag * 5,
                    fillColor: getColor(feature.properties.mag),
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.9
                })
                .bindPopup("<h3>" + "Location: " + feature.properties.place +
                    "</h3><hr><p>" + "Date/Time: " + new Date(feature.properties.time) + "<br>" +
                    "Magnitude: " + feature.properties.mag + "</p>");
        }
    });
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    })

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    })

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });
    console.log(myMap);

    //   Create a layer control
    //   Pass in our baseMaps and overlayMaps
    //   Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Add the info legend to the map
    legend.addTo(myMap);
}
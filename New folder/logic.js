var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
  console.log(data.features)
});

//features are passed into the create features function
function createFeatures(earthquakeData) {

 //color circles based on magnitutde
function CirColor(mag){
  if (mag < 1) {
    return "lime"
  }
  else if (mag < 2) {
    return "green"
  }
  else if (mag < 3) {
    return "yellow"
  }
  else if (mag < 4) {
    return "tan"
  }
  else if (mag < 5) {
    return "orange"
  }
  else {
    return "red"
  }
}

// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake
function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}

//create geoJson layer and return circles on the coordinates
var earthquakes = L.geoJSON(earthquakeData, {
  pointToLayer: function(earthquakeData, latlng) {
    return L.circle(latlng, {
      radius: earthquakeData.properties.mag * 12000,
      color: CirColor(earthquakeData.properties.mag),
      fillOpacity: .60
    });
  },
  onEachFeature: onEachFeature
});


createMap(earthquakes);
}

function createMap(earthquakes) {

// Define map layers for control
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
   maxZoom: 16,
   id: "mapbox.light",
   accessToken: API_KEY
  });

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
   maxZoom: 16,
   id: "mapbox.streets",
   accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
   maxZoom: 16,
   id: "mapbox.dark",
   accessToken: API_KEY
  });



// Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Street Map": streetmap,
    "Dark Map": darkmap
  
  };

// Create overlay object to hold our overlay layer
  var overlayMaps = {
   Earthquakes: earthquakes
  };

// Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [lightmap, earthquakes]
  });

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
   collapsed: false
  }).addTo(myMap);

  
  
//create legend 
//legend example https://leafletjs.com/examples/choropleth/
  var legend = L.control({position: 'bottomright'});

//function to get the legend color
  function legColor(d) {
    return d > 5 ? 'red' :
         d > 4  ? 'orange' :
         d > 3  ? 'tan' :
         d > 2  ? 'yellow' :
         d > 1  ? 'green' :
                'lime' ;
  };

// 
  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        mags = [0, 1, 2, 3, 4, 5]
  
    for (var i = 0; i < mags.length; i++) {
        div.innerHTML +=
            '<i style="background:' + legColor(mags[i] + 1) + '"></i> ' +
            mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
     }

      return div;
  };

  legend.addTo(myMap);
}

// Import GeoJSON data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create Leaflet map
let map = L.map("map", {
    center: [40.76, -111.89],
    zoom: 5
});

// Add streetmap tile layer
let layer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create overall function to populate map with markers where earthquakes took place

// Format GeoJSON data
d3.json(url).then(function(earthquakes) {
    console.log(earthquakes)

// Create a function to color each marker according to earthquake depth
    function markerColor(depthLevel) {
        if (depthLevel >= 90) return "Red";
        else if (depthLevel >= 70) return "DarkOrange";
        else if (depthLevel >= 50) return "Orange";
        else if (depthLevel >= 30) return "Gold";
        else if (depthLevel >= 10) return "GreenYellow";
        else return "LawnGreen";
    };

// Create a function to populate markers with descriptive popups
    function popups(features, layer) {
        layer.bindPopup(`<strong> Earthquake Location: <strong> ${features.properties.place} <br/>
        <strong> Earthquake Magnitude: <strong> ${features.properties.mag} <br/>
        <strong> Earthquake Depth: <strong> ${features.geometry.coordinates[2]}`);
    };

// Create a legend to portray the depth color scale on the map
    let depthLegend = L.control({ position: "bottomright" });
    depthLegend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      let depthGroups = [-10, 10, 30, 50, 70, 90];
      let depthColors = ["LawnGreen", "GreenYellow", "Gold", "Orange", "DarkOrange", "Red"];
      let labels = [];
    
      let legendInfo = "<h1>Earthquake Depth</h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + depthGroups[0] + "</div>" +
          "<div class=\"max\">" + depthGroups[depthGroups.length - 1] + "</div>" +
        "</div>";
  
      div.innerHTML = legendInfo;
  
      depthGroups.forEach(function(filler, index) {
        labels.push("<li style=\"background-color: " + depthColors[index] + "\"></li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
  

    depthLegend.addTo(map);

// Add markers to the map
    L.geoJSON(earthquakes, {
        onEachFeature: popups,
        pointToLayer: function (features, coords) {
            return L.circleMarker(coords, { 
                color: "Black",
                fillColor: markerColor(features.geometry.coordinates[2]),
                radius: features.properties.mag * 5,
                fillOpacity: .7,
                weight: .5
            });
        }
    }).addTo(map);
});

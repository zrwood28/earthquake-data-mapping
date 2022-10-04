// Thanks to this post for the following code: https://stackoverflow.com/questions/2499567/how-to-make-a-json-call-to-an-url/2499647#2499647

let json = async url => {
    let response = await fetch(url);
    return response.json();
}

json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => console.log(data))

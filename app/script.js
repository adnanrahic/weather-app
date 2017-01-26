var card = document.getElementById("card");
// var loading = setMessage("Loading...");

function get(url) {
    return new Promise(function(succeed, fail) {
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.addEventListener("load", function() {
        if (req.status < 400)
            succeed(req);
        else
            fail(new Error("Request failed: " + req));
        });
        req.addEventListener("error", function() {
        fail(new Error("Network error"));
        });
        req.send(null);
    });
}
function showCard() {
    card.className = "card visible";
}
function setMessage(msg) {
    var wrp = document.getElementById("card-wrp");
    var el = document.createElement('div');
    el.className = "strong";
    el.innerText = msg;
    wrp.appendChild(el);
    return el;
}
function removeMessage(el) {
    var wrp = document.getElementById("card-wrp");
    wrp.removeChild(el);
}
var origin = window.location.href;
var images = {
    thunderstorm: origin+"app/assets/thunderstorm.jpg",
    drizzle: origin+"app/assets/drizzle.jpg",
    rain: origin+"app/assets/rain.jpg",
    snow: origin+"app/assets/snow.jpg",
    atmosphere: origin+"app/assets/atmosphere.jpg",
    clear: origin+"app/assets/clear.jpg",
    clouds: origin+"app/assets/clouds.jpg",
    extreme: origin+"app/assets/extreme.jpg"
};
function getImg(id) {
    if (id >= 200 && id < 300) return images.thunderstorm;
    else if (id >= 300 && id < 400) return images.drizzle;
    else if (id >= 500 && id < 600) return images.rain;
    else if (id >= 600 && id < 700) return images.snow;
    else if (id >= 700 && id < 800) return images.atmosphere;
    else if (id >= 800 && id < 801) return images.clear;
    else if (id >= 801 && id < 900) return images.clouds;
    else if (id >= 900) return images.extreme;
}

load("c");
function load(tempUnit) {
    var loading = setMessage("Loading...");
    var tempUnitApi;
    if (tempUnit === "c") tempUnitApi = "metric";
    else if (tempUnit === "f") tempUnitApi = "imperial";

    if (navigator.geolocation) {    
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var weatherApi = "/weather/"+lat+"/"+lon+"/"+tempUnitApi;
            get(weatherApi).then(function(res) {
                return JSON.parse(res.response);
            })
            .then(function(weather) {
                init(weather, tempUnit);
            })
            .then(function() {
                showCard();
                removeMessage(loading);
            });
        });
    }
}
function generateTitle(weather) {
    var title = document.createElement("h4");
    title.className = "card-title";
    var country = document.createElement("span");
    country.innerText = weather.sys.country;
    var city = document.createElement("span");
    city.innerText = weather.name+", ";
    title.appendChild(city);
    title.appendChild(country);
    return title;
}
function generateContent(weather, tempUnit) {
    function generateCelsiusTempIcon(tempUnit) {
        var tempIcon = document.createElement("span");
        tempIcon.innerText = "C";
        if (tempUnit === "c") tempIcon.className = "temp-icon active";
        else tempIcon.className = "temp-icon pointer";
        return tempIcon;
    }
    function generateFahrenheitTempIcon(tempUnit) {
        var tempIcon = document.createElement("span");
        tempIcon.innerText = "F";
        if (tempUnit === "f") tempIcon.className = "temp-icon active";
        else tempIcon.className = "temp-icon pointer";
        return tempIcon;
    }
    var content = document.createElement("span");
    content.className = "card-text";
    var temperature = document.createElement("span");
    temperature.innerText = weather.main.temp;
    temperature.className = "mr20";
    
    var tempIconC = generateCelsiusTempIcon(tempUnit);
    var tempIconF = generateFahrenheitTempIcon(tempUnit);
    var tempIconSpacer = document.createElement("span");
    tempIconC.addEventListener('click', function(event) {
        load("c");
        tempIconC.className = "temp-icon active";
        tempIconF.className = "temp-icon";
    });
    tempIconF.addEventListener('click', function(event) {
        load("f");
        tempIconF.className = "temp-icon active";
        tempIconC.className = "temp-icon";
    });
    
    tempIconSpacer.innerText = " | ";
    tempIconSpacer.className = "temp-icon";
    temperature.appendChild(tempIconC);
    temperature.appendChild(tempIconSpacer);
    temperature.appendChild(tempIconF);
    
    var icon = document.createElement("span");
    icon.innerHTML = "<img style='display:inline;' src='http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png'>";
    var main = document.createElement("span");
    main.innerText = weather.weather[0].main;
    content.appendChild(icon);
    content.appendChild(temperature);
    content.appendChild(main);
    return content;
}
function generateImg(weather) {
    var img = document.getElementById("img");
    img.src = getImg(weather.weather[0].id);
}
function init(weather, tempUnit) {
    var wrp = document.getElementById("wrp");
    var clear = document.getElementsByClassName("card-title")[0];
    if (clear != null) wrp.removeChild(clear);
        
    
    var title = generateTitle(weather);
    var content = generateContent(weather, tempUnit);
    generateImg(weather);
    title.appendChild(content);
    wrp.appendChild(title);
}
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
var images = {
    thunderstorm: "http://pre01.deviantart.net/d725/th/pre/f/2013/162/0/1/landscape_with_the_thunderstorm_by_macinivnw-d68mww1.jpg",
    drizzle: "http://hinhanhdep.pro/content/uploads/2014/10/xem-hinh-anh-con-mua-270-14.jpg",
    rain: "https://www.ibiza2day.com/wp-content/uploads/2015/03/rain.jpg",
    snow: "http://restoring-donbass.com/en/wp-content/uploads/2015/10/White-snow-on-a-blank-page.-Lena-Danilova.jpg",
    atmosphere: "http://kingofwallpapers.com/mist/mist-004.jpg",
    clear: "http://novatv.mk/wp-content/uploads/2016/07/sunshinesky_ukcountryside_g_wp1.jpg",
    clouds: "http://www.wetter-foto.de/images/upload/orig/012408.jpg",
    extreme: "http://m.memegen.com/i7fvjq.jpg"
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
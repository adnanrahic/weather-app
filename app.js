var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var request = require("request");
app.use(favicon(__dirname + '/favicon.ico'));
app.use('/assets', express.static('assets'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/weather/:lat/:lon/:tempUnitApi', function(req, res) {
  var lat = req.params.lat;
  var lon = req.params.lon;
  var tempUnitApi = req.params.tempUnitApi;
  var weatherApi = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units="+tempUnitApi+"&APPID=91d8f9d77333af1eb29c60bafa59246c";
  request(weatherApi, function(error, response, body) {
    res.send(body);
  });
});
var port = (process.env.PORT || 3000);
app.listen(port);
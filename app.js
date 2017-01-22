var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/favicon.ico'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/wat', function (req, res) {
  res.send("Fuck you!");
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
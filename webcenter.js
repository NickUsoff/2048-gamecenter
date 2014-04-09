var express = require("express");
var logfmt = require("logfmt");
var app = express();



// Mongo initialization
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/database';
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
	db = databaseConnection;
});

app.use(logfmt.requestLogger());



app.get('/', function(req, res) {
  res.send("Welcome");
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
var express = require("express");
var logfmt = require("logfmt");
var app = express();



// Mongo initialization
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/gamecenter';
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
	db = databaseConnection;
});


app.use(logfmt.requestLogger());
app.use(express.json());
app.use(express.urlencoded());

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});




//default display
app.get('/', function(req, res) {
  res.send("Welcomezz");
});



// Returns a JSON string (array of objects) for a specified 
//player with the scores sorted in descending order
app.get('/scores.json', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	
	userName = req.query.username;
	//proceed only if the username exists
	if(userName){
		db.collection('scores', function(error, collection) {
			collection.find({username:userName}).sort( { score: -1 } ).toArray(function(err, docs){
	    		res.set('Content-Type', 'text/json');
	  			res.send(docs);
			});
			
  		});
	}
	else{
		res.send(["Please enter a username!"]);
	}

});

//Submits final score and grid for a terminated 2048 game
app.post('/submit.json', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	db.collection('scores', function(error, collection) {

	    userName = req.body.username;
	    score = parseInt(req.body.score);
	    grid = req.body.grid;
	    time = new Date();
	    if(!(!userName || !score || !grid)){ //validation to ensure all parameters entered
		    theDocument = {"username":userName,"score":score,"grid":grid,"created_at":time};
		    collection.insert(theDocument, function(error, saved) {

		      // What you really want to do here: if there was an error inserting the data into the collection in MongoDB, send an error. Otherwise, send OK (e.g., 200 status code)
		      res.send(200);
		    });
		}
  	});

});


// app.get('/play', function(request, response) {
//   // Send data to this web application via:
//   //   curl --data "playdata=blah..." http://[domain here, e.g., localhost]:3000/play
//   userinput = "blargh";
//   //userinput = request.body.playdata;
//   console.log("Someone sent me some data: " + userinput);

//   // Let's insert whatever was sent to this web application (read: NSFW) to a collection named 'abyss' on MongoDB

	

//   // 1. Specify a collection to use
//   db.collection('testCol', function(error, collection) {

//     // 2. Put data into the collectiontheDocument = {"dump":userinput};
//     theDocument = {"dump":userinput};
//     collection.insert(theDocument, function(error, saved) {

//       // What you really want to do here: if there was an error inserting the data into the collection in MongoDB, send an error. Otherwise, send OK (e.g., 200 status code)
//       response.send(200);
//     });
//   });
// });

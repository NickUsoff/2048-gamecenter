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


//default display, shows username, score, and timestamp for each entry in 
//descending order of score
app.get('/', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	db.collection('scores', function(error, collection) {
		collection.find().sort( { score: -1 } ).toArray(function(err, docs){
			//style all of the scores and display them
			var resString = "<html style='font-size:40px'>";
			resString += "<head><style>"
						+ "body{font-family:tahoma;text-align:center}"
						+ "table{margin:0 auto;border:1px solid black}"
						+ "td{padding:6px}"
						+ "</style></head>";
			resString += "<body><div><h1>2048 Score Board</h1></div><table>";
			for(var i = 0; i < docs.length; i++){
				resString += "<tr>";
				resString += "<td>" + docs[i].username + "</td>";
				resString += "<td>" + docs[i].score + "</td>";
				resString += "<td>" + docs[i].created_at + "</td>";
				resString += "</tr>";
			}
			resString +="</table></body></html>";
	    	res.set('Content-Type', 'text/html');
	  		res.end(resString);
		});
	});
});



// Returns a JSON string (array of objects) for a specified 
//player with the scores sorted in descending order
app.get('/scores.json', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	userName = req.query.username;
	res.set('Content-Type', 'text/json');
	//proceed only if the username exists
	if(userName){
		db.collection('scores', function(error, collection) {
			collection.find({username:userName}).sort( { score: -1 } ).toArray(function(err, docs){
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
		        res.send(200);
		    });
		}
  	});

});
2048 Game Center

This assignment focused on submitting data from the end of a game of 2048 to a web server using a Node.js web application. The web application has two APIs: /submit.json is a POST request that  takes in a username, score, and grid and inputs that data (if it's all there) to the database along with a timestamp. /scores.json is a GET request which takes a username string and lists all the data for each game played by that user, in descending order of score. Finally, the application has a "/" homepage which shows each game in order of score. This output is stylized. 

As mentioned above, all of the data is stored in a database. This database is a collection of mongodb documents, and each document has the field username (string), score (integer), grid (JSON of the final board position) and a created_at (timestamp). 

I did not collaborate with anyone on this assignment - it took around five hours.

"Explain how the score and grid are stored in the 2048 game": 
The game_manager.js file holds an object which keeps track of the state of the game. This object holds both the score as a number and the grid as a serialized version of the grid "class".

"Explain the modifications... that you had to make in order to send the final score and grid to your web application."
First, I had to add jQuery to the game_manager.js file in order to make a call to the POST API. Then, after figuring out where the game ends (I chose the spot in the move function where no more moves are available since this only occurs once at the end of the game), I inserted a call to the jquery post function with all the data included needed to use the /submit.json API
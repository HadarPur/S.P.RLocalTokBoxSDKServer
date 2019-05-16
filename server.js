var OpenTok = require('opentok');
var express = require('express');
var http = require('http');
var app = express();
var server = http.Server(app);

var apiKey = '46328822';
var apiSecret = '1031919db407a48f966d8a2e55bc09dce0f43d95';
var opentok = new OpenTok(apiKey, apiSecret);

app.set('port', 5000);
app.use(express.static('public'));

app.get('/', function(req, res, next) {
		opentok.createSession({mediaMode:"relayed"}, function(err, session) {
				if (err) {
					console.log(err);
					return;
				}
				
				//get token publisher  
				var tokenPub = session.generateToken({
					role :                   'publisher',
					expireTime :             (new Date().getTime() / 1000)+(7 * 24 * 60 * 60), // in one week
					data :                   'name=SPR',
					initialLayoutClassList : ['focus']
				});
			
				//get token subscriber  
				var tokenSub = session.generateToken({
					role :                   'subscriber',
					expireTime :             (new Date().getTime() / 1000)+(7 * 24 * 60 * 60), // in one week
					data :                   'name=SPR',
					initialLayoutClassList : ['focus']
				});
			
				var data = {
					"apiKey": apiKey,
					"sessionId": session.sessionId,
					"tokenPublisher": tokenPub,
					"tokenSubscriber": tokenSub
				};

				console.log("data sent to http://localhost:%s", 5000)
				res.setHeader('content-type', 'application/json');
				res.end(JSON.stringify(data));
			})
	}
);
var server = app.listen(5000, function () {
    console.log("Starting server on port at http://localhost:%s", 5000);
});

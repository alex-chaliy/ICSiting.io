'use strict';

const config = require('./config.js');
const express = require('express');
const app = express();
const server = app.listen(config.server.port, function() {
	console.log('Server listening at' + config.server.protocol
				+ config.server.adress + ':' + config.server.port);
});

app.use(express.static(path.join(__dirname+'/public')));

app.get('/', function(request, response) {
	response.sendFile(__dirname+'/client/index.html');
});

// // Example
// // localhost/mebacjhsgh/maxim/sorokin

// app.put('/user/:id/:name/:surname', function(request, response) {
// 	let userId = request.params.id;
// 	response.send();
// });


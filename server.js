'use strict';

const path = require('path');
const crypto = require('crypto');

const config = require('./config.js');

const express = require('express');
const app = express();
const server = app.listen(config.server.port, function() {
	console.log('Server listening at ' + config.server.protocol
				+ config.server.adress + ':' + config.server.port);
});
const mongoose = require('mongoose');
mongoose.connect('mongodb://' + config.db.adress
				+ ':' + config.db.port
				+ '/' +config.db.name);

const User = require('./db/models/user');

app.use(express.static(path.join(__dirname+'/public')));

app.get('/', function(request, response) {
	response.sendFile(__dirname+'/client/index.html');
});

/** Users **/
app.post('/user', function(request, response) {
	var user_data = request.body;
	var new_salt = saltGenerator(40);
	var hash = crypto.createHash('sha256');
	hash.update(user_data.password);
	var new_user = new User({ 	login: user_data.login,
								password_hash: hash,
								registration_date: undefined,
								name: user_data.name,
								surname: user_data.surname,
								second_name: user_data.second_name,
								department: user_data.department,
								groupe: user_data.groupe,
								entering_year: user_data.entering_year,
								graduation_year: user_data.graduation_year,
								company: user_data.company,
								city: user_data.city,
								birthday: user_data.birthday,
								salt: new_salt,
								token:  });
	new_user.save(function (err) {
	  if (err) return handleError(err);
	  // saved!
	})
});

// // Example
// // localhost/mebacjhsgh/maxim/sorokin

// app.put('/user/:id/:name/:surname', function(request, response) {
// 	let userId = request.params.id;
// 	response.send();
// });

saltGenerator = function(n){  // [ 3 ] random words and digits by the wocabulary
  var s ='', abd ='abcdefghijklmnopqrstuvwxyz0123456789', aL = abd.length;
  while(s.length < n)
    s += abd[Math.random() * aL|0];
  return s;
}
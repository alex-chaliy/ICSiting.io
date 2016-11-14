'use strict';

const path = require('path');
const crypto = require('crypto');

const config = require('./config.js');
const saltGenerator = require('./saltGenerator.js');

const bodyParser = require('body-parser');
//const _ = require('lodash');
const express = require('express');
const app = express();
const server = app.listen(config.server.port, function() {
	console.log('Server listening at ' + config.server.protocol
				+ config.server.adress + ':' + config.server.port);
});

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://' + config.db.adress + ':' + config.db.port + '/' + config.db.name, function() {
// 	console.log('Connected to db at ' + 'mongodb://' + config.db.adress
// 			  + ':' + config.db.port + '/' + config.db.name);
// });

mongoose.connect('mongodb://' + config.db.adress + ':' + config.db.port + '/' + config.db.name);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', () => {
	console.log("Successfully connected to MongoDB");
});

/** Models **/
	const User 	  = require('./db/models/user');
	const Post 	  = require('./db/models/post');
	const Vacancy = require('./db/models/vacancy');

/*******
* Routes *
********/

/** others **/
	app.use(express.static(__dirname + '/public'));
	app.use('/node_modules', express.static(__dirname + '/node_modules'));
	app.use('/markup', express.static(__dirname + '/markup'));
	app.use('/uploads', express.static(__dirname + '/uploads'));
	
	app.get('/', function(request, response) {
		response.sendFile(__dirname + '/client/index.html');
	});

	app.use(bodyParser.json());

/** Users **/

	app.post('/user', function(request, response) {
		
		console.log('\nAdding new user');
		
		var userData = request.body;
		var newSalt = saltGenerator(100);
		var saltedPassword = request.body.password + newSalt;
		var sha256 = crypto.createHash('sha256').update(saltedPassword).digest('hex');
		var finalData = { 	login: userData.login, //d
							password_hash: sha256, //d
							registration_date: undefined,
							name: userData.name,
							surname: userData.surname,
							second_name: userData.second_name,
							department: userData.department,
							groupe: userData.groupe,
							entering_year: userData.entering_year,
							graduation_year: userData.graduation_year,
							company: userData.company,
							city: userData.city,
							birthday: userData.birthday,
							salt: newSalt, //d
							token: undefined //d
						  }
		var newUser = new User(finalData);
		newUser.save(function (err) {
		  	
		  	if (err) {
		  		console.log('Error was occurred:');
		  		console.log(err);
		  		response.send(err);
		  		return 0;
		  	}

		  	User.find({ login: finalData.login }, function(err, docs) {
		  		console.log('New user added');
		  		response.send(docs[0]._id);
		  	});
		});
	});

	app.get('/user/:id', function(request, response) {

		console.log('\nAsking for user');

		var id = request.params.id;

		User.find({ _id: id }, function(err, docs) {
			
			if (err) {
		  		console.log('Error was occurred:');
		  		console.log(err);
		  		response.send(err);
		  		return 0;
		  	}

		  	if(docs[0].token !== undefined) {
		  		delete docs[0].token;
		  	}
		  	console.log('User data sent');
			response.send(docs[0]);
		});
	});

	app.get('/users', function(request, response) {

		console.log('\nAsking for all users');

		User.find(function(err, docs) {
			
			if (err) {
		  		console.log('Error was occurred:');
		  		console.log(err);
		  		response.send(err);
		  		return 0;
		  	}

		  	console.log('Data was sent');
			response.send(docs);
		});
	});

	app.delete('/user/:id', function(request, response) {

		console.log('\nDeleting user');

		var id = request.params.id;

		User.remove({ _id: id }, function(err) {
			
			if (err) {
		  		console.log('Error was occurred:');
		  		console.log(err);
		  		response.send(err);
		  		return 0;
		  	}

		  	console.log('User was removed');
		  	response.send(id);
		});
	});

	app.put('/user/:id', function(request, response) {

		console.log('\nUpdating user');

		var id = request.params.id;

		User.update({ _id: id }, request.body, function(err, raw) {

			if(err) {
				console.log('Error was occurred:');
		  		console.log(err);
		  		response.send(err);
		  		return 0;	
			}

			console.log('User was updated');
			response.send(id);
		});
	});

/** Post **/


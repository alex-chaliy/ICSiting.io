'use strict';

const path = require('path');
const crypto = require('crypto');

const _ = require('lodash');

const bodyParser = require('body-parser');
const express = require('express');

const config = require('./config.js');
const saltGenerator = require('./saltGenerator.js');

const app = express();
const server = app.listen(config.server.port, () => {
	console.log('Server listening at ' +
		config.server.protocol +
		config.server.adress +
		':' + config.server.port);
});

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://' + config.db.adress + ':' + config.db.port + '/' + config.db.name);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', () => {
	console.log("Successfully connected to MongoDB");
});

/** Models **/
	const User = require('./db/models/user');
	const Post = require('./db/models/post');
	const Vacancy = require('./db/models/vacancy');

/*******
* Routes *
********/

/** others **/
	app.use('/', express.static(__dirname + '/public'));
	app.use('/node_modules', express.static(__dirname + '/node_modules'));
	app.use('/markup', express.static(__dirname + '/markup'));
	app.use('/uploads', express.static(__dirname + '/uploads'));

	app.use(bodyParser.json());

/** Users **/
	app.post('/user', (request, response) => {
		let userData = request.body;

		let newSalt = saltGenerator(100);
		let saltedPassword = userData.password + newSalt;
		let sha256 = crypto.createHash('sha256').update(saltedPassword).digest('hex');

		userData.passwordHash = sha256;
		userData.salt = newSalt;
		userData.token = newSalt;
		delete userData.password;

		if(!userData.role)
			userData.role = 'user';

		let newUser = new User(userData);

		newUser.save((err, doc) => {
			if(err) {
		  		console.log('/user | POST | Error was occurred');
				console.log(err.errmsg);
				response.send(err.errmsg);
			}
			if(doc) {
				response.send(doc._id);
			}
		});
	});

	app.get('/user/:id', (request, response) => {
		let id = request.params.id;
		User.find({ _id: id }, (err, docs) => {
			if (err) {
		  		console.log('/user/:id | GET | Error was occurred');
				console.log(err.errmsg);
		  		response.send(err.errmsg);
		  	}
			if(docs) {
				let doc = docs[0] || {};
				// delete hidden properties
				delete doc.login;
				delete doc.passwordHash;
				delete doc.salt;
				delete doc.token;
				response.send(doc);
			}
		});
	});

	app.get('/users', (request, response) => {
		User.find((err, docs) => {
			if (err) {
		  		console.log('/users | GET | Error was occurred');
		  		response.send(err.errmsg);
		  	}
		  	if(docs) {
		  		// delete hidden properties
		  		let i = 0;
		  		_.forEach(docs, (el) => {
		  			delete el.login;
		  			delete el.passwordHash;
		  			delete el.salt;
		  			delete el.token;
		  			i++;
		  			if(i === docs.length)
		  				response.send(docs);
		  		});
		  		if(docs.length === 0)
		  			response.send(docs);
		  	}
		});
	});

	app.put('/user/:id', (request, response) => {
		let id = request.params.id;
		User.update({ _id: id }, request.body, (err) => {
			if(err) {
		  		console.log('/user/:id | DELETE | Error was occurred');
		  		console.log(err.errmsg);
		  		response.send(err.errmsg);
			} else {
				response.send(id);
			}
		});
	});

	app.delete('/user/:id', (request, response) => {
		let id = request.params.id;
		User.remove({ _id: id }, (err, doc) => {
			if (err) {
		  		console.log('/user/:id | DELETE | Error was occurred');
		  		console.log(err.errmsg);
		  		response.send(err.errmsg);
		  	} else {
				response.send(id);
			}
		});
	});

/** Post **/
	app.post('/post', (request, response) => {
		let data = request.body;
		let post = new Post(data);
		post.save((err, doc) => {
			if(err) {
		  		console.log('/post | POST | Error was occurred');
				console.log(err.errmsg);
				response.send(err.errmsg);
			}
			if(doc) {
				response.send(doc._id);
			}
		});
	});

	app.get('/posts', (request, response) => {
		Post.find((err, docs) => {
			if (err) {
		  		console.log('/posts | GET | Error was occurred');
		  		response.send(err.errmsg);
		  	}
		  	if(docs) {
	  			response.send(docs);
		  	}
		});
	});

	app.put('/post/:id', (request, response) => {
		let id = request.params.id;
		Post.update({ _id: id }, request.body, (err) => {
			if(err) {
		  		console.log('/post/:id | DELETE | Error was occurred');
		  		console.log(err.errmsg);
		  		response.send(err.errmsg);
			} else {
				response.send(id);
			}
		});
	});

	app.delete('/post/:id', (request, response) => {
		let id = request.params.id;
		Post.remove({ _id: id }, (err, doc) => {
			if (err) {
		  		console.log('/post/:id | DELETE | Error was occurred');
		  		console.log(err.errmsg);
		  		response.send(err.errmsg);
		  	} else {
				response.send(id);
			}
		});
	});
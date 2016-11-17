'use strict';

const path = require('path');
const crypto = require('crypto');

const _ = require('lodash');

const bodyParser = require('body-parser');
const express = require('express');

const config = require('./config');
const saltGenerator = require('./saltGenerator');

const defineUserRole = require('./defineUserRole');

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
		delete userData.password;
		userData.token = undefined;

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
				doc.login = undefined;
				doc.passwordHash = undefined;
				doc.salt = undefined;
				doc.token = undefined;
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
		  			el.login = undefined;
		  			el.passwordHash = undefined;
		  			el.salt = undefined;
		  			el.token = undefined;
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
		let _token = request.body.token;
		request.body.token = undefined;
		let updateData = request.body;

		authCheck(_token, (accessType) => {

			console.log(accessType);
			if((accessType == 'admin') || (accessType == 'currentUser')){

				User.update({ _id: id }, updateData, (err) => {
					if(err) {
				  		console.log('/user/:id | PUT | Error was occurred');
				  		console.log(err.errmsg);
				  		response.send(err.errmsg);
					} else {
						response.send(id);
					}
				});
			} else {
				response.send('Wrong access rights');
			}
		}, id);
	});

	app.delete('/user/:id', (request, response) => {
		let id = request.params.id;
		let _token = request.body.token;
		request.body.token = undefined;

		authCheck(_token, (accessType) => {

			if((accessType == 'admin') || (accessType == 'currentUser')){
				User.remove({ _id: id }, (err, doc) => {
					if (err) {
				  		console.log('/user/:id | DELETE | Error was occurred');
				  		console.log(err.errmsg);
				  		response.send(err.errmsg);
				  	} else {
						response.send(id);
					}
				});
			} else {
				response.send('Wrong access rights');
			}
		}, id);
	});

	app.post('/login', (request, response) => {
		let data = request.body;
		User.find({ login: data.login }, (err, docs) => {
			if (err) {
		  		console.log('/login | GET | Error was occurred');
		  		console.log(err.errmsg);
		  		response.send(err.errmsg);
		  	} else {

				let saltedPassword = data.password + docs[0].salt;
				let sha256 = crypto.createHash('sha256').update(saltedPassword).digest('hex');
				if(sha256 == docs[0].passwordHash) {

					// Create new token
					let _token = saltGenerator(100);

					// Put new token in current user
					User.update({ _id: docs[0]._id }, { token: _token }, (err) => {
						if(err) {
					  		console.log('Error was occurred while creating new token');
					  		console.log(err.errmsg);
					  		response.send(err.errmsg);
						} else {
							response.send(_token);
						}
					});

				} else {
					response.send('Wrong password');
				}
			}
		})
	});

	app.post('/logout', (request, response) => {
		let token = request.body.token;

		User.update({ token: token }, { token: undefined }, (err) => {
			if(err) {
		  		console.log('Error was occurred while logout');
		  		console.log(err.errmsg);
		  		response.send(err.errmsg);
			} else {
				response.send('User was logout');
			}
		});
	});

/** Post **/
	app.post('/post', (request, response) => {
		let token = request.body.token;
		let postData = request.body;
		delete postData.token;

		let params = {
			token: token,
			UserEntity: User
		}
		defineUserRole(params, (role, user) => {
			if(role === 'admin' || role === 'moderator') {
				let post = new Post(postData);
				post.save((err, doc) => {
					if(err) {
				  		console.log('/post | POST | Error was occurred');
						console.log(err.errmsg);
						response.send(err.errmsg);
					}
					if(doc) {
						response.status(200).send(doc._id);
					}
				});
			} else {
				response.status(403).send('Write access forbidden.');
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
		let token = request.body.token;
		let postData = request.body;
		delete postData.token;

		let params = {
			token: token,
			UserEntity: User
		}
		defineUserRole(params, (role, user) => {
			if(role === 'admin' || role === 'moderator') {
				Post.update({ _id: id }, postData, (err) => {
					if(err) {
				  		console.log('/post/:id | PUT | Error was occurred');
				  		console.log(err.errmsg);
				  		response.send(err.errmsg);
					} else {
						response.status(200).send(id);
					}
				});
			} else {
				response.status(403).send('Update access forbidden.');
			}
		});
	});

	app.delete('/post/:id', (request, response) => {
		let id = request.params.id;
		let token = request.body.token;

		let params = {
			token: token,
			UserEntity: User
		}
		defineUserRole(params, (role, user) => {
			if(role === 'admin' || role === 'moderator') {
				Post.remove({ _id: id }, (err) => {
					if (err) {
				  		console.log('/post/:id | DELETE | Error was occurred');
				  		console.log(err.errmsg);
				  		response.send(err.errmsg);
				  	} else {
						response.send(id);
					}
				});
			} else {
				response.status(403).send('Delete access forbidden.');
			}
		});
	});
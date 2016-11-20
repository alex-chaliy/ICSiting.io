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
	app.post('/login', (request, response) => {
		let userData = request.body;
		User.findOne({ login: userData.login }, (err, user) => {
			if (err) response.send(err.errmsg);
		  	else {
				if(user) {
					let saltedPassword = userData.password + user.salt;
					let hashedPassword = crypto.createHash('sha256').update(saltedPassword).digest('hex');

					if(hashedPassword === user.passwordHash) {
						let newToken = saltGenerator(100);
						user.token = newToken;
						user.passwordHash = undefined;
						user.salt = undefined;

						User.update({ _id: user._id }, { token: newToken }, (err) => {
							if(err) response.send(err.errmsg);
							else response.status(200).send(user);
						});
					} else response.status(403).send('Wrong password.');
					
				} else response.status(403).send('Wrong login.');
			}
		});
	});

	app.post('/logout', (request, response) => {
		let token = request.body.token;

		User.findOne({ token: token }, (err, user) => {
			if (err) response.send(err.errmsg);
		  	else {
				if(user) {
					User.update({ token: token }, { token: null }, (err) => {
						if(err) response.send(err.errmsg);
						else response.status(200).send('User was logout.');
					});
				} else {response.status(403).send('Wrong token.');}
			}
		});
	});

	app.post('/user', (request, response) => {
		let userData = request.body;

		let newSalt = saltGenerator(100);
		let saltedPassword = userData.password + newSalt;
		let hashedPassword = crypto.createHash('sha256').update(saltedPassword).digest('hex');

		userData.passwordHash = hashedPassword;
		userData.salt = newSalt;
		delete userData.password;
		userData.token = saltGenerator(100);

		// TODO: vulnerability -> only admin can create users with role 'admin' and 'moderator'
		if(!userData.role)
			userData.role = 'user';

		if(!userData.imgUrl)
			userData.imgUrl = '/uploads/img/defaults/default-user-logo.jpg';

		User.findOne({login: userData.login}, (err, doc) => {
			if(doc) {
				response.status(403).send({
					msg: 'User with such login is existed',
					notUniqueLogin: true
				});
			} else {
				let newUser = new User(userData);
				newUser.save((err, doc) => {
					if(err) {
				  		console.log('/user | POST | Error was occurred');
						console.log(err.errmsg);
						response.status(403).send(err.errmsg);
					}
					if(doc) {
						response.send(doc._id);
					}
				});
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

/** Post **/
	app.post('/post', (request, response) => {
		let token = request.body.token;
		let postData = request.body;
		delete postData.token;

		if(!postData.coverImg)
			postData.coverImg = '/uploads/img/defaults/default-cover.jpg';

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
		Post.find()
		.sort([['creationDate', -1]]).exec((err, docs) => {
			if (err) {
		  		console.log('/posts | GET | Error was occurred');
		  		response.send(err.errmsg);
		  	}
		  	if(docs) {
		  		if(docs.length === 0)
		  			response.status(200).send(docs);
	  			// get creators for posts
		  		let i = 0;
		  		_.forEach(docs, (el) => {
		  			User.findOne({ _id: el.creator_id }, (err, user) => {
		  				if (err)
		  			  		response.status(403).send(err.errmsg);
		  				if(user) {
		  					el.creator_id = undefined;
		  					user = user || {};
		  					el.creator = {};
		  					// choose only needed properties
		  					el.creator._id = user._id;
		  					el.creator.name = user.name;
		  					el.creator.surName = user.surName;
		  					el.creator.imgUrl = user.imgUrl;
		  				}

		  				i++;
		  				if(i === docs.length)
		  					response.status(200).send(docs);
		  			});	
		  		});
		  	}
		});
	});
	app.get('/post/:id', (request, response) => {
		let id = request.params.id;
		Post.findOne({_id: id}, (err, post) => {
			if (err) {
		  		console.log('/post/:id | GET | Error was occurred');
		  		response.status(403).send(err.errmsg);
		  	}
		  	if(post) {
		  		User.findOne({ _id: post.creator_id }, (err, user) => {
		  			if (err)
		  		  		response.status(403).send(err.errmsg);
		  			if(user) {
		  				post.creator_id = undefined;
		  				user = user || {};
		  				post.creator = {};
		  				// choose only needed properties
		  				post.creator._id = user._id;
		  				post.creator.name = user.name;
		  				post.creator.surName = user.surName;
		  				post.creator.imgUrl = user.imgUrl;
		  			}
	  				response.status(200).send(post);
		  		});	
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
				  		response.status(403).send(err.errmsg);
				  	} else {
						response.status(200).send(id);
					}
				});
			} else {
				response.status(403).send('Delete access forbidden.');
			}
		});
	});

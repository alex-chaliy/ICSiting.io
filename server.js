'use strict';

const path = require('path');
const config = require('./config.js');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = app.listen(config.server.port, function() {
	console.log('Server listening at ' + config.server.protocol
				+ config.server.adress + ':' + config.server.port);
});

// const mongoose = require('mongoose');
// mongoose.connect('mongodb://' + config.db.adress
// 				+ ':' + config.db.port
// 				+ '/' +config.db.name);s

/*******
* Routes *
********/

/** others **/
	app.use(express.static(__dirname+"/public"));
	app.use('/node_modules', express.static(__dirname+"/node_modules"));
	app.use('/markup', express.static(__dirname+"/markup"));
	app.use('/uploads', express.static(__dirname+"/uploads"));
	app.use(bodyParser.json());

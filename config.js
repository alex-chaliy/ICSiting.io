'use strict';

var Config = {
	dev: {
		server: {
			protocol: 'http://',
			adress: 'localhost',
			port: 4351
		}, 
		db: {
			adress: 'localhost',
			port: '27017',
			name: 'test'
		}
	},
	production: {}
};

module.exports = Config.dev;
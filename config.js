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
	production: {
		server: {
			protocol: 'http://',
			adress: 'site.com',
			port: 4351
		}, 
		db: {
			adress: 'site.com',
			port: '27017',
			name: 'ics'
		}
	}
};

module.exports = Config.dev;
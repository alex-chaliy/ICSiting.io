'use strict';

const _ = require('lodash');

const mongoose = require('mongoose');

const config = require('./../config');

mongoose.connect(config.db.address + ':' + config.db.port + '/' + config.db.name);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', () => {
	console.log("Successfully connected to MongoDB");
});

class Db {
	/**
	* Entity - link to object; this object is mongoose model and contains mongoose methods to manipulate MongoDB
	*/

	/*************
	* Bacic metods *
	**************/

/* get */
	getInstances(params) {
		let Entity = params.Entity;
		let query = params.query;
		let callback = params.callback;
		Entity.find(query, callback);
	}

	getManyToMany(params) {
		let targetEntity = params.targetEntity;
		let instanceId = params.instanceId;
		let sumEntity = params.sumEntity;
		let callback = params.callback;

		let allFromSumEntity;
		let idsArray;
		let instancesFromTargetEntity;
		let docs;
		let getAllFromSumEntity = () => {
			return new Promise((resolve, reject) => {
				sumEntity.find((error, docs) => {
					allFromSumEntity = docs;
					resolve();
				});
			});
		}
		let getIdsArray = () => {
			return new Promise((resolve, reject) => {
				idsArray = []; 
				_.forEach(allFromSumEntity, (element) => {
					// stringify and parse object to remove mongoose-properties
					element = JSON.stringify(element);
					element = JSON.parse(element);

					for(let property in element) {
						if(element[property] != instanceId && property != '_id' && property != '__v')
							idsArray.push(element[property]);
					}
				});
				resolve();
			});
		}
		let getInstancesFromTargetEntity = () => {
			return new Promise((resolve, reject) => {
				docs = [];
				let i = 0;
				_.forEach(idsArray, (element) => {
					targetEntity.findOne({_id: element}, (error, doc) => {
						docs.push(doc);
						i++;
						if(i == idsArray.length)
							callback(docs);
					});
				});
			});
		}
		getAllFromSumEntity()
			.then(getIdsArray)
			.then(getInstancesFromTargetEntity);
	}

/* create */
	createInstances(params) {
		let Entity = params.Entity;
		let data = params.data;
		let callback = params.callback;

		let instance = new Entity(data);
		instance.save(callback);
	}

	createManyToMany(params) {
		// Пример: я нахожусь на странице редактирования продукта,
		// мне нужно создать 10 тегов и сразу прикрепить их к текущему продукту,
		// учитывая то, что продукты и теги вступают в связь многие ко многим.
	}

/* update */
	updateInstances(params) {
		let Entity = params.Entity;
		let query = params.query;
		let data = params.data;
		let callback = params.callback;
		Entity.update(query, data, callback);
	}

	updateManyToMany(params) {}

/* delete */
	deleteInstances(Entity, instanceId, callback) {
		let Entity = params.Entity;
		let query = params.query;
		let callback = params.callback;
		Entity.remove(query, callback);
	}
	deleteManyToMany(params) {}

	/*****************
	* Composite metods *
	******************/
	/*getProducts() {
		get
	}*/
}

module.exports = Db;
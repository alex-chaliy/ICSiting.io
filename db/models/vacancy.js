'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VacancySchema = new Schema({
	
});

const Vacancy = mongoose.model('Vacancy', UserSchema);

module.exports = Vacancy;
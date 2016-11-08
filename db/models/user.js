'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	login: String,
	password_hash: String,
	registration_date: { type: Date, default: Date.now },
	name: String,
	surname: String,
	second_name: String,
	department: String,
	groupe: String,
	entering_year: Date,
	graduation_year: Date,
	company: String,
	city: String,
	birthday: Date,
	salt: String,
	token: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
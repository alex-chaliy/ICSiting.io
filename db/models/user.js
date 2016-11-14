'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	login: { type:String, unique: true, required: true, dropDups: true },
	password_hash: String,
	registration_date: { type: Date, default: Date.now },
	name: String,
	surname: String,
	second_name: String,
	groupe: String,
	city: String,
	contacs: {
		skype: String,
		phone: String,
		email: String
	},
	job: {
		resume: {
			link: String,
			title: String
		},
		company: String,
		position: String
	},
	techerData: {
		department_id: String,
	},
	education: [{
		status: String,
		university: String,
		institute: String,
		department: String,
		department_id: String,
		entering_year: Date,
		graduation_year: Date,
	}],
	birthday: Date,
	salt: String,
	token: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
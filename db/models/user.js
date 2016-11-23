'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	role: String,
	verified: Boolean,
	login: { type: String, unique: true, required: true, dropDups: true },
	passwordHash: String,
	name: String,
	secondName: String,
	surName: String,
	imgUrl: String,
	city: String,
	aboutMyself: String,
	contacts: {
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
		position: String,
		skills: [String]
	},

	techerData: {
		department_id: String,
	},

	educations: [{
		status: String,
		university: String,
		institute: String,

		department: String,
		department_id: String,

		entryYear: Number,
		graduateYear: Number
	}],

	salt: String,
	token: String,

	registrationDate: { type: Date, default: Date.now },

	personalDatails: {
		hobbies: [String],
		birthday: Date
	}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
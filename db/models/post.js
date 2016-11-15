'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	creator_id: String,
	creationDate: { type: Date, default: Date.now },
	language_id: String,
	title: String,
	coverImg: String,
	tags: [String],
	parts: [String],
	eventData: {
		date: String,
		place: String,
		registrationLink: String
	},
	courseData: {
		teachers: [String],
		registrationLink: String
	}
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
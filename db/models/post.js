'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	creation_date: { type: Date, default: Date.now },
	name: String,
	creator_id: String,
	parts: [String]
});

const Post = mongoose.model('Post', UserSchema);

module.exports = Post;
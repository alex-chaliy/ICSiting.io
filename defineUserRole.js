let defineUserRole = (params, callback) => {
	let token = params.token;
	let UserEntity = params.UserEntity;

	UserEntity.findOne({ token: token }, (err, user) => {
		if (err) {
	  		console.log('Error was occurred while trying to get user data by token.');
	  		response.send(err.errmsg);
	  	}
  		user = user || {};
  		callback(user.role, user);
	});
}

module.exports = defineUserRole;
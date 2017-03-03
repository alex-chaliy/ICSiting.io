let defineUserRole = (params, callback) => {
	let token = params.token || '';
	let id = params.id || '';
	let UserEntity = params.UserEntity;

	UserEntity.findOne({ token: token }, (err, user) => {
		if (err) {
	  		console.log('Error was occurred while trying to define user role.');
	  		response.send(err.errmsg);
	  	}
  		user = user || {};
  		if(user._id == id)
  			user.role = 'dataCreator';
  		callback(user.role);
	});
}

module.exports = defineUserRole;
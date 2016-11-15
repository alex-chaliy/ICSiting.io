let saltGenerator = (length) => {
	let s = '';
	let abd ='abcdefghijklmnopqrstuvwxyz0123456789';
	let aL = abd.length;
	while(s.length < length)
		s += abd[Math.random() * aL|0];
	return s;
}

module.exports = saltGenerator;
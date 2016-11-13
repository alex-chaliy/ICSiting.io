function saltgenerator(length) {
  var s ='', abd ='abcdefghijklmnopqrstuvwxyz0123456789', aL = abd.length;
  while(s.length < length)
    s += abd[Math.random() * aL|0];
  return s;
}

module.exports = saltgenerator;
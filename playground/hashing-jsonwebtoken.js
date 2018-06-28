const jwt = require('jsonwebtoken');

var data = {
    id: 10
}

// sign takes data and hash it and it also takes our salt value
var token = jwt.sign(data, '123abc');
console.log(token);

// verify token was not manipulated (if salt is changed it will return an error)
var decoded = jwt.verify(token, '123abc');
console.log('Decoded: ', decoded);
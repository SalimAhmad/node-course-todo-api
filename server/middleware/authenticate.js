var {User} = require('./../models/user');

// middleware function used on routes to make them private (only logged in user can access them)
// authenticate has access to the user and the token
var authenticate = (req, res, next) => {
    var token = req.header('x-auth'); // to get value from header with key x-auth

    User.findByToken(token).then(user => {
        if (!user) {
            return Promise.reject(); // this will run .catch method below -- .then success case won't be executed
        }

        req.user = user;
        req.token = token;
        next();
    }).catch(e => {
        res.status(401).send();
    })
};

module.exports = {authenticate};
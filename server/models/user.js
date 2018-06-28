const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// instance methods: the methods defined on the document (instance) i.e. lower case user
// an instance (using methods) have access to just one document (user)

// Determines what gets sent back when a mongoose model is converted into JSON
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject(); // converts this document into plain javascript object

    return _.pick(userObject, ['_id', 'email']);
};

// we use regular function because arrow functions do not bind 'this' keyword
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token;
    });
};

// statics: the methods defined on the Model i.e. upper case User
// a model (using statics) have access to all documents (users)

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // })
        return Promise.reject();
        // this promise will return from findByToken
        // it is rejected so in server.js the success case (consumed by then) will never fire, but catch will
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token, // we are using quotes here because of the dot
        'tokens.access': 'auth'
    })
}

// before we run 'save' the following should be executed
UserSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        });
    } else {
        next();
    }
})

var User = mongoose.model('User', UserSchema);

module.exports = {User};
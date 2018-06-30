require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser'); // takes json and converts it into an object
const {ObjectID} = require('mongodb');

var {mangoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id // req.user from authenticate.js
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, e => {
        res.status(400).send(e);
    })
})

app.get('/todos', authenticate, (req, res) => {
    // Todo.find() gets back everything from Todo
    // Todo.find({_creator: req.user._id}) only gets todos created by the user logged in
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos}); // we want an object so we can later add properties that's why we wrap todos array inside {}
    }, e => {
        res.status(400).send(e);
    })
})

// GET /todos/123456
app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOne({
    _id: id,
    _creator: req.user._id
    }).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch(e => {
        res.status(400).send();
    })
})

app.delete('/todos/:id', authenticate, (req, res) => {
    // get the id
    var id = req.params.id;

    // validate the id --> not valid? return 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // remove todo
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then(todo => {
        // success
        // if no doc, send 404 (if it's successful, then it will definitely send doc back)
        if (!todo) {
            return res.status(404).send();
        }
        // if doc, send doc back with 200
        res.send({todo}); // OR res.send({todo: todo})
    }).catch(e => {
        // error
        // 400 with empty body
        res.status(400).send();
    });
});

// UPDATE
app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    // so that user can only update text and completed and not something else like id
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    // similar to findOneAndUpdate in mongodb-update.js (new is used in mongoose instead of returnOriginal in mongodb)
    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }


        res.send({todo});
    }).catch(e => {
        res.status(400).send();
    })
})


// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        // send token back as an http response header
        // header has 2 arguments. first is its key (name) and the second is value you want to set the header to
        res.header('x-auth', token).send(user);
    }).catch(e => {
        res.status(400).send(e);
    })
})

// private route (route for loggged in user) with authenticate middleware
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
})

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then(user => {
        user.generateAuthToken().then(token => {
            res.header('x-auth', token).send(user);
        })
    }).catch(e => {
        res.status(400).send();
    })
})

// private route with authenticate to delete token (which will log out user)
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
})

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
})

module.exports = {app};
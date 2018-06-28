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

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, e => {
        res.status(400).send(e);
    })
})

app.get('/todos', (req, res) => {
    // Todo.find() to get back everything from Todo
    Todo.find().then((todos) => {
        res.send({todos}); // we want an object so we can later add properties that's why we wrap todos array inside {}
    }, e => {
        res.status(400).send(e);
    })
})

// GET /todos/123456
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch(e => {
        res.status(400).send();
    })
})

app.delete('/todos/:id', (req, res) => {
    // get the id
    var id = req.params.id;

    // validate the id --> not valid? return 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // remove todo by id
    Todo.findByIdAndRemove(id).then(todo => {
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
app.patch('/todos/:id', (req, res) => {
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
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(todo => {
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

// private route with authenticate
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
})

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
})

module.exports = {app};
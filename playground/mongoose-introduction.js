var {mangoose} = require('./db/mongoose');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

// var newTodo2 = new Todo({
//     text: 'Something to do'
// });

// newTodo2.save().then((doc) => {
//     console.log(JSON.stringify(doc, undefined, 2))
// }, (er) => {
//     console.log('Unable to save', er)
// })

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
})

var user = new User({
    email: 'salim@example.com   '
})

user.save().then((doc) => {
    console.log('User saved', doc)
}, e => {
    console.log('Unable to save', e)
})
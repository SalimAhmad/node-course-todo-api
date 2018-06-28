const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// remove all documents (it doesn't return the removed document(s))
// Todo.remove({}).then(result => {
//     console.log(result);
// });

// find first document that matches and remove it then return removed document
// USE Todo.findOneAndRemove OR Todo.findByIdAndRemove
// Todo.findByOneAndRemove({_id: '5b325354d4d86fdfb6da4549'}).then(todo => {
//     console.log(todo);
// })

Todo.findByIdAndRemove('5b325354d4d86fdfb6da4549').then(todo => {
    console.log(todo);
})
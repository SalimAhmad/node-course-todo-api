const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5b2f7d6e21774e31c8c2f7ec99';

// if (!ObjectID.isValid(id)){
//     console.log('ID not valid');
// }

// // returns an array of documents that match the criteria or empty array if no such match exists
// Todo.find({
//     _id: id
// }).then(todos => {
//     console.log('Todos', todos);
// });

// // only returns first document that matches criteria
// // if there is no such document it will return null
// Todo.findOne({
//     _id: id
// }).then(todo => {
//     console.log('Todo', todo);
// });

// // looking for a document by its id
// Todo.findById(id).then(todo => {
//     if(!todo){
//         return console.log('ID not found');
//     }
//     console.log('Todo by ID', todo);
// }).catch(e => console.log(e));

User.findById('5b27d54990d8ba2d9439f031').then((user) => {
    if (!user) {
        return console.log('Unable to find user');
    }

    console.log(JSON.stringify(user, undefined, 2));
}, e => {
    console.log(e);
})
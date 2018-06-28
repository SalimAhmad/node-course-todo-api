const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // })

    // deleteOne (deletes first item that matches the criteria then stops)
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // })

    //findOneAndDelete (gets the data back from the first item that matches criteria then deletes it)
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // })

    // db.collection('Users').deleteMany({name: 'Salim'});

    db.collection('Users').findOneAndDelete({ _id: new ObjectID('5b278a65345f47077c7cc076')})
    .then((results) => {
        console.log(JSON.stringify(results, undefined, 2));
    })

    // client.close();
});
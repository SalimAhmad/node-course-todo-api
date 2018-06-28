const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // findOneAndUpdate arguments:
    // first: document selection filter
    // second: update operations to be performed on document
    // third: optional settings (returnOriginal when false, returns the updated document rather than the original. The default is true.)
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5b27b6bf4172e884b59d7ad9')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // })

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5b27897e02b82323bc8472c3')
    }, {
        $set: {
            name: 'Salim'
        },
        $inc: {
            age: -1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })

    // client.close();
});
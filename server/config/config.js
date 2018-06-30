// creating a test database (1st for production and test || 2nd for development)
// when we run test, we're going to be using a new database so that it's not going to wipe the development database
var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    // requiring a json file automatically parses it into a javascript object
    var config = require('./config.json');
    // if env = "test", we're gonna grab the "test" property in the json file || same in "development"
    var envConfig = config[env];

    // Object.keys(envConfig) returns an array of the keys in the envConfig object
    // envConfig[key] will grab the value of that key in the envConfig object
    Object.keys(envConfig).forEach(key => {
        process.env[key] = envConfig[key];
    })
}

// if (env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
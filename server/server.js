var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js')
var {User} = require('./models/user.js');
var {Todo} = require('./models/todo.js');

var app = express();

app.use(bodyParser.json());

app.use((request, response, next) => {
    var timeOfRequest = new Date();
     console.log(`${timeOfRequest} => method : ${request.method} => url : ${request.url}`);
    next();
});

// Create New Todo
app.post('/todos', (request, response) => {
    var newTask = new Todo({
        text : request.body.text
    });

    newTask.save().then((doc) => {
        response.send(doc);
    }).catch((error) => {
        response.status(400).send(error);
    });
});

// Get all todos
app.get('/todos', (request, response) => {
    Todo.find().then((todos) => {
        responseData = {
            data : todos,
            success : 1
        };
        response.send(responseData);
    }).catch((error) => {
        responseData = {
            errorMessage : error,
            error : 1
        };
        response.status(400).send(responseData);
    });
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000")
});

module.exports.app = app;
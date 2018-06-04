var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js')
var {User} = require('./models/user.js');
var {Todo} = require('./models/todo.js');

const port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());

app.use((request, response, next) => {
    var timeOfRequest = new Date();
    // console.log(`${timeOfRequest} => method : ${request.method} => url : ${request.url}`);
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

// Get todo with id
app.get('/todos/:id', (request, response) => {
    Todo.findById(request.params.id).then((todo) => {
        customResponse = {
            success : 1,
            data : todo
        }
        if (!todo) {
            return response.status(404).send(customResponse)
        }
        response.send(customResponse);
    }).catch((error) => {
        customResponse = {
            error : 1,
            message : error.message
        }
        response.status(400).send(customResponse);
    });
});

// Delete todo with id
app.delete('/todos/:id', (request, response) => {
    id = request.params.id;

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }
        response.send(todo);
    }).catch((error) => {
        response.send(error);
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});

module.exports.app = app;
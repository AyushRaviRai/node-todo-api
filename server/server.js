const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
require('./config/config.js');

var {mongoose} = require('./db/mongoose.js')
var {User} = require('./models/user.js');
var {Todo} = require('./models/todo.js');


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

// update todo
app.patch('/todos/:id', (request, response) => {
    id = request.params.id;
    updateBody = _.pick(reqeust.body, ['text', 'completed']);

    if (_.isBoolean(updateBody.completed)) {
        updateBody.completeAt = new Date().getTime();
    } else {
        updateBody.completeAt = null,
        updateBody.completed = false
    }

    Todo.findByIdAndUpdate(id, {$set : updateBody}, {new : true}).then((todo) => {
        if (!todo) {
            response.status(404).send();
        }
        response.send({todo});
    }).catch((error) => {
        response.status(400).send(error)
    });
});

// Sign Up New User
app.post('/user', (request, response) => {
    var body = _.pick(request.body, ['email', 'password', 'name']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        user.toJSON();
        response.header('x-auth', token).send(user);
    }).catch((error) => {
        console.log("here", error);
        response.status(400).send(error);
    })
});

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
});

module.exports.app = app;
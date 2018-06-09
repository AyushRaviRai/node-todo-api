const {ObjectID} = require('mongodb')

const {Todo} = require('./../../models/todo.js');
const {User} = require('./../../models/user.js');
const jwt = require('jsonwebtoken');


userOneId = new ObjectID();
userTwoId = new ObjectID();

dummyTodos = [{
    _id : new ObjectID(),
    text : "todo 1",
    _creator : userOneId
}, {
    _id : new ObjectID(),
    text : "text 2",
    _creator : userTwoId
}];

dummyUsers = [{
    _id : userOneId,
    email : "ayushravirai@gmail.com",
    password : "useronepass",
    name : "name ke bina nachega ??",
    tokens : [{
        access : "auth",
        token : jwt.sign({
            _id : userOneId,
            access : "auth"
        }, process.env.JWT_SECRET).toString()
    }]
}, {
    _id : userTwoId,
    email : "ayushravisdfsdfsdrai@gmail.com",
    "password" : "usernepass",
    "name" : "someoneinyourass"
}];


const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(dummyTodos).then(() => {
            done();
        }).catch((error) => {
            done(error);
        });
    }).catch((error) => {
        console.log(error);
    })
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(dummyUsers[0]).save();
        var userTwo = new User(dummyUsers[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => {
        done();
    });
}

module.exports = {dummyTodos, populateTodos, dummyUsers, populateUsers};
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb')

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/user.js');
const {dummyTodos, populateTodos, dummyUsers, populateUsers} = require('./seed/seed.js');

// Clear up the database
beforeEach(populateTodos);

beforeEach(populateUsers);

describe('POST /todos', () => {
    it('should create new todo with valid data', (done) => {
        var text = 'this is some new task'
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((response) => {
                expect(response.body.text).toBe(text);
            })
            .end((error, response) => {
                if (error) {
                    return done(error);
                }

                // Checking this text is really inserted in side the database
                Todo.find({text : text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((error) => {
                    return done(error);
                });
            });
    });

    it('should not create todo with invalid data', (done) => {
        var  text = '';

        request(app)
            .post('/todos')
            .send({text})
            .expect(400)
            .expect((response) => {
                expect(response.body.errors).toExists();
            }).end((error, response) => {
                // also note should not be inserted in db
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((error) => {
                    return done(error);
                })
            });
    });
});

describe('GET /todos', () => {
    it("should get all todos", (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((response) => {
                expect(response.body.data.length).toBe(2);
            })
            .end((error, response) => {
                return done();
            });
    });
});

describe('GET /todos/:id', () => {
    it('should return error with 400 if invalid object id', (done) => {
        request(app)
            .get('/todos/' + '6b140adcf77a072bc2e256a41231')
            .expect(400)
            .end(done)
    });

    it('should return not found with valid object id if not in db', (done) => {
        request(app)
            .get('/todos/' + '5b140adcf77a072bc2e256a4')
            .expect(404)
            .expect((response) => {
                expect(response.body.data).toBe(null);
            }).end(done)
    });

    it('should return doc found with id same as sent', (done) => {
        request(app)
            .get('/todos/' + dummyTodos[0]._id.toHexString())
            .expect(200)
            .expect((response) => {
                expect(response.body.data._id).toBe(dummyTodos[0]._id.toHexString());
            }).end(done)
    });
});

// TODO :: have to add test cases for DELETE and PATCH 
// they are pretty similar to above ones to no need !!!


describe('GET /users/me', () => {
    it('should return user when token sahi diya hain ', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.body._id).toBe(dummyUsers[0]._id.toHexString());
                expect(response.body.email).toBe(dummyUsers[0].email);
            }).end(done);
    });

    it('shoule return 401 is not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .end(done);
    });
});


describe('POST /users', () => {
    it('it shoule create a user passing valid email', (done) => {
        var email = 'nothing@gmail.com';
        var password = 'ayush123!';
        var name = "ayushhainbhai";

        request(app)
            .post('/users')
            .send({email, password, name})
            .expect(200)
            .expect((response) => {
                expect(response.headers['x-auth']).toBeTruthy();
                expect(response.body.email).toBe(email);
            }).end(done);
    });

    it('should return validation error is input invalid', (done) => {
        var email = 'nothingsdfsd@gmail.com';
        var password = 'ay';
        var name = "ayushhainbhai";

        request(app)
            .post('/users')
            .send({email, password, name})
            .expect(400)
            .end(done);
    });

    it('should not create user is email in use', (done) => {
        var email = 'ayushravirai@gmail.com';
        var password = 'aysdfsdfsdf';
        var name = "ayushhainbhai";

        request(app)
            .post('/users')
            .send({email, password, name})
            .expect(400)
            .expect((response) => {
                expect(response.body.name).toBe('MongoError');
                expect(response.body.code).toBe(11000);
            }).end(done);
    })
});

describe('POST /users/login', () => {
    it('shoule return auth token with user detaails for valid user pass and email combo', (done) => {
        var {email, password} = dummyUsers[0];
        request(app)
            .post('/users/login')
            .send({email, password})
            .expect(200)
            .expect((response) => {
                expect(response.body.email).toBe(email);
                expect(response.headers['x-auth']).toBeTruthy();
            }).end(done);
    });

    it('should return 404 error when wrong password given', (done) => {
        var {email} = dummyUsers[0];
        password = "abd12";
        request(app)
            .post('/users/login')
            .send({email, password})
            .expect(400)
            .end(done);
    });
})
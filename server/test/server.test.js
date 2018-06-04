const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb')

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/user.js');

dummyTodos = [{
    _id : new ObjectID(),
    text : "todo 1"
}, {
    _id : new ObjectID(),
    text : "text 2"
}];

// Clear up the database
beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(dummyTodos).then(() => {
            done();
        }).catch((error) => {
            done(error);
        });
    }).catch((error) => {
        console.log(error);
    })
});

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
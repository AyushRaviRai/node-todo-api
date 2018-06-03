const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/user.js');

// Clear up the database
beforeEach((done) => {
    Todo.remove({}).then(() => {
        done(); 
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
                Todo.find().then((todos) => {
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
                    expect(todos.length).toBe(0);
                    done();
                }).catch((error) => {
                    return done(error);
                })
            });
    });
});
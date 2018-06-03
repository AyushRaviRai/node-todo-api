// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        return console.log("Cannot connec to mongo db serber");
    }

    console.log("Connected To Mongo Db Server");

    // Insert Some Data in the server
    const db = client.db('TodoApp');
    // db.collection('Todos').insertOne({
    //     text : "Kuch karna hain bhai mujhe kuch to karo",
    //     completed : false
    // }, (error, result) => {
    //     if (error){
    //         return console.log("Unable to insert this shit", error);
    //     }
    //     console.log(result.ops);
    // });

    // Find all data 
    var data = db
        .collection('Todos')
        .find({
            completed : true
        }).toArray()
        .then((documents) => {
            console.log(JSON.stringify(documents, undefined, 2));
        }).catch((error) => {
            console.log("Unable to fetch todos ", error)
        });

    // console.log(data);

    client.close();
});
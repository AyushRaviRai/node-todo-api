// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        return console.log("Cannot connec to mongo db serber");
    }

    console.log("Connected To Mongo Db Server");

    // Insert Some Data in the server
    const db = client.db('TodoApp');
    // db.collection('Users').insertOne({
    //     name : "Ayush Ravi",
    //     age : 25,
    //     hobbies : "like to enjoy :P"
    // }, (error, result) => {
    //     if (error){
    //         return console.log("Unable to insert this shit", error);
    //     }
    //     console.log(result.ops);
    // });

    // // Find all data 
    // var data = db
    //     .collection('Todos')
    //     .find({
    //         completed : true
    //     }).toArray()
    //     .then((documents) => {
    //         console.log(JSON.stringify(documents, undefined, 2));
    //     }).catch((error) => {
    //         console.log("Unable to fetch todos ", error)
    //     }); 


    db.collection('Users').findOneAndUpdate({
        _id : new ObjectID('5b138d3d56b2b126efa37fd2')
    },{
        $set : {
            name : "Aakshi"
        },
        $inc : {
            age : -5
        }
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log("Some shitty error occured : ", error);
    });
    // console.log(data);

    client.close();
});
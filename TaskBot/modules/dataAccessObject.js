var MongoClient = require('mongodb').MongoClient;

exports.insertDocument = function(userObject){
  var url = "mongodb://Artur:qwerty@ds113936.mlab.com:13936/todo_manager";  
  MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("users").insertOne(userObject, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });
}
exports.insertDocuments = function(docuements){
}
exports.getDocumentByQuery = function(query){
  var url = "mongodb://Artur:qwerty@ds113936.mlab.com:13936/todo_manager";  
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log(err);
      throw err
    };
    db.collection("users").find(query).toArray(function(err, result) {
      if (err) {
        console.log(err);
        throw err
      };
      console.log(result);
      db.close();
    });
  });
}
exports.CreateCollection = function(collectionName){
  var url = "mongodb://Artur:qwerty@ds113936.mlab.com:13936/todo_manager";  
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.createCollection(collectionName, function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
}

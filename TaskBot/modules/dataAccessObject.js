var MongoClient = require('mongodb').MongoClient;

exports.insertDocument = function(userObject){
  return new Promise(function(resolve,reject){
      var url = "mongodb://Artur:qwerty@ds113936.mlab.com:13936/todo_manager";
      var dbResult;

      MongoClient.connect(url, function(err, db) {
            if (err) {
              return reject(err);
            }
            db.collection("users").insertOne(userObject, function(err, res) {
              if (err){ 
                return reject(err);
              };
              
              dbResult = {
                code: 200,
                phrase: 'SECCESS',
                message: '1 document was inserted'
              };
              return resolve(dbResult);
              db.close();
            });
          });
    });
}
exports.insertDocuments = function(docuements){
}
exports.getDocumentByQuery = function(query) {
  return new Promise(function(resolve, reject){
      var url = "mongodb://Artur:qwerty@ds113936.mlab.com:13936/todo_manager";  
      var dbResult;

      MongoClient.connect(url, function(err, db) {
        if (err) {
          return reject(err);
        };
        db.collection("users").find(query).toArray(function(err, result) {
          if (err) {
            return reject(err);
          };
          dbResult = {
            code: 200,
            data: result,
          };
          return resolve(dbResult);
          db.close();
        });
      });
    }) 
}

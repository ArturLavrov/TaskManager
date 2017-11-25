var MongoClient = require('mongodb').MongoClient;

var dbSettings = {
    url: "mongodb://Artur:qwerty@ds113936.mlab.com:13936/todo_manager",
    collection: "users",
};

exports.insertDocument = function(userObject){
  return new Promise(function(resolve,reject){
      var dbResult;

      MongoClient.connect(dbSettings.url, function(err, db) {
            if (err) {
              return reject(err);
            }
            db.collection(dbSettings.collection).insertOne(userObject, function(err, res) {
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
      var dbResult;

      MongoClient.connect(dbSettings.url, function(err, db) {
        if (err) {
          return reject(err);
        };
        db.collection(dbSettings.collection).find(query).toArray(function(err, result) {
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

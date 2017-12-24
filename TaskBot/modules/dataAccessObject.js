var MongoClient = require('mongodb').MongoClient;
var env = process.env.NODE_ENV || 'development';
var config = require('../config')[env];

exports.insertDocument = function(userObject){
  return new Promise(function(resolve,reject){
      var dbResult;

      MongoClient.connect(config.database.url, function(err, db) {
            if (err) {
              return reject(err);
            }
            db.collection(config.database.collection).insertOne(userObject, function(err, res) {
              if (err){ 
                return reject(err);
              } else {
                dbResult = {
                  code: 200,
                  phrase: 'SECCESS',
                  message: '1 document was inserted'
                };
              }
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
          MongoClient.connect(config.database.url, function(err, db) {
            if (err) {
              return reject(err);
            };
            db.collection(config.database.collection).find({ 'repositories.id': query.repositoryID },{ 'repositories.$': 1, 'email': 1, 'tocken': 1, 'githubid':1, 'login':1 }).toArray(function(err, result) {
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


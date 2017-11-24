var request = require('request');

exports.post = function(requestOptions){
    return new Promise(function(resolve,reject){
        request.post(requestOptions, function optionalCallback(err, httpResponce){
            if(err){
                return reject(err);
            }else{
                return resolve(httpResponce);
            }
        })  
    })
};

exports.get = function(requestOptions){
    return new Promise(function(resolve,reject){
         request(requestOptions, function optionalCallback(err, httpResponce) {
               if(err) {
                  return reject(err);
               }else{
                    return resolve(httpResponce);
               }
         });
  })
}
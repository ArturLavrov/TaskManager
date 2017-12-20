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
exports.getCreateTaskHeaders = function(tocken){
    return {
        'Authorization': tocken,
        'User-Agent': "//TODO's Manager",
        'Accept':'application/vnd.github.machine-man-preview+json'
    }
}
exports.getRepositoryHeaders = function(){
    return{
        'User-Agent': "//TODO's Manager",
        'Accept':'application/vnd.github.machine-man-preview+json'
    }
}
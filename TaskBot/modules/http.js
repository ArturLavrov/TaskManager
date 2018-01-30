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
exports.getJwtOptions = function(){
    return {
        url:'https://github.com/login/oauth/access_token', 
        headers:{
            'Accept': 'application/json'
        },
        formData:{
            client_id: 'client_id',
            client_secret: 'client_secrete',
            code: gitHubCode,
        }
    }
}
exports.getCreateTaskRequestOptions = function(tocken,repositoryUrl){
    return {
        url:"https://api.github.com/repos/"+ repositoryUrl +"/issues", 
        headers:{
            'Authorization': tocken,
            'User-Agent': "//TODO's Manager",
            'Accept':'application/vnd.github.machine-man-preview+json'
        },
        body:task,
        json:true,
    }
}
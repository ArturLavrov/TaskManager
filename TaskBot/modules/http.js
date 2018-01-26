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
            client_id: 'Iv1.9b56ab47a227f5d6',
            client_secret: '73250b0dff85c135ca9ae11dd6db571221b393fd',
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
var http = require('../modules/http');
//WORK
exports.getCommitDiff = function(commitId){
      return new Promise(function(resolve,reject){
            var requestUrl = "https://github.com/ArturLavrov/AdaptiveWebSite/commit/" + commitId + ".diff";
            
            var options = {
                  url: requestUrl, 
            } 

            http.get(options).then(function(response){
                  var commitDiff = response.body;
                  return resolve(commitDiff);
            }).catch(function(err){
                 return reject(err);
            });   
      });
} 
//WORK
exports.parseCommitDiff = function(diff){
      var resultDataAray = [];
      const regex = /\+\s*\/\/TODO(: |:)(\w+[^\n]+)./g;
      
      if(diff === ""){
            return resultDataAray;
      }
      let parsedValue;
      
      while ((parsedValue = regex.exec(diff)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (parsedValue.index === regex.lastIndex) {
              regex.lastIndex++;
          }
          console.log(parsedValue[2]);
          resultDataAray.push(parsedValue[2])
      }
      return resultDataAray;
};
//WORK
exports.getJwtTocken = function(gitHubCode){
      return new Promise(function(resolve, reject){
            var formData = {
                  client_id: 'Iv1.9b56ab47a227f5d6',
                  client_secret: '73250b0dff85c135ca9ae11dd6db571221b393fd',
                  code: gitHubCode,
            }
            
            var options = {
                  url:'https://github.com/login/oauth/access_token', 
                  headers:{
                  'Accept': 'application/json'
                  },
                  formData:formData,
            }

            http.post(options).then(function(response){
                  var jsonObj;
                        
                  try{
                        jsonObj = JSON.parse(response.body);
                  }catch(e){
                        return reject(e);
                  }
                        
                  var access_token = jsonObj.access_token;
                  return resolve(access_token);
            }).catch(function(err){
                  return reject(err);
            });
      });
};
//WORK
exports.createTask = function(accessTocken, message){
      return new Promise(function(resolve, reject){
            var tocken = 'token ' + accessTocken;
            
            var task = {
                  title: message,
                  body: '',
            }
            
            var options = {
                  url:'https://api.github.com/repos/ArturLavrov/AdaptiveWebSite/issues', 
                  headers:{
                        'Authorization': tocken,
                        'User-Agent': "//TODO's Manager",
                        'Accept':'application/vnd.github.machine-man-preview+json'
                  },
                  body:task,
                  json:true,
            } 
      
            http.post(options).then(function(response){
                 if(response.statusCode == 200){
                       return resolve(200);
                 }else{
                       return reject(response.message);
                 }
            }).catch(function(err){
                  return reject(err);
            });
      })
};
//WORK
exports.getUserInfo = function(jwtTocken){
    return new Promise(function(resolve,reject){
      var tocken = 'token ' + jwtTocken;
      
      var options = {
            url:'https://api.github.com/user', 
            headers:{
                  'Authorization': tocken,
                  'User-Agent': "//TODO's Manager",
                  'Accept':'application/vnd.github.machine-man-preview+json'
            },
      }
      http.get(options).then(function(response){
           var userInfo
           try{
                 userInfo = JSON.parse(response.body);
           }catch(e){
                 return reject(e);
           };
           
           return resolve(userInfo);
      }).catch(function(err){
            return reject(err);
      });
    });
}
//WORK
exports.getUserRepositories = function(jwtTocken, gitHubUserName){
  return new Promise(function(resolve,reject){
      var options = {
            url:'https://api.github.com/users/'+ gitHubUserName + '/repos',
            headers:{
                  'User-Agent': "//TODO's Manager",
                  'Accept':'application/vnd.github.machine-man-preview+json'
            }, 
      }

      http.get(options).then(function(response){
            var userRepositories = [];
            var userRepositoriesApiResponse;

           try{
                 userRepositoriesApiResponse = JSON.parse(response.body);
           }catch(e){
                 return reject(e);
           };
           userRepositoriesApiResponse.forEach(function(repository){
                  userRepositories.push(
                        {
                              name: repository.name,
                              url: repository.full_name,
                              id:repository.id,
                              description:repository.description,
                        }
                  );
            })
            return resolve(userRepositories);
      }).catch(function(err){
            return reject(err);
      });
  })
}
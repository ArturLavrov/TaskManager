var http = require('../modules/http');
var dataAccessObject = require('../modules/dataAccessObject');
//WORK
exports.startPipeline = function(webHook){
      var commitsInPush,
      repositoryId,
      query,
      commitId,
      todoArray,
      //TODO:create module that contains all Result or throw objects. For example apiResponce.UserNotFound;
      pipelineResult = {
            code: 0,
            message: ""
      };
      
      commitsInPush = webHook.commits;
      commitsInPush.forEach(function(commit){

            repositoryId = webHook.repository.id;
            query = { repositoryID: repositoryId };
            commitId = commit.id;
            
            dataAccessObject.getDocumentByQuery(query).then(function(dbResult){
                  if(dbResult.data.length > 0){
                      getCommitDiff(commitId).then(function(commitDiff){
                          todoArray = parseCommitDiff(commitDiff);
                          if(todoArray.length > 0) {
                              for(var j = 0; j < todoArray.length; j++) {
                                  createTask(dbResult.data[0].tocken, todoArray[j], dbResult.data[0].repositories[0].url).then(function(){
                                    pipelineResult.code = 200;
                                    pipelineResult.message = "Task was successfuly created";
                                    return pipelineResult;
                                  });
                              }
                        } else{
                             return; 
                        }
                      });
                  } 
                  else {
                        pipelineResult.code = 404,
                        message = "User not found"
                        return pipelineResult;
                  }
              }).catch(function(err){
                  throw {
                        code:500,
                        name: 'MongoDB Error',
                        message: "Something had happend when 'getDocumentByQuery(query)' start executed",
                        extra: err
                  }
              });
      })
}
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
                  var jsonObj, access_token;

                  jsonObj = JSON.parse(response.body);      
                  access_token = jsonObj.access_token;

                  return resolve(access_token);
            });
      });
};
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
           var userInfo;
           userInfo = JSON.parse(response.body);
           return resolve(userInfo);
      });
    });
}
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

            userRepositoriesApiResponse = JSON.parse(response.body);
          
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
      });
  })
}

getCommitDiff = function(commitId){
      return new Promise(function(resolve,reject){
            var requestUrl = "https://github.com/ArturLavrov/AdaptiveWebSite/commit/" + commitId + ".diff";
            
            var options = {
                  url: requestUrl, 
            } 

            http.get(options).then(function(response){
                  var commitDiff = response.body;
                  return resolve(commitDiff);
            });  
      });
} 
parseCommitDiff = function(diff){
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
createTask = function(accessTocken, message, repositoryUrl){
      return new Promise(function(resolve, reject){
            var tocken = 'token ' + accessTocken;
            
            var task = {
                  title: message,
                  body: '',
            }
            
            var options = {
                  url:"https://api.github.com/repos/"+ repositoryUrl +"/issues", 
                  headers:{
                        'Authorization': tocken,
                        'User-Agent': "//TODO's Manager",
                        'Accept':'application/vnd.github.machine-man-preview+json'
                  },
                  body:task,
                  json:true,
            } 
      
            http.post(options).then(function(response){
                 if(response.statusCode !== 200){
                       throw {
                             code:500,
                             message:"Something had happend when try to create task",
                       }
                 }
            });
      })
};
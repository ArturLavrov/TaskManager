var http = require('../modules/http');
var dataAccessObject = require('../modules/dataAccessObject');
var apiResponce = require('../modules/apiResponses');
var utils = require('../modules/utils');

exports.startPipeline = function(webHook){
      var commitsInPush,
      repositoryId,
      query,
      commitId,
      todoArray,

      commitsInPush = webHook.commits;
      commitsInPush.forEach(function(commit){

            repositoryId = webHook.repository.id;
            query = { repositoryID: repositoryId };
            commitId = commit.id;
            
            dataAccessObject.getDocumentByQuery(query).then(function(dbResult){
                  if(dbResult.data.length > 0){
                      getCommitDiff(commitId,dbResult.data[0].repositories[0].url)
                        .then(function(commitDiff){
                          todoArray = parseCommitDiff(commitDiff);
                          if(todoArray.length > 0) {
                              for(var j = 0; j < todoArray.length; j++) {
                                  createTask(dbResult.data[0].tocken, todoArray[j], dbResult.data[0].repositories[0].url).then(function(){
                                    return apiResponce.gitHub.taskSuccessfulyCreated();
                                  });
                              }
                        } else{
                             return; 
                        }
                      });
                  } 
                  else {
                        return apiResponce.mongoDB.recordNotFound();
                  }
              }).catch(function(err){
                  throw apiResponce.mongoDB.error();
              });
      })
}
exports.getJwtTocken = function(gitHubCode){
      return new Promise(function(resolve, reject){
            var options = http.getJwtOptions();
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
      var headers,tocken,options, userInfo;
      
      headers = http.getCreateTaskHeaders();
      tocken = 'token ' + jwtTocken;
      
      options = {
            url:'https://api.github.com/user', 
            headers:headers,
      }
      http.get(options).then(function(response){
           userInfo = JSON.parse(response.body);
           return resolve(userInfo);
      });
    });
}
exports.getUserRepositories = function(jwtTocken, gitHubUserName){
  return new Promise(function(resolve,reject){
      var options = {
            url:'https://api.github.com/users/'+ gitHubUserName + '/repos',
            headers:http.getRepositoryHeaders(), 
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

getCommitDiff = function(commitId,repositoryUrl){
      return new Promise(function(resolve,reject){
            var requestUrl = "https://github.com/"+repositoryUrl+"/commit/" + commitId + ".diff";
            
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
            var tocken,issueTitle,task,options;
            
            tocken = 'token ' + accessTocken;
            
            issueTitle = utils.capitalizeFirstLetter(message);

            task = {
                  title: issueTitle,
                  body: '',
            }
            
            options = http.getCreateTaskRequestOptions(tocken,repositoryUrl);

            http.post(options).then(function(response){
                 if(response.statusCode !== 200){
                       throw apiResponce.gitHub.failedToCreateTask();
                 }
            });
      })
};

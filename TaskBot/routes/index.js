var router = require('express').Router();
var git = require('../modules/git');
var dataAccessObject = require('../modules/dataAccessObject');
var utils = require('../modules/utils');

/* GET home page. */
router.get('/', function(req, res, next) { 
    res.sendfile("views/index.html");  
});
/* GET recive github auth callbach. */
router.get('/callback',function(req,res){
    var gitHubCode = req.query.code,
        userTocken = 0,
        userObject = {
            tocken:0,
            gitHubId:"",
            email:"",
            login:"",
        };

    //TODO:move this code to some middleware.    
    git.getJwtTocken(gitHubCode).then(function(tocken){
         
        userTocken = tocken;
         
         git.getUserInfo(tocken).then(function(userInfo){
            
            userObject.tocken = userTocken
            userObject.gitHubId = userInfo.id,
            userObject.email = userInfo.email,
            userObject.login = userInfo.login,
            
            console.log(JSON.stringify(userObject));

            dataAccessObject.insertDocument(userObject).then(function(dbResult){
                if(dbResult.code === 200){
                    res.render('successfulAuth');
                }
            })
         });
    }).catch(function(err){
        console.log(err);
    });
});

/* POST recive github webhook. */
router.post('/',function(req,res){
   var gitHubWebHook,
       query,
       commitId,
       authorEmail;

   gitHubWebHook = req.body;

   if(gitHubWebHook === "") {
      res.render('index', { title: 'Bad webhook body message' });
   }else {
      if(gitHubWebHook.head_commit.distinct) {
        
        authorEmail = gitHubWebHook.commits[0].author.email;
        commitId = gitHubWebHook.commits[0].id;
        query = { "email" : authorEmail  }

        dataAccessObject.getDocumentByQuery(query).then(function(dbResult){
            if(dbResult.data.length > 0){
                //Move to another method
                git.getCommitDiff(commitId).then(function(commitDiff){
                    var resultArray = git.parseCommitDiff(commitDiff);
                    
                    if(resultArray.length > 0) {
                        for(var i = 0; i <= resultArray.length; i++) {
                            git.createTask(dbResult.data[0].tocken, resultArray[i]).then(function(code){
                                console.log(200);
                            });
                        }
                    }

                });
            } 
            else {
                return;
            }
        }).catch(function(err){
            console.log(err);
        });
      }
   }
});
module.exports = router;

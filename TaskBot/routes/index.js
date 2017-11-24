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
            repositories:[]
        };

    //TODO:move this code to some middleware.    
    git.getJwtTocken(gitHubCode).then(function(tocken){
         
        userTocken = tocken;
         
         git.getUserInfo(tocken).then(function(userInfo){
            
            userObject.tocken = userTocken
            userObject.gitHubId = userInfo.id,
            userObject.email = userInfo.email,
            userObject.login = userInfo.login,
    
             git.getUserRepositories(userObject.tocken, userObject.login).then(function(userRepos){
                
                userObject.repositories = userRepos;
                console.log(JSON.stringify(userObject));
                
                res.render('successfulAuth', { pageData:userObject })
                
                dataAccessObject.insertDocument(userObject).then(function(dbResult){
                        console.log(dbResult.message);
                }); 
             });   
         });
    }).catch(function(err){
        console.log(err);
    });
});


router.post('/finsihedIntegration',function(req,res){
   var data = req.body;
   if(data !== "" && data !== undefined){
       if(utils.isJsonValid(JSON.stringify(data))) {
            dataAccessObject.insertDocument(data);
            res.sendStatus(200);
       }else {
           res.send(500);
       }
   }else{
       res.sendStatus(500);
   }
});

/* POST recive github webhook. */
router.post('/',function(req,res){
   var gitHubWebHook,
       repositoryId,
       query,
       authorEmail;

   gitHubWebHook = req.body;

   if(gitHubWebHook === "") {
      res.render('index', { title: 'Bad webhook body message' });
   }else {
      if(gitHubWebHook.head_commit.distinct) {
        repositoryId = gitHubWebHook.repository.id;
        
        query = { "repositories.id" : repositoryId  }

        dataAccessObject.getDocumentByQuery(query).then(function(dbResult){
            if(dbResult.data.length > 0){
                //start processing pipeline here.
            }else {
                return;
            }
        }).catch(function(err){
            console.log(err);
        });
      }
   }
});
module.exports = router;

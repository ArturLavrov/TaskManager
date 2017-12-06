var router = require('express').Router();
var git = require('../modules/git');
var dataAccessObject = require('../modules/dataAccessObject');
var utils = require('../modules/utils');
var apiResponse = require('../modules/apiResponses');

/* GET home page. */
router.get('/', function(req, res) {
    res.send("index.html");
 });

/* GET recive github auth callbach. */
router.get('/callback',function(req,res){
    var gitHubCode = req.query.code,
        userTocken = 0,
        query = {
            email:""
        }
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
            query.email = userInfo.email;
            //TODO: use limit.Query should looks like: db.users.find({"email":"arturstylus@gmail.com"}).limit(1).
            dataAccessObject.getDocumentByQuery(query).then(function(data){
                if(data.length > 0){
                    
                    userObject.tocken = userTocken
                    userObject.gitHubId = userInfo.id,
                    userObject.email = userInfo.email,
                    userObject.login = userInfo.login,
                    
                    git.getUserRepositories(userObject.tocken, userObject.login).then(function(userRepos){
                        
                        userObject.repositories = userRepos;
                        
                        res.render('repos', { pageData:userObject })
                     });   
                }
                else{
                   res.send('alreadyIntegrated.html');
                }
            })
         });
    }).catch(function(err){
          console.log(err);
    });
});

/* POST finishedIntegration. */
router.post('/finsihedIntegration',function(req,res){
    var data = req.body;
    if(data !== "" && data !== undefined) {
        if(utils.isJsonValid(JSON.stringify(data))) {
             dataAccessObject.insertDocument(data).then(function(dbResult){
                 if(dbResult.code === 200){
                     res.send(200);
                 }else{
                     res.send(500);
                 }
             }).catch(function(err){
                 console.log(err);
             }); 
        }else {
             res.send(500);
        }
    }else {
        res.sendStatus(500);
    }
 });
 
/* POST recive github webhook. */

router.post('/',function(req,res){
   var gitHubWebHook,
       query,
       commitId,
       pipeLineResult,
       authorEmail;
    
       gitHubWebHook = req.body;

   if(gitHubWebHook === "" || !gitHubWebHook.head_commit.distinct) {
      res.send(apiResponse.gitHub.incorrectWebHook())
   } else {
     try{
        pipeLineResult = git.startPipeline(gitHubWebHook);
     }
     catch(err){
        console.log(err);
     }
   }
});
module.exports = router;

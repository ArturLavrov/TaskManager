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
       authorEmail;

   gitHubWebHook = req.body;

   if(gitHubWebHook === "") {
      res.render('index', { title: 'Bad webhook body message' });
   }else {
      if(gitHubWebHook.head_commit.distinct) {
        authorEmail = gitHubWebHook.commits[0].author.email;
        
        query = { "user.email" : authorEmail  }

        dataAccessObject.getDocumentByQuery(query).then(function(dbResult){
            if(dbResult.data.length > 0){
                //start processinipeline here.
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

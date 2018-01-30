exports.gitHub = {};
exports.gitHub.taskSuccessfulyCreated = function(){
    var response = {
        code: 200,
        message: "Task was successfuly created"
    }
    return response
}
exports.gitHub.failedToCreateTask = function(response){
    var response = {
        code:500,
        message:"Something had happend when try to create task",
        gitHubResponse:response
    }
    return response;
}
exports.gitHub.incorrectWebHook = function(){
    var response = {
         code:500,
         message:"Incorrect web-hook structure",
    }
    return response;
}
exports.mongoDB = {};
exports.mongoDB.error = function(error){
   return {
        code:500,
        name:"MongoDB Error",
        message: "Something bad happend when 'getDocumentByQuery(query)' start executed",
        error:error
    }
}
exports.mongoDB.recordNotFound = function(){
    var response = {
        code:404,
        message:"Record not found",
    }
    return response;
}
exports.mongoDB.insertionSuccessful = function(){
    var response = {
        code: 200,
        phrase: 'SUCCESS',
        message: '1 document was inserted'
    }
    return response;
}
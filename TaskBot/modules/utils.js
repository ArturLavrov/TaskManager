exports.isJsonValid = function(jsonString){
    try {
        JSON.parse(jsonString);
        return true;
    } catch (e) {
        return false;
    }
}
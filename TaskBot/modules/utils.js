exports.isJsonValid = function(jsonString){
    try {
        JSON.parse(jsonString);
        return true;
    } catch (e) {
        return false;
    }
}
exports.capitalizeFirstLetter = function(){
    return string.charAt(0).toUpperCase() + string.slice(1);
}
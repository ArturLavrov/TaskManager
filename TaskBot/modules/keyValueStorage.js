var cache = require('memory-cache');
//TODO:create universal interface that will be siutable for any K/V storage(Redis,Memcache,memory cache,etc..)

exports.get = function(key){
    if(key === ''){
        return null;
    } 
    var result = cache.get(key)
    return result;
}
exports.set = function(key,value){
    //TODO:check key/value constraints
    cache.put(key,value);
}
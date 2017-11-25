var config = {
    development: {
        //url to be used in link generation
        url: 'http://my.site.com',
        //mongodb connection settings
        database: {
            url: "mongodb://Artur:qwerty@ds113936.mlab.com:13936/todo_manager",
            collection: "users",
        },
        //server details
        server: {
            host: '127.0.0.1',
            port: '3422'
        }
    },
    production: {
        //url to be used in link generation
        url: 'http://my.site.com',
        //mongodb connection settings
        database: {
            url: "mongodb://Artur:qwerty@ds113936.mlab.com:13936/todo_manager",
            collection: "users",
        },
        //server details
        server: {
            host:   '127.0.0.1',
            port:   '3421'
        }
    }
    };
    module.exports = config;
var service = require("./service.js");

module.exports =  {
    authenticate: function(params, callback) {
        if(params.username.length < 5) {
            callback({ statusCode: 500, data: "Username must be at least 5 characters long." });
        } else if(params.password.length < 5) {
            callback({ statusCode: 500, data: "Password must be at least 5 characters long." });
        } else {
            service.authenticate(params.username, params.password, function(result) {
                if(result.status) {
                    callback({ statusCode: 200, data: result.data });
                } else {
                    callback({ statusCode: 403, data: result.data });
                }
            });
        }
    },

    register: function(params, callback) {
        let scope = this;

        if(params.username.length < 5) {
            callback({ statusCode: 500, data: "Username must be at least 5 characters long." });
        } else if(params.password.length < 5) {
            callback({ statusCode: 500, data: "Password must be at least 5 characters long." });
        } else {
            service.addUser(params.username, params.password, function(result) {
                if(result.status) {
                    scope.authenticate(params, callback);
                } else {
                    callback({ statusCode: 500, data: result.data });
                }
            });
        }
    }
}
var service = require("./service.js");

module.exports =  {
    validateSession: function(params, callback) {
        let result = service.validateSession(params.sessionID);
        if(result.status) {
            callback({ statusCode: 200, data: result.data });
        } else {
            callback({ statusCode: 403, data: result.data });
        }
    },

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
    },

    changePassword: function(params, callback) {
        if(params.newPassword.length < 5) {
            callback({ statusCode: 500, data: "New password must be at least 5 characters long." });
        } else {
            service.changePassword(params.oldPassword, params.newPassword, params.sessionID, function(result) {
                if(result.status) {
                    callback({ statusCode: 200, data: result.data });
                } else {
                    callback({ statusCode: 500, data: result.data });
                }
            });
        }
    },

    getInventories: function(params, callback) {
        service.getInventories(params.sessionID, function(result) {
            if(result.status) {
                callback({ statusCode: 200, data: result.data });
            } else {
                callback({ statusCode: 500, data: "Not yet implemented" });
            }
        })
    },

    addInventory: function(params, callback) {
        if(name.length < 200) {
            callback({ statusCode: 500, data: "Inventory name can't be longer than 200 characters." });
        } else {
            service.addInventory(params.sessionID, params.name, function(result) {
                if(result.status) {
                    callback({ statusCode: 200, data: result.data });
                } else {
                    callback({ statusCode: 500, data: result.data });
                }
            })
        }
    }
}
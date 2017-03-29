var service = require("./service.js");

module.exports =  {
    validateSession: function(params, callback) {
        service.validateSession(params.sessionID, function(result) {
            if(result.status) {
                callback({ statusCode: 200, data: result.data });
            } else {
                callback({ statusCode: 403, data: result.data });
            }
        });
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
                callback({ statusCode: 500, data: result.data });
            }
        })
    },

    addInventory: function(params, callback) {
        if(params.name.length < 5 || params.name.length > 200) {
            callback({ statusCode: 500, data: "Inventory name must be between 5 and 200 characters long." });
        } else {
            service.addInventory(params.name, params.sessionID, function(result) {
                if(result.status) {
                    callback({ statusCode: 200, data: result.data });
                } else {
                    callback({ statusCode: 500, data: result.data });
                }
            })
        }
    },

    editInventory: function(params, callback) {
        service.editInventory(params.id, params.name, params.sessionID, function(result) {
            if(result.status) {
                callback({ statusCode: 200, data: result.data });
            } else {
                callback({ statusCode: 500, data: result.data });
            }
        })
    },

    deleteInventory: function(params, callback) {
        service.deleteInventory(params.inventoryID, params.sessionID, function(result) {
            if(result.status) {
                callback({ statusCode: 200, data: result.data });
            } else {
                callback({ statusCode: 500, data: result.data });
            }
        })
    },

    saveInventoryQuantities: function(params, callback) {
        service.saveInventoryQuantities(params.inventoryID, JSON.parse(params.quantities), params.sessionID, function(result) {
            if(result.status) {
                callback({ statusCode: 200, data: result.data });
            } else {
                callback({ statusCode: 500, data: result.data });
            }
        })
    },

    getProducts: function(params, callback) {
        service.getProducts(params.sessionID, function(result) {
            if(result.status) {
                callback({ statusCode: 200, data: result.data });
            } else {
                callback({ statusCode: 500, data: result.data });
            }
        })
    },

    addKnownProduct: function(params, callback) {
        service.addKnownProduct(params.productID, params.inventoryID, params.quantity, params.sessionID, function(result) {
            if(result.status) {
                callback({ statusCode: 200, data: result.data });
            } else {
                callback({ statusCode: 500, data: result.data });
            }
        });
    }
}
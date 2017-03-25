var fs = require('fs');

var PrivateService = function() {
    this.session = [];

    this.getSession = function(sessionID) {
        let sessions = this.session;
        let returnValue = null;

        for(var ses in sessions) {
            if(sessions[ses].sessionID == sessionID) {
                returnValue = sessions[ses];
                break;
            }
        }

        return returnValue;
    }

    this.readFile = function(which, callback) {
        let path = this.goBackOneDir(__dirname) + "\\data\\" + which + ".json";
        fs.readFile(path, "utf8", function (error, data) {
            if (error) {
                callback(null);
            } else {
                callback(data);
            }
        });
    }

    this.writeFile = function(which, text, callback) {
        let path = this.goBackOneDir(__dirname) + "\\data\\" + which + ".json";
        fs.writeFile(path, text, function (error) {
            if (error) {
                callback(false);
            } else {
                callback(true);
            }
        });
    }

    /*
        Returns the given path, one directory back.
    */
    this.goBackOneDir = function(path) {
        return path.substring(0, path.lastIndexOf('\\'));
    }
}

var privateService = new PrivateService();

var Service = function() {
    this.validateSession = function(sessionID, callback) {
        let session = privateService.getSession(sessionID);

        if(session == null) {
            callback({ status: false, data: null });
        } else {
            callback({ status: true, data: sessionID });
        }
    }

    /*
        Authenticate a user with a username and password.
    */
    this.authenticate = function(username, password, callback) {
        this.getData("users", function(data) {
            if(data != null && data.length > 0) {
                let match = false;
                let id = -1;

                for(var user in data) {
                    if(data[user].username == username && data[user].password == password) {
                        match = true;
                        id = data[user].id;
                        break;
                    }
                }

                if(match) {
                    let sessionID = privateService.session.length + 1;

                    privateService.session[privateService.session.length] = {
                        username: username,
                        id: id,
                        sessionID: sessionID
                    }

                    callback({ status: true, data: sessionID });
                } else {
                    callback({ status: false, data: "Credentials are not correct." });
                }
            } else {
                callback({ status: false, data: "Credentials are not correct." });
            }
        });
    }

    /*
        Register a new user with a username and password.
    */
    this.addUser = function(username, password, callback) {
        let scope = this;

        this.getData("users", function(data) {
            if(data != null && data.length > 0) {
                let match = false;
                let highestID = 0;

                for(var user in data) {
                    highestID = user.id;

                    if(data[user].username == username) {
                        match = true;
                        break;
                    }
                }

                if(!match) {
                    data[data.length] = {
                        id: highestID + 1,
                        username: username,
                        password: password
                    }
                    privateService.writeFile("users", JSON.stringify(data), function(result) {
                        if(result) {
                            scope.authenticate(username, password, callback);
                        } else {
                            callback({ status: false, data: "Registration failed, please try again later." });
                        }
                    });
                } else {
                    callback({ status: false, data: "Username already exists." });
                }
            } else {
                data = [{ id: 0, username: username, password: password }];
                privateService.writeFile("users", JSON.stringify(data), function(result) {
                    if(result) {
                        scope.authenticate(username, password, callback);
                    } else {
                        callback({ status: false, data: "Registration failed, please try again later." });
                    }
                });
            }
        });
    }

    /*
        Changes a user's password.
    */
    this.changePassword = function(oldPassword, newPassword, sessionID, callback) {
        let scope = this;

        this.getData("users", function(data) {
            if(data != null && data.length > 0) {
                let match = false;
                let session = privateService.getSession(sessionID);

                if(session != null) {
                    let userID = session.id;

                    for(var user in data) {
                        if(data[user].id == userID && data[user].password == oldPassword) {
                            match = true;
                            data[user].password = newPassword;

                            break;
                        }
                    }

                    if(match) {
                        privateService.writeFile("users", JSON.stringify(data), function(result) {
                            if(result) {
                                callback({ status: true, data: "Password chance successful." });
                            } else {
                                callback({ status: false, data: "Password chance failed, please try again later." });
                            }
                        });
                    } else {
                        callback({ status: false, data: "Old password is incorrect." });
                    }
                } else {
                    callback({ status: false, data: "Not authenticated." });
                }
            } else {
                callback({ status: false, data: "No users exist, this should never happen." });
            }
        });
    }

    /*
        Returns all the inventories belonging to the current user.
    */
    this.getInventories = function(sessionID, callback) {
        let session = privateService.getSession(sessionID);

        if(session != null) {
            this.getData("inventories", function(result) {
                let inventories = [];

                if(result != null && result.length > 0) {
                    for(var inv in result) {
                        if(result[inv].userID == session.id) {
                            inventories[inventories.length] = result[inv];
                        }
                    }
                }
                
                callback({ status: true, data: inventories });
            });
        } else {
            callback({ status: false, data: "Not authenticated." });
        }
    }

    /*
        Add an inventory with a name and a user's session ID.
    */
    this.addInventory = function(name, sessionID, callback) {
        let session = privateService.getSession(sessionID);

        if(session != null) {
            this.getData("inventories", function(result) {
                result[result.length] = {
                    name: name,
                    id: result.length,
                    userID: session.id,
                    products: []
                }

                privateService.writeFile("inventories", JSON.stringify(result), function(writtenResult) {
                    if(writtenResult) {
                        callback({ status: true, data: "Inventory created successfully." });
                    } else {
                        callback({ status: false, data: "Inventory creation failed, please try again later." });
                    }
                });
            });
        } else {
            callback({ status: false, data: "Not authenticated." });
        }
    }

    /*
        Deletes an inventory with the given ID belonging to the current user.
    */
    this.deleteInventory = function(inventoryID, sessionID, callback) {
        let session = privateService.getSession(sessionID);

        if(session != null) {
            this.getData("inventories", function(result) {
                if(result != null && result.length > 0) {
                    let match = false;

                    for(var inv in result) {
                        if(result[inv].userID == session.id && result[inv].id == inventoryID) {
                            result.splice(inv, 1);
                            match = true;
                        }
                    }

                    if(match) {
                        privateService.writeFile("inventories", JSON.stringify(result), function(writtenResult) {
                            if(writtenResult) {
                                callback({ status: true, data: "Inventory deleted successfully." });
                            } else {
                                callback({ status: false, data: "Inventory deletion failed, please try again later." });
                            }
                        });
                    } else {
                        callback({ status: false, data: "Old password is incorrect." });
                    }
                } else {
                    callback({ status: false, data: "No inventories exist, cannot delete." });
                }
            });
        } else {
            callback({ status: false, data: "Not authenticated." });
        }
    }

    /*
        Passes a JSON object of the given data type to the callback. (e.g. 'users')
    */
    this.getData = function(which, callback) {
        privateService.readFile(which, function(data) {
            callback(JSON.parse(data));
        });
    }
}

module.exports = new Service();
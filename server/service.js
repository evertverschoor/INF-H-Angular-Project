var fs = require('fs');

var PrivateService = function() {
    this.session = [];

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
    this.authenticate = function(username, password, callback) {
        this.getData("users", function(data) {
            if(data != null) {
                let match = false;

                for(var user in data) {
                    if(data[user].username == username && data[user].password == password) {
                        match = true;
                        break;
                    }
                }

                if(match) {
                    let sessionID = privateService.session.length + 1;

                    privateService.session[privateService.session.length] = {
                        username: username,
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

    this.addUser = function(username, password, callback) {
        let scope = this;

        this.getData("users", function(data) {
            if(data != null) {
                let match = false;

                for(var user in data) {
                    if(data[user].username == username) {
                        match = true;
                        break;
                    }
                }

                if(!match) {
                    data[data.length] = {
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
                callback({ status: false, data: "Credentials are not correct." });
            }
        });
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
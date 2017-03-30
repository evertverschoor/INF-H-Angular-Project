var fs = require('fs');
var controller = require("./controller.js");

// ------------------------------------------------- //
// Module that handles application-specific actions. //
// ------------------------------------------------- //
var Inventory = function() {
    /*
        Handles action calls.
    */
    this.handleRequest = function(request, response, callback) {
        var result = {
            isAction: true,
            status: 200,
            response: ""
        }

        try {
            var params = this.getParams(decodeURIComponent(request.url));
            if(params == null) {
                params = {};
            }

            var action = this.getAction(request.url);
            controller[this.getAction(request.url)](params, function(controllerResult) {
                if(typeof controllerResult.data == "string") {
                    result.response = controllerResult.data;
                } else {
                    result.response = JSON.stringify(controllerResult.data);
                }
                
                result.status = controllerResult.statusCode;

                console.log("-----------------------");
                console.log("Got request for action: " + action);
                console.log("-----------------------");

                callback(result);
            });
        } catch(ex) {
            result.isAction = false;
            result.status = 500;
            callback(result);
        }
    }

    /*
        Returns the action from a URL.
    */
    this.getAction = function(url) {
        var action = url.substring(1, url.length);

        if(action.indexOf('/') > -1) {
            action = action.substring(0, action.indexOf('/'));
        }

        if(action.indexOf('?') > -1) {
            action = action.substring(0, action.indexOf('?'));
        }

        if(action.indexOf('#') > -1) {
            action = action.substring(0, action.indexOf('#'));
        }

        return action;
    }

    /*
        Returns the parameters from the given URL, if any.
    */
    this.getParams = function(url) {
        if(url.indexOf('?') > -1) {
            var returnValue = {};

            url = url.substring(url.indexOf('?') + 1, url.length);
            var params = url.split('&');

            for(var param in params) {
                if(params[param].indexOf('=') > -1) {
                    var parts = params[param].split('=');
                    returnValue[parts[0]] = parts[1];
                }
            }
            
            return returnValue;
        } else {
            return null;
        }
    }
}

// ---------------------------------------- //
// Module that handles HTTP server actions. //
// ---------------------------------------- //
var FileServer = function() {
    /*
        Handles requests for files.
    */
    this.handleRequest = function(request, response) {
        var encoding = null;
        var cleanRequest = this.getCleanURL(request.url);

        var allowedDirectories = ["/assets", "/scripts", "/libs", "/views", "/data/images"];

        console.log("--------------------");
        console.log("Got request for file: " + cleanRequest);
        console.log("--------------------");

        // "/" returns index.html
        if(cleanRequest == '/') {
            cleanRequest = "/index.html";
        } 
        
        // "/favicon.ico" returns /assets/favicon.ico
        else if(cleanRequest == '/favicon.ico') {
            cleanRequest = "/assets/favicon.ico";
        }
        
        // Not all directories are accessible, check the request URL
        else {
            if(cleanRequest.indexOf("../") > -1) {
                response.statusCode = 403;
                response.end("Use of '../' is not allowed.");
                return;
            } else {
                var match = false;

                for(var index in allowedDirectories) {
                    if(cleanRequest.substring(0, allowedDirectories[index].length) == allowedDirectories[index]) {
                        match = true;
                        break;
                    }
                }

                if(!match) {
                    response.statusCode = 403;
                    response.end("Not allowed ;)");
                    return;
                }
            }
        }

        switch(this.getExtension(cleanRequest)) {
            case "html":
            case "htm":
            case "js":
            case "css":
                encoding = "utf8"; // Images seem to work with this encoding too, but I'll leave this bit here in case I need it later.
                break;
        }

        var path = this.goBackOneDir(__dirname) + cleanRequest;
        fs.readFile(path, encoding, function (error, data) {
            if (error) {
                console.log(error);
                response.statusCode = 404;
                response.end("Not found.");
            } else {
                response.statusCode = 200;
                response.end(data);
            }
        });
    }

    /*
        Returns the given path, one directory back.
    */
    this.goBackOneDir = function(path) {
        return path.substring(0, path.lastIndexOf('\\'));
    }

    /*
        Returns a file extension from a given string, if there is one.
    */
    this.getExtension = function(url) {
        var fileExtension = url.split('.');
        fileExtension = fileExtension[fileExtension.length - 1];

        if(fileExtension.indexOf('/') > -1) {
            return null;
        } else {
            return fileExtension;
        }
    }

    /*
        Returns a clean version of an URL that can be used for file reading.
    */
    this.getCleanURL = function(url) {
        var cleanUrl = url;

        if(cleanUrl.indexOf('#') > -1) {
            cleanUrl = url.substring(0, url.lastIndexOf('#'));
        }
        
        return cleanUrl;
    }
}

module.exports =  {
    inventory: new Inventory(),
    fileServer: new FileServer()
}
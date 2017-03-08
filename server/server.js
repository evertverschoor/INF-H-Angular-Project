var fs = require('fs');
var controller = require("./controller.js");

// ------------------------------------------------- //
// Module that handles application-specific actions. //
// ------------------------------------------------- //
var Inventory = function() {
    /*
        Handles action calls.
    */
    this.handleRequest = function(request, response) {
        let result = {
            isAction: true,
            status: 200,
            response: ""
        }

        try {
            let params = this.getParams(request.url);
            if(params == null) {
                params = {};
            }

            result.response = controller[this.getAction(request.url)](params);
        } catch(ex) {
            console.log("ACTION EX: " + ex);
            result.isAction = false;
            result.status = 500;
        }
        /*switch(this.getAction(request.url)) {
            case "authenticate":
                result.response = "Authenticate called!";
                let params = this.getParams(request.url);
                break;
            default:
                result.isAction = false;
                result.status = 500;
                break;
        }*/

        return result;
    }

    /*
        Returns the action from a URL.
    */
    this.getAction = function(url) {
        let action = url.substring(1, url.length);

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
            let returnValue = {};

            url = url.substring(url.indexOf('?') + 1, url.length);
            let params = url.split('&');

            for(var param in params) {
                if(params[param].indexOf('=') > -1) {
                    let parts = params[param].split('=');
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
        let encoding = null;
        let cleanRequest = this.getCleanURL(request.url);

        console.log("--------------------");
        console.log("Got request for file: " + cleanRequest);
        console.log("--------------------");

        if(cleanRequest == '/') {
            cleanRequest = "/index.html";
        }

        switch(this.getExtension(cleanRequest)) {
            case "html":
            case "htm":
            case "js":
            case "css":
                encoding = "utf8"; // Images seem to work with this encoding too, but I'll leave this bit here in case I need it later.
                break;
        }

        let path = this.goBackOneDir(__dirname) + cleanRequest;
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
        let fileExtension = url.split('.');
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
        let cleanUrl = url;

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
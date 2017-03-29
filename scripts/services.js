// ----------------- //
// Inventory Service //
// ----------------- //
app.service('InventoryService', function($http, AuthenticationService) {
    /*
        Returns all inventories the user has.
    */
    this.getInventories = function(callback) {
        $http({
            method: 'GET',
            url: '/getInventories?sessionID=' + AuthenticationService.getSessionID(),
        }).then(function(response) {
            for(var inv in response.data) {
                response.data[inv].name = decodeURIComponent(response.data[inv].name);
            }

            callback({ status: true, message: response.data });
        }, function(response) {
            callback({ status: false, message: response.data });
        });
    }

    /*
        Returns the inventory that belongs to the given ID.
    */
    this.getInventory = function(inventoryID, callback) {
        this.getInventories(function(result) {
            if(result.status) {
                for(var inv in result.message) {
                    if(result.message[inv].id == inventoryID) {
                        callback(result.message[inv]);
                        break;
                    }
                }
            } else {
                callback(null);
            }
        });
    }

    /*
        Adds a new inventory.
    */
    this.addInventory = function(name, callback) {
        $http({
            method: 'POST',
            url: '/addInventory?sessionID=' + AuthenticationService.getSessionID() + '&name=' + name,
        }).then(function(response) {
            callback({ status: true, message: response.data });
        }, function(response) {
            callback({ status: false, message: response.data });
        });
    }

    /*
        Edits an inventory.
    */
    this.editInventory = function(inventory, callback) {
        $http({
            method: 'POST',
            url: '/editInventory?sessionID=' + AuthenticationService.getSessionID() + '&id=' + inventory.id + "&name=" + inventory.name,
        }).then(function(response) {
            callback({ status: true, message: response.data });
        }, function(response) {
            callback({ status: false, message: response.data });
        });
    }

    /*
        Edits the quantities of products in an inventory.
    */
    this.saveInventoryQuantities = function(inventory, callback) {
        let sendableData = [];
        for(var index in inventory.products) {
            sendableData[sendableData.length] = {
                id: inventory.products[index].id,
                quantity: inventory.products[index].quantity
            }
        }

        $http({
            method: 'POST',
            url: '/saveInventoryQuantities?sessionID=' + AuthenticationService.getSessionID() + '&inventoryID=' + inventory.id + "&quantities=" + JSON.stringify(sendableData),
        }).then(function(response) {
            callback({ status: true, message: response.data });
        }, function(response) {
            callback({ status: false, message: response.data });
        });
    }

    /*
        Deletes an inventory.
    */
    this.deleteInventory = function(inventoryID, callback) {
        $http({
            method: 'POST',
            url: '/deleteInventory?sessionID=' + AuthenticationService.getSessionID() + '&inventoryID=' + inventoryID,
        }).then(function(response) {
            callback({ status: true, message: response.data });
        }, function(response) {
            callback({ status: false, message: response.data });
        });
    }
});

// --------------- //
// Product Service //
// --------------- //
app.service('ProductService', function($http, AuthenticationService) {
    /*
        Returns all products the user has.
    */
    this.getProducts = function(callback) {
        $http({
            method: 'GET',
            url: '/getProducts?sessionID=' + AuthenticationService.getSessionID(),
        }).then(function(response) {
            callback({ status: true, message: response.data });
        }, function(response) {
            callback({ status: false, message: response.data });
        });
    }

    /*
        Adds an existing product to an inventory.
    */
    this.addKnownProduct = function(productID, inventoryID, quantity, callback) {
        $http({
            method: 'POST',
            url: '/addKnownProduct?sessionID=' + AuthenticationService.getSessionID() + '&productID=' + productID + '&inventoryID=' + inventoryID + '&quantity=' + quantity,
        }).then(function(response) {
            callback({ status: true, message: response.data });
        }, function(response) {
            callback({ status: false, message: response.data });
        });
    }
});

// ---------------------- //
// Authentication Service //
// ---------------------- //
app.service('AuthenticationService', function($http) {
    /* 
        Returns the Session ID from the local storage.
    */
    this.getSessionID = function() {
        let sessionID = localStorage.getItem('SessionID');
        if(sessionID == null || sessionID == 'null') {
            return null;
        } else {
            return sessionID;
        }
    }

    /*
        Sets the Session ID to the local storage.
    */
    this.setSessionID = function(value) {
        localStorage.setItem('SessionID', value);
    }

    /*
        Returns whether or not we're currently authenticated.
    */
    this.isAuthenticated = function() {
        let sessionID = this.getSessionID();
        return sessionID != null && sessionID != "";
    }

    /*
        Makes sure if we have a session locally, that it matches the one in the server.
    */
    this.validateSession = function() {
        let sessionID = this.getSessionID();
        if(sessionID != null) {
            $http({
                method: 'GET',
                url: '/validateSession?sessionID=' + sessionID,
            }).then(function(response) {
                localStorage.setItem('SessionID', response.data);
            }, function(response) {
                localStorage.setItem('SessionID', null);
            });
        }
    }

    /*
        Authenticates a user with the given username and password.
    */
    this.authenticate = function(username, password, callback) {
        $http({
            method: 'POST',
            url: '/authenticate?username=' + username + '&password=' + password,
        }).then(function(response) {
            localStorage.setItem('SessionID', response.data);
            callback({ status: true, message: "Login successful." });
        }, function(response) {
            callback({ status: false, message: response.data });
        });
    }

    /*
        Logs out the currently authenticated user.
    */
    this.unauthenticate = function(username, password) {
        localStorage.setItem('SessionID', "");
        return { status: true, message: "Logout successful." };
    }

    /*
        Registers a new user.
    */
    this.register = function(username, password, confirmPassword, callback) {
        if(password == confirmPassword) {
            $http({
                method: 'POST',
                url: '/register?username=' + username + '&password=' + password,
            }).then(function(response) {
                localStorage.setItem('SessionID', response.data);
                callback({ status: true, message: "Registration successful." });
            }, function(response) {
                callback({ status: false, message: response.data });
            });
        } else {
           callback({ status: false, message: "Your passwords do not match." });
        }
    }
});

// --------------- //
// Account Service //
// --------------- //
app.service('AccountService', function($http, AuthenticationService) {
    /*
        Changes the user's password. Checks if the new passwords match.
    */
    this.changePassword = function(oldPassword, newPassword, confirmNewPassword, callback) {
        if(newPassword == confirmNewPassword) {
            $http({
                method: 'POST',
                url: '/changePassword?sessionID=' + AuthenticationService.getSessionID() + '&oldPassword=' + oldPassword + '&newPassword=' + newPassword,
            }).then(function(response) {
                callback({ status: true, message: "Changes applied successfully." });
            }, function(response) {
                callback({ status: false, message: response.data });
            });
        } else {
           callback({ status: false, message: "Your new passwords do not match." });
        }
    }
});

// ---------- //
// UI Service //
// ---------- //
app.service('UIService', function(AuthenticationService) {
    /*
        Makes sure the navigation bar displays the right buttons.
    */
    this.refreshNavigationBar = function() {
        if(AuthenticationService.isAuthenticated()) {
            document.querySelector("#LoginButton").style.display = "none";
            document.querySelector("#RegisterButton").style.display = "none";
            document.querySelector("#AccountButton").style.display = "";
            document.querySelector("#LogoutButton").style.display = "";
        } else {
            document.querySelector("#LoginButton").style.display = "";
            document.querySelector("#RegisterButton").style.display = "";
            document.querySelector("#AccountButton").style.display = "none";
            document.querySelector("#LogoutButton").style.display = "none";
        }
    }

    /*
        Shows a message that disappears after a couple of seconds.
    */
    this.showMessage = function(message) {
        let container = document.createElement("DIV");
        container.className = "ngUtilsMessage";

        let text = document.createTextNode(message);
        container.appendChild(text);

        document.querySelector("body").appendChild(container);

        setTimeout(function() {
            document.querySelector("body").removeChild(container);
        }, 5000);
    }

    /*
        Goes to a given page.
    */
    this.goTo = function(where) {
        window.location = "#!/" + where;
    }

    /*
        Autofocuses the first element it finds with the attribute 'autofocus'.
    */
    this.autoFocus = function() {
        let autofocusElement = document.querySelector("[data-ng-autofocus]");
        if(autofocusElement != null) {
            autofocusElement.focus();
        }
    }
});

// -------------- //
// Camera Service //
// -------------- //
app.service('CameraService', function() {
    this.cameraInterval = 0;
    this.data = {
        video: 0,
        canvas: 0,
        context: 0,
        width: 0,
        height: 0
    }

    /*
        Initializes the camera protocol on a page with the given element ID's.
    */
    this.initializeCamera = function(videoID, canvasID) {
        let scope = this;

        this.data.video = document.getElementById(videoID);
        this.data.canvas = document.getElementById(canvasID);
        this.data.context = this.data.canvas.getContext("2d");
        
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
                scope.data.video.src = window.URL.createObjectURL(stream);
                scope.data.video.play();

                setTimeout(function() {
                    scope.data.width = scope.data.video.offsetWidth;
                    scope.data.height = scope.data.video.offsetHeight;

                    scope.data.canvas.width = scope.data.width;
                    scope.data.canvas.height = scope.data.height;

                    scope.data.video.style.display = "none";
                    scope.data.canvas.style.display = "block";
                }, 500);

                scope.cameraInterval = setInterval(function() {
                    scope.data.context.drawImage(scope.data.video, 0, 0, scope.data.width, scope.data.height);
                }, 32);
            });
        }
    }

    /*
        Takes a picture with the currently set-up camera protocol.
    */
    this.takePicture = function() {
        clearInterval(this.cameraInterval);
    }

    /*
        Returns a JPEG if a picture has been taken already
    */
    this.getJPEG = function() {
        return this.data.canvas.toDataURL('image/jpeg', 0.1);
    }
});
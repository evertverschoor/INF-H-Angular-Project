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
            callback({ status: true, message: response.data });
        }, function(response) {
            callback({ status: false, message: response.data });
        });

        /*
        return [
            {
                name: "Home fridge",
                id: 0,
                products: [
                    {
                        id: 0,
                        name: "Apple",
                        quantity: 2,
                        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/220px-Red_Apple.jpg"
                    },
                    {
                        id: 1,
                        name: "Pear",
                        quantity: 5,
                        image: "http://usapears.org/wp-content/uploads/2015/01/green-anjou-pear.jpg"
                    }
                ]
            },
            {
                name: "Mini fridge",
                id: 1,
                products: [
                    {
                        id: 3,
                        name: "Banana",
                        quantity: 4,
                        image: "https://www.bbcgoodfood.com/sites/default/files/glossary/banana-crop.jpg"
                    }
                ]
            }
        ];*/
    }

    /*
        Returns the inventory that belongs to the given ID.
    */
    this.getInventory = function(inventoryID) {
        return this.getInventories()[inventoryID];
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
        Deletes an inventory.
    */
    this.deleteInventory = function(inventoryID) {
        return { status: false, message: "Not yet implemented" };
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
        
        Returns:
        {
            status: bool,
            message: string
        }
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
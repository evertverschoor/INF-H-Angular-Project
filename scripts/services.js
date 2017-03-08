// ----------------- //
// Inventory Service //
// ----------------- //
app.service('InventoryService', function() {
    /*
        Returns all inventories the user has.
    */
    this.getInventories = function() {
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
        ];
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
    this.addInventory = function(name) {
        return { status: false, message: "Not yet implemented" };
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
app.service('AuthenticationService', function() {
    /* 
        Returns the Session ID from the local storage.
    */
    this.getSessionID = function() {
        return localStorage.getItem('SessionID');
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
        return sessionID != null && sessionID != "";;
    }

    /*
        Authenticates a user with the given username and password.
    */
    this.authenticate = function(username, password) {
        localStorage.setItem('SessionID', 7362367);
        return { status: true, message: "Login successful." };
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
    this.register = function(username, password, confirmPassword) {
        console.log("PW: " + password);
        console.log("CPW: " + confirmPassword);

        if(password == confirmPassword) {
            return this.authenticate(username, password);
        } else {
            return { status: false, message: "Your passwords do not match." };
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
            document.querySelector("#LogoutButton").style.display = "";
        } else {
            document.querySelector("#LoginButton").style.display = "";
            document.querySelector("#RegisterButton").style.display = "";
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
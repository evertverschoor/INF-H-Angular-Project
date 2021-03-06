var fs = require('fs');

var PrivateService = function() {
    this.session = [];

    this.getSession = function(sessionID) {
        var sessions = this.session;
        var returnValue = null;

        for(var ses in sessions) {
            if(sessions[ses].sessionID == sessionID) {
                returnValue = sessions[ses];
                break;
            }
        }

        return returnValue;
    }

    this.clearSession = function(sessionID) {
        var toSplice = -1,
            sessions = this.session;

        for(var ses in sessions) {
            if(sessions[ses].sessionID == sessionID) {
                toSplice = ses;
                break;
            }
        }

        if(toSplice > -1) {
            this.session.splice(toSplice, 1);
            return true;
        } else {
            return false;
        }
    }

    this.readFile = function(which, callback) {
        var path = this.goBackOneDir(__dirname) + "\\data\\" + which + ".json";
        fs.readFile(path, "utf8", function (error, data) {
            if (error) {
                callback(null);
            } else {
                callback(data);
            }
        });
    }

    this.writeFile = function(which, text, callback) {
        var path = this.goBackOneDir(__dirname) + "\\data\\" + which + ".json";
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
    /*
        Make sure the front-end and back-end sessions are still valid.
    */
    this.validateSession = function(sessionID, callback) {
        var session = privateService.getSession(sessionID);

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

            // If at least 1 user exists
            if(data != null && data.length > 0) {
                var match = false;
                var id = -1;

                // For each existing user
                for(var user in data) {

                    // Compare credentials and find a match
                    if(data[user].username == username && data[user].password == password) {
                        match = true;
                        id = data[user].id;
                        break;
                    }
                }

                // If we found a match, authenticate
                if(match) {
                    var sessionID = privateService.session.length + 1;

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
        Unauthenticates the user with the given session ID.
    */
    this.unauthenticate = function(sessionID, callback) {
        var result = privateService.clearSession(sessionID);
        callback({ status: true, data: "OK" });
    }

    /*
        Register a new user with a username and password.
    */
    this.addUser = function(username, password, callback) {
        var scope = this;

        this.getData("users", function(data) {
            if(data != null && data.length > 0) {
                var match = false;
                var highestID = 0;

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
        var scope = this;

        this.getData("users", function(data) {
            if(data != null && data.length > 0) {
                var match = false;
                var session = privateService.getSession(sessionID);

                if(session != null) {
                    var userID = session.id;

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
        var session = privateService.getSession(sessionID);
        var scope = this;

        if(session != null) {
            this.getData("inventories", function(result) {
                var inventories = [];

                if(result != null && result.length > 0) {
                    for(var inv in result) {
                        if(result[inv].userID == session.id) {
                            inventories[inventories.length] = result[inv];
                        }
                    }
                }

                // Add the relevant product data (image, name)
                scope.getProducts(sessionID, function(pResult) {
                    var userProducts = pResult.data;

                    for(var inv in inventories) {
                        var invProducts = inventories[inv].products;
                        for(var invProd in invProducts) {
                            for(var prod in userProducts) {
                                if(invProducts[invProd].id == userProducts[prod].id) {
                                    inventories[inv].products[invProd].image = userProducts[prod].image;
                                    inventories[inv].products[invProd].name = userProducts[prod].name;
                                }
                            }
                        }
                    }

                    callback({ status: true, data: inventories });
                });
            });
        } else {
            callback({ status: false, data: "Not authenticated." });
        }
    }

    /*
        Add an inventory with a name and a user's session ID.
    */
    this.addInventory = function(name, sessionID, callback) {
        var session = privateService.getSession(sessionID);

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
        var session = privateService.getSession(sessionID);

        if(session != null) {
            this.getData("inventories", function(result) {
                if(result != null && result.length > 0) {
                    var match = false;

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
                        callback({ status: false, data: "No inventory found." });
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
        Edits an inventory with the given ID belonging to the current user.
    */
    this.editInventory = function(inventoryID, inventoryName, sessionID, callback) {
        var session = privateService.getSession(sessionID);

        if(session != null) {
            this.getData("inventories", function(result) {
                if(result != null && result.length > 0) {
                    var match = false;

                    for(var inv in result) {
                        if(result[inv].userID == session.id && result[inv].id == inventoryID) {
                            result[inv].name = inventoryName;
                            match = true;
                        }
                    }

                    if(match) {
                        privateService.writeFile("inventories", JSON.stringify(result), function(writtenResult) {
                            if(writtenResult) {
                                callback({ status: true, data: "Inventory edited successfully." });
                            } else {
                                callback({ status: false, data: "Inventory editing failed, please try again later." });
                            }
                        });
                    } else {
                        callback({ status: false, data: "No inventory found." });
                    }
                } else {
                    callback({ status: false, data: "No inventories exist, cannot edit." });
                }
            });
        } else {
            callback({ status: false, data: "Not authenticated." });
        }
    }

    /*
        Edits the quantities of the products in an inventory with the given ID belonging to the current user.
    */
    this.saveInventoryQuantities = function(inventoryID, quantities, sessionID, callback) {
        var session = privateService.getSession(sessionID);
        var productsToRemove = [];

        if(session != null) {
            this.getData("inventories", function(result) {
                if(result != null && result.length > 0) {
                    var match = false;
                    
                    // Iterator for inventories
                    for(var inv in result) {
                        if(result[inv].userID == session.id && result[inv].id == inventoryID) {

                            // Iterator for products in this inventory
                            for(var prod in result[inv].products) {
                                
                                // Iterator for products that could change their quantity
                                for(var quan in quantities) {
                                    if(result[inv].products[prod].id == quantities[quan].id) {
                                        if(quantities[quan].quantity > 0) {
                                            result[inv].products[prod].quantity = quantities[quan].quantity;
                                        } else {
                                            productsToRemove[productsToRemove.length] = {
                                                inventoryIndex: inv,
                                                productIndex: prod
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Remove any products that have quantity 0
                    for(var toRemove in productsToRemove) {
                        result[productsToRemove[toRemove].inventoryIndex].products.splice(productsToRemove[toRemove].productIndex, 1);
                    }

                    privateService.writeFile("inventories", JSON.stringify(result), function(writtenResult) {
                        if(writtenResult) {
                            callback({ status: true, data: "Quantities updated successfully." });
                        } else {
                            callback({ status: false, data: "Quantity updating failed, please try again later." });
                        }
                    });
                } else {
                    callback({ status: false, data: "No inventories exist, cannot edit." });
                }
            });
        } else {
            callback({ status: false, data: "Not authenticated." });
        }
    }

    /*
        Returns all the products belonging to the current user.
    */
    this.getProducts = function(sessionID, callback) {
        var session = privateService.getSession(sessionID);

        if(session != null) {
            this.getData("products", function(result) {
                var products = [];

                if(result != null && result.length > 0) {
                    for(var prod in result) {
                        if(result[prod].userID == session.id) {
                            products[products.length] = result[prod];
                        }
                    }
                }
                
                callback({ status: true, data: products });
            });
        } else {
            callback({ status: false, data: "Not authenticated." });
        }
    }

    /*
        Adds a known product to a given inventory.
    */
    this.addKnownProduct = function(productID, inventoryID, quantity, sessionID, callback) {
        var session = privateService.getSession(sessionID);

        if(quantity < 1) {
            callback({ status: true, data: "No products were added." });
            return;
        }

        if(session != null) {
            this.getData("inventories", function(result) {
                if(result != null && result.length > 0) {
                    var match = false;

                    for(var inv in result) {
                        if(result[inv].userID == session.id && result[inv].id == inventoryID) {
                            var products = result[inv].products;

                            var productMatch = false;
                            for(var prod in products) {
                                if(products[prod].id == productID) {
                                    result[inv].products[prod].quantity = parseInt(result[inv].products[prod].quantity) + parseInt(quantity);
                                    productMatch = true;
                                    break;
                                }
                            }

                            if(!productMatch) {
                                result[inv].products[result[inv].products.length] = {
                                    id: productID,
                                    quantity: parseInt(quantity)
                                }
                            }

                            match = true;
                            break;
                        }
                    }

                    if(match) {
                        privateService.writeFile("inventories", JSON.stringify(result), function(writtenResult) {
                            if(writtenResult) {
                                callback({ status: true, data: "Product added successfully." });
                            } else {
                                callback({ status: false, data: "Adding product failed, please try again later." });
                            }
                        });
                    } else {
                        callback({ status: false, data: "No inventory found." });
                    }
                } else {
                    callback({ status: false, data: "No inventories exist, cannot add product." });
                }
            });
        } else {
            callback({ status: false, data: "Not authenticated." });
        }
    }

    /*
        Adds a new product to a given inventory.
    */
    this.addNewProduct = function(name, quantity, inventoryID, image, sessionID, callback) {
        var session = privateService.getSession(sessionID),
            scope = this;

        if(session != null) {
            // Save the image and retrieve the URL to it
            image = image.replace(/^data:image\/jpeg;base64,/, "");
            var productID = new Date().getTime() + "_" + name.replace(/ /g,"_"),
                imageURL = "data/images/" + productID + ".jpg";

            fs.writeFile(imageURL, image, 'base64', function(err) {
                if(err == null) {
                    // Save the product with the image URL
                    scope.getData("products", function(result) {
                        result[result.length] = {
                            id: productID,
                            userID: session.id,
                            name: name,
                            image: imageURL
                        }

                        privateService.writeFile("products", JSON.stringify(result), function(writtenResult) {
                            if(writtenResult && quantity < 1) {
                                callback({ status: true, data: "Product added successfully." });
                            } else if(writtenResult) {
                                // If the quantity is > 1, use addKnownProduct to add it to the inventory
                                scope.addKnownProduct(productID, inventoryID, quantity, sessionID, callback);
                            } else {
                                callback({ status: false, data: "Adding product failed, please try again later." });
                            }
                        });
                    });
                } else {
                    console.log("Error saving the new product image, perhaps you need to create a directory 'data/images'?");
                    callback({ status: false, data: "Failed to save your image, please try again later." });
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
            if(data == null) {
                callback([]);
            } else {
                callback(JSON.parse(data));
            }
        });
    }
}

module.exports = new Service();
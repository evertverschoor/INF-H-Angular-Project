// --------------------- //
// Navigation Controller //
// --------------------- //
app.controller('navigationController', function($scope, AuthenticationService, UIService, AuthenticationService) {
    /*
        Logs out the authenticated user.
    */
    $scope.logOut = function() {
        let result = AuthenticationService.unauthenticate();
        if(result.status) {
            UIService.goTo("login");
            UIService.refreshNavigationBar();
        }

        UIService.showMessage(result.message);
    }

    AuthenticationService.validateSession();
    UIService.refreshNavigationBar();
});

// -------------------- //
// Inventory Controller //
// -------------------- //
app.controller('inventoryController', function($scope, $route, InventoryService, AuthenticationService, UIService) {
    if(AuthenticationService.isAuthenticated()) {
        $scope.empty = false;
        InventoryService.getInventories(function(data) {
            $scope.inventories = data.message != "null" ? data.message : [];
            if($scope.inventories.length < 1)  {
                $scope.empty = true;
            }
        });

        $scope.saveInventoryQuantities = function(inventory) {
            InventoryService.saveInventoryQuantities(inventory, function(result) {
                if(result.status) {
                    $route.reload();
                    UIService.refreshNavigationBar();
                }

                UIService.showMessage(result.message);
            });
        }

        UIService.autoFocus();
    } else {
        UIService.goTo("login");
    }
});

// ---------------- //
// Login Controller //
// ---------------- //
app.controller('loginController', function($scope, AuthenticationService, UIService) {
    $scope.username = "";
    $scope.password = "";

    $scope.login = function() {
        AuthenticationService.authenticate($scope.username, $scope.password, function(result) {
            if(result.status) {
                UIService.goTo("inventory");
                UIService.refreshNavigationBar();
            }

            UIService.showMessage(result.message);
        });
    }

    UIService.autoFocus();
    UIService.refreshNavigationBar();
});

// ------------------- //
// Register Controller //
// ------------------- //
app.controller('registerController', function($scope, AuthenticationService, UIService) {
    $scope.username = "";
    $scope.password = "";
    $scope.confirmPassword = "";

    $scope.register = function() {
        AuthenticationService.register($scope.username, $scope.password, $scope.confirmPassword, function(result) {
            if(result.status) {
                UIService.goTo("inventory");
                UIService.refreshNavigationBar();
            }

            UIService.showMessage(result.message);
        });
    }

    UIService.autoFocus();
    UIService.refreshNavigationBar();
});

// ------------------ //
// Account Controller //
// ------------------ //
app.controller('accountController', function($scope, AuthenticationService, UIService, AccountService) {
    if(AuthenticationService.isAuthenticated()) {
        $scope.oldPassword = "";
        $scope.newPassword = "";
        $scope.confirmNewPassword = "";

        $scope.apply = function() {
            console.log("Hiiiii!");
            AccountService.changePassword($scope.oldPassword, $scope.newPassword, $scope.confirmNewPassword, function(result) {
                if(result.status) {
                    UIService.goTo("account");
                    UIService.refreshNavigationBar();
                }

                UIService.showMessage(result.message);
            });
        }

        UIService.autoFocus();
    } else {
        UIService.goTo("login");
    }
});

// ------------------------ //
// New Inventory Controller //
// ------------------------ //
app.controller('newInventoryController', function($scope, AuthenticationService, UIService, InventoryService) {
    if(AuthenticationService.isAuthenticated()) {
        $scope.name = "";

        $scope.createInventory = function() {
            InventoryService.addInventory($scope.name, function(data) {
                if(data.status) {
                    UIService.goTo("inventory");
                    UIService.refreshNavigationBar();
                }

                UIService.showMessage(data.message);
            });
        }

        UIService.autoFocus();
    } else {
        UIService.goTo("login");
    }
});

// ------------------------ //
// Edit Inventory Controller //
// ------------------------ //
app.controller('editInventoryController', function($scope, $routeParams, AuthenticationService, UIService, InventoryService) {
    if(AuthenticationService.isAuthenticated()) {
        InventoryService.getInventory($routeParams.id, function(result) {
            $scope.inventory = result;
            $scope.displayName = angular.copy(result.name);
        });

        $scope.editInventory = function() {
            InventoryService.editInventory($scope.inventory, function(data) {
                if(data.status) {
                    UIService.goTo("inventory");
                    UIService.refreshNavigationBar();
                }

                UIService.showMessage(data.message);
            });
        }

        UIService.autoFocus();
    } else {
        UIService.goTo("login");
    }
});

// --------------------------- //
// Delete Inventory Controller //
// --------------------------- //
app.controller('deleteInventoryController', function($scope, $routeParams, AuthenticationService, UIService, InventoryService) {
    if(AuthenticationService.isAuthenticated()) {
        InventoryService.getInventory($routeParams.id, function(result) {
            $scope.inventory = result;
            $scope.displayName = angular.copy(result.name);
        });

        $scope.deleteInventory = function() {
            InventoryService.deleteInventory($scope.inventory.id, function(result) {
                if(result.status) {
                    UIService.goTo("inventory");
                    UIService.refreshNavigationBar();
                }

                UIService.showMessage(result.message);
            });
        }

        UIService.autoFocus();
    } else {
        UIService.goTo("login");
    }
});

// ---------------------- //
// Add Product Controller //
// ---------------------- //
app.controller('addProductController', function($scope, $routeParams, AuthenticationService, UIService, CameraService, InventoryService, ProductService) {
    if(AuthenticationService.isAuthenticated()) {
        $scope.newProduct = {
            name: "",
            quantity: 1
        }

        InventoryService.getInventory($routeParams.id, function(result) {
            $scope.inventory = result;
            $scope.displayName = angular.copy(result.name);
        });

        ProductService.getProducts(function(result) {
            $scope.products = result.message;
            
            if($scope.products.length > 0) {
                $scope.hasKnownProducts = true;
                $scope.knownProductImage = $scope.products[0].image;

                $scope.knownProduct = {
                    id: $scope.products[0].id,
                    quantity: 1,
                    image: $scope.products[0].image
                }
            } else {
                $scope.hasKnownProducts = false;
                $scope.knownProduct = {
                    image: ""
                }
            }
        })

        $scope.addNew = function() {
            let imageData = CameraService.getJPEG();
            console.log(imageData);
            UIService.showMessage("Not yet implemented");
        }

        $scope.addKnown = function() {

            ProductService.addKnownProduct($scope.knownProduct.id, $scope.inventory.id, $scope.knownProduct.quantity, function(result) {
                if(result.status) {
                    UIService.goTo("inventory");
                }

                UIService.showMessage(result.message);
            });
        }

        $scope.takePicture = function() {
            CameraService.takePicture();
            UIService.showMessage("Picture taken.");
        }

        $scope.setKnownProduct = function(product) {
            $scope.knownProduct.id = product.id;
            $scope.knownProduct.image = product.image;
        }

        UIService.autoFocus();

        CameraService.initializeCamera("ProductPictureVideo", "ProductPictureCanvas");
    } else {
        UIService.goTo("login");
    }
});
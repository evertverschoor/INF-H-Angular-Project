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
app.controller('inventoryController', function($scope, InventoryService, AuthenticationService, UIService) {
    if(AuthenticationService.isAuthenticated()) {
        $scope.empty = false;
        InventoryService.getInventories(function(data) {
            $scope.inventories = data.message != "null" ? data.message : [];
            if($scope.inventories.length < 1)  {
                $scope.empty = true;
            }

            UIService.autoFocus();
        });
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

// --------------------------- //
// Delete Inventory Controller //
// --------------------------- //
app.controller('deleteInventoryController', function($scope, $routeParams, AuthenticationService, UIService, InventoryService) {
    if(AuthenticationService.isAuthenticated()) {
        InventoryService.getInventory($routeParams.id, function(result) {
            $scope.inventory = result;
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
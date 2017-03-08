// --------------------- //
// Navigation Controller //
// --------------------- //
app.controller('navigationController', function($scope, AuthenticationService, UIService) {
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

    UIService.refreshNavigationBar();
});

// -------------------- //
// Inventory Controller //
// -------------------- //
app.controller('inventoryController', function($scope, InventoryService, AuthenticationService, UIService) {
    if(AuthenticationService.isAuthenticated()) {
        $scope.empty = false;
        $scope.inventories = InventoryService.getInventories();
        if($scope.inventories.length < 1)  {
            $scope.empty = true;
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
        let result = AuthenticationService.authenticate($scope.username, $scope.password);
        if(result.status) {
            UIService.goTo("inventory");
            UIService.refreshNavigationBar();
        }

        UIService.showMessage(result.message);
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
        let result = AuthenticationService.register($scope.username, $scope.password, $scope.confirmPassword);
        if(result.status) {
            UIService.goTo("inventory");
            UIService.refreshNavigationBar();
        }

        UIService.showMessage(result.message);
    }

    UIService.autoFocus();
    UIService.refreshNavigationBar();
});

// ------------------------ //
// New Inventory Controller //
// ------------------------ //
app.controller('newInventoryController', function($scope, AuthenticationService, UIService, InventoryService) {
    if(AuthenticationService.isAuthenticated()) {
        $scope.name = "";

        $scope.createInventory = function() {
            let result = InventoryService.addInventory($scope.name);
            if(result.status) {
                UIService.goTo("inventory");
                UIService.refreshNavigationBar();
            }

            UIService.showMessage(result.message);
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
        $scope.inventory = InventoryService.getInventory($routeParams.id);

        $scope.deleteInventory = function() {
            let result = InventoryService.deleteInventory($scope.inventory.id);
            if(result.status) {
                UIService.goTo("inventory");
                UIService.refreshNavigationBar();
            }

            UIService.showMessage(result.message);
        }

        UIService.autoFocus();
    } else {
        UIService.goTo("login");
    }
});
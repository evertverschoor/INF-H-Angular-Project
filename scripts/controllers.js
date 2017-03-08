app.controller('inventoryController', function($scope, InventoryService) {
    $scope.inventory = InventoryService.getInventory(0000);
    angularUtils.autoFocus();
});

app.controller('loginController', function($scope) {
    $scope.username = "";
    $scope.password = "";
    $scope.login = function() {

    }

    angularUtils.autoFocus();
});
var app = angular.module('inventory', ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/inventory", {
        templateUrl: "views/inventory.html",
        controller: "inventoryController"
    })
    .when("/login", {
        templateUrl: "views/login.html",
        controller: "loginController"
    })
    .otherwise({
        templateUrl: "views/inventory.html",
        controller: "inventoryController"
    });
});

app.controller('inventoryController', function($scope) {
    $scope.products = [
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
        },
    ];

    angularUtils.autoFocus();
});

app.controller('loginController', function($scope) {
    $scope.username = "";
    $scope.password = "";
    $scope.login = function() {

    }

    angularUtils.autoFocus();
});
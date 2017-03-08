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
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
    .when("/register", {
        templateUrl: "views/register.html",
        controller: "registerController"
    })
    .when("/newinventory", {
        templateUrl: "views/newinventory.html",
        controller: "newInventoryController"
    })
    .when("/deleteinventory", {
        templateUrl: "views/deleteinventory.html",
        controller: "deleteInventoryController"
    })
    .otherwise({
        templateUrl: "views/inventory.html",
        controller: "inventoryController"
    });
});
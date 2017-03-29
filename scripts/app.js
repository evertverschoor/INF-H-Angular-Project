var app = angular.module('inventory', ["ngRoute"]);

/*
    Route configuration
*/
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
    .when("/account", {
        templateUrl: "views/account.html",
        controller: "accountController"
    })
    .when("/newinventory", {
        templateUrl: "views/newinventory.html",
        controller: "newInventoryController"
    })
    .when("/editinventory", {
        templateUrl: "views/editinventory.html",
        controller: "editInventoryController"
    })
    .when("/deleteinventory", {
        templateUrl: "views/deleteinventory.html",
        controller: "deleteInventoryController"
    })
    .when("/addproduct", {
        templateUrl: "views/addproduct.html",
        controller: "addProductController"
    })
    .otherwise({
        templateUrl: "views/inventory.html",
        controller: "inventoryController"
    });
});

/*
    Filter definitions
*/
app.filter('mediumNameLimiter', function () {
    return function (item) {
        return item.length > 22 ? item.substring(0, 22) + "..." : item;
    };
});

app.filter('smallNameLimiter', function () {
    return function (item) {
        return item.length > 17 ? item.substring(0, 17) + "..." : item;
    };
});
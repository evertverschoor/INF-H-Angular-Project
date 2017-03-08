app.service('InventoryService', function() {
    this.getInventory = function(sessionID) {
        return {
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
        };
    }
});
uiTest.onTestStart(function() {

    // STEP 1 - LOGIN //
    uiTest.enterData("admin", "#LoginUsername");
    uiTest.enterData("admin", "#LoginPassword");
    uiTest.click("#LoginSubmit", function(result) {
        result.assertHas(
            "Inventory</h1>", 
            "Header 'Inventory' should be there."
        );

        result.assertHasNot(
            "Login</h1>", 
            "Header 'Login' should not be there."
        );

        // STEP 2 - NEW INVENTORY //
        uiTest.click("#NewInventoryButton", function(result) {
            result.assertHas(
                "New inventory</h1>", 
                "Header 'New inventory' should be there."
            );

            // STEP 3 - CREATE THE INVENTORY //
            uiTest.enterData("Test inventory", "#NewInventoryName");
            uiTest.click("#NewInventorySubmit", function(result) {
                result.assertHas(
                    "Not yet implemented.", 
                    "We should get a 'Not yet implemented' warning.", 
                    ".ngUtilsMessage"
                );
            });
        });
    });
});
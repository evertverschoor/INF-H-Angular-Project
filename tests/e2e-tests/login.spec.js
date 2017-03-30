describe('Logging in', function() {
    beforeEach(function() {
        browser.get('http://localhost:80');
    });
  
    it('should display the login page', function() {
        var pageHeader = element(by.tagName("h1")).getText();
        expect(pageHeader).toBe("Login");
    });

    it('should fail with false credentials', function() {
        var usernameField = element(by.id("LoginUsername")),
            passwordField = element(by.id("LoginPassword"));

        usernameField.sendKeys("wrongUsername");
        passwordField.sendKeys("wrongPassword");

        element(by.id("LoginSubmit")).click();

        var message = element(by.className("ngUtilsMessage")).getText();
        expect(message).toBe("Credentials are not correct.");
    });

    it('should pass with correct credentials', function() {
        var usernameField = element(by.id("LoginUsername")),
            passwordField = element(by.id("LoginPassword"));

        // Keep in mind these credentials need to actually exist or this test fails too
        usernameField.sendKeys("guest@gmail.com");
        passwordField.sendKeys("guest");

        element(by.id("LoginSubmit")).click();

        var message = element(by.className("ngUtilsMessage")).getText();
        expect(message).toBe("Login successful.");
    });
});
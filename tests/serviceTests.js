describe("Authentication Service", function() {
    var authenticationService;

    beforeEach(angular.mock.module("inventory"));

    beforeEach(inject(function(_AuthenticationService_) {
        authenticationService = _AuthenticationService_;
    }));

    describe("Registering", function() {
        /*
            Test #1: "Confirm password" field not matching the password field
        */
        it("should fail when the two passwords don't match", function() {
            authenticationService.register("username", "password", "passwordDifferent", function(result) {
                expect(result.status).toBe(false);
            });
        });

        /*
            Test #2: "Confirm password" field and password field matching
        */
        it("should pass when the two passwords match", function() {
            authenticationService.register("username", "password", "password", function(result) {
                expect(result.status).toBe(true);
            });
        });
    });
});
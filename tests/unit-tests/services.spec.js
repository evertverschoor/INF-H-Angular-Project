describe("Authentication Service", function() {
    var authenticationService;

    beforeEach(angular.mock.module("inventory"));

    beforeEach(inject(function(_AuthenticationService_) {
        authenticationService = _AuthenticationService_;
    }));

    describe("Registering", function() {
        
        it("should fail when the two passwords don't match", function() {
            authenticationService.register("username", "password", "passwordDifferent", function(result) {
                expect(result.status).toBe(false);
            });
        });

        it("should pass when the two passwords match", function() {
            authenticationService.register("username", "password", "password", function(result) {
                expect(result.status).toBe(true);
            });
        });
    });

    describe("Session in LocalStorage", function() {
        
        it("should properly write a session to LocalStorage", function() {
            authenticationService.setSessionID("test");
            var storedSessionID = authenticationService.getSessionID();
            expect(storedSessionID).toEqual("test");
        });

        it("should tell us we're authenticated when we have a local session", function() {
            authenticationService.setSessionID("test");
            var isAuthenticated = authenticationService.isAuthenticated();
            expect(isAuthenticated).toBe(true);
        });

        it("should tell us we're not authenticated when we don't have a local session", function() {
            authenticationService.setSessionID("");
            var isAuthenticated = authenticationService.isAuthenticated();
            expect(isAuthenticated).toBe(false);
        });
    });
});

describe("Account Service", function() {
    var accountService;

    beforeEach(angular.mock.module("inventory"));

    beforeEach(inject(function(_AccountService_) {
        accountService = _AccountService_;
    }));

    describe("Changing Password", function() {
        
        it("should fail when the two passwords don't match", function() {
            accountService.changePassword("oldPassword", "newPassword", "newPasswordDifferent", function(result) {
                expect(result.message).toEqual("Your new passwords do not match.");
            });
        });

        it("should pass when the two passwords match", function() {
            accountService.changePassword("oldPassword", "newPassword", "newPassword", function(result) {
                expect(result.message).not.toEqual("Your new passwords do not match.");
            });
        });
    });
});
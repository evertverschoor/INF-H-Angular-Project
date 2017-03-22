var UITest = function() {
    "use strict";

    let scope = this;
    let ongoingTest = { callback: null }
    let successfulTests = 0;
    let failedTests = 0;
    let testResultsTimeout = 0;

    let TestableResult = function(onAssertPositive, onAssertNegative) {
        /*
            Asserts if the tested subject has the given text occurence.
            @param value : Has what?
            @param subject : Describe this assertion.
            @param scope : Optional, where specifically to look for the value?
        */
        this.assertHas = function(value, subject, scope) {
            let whereToLook = document.body;
            if(scope != null) {
                whereToLook = scope;
            }

            if(whereToLook.innerHTML.indexOf(value) > -1) {
                onAssertPositive(subject);
            } else {
                onAssertNegative(subject);
            }
        }

        /*
            Asserts if the tested subject does not have the given text occurence.
            @param value : Doesn't have what?
            @param subject : Describe this assertion.
            @param scope : Optional, where specifically to look for the value?
        */
        this.assertHasNot = function(value, subject, scope) {
            let whereToLook = document.body;
            if(scope != null) {
                whereToLook = scope;
            }

            if(!(whereToLook.innerHTML.indexOf(value) > -1)) {
                onAssertPositive(subject);
            } else {
                onAssertNegative(subject);
            }
        }
    }

    let onTestStartCallback = function() {
        console.error("No test function has been defined!");
    }

    let getTestCount = function() {
        return successfulTests + failedTests;
    }

    let assertPositive = function(subject) {
        successfulTests++;
        scope.log("Test: \"" + subject + "\" passed. " + " (" + successfulTests + "/" + getTestCount() + " tests passed)", 'a');
    }

    let assertNegative = function(message) {
        failedTests++;
        scope.log("Test: \"" + subject + "\" did not pass. " + " (" + successfulTests + "/" + getTestCount() + " tests passed)", 'e');
    }

    let onHttpRequestCompleted = function(response) {
        if(ongoingTest.callback != null) {
            console.log("Clearing/setting timeout!");
            clearTimeout(testResultsTimeout);
            testResultsTimeout = setTimeout(function() {
                console.log("Hit timeout!");
                ongoingTest.callback(new TestableResult(assertPositive, assertNegative));
                ongoingTest.callback = null;
            }, 1000);
        }
    }

    let hookHttpRequests = function() {
        var origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener('load', function() {
                console.log(this.responseURL);
                onHttpRequestCompleted(this.responseText);
            });
            origOpen.apply(this, arguments);
        };
    }

    /*  
        Run every test.
    */
    this.start = function() {
        successfulTests = 0;
        failedTests = 0;
        onTestStartCallback();
        return "Running tests...";
    }

    /*
        Set a function that defines what tests will be performed.
    */
    this.onTestStart = function(callback) {
        onTestStartCallback = callback;
    }

    /*
        Click an element, setting of a test.
    */
    this.click = function(element, callback) {
        let foundElement = document.querySelector(element);
        if(foundElement != null) {
            setTimeout(function() {
                ongoingTest.callback = callback;
                foundElement.click();
            }, 1000);
        } else {
            this.log("Can't run test on \"" + element + "\", no such element.", 'e');
        }
    }

    /*
        Logs a message.
        Use type = 'e' or 'a' for an error or assertive message.
    */
    this.log = function(message, type) {
        switch(type) {
            case 'e':
                console.error(message);
                break;
            case 'a':
                console.log(message);
                break;
            default:
                console.log(message);
                break;
        }
    }

    /*
        Enters data into a given element.
        If multiple elements show up, the first one is used.
    */
    this.enterData = function(data, element) {
        let foundElement = document.querySelector(element);
        if(foundElement != null) {
            if(foundElement[0] != null) {
                foundElement[0].value = data;
            } else {
                foundElement.value = data;
            }
        } else {
            this.log("Failed to enter data in \"" + element + "\", no such element.");
        }
    }

    hookHttpRequests();
}

var uiTest = new UITest();
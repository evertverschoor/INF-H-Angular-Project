/*
    Author: Evert Verschoor
    Utility functions for missing Angular functionality.
*/
var angularUtils = {
    /*
        Autofocuses the first element it finds with the attribute 'autofocus'.
    */
    autoFocus: function() {
        let autofocusElement = document.querySelector("[data-ng-autofocus]");
        if(autofocusElement != null) {
            autofocusElement.focus();
        }
    },

    /*
        Goes to a given page.
    */
    goTo: function(where) {
        window.location = "!#!/" + where;
    },

    /*
        Shows a simple message box that disappears after a bit.
    */
    showMessage: function(message) {
        let container = document.createElement("DIV");
        container.className = "ngUtilsMessage";

        let text = document.createTextNode(message);
        container.appendChild(text);

        document.querySelector("body").appendChild(container);

        setTimeout(function() {
            document.querySelector("body").removeChild(container);
        }, 5000);
    }
}
/*
    Author: Evert Verschoor
    Utility functions for missing Angular functionality.
*/
var angularUtils = {
    /*
        Autofocuses the first element it finds with the attribute 'autofocus'.
    */
    autoFocus: function() {
        let autofocusElement = document.querySelector("[autofocus]");
        if(autofocusElement != null) {
            autofocusElement.focus();
        }
    }
}
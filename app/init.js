(function(window, HighresiO, Handlebars, undefined) {
	"use strict";
	
	// Define HighresiO as an object only if it doesn't exist. 
	// Good practice based on: http://addyosmani.com/resources/essentialjsdesignpatterns/book/#detailnamespacing
	HighresiO = window.HighresiO || (window.HighresiO = {});

	// Added for namespacing - All objects/methods/function are under: HighresiO.Highbrow 
	// Done to avoid conflicts with other libraries that might be named Highbrow.
	// Has a very small performance / load time impact perhaps, but safer.
    // Inner scope - All things will reside inside Highbrow.
	HighresiO.Highbrow = {};

    // Check if Handlebars already exist, if it doesn't create an object under Highbrow namespace. 
    // The extern lib included in our project will be used.
    Handlebars = window.Handlebars || (HighresiO.Highbrow.Handlebars = {});

    // Attach it to Highbrow anyway 
    HighresiO.Highbrow.Handlebars = Handlebars;

	/**
	 * A test function - remove it :)
	 */
    HighresiO.Highbrow.mainFunc = function(hi) {
    	// Functions will have access to log from util package, if they aren't invoked with in this file.
    	HighresiO.Highbrow.Util.log("Saying " + hi + " from mainFunc");
    };

})(window);
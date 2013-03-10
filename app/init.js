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

	console.log(window.HighresiO);

    HighresiO.Highbrow.mainFunc = function(hi) {
        console.log("Saying " + hi + " from mainFunc");
    };

    // Check if Handlebars already exist, if it doesn't create an object under Highbrow namespace. 
    // The extern lib included in our project will be used.
    Handlebars = window.Handlebars || (HighresiO.Highbrow.Handlebars = {});

    // Attach it to Highbrow anyway 
    HighresiO.Highbrow.Handlebars = Handlebars;


    // if (window.Handlebars == undefined) {
    // 	Handlebars = window.Handlebars;
    // 	// Also attach it to Highbrow to simplify our coding.
    // 	HighresiO.Highbrow.Handlebars = Handlebars
    // } else {

    // }
    console.log("init::Handlebars = " + Handlebars);

})(window);
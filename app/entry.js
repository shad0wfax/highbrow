var init = require("./init.js");

// Extern lib - load only if Handlebars hasn't been defined. 
// Has to be loaded before util.js
// Browserify built file prevents the IIFE of our custom Handlerbars this way.
// if (window.Handlebars === undefined) {
	var handlebars = require("./extern/handlebars.runtime-1.0.rc.1.hibrow.js");
// }

var init = require("./util.js");
var init = require("./styles/base.js");
var init = require("./styles/photo.js");
var init = require("./labels/base_en.js");
var init = require("./labels/photo_en.js");
			
		// Testing 	
		var app = require("./app.js");
		var router = require("./router.js");
		var store = require("./store.js");

var app = require("./form_feedback.js");

var output = require("./templates/all_templates_output.js");

HighresiO.Highbrow.Util.log("Loaded all scripts from entry.js!")

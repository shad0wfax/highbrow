var init = require("./init.js");
var init = require("./styles/base.js");
var init = require("./styles/photo.js");
var init = require("./labels/base_en.js");
var init = require("./labels/photo_en.js");
var app = require("./app.js");
var router = require("./router.js");
var store = require("./store.js");

// Extern lib - load only if Handlebars hasn't been defined.
// Browserify built file prevents the IIFE of our custom Handlerbars this way.
if (window.Handlebars === undefined) {
	var store = require("./extern/handlebars.runtime-1.0.rc.1.hibrow.js");
}

var output = require("./templates/all_templates_output.js");

console.log("Loaded all scripts!")

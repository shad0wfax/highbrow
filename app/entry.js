require("./init.js");

// Extern lib - load only if Handlebars hasn't been defined. 
// Has to be loaded before util.js
// Browserify built file prevents the IIFE of our custom Handlerbars this way.
// if (window.Handlebars === undefined) {
	require("./extern/handlebars.runtime-1.0.rc.1.hibrow.js");
// }



require("./util.js");

require("./styles/base.js");
require("./styles/photo.js");
require("./labels/base_en.js");
require("./labels/photo_en.js");
			
		// Testing 	
		require("./app.js");
		require("./router.js");
		require("./store.js");


require("./templates/dom_id/base.js");
require("./templates/dom_id/form_feedback.js");

require("./form_feedback.js");

// Include auto-generated file after handlebars compilation. (Note: this will be deleted from the workshpace though.)
require("./templates/all_templates_output.js");


HighresiO.Highbrow.Util.log("Loaded all scripts from entry.js!")

// Follow the IIFE style decleration so that mimifiers can optimize namespace (HighresiO.Highbrow)
(function(window, Highbrow, undefined) {
	// config is an object with options override. It is optional and works with sensible defaults.
	// Config structure supported: (All optional, but if supplied will override only for this instance)
	/*
		 config = {
			"styles":{"key1":"val1","key2":"val2"...}, // Override the defaults
			"labels":{"key1":"val1","key2":"val2"...}, // Override the defaults
			"domids":{"key1":"val1","key2":"val2"...}, // Override the defaults
			"url":"some_http/s_end_point_to_send_info"
		}
	*/
	Highbrow.FormFeedback = function(config) {
		this.config = config || {};
		// TODO: Override init logic needed (like passed in styles / lablels)

		var template = Highbrow.Handlebars.templates["form_feedback.hbs"];
		var compiledTemplate = template(Highbrow.Util.handlebarsContext(this.config));
	    
	    var div = document.createElement("div");
	    div.innerHTML = compiledTemplate;

	    if(document.body != null){ document.body.appendChild(div);}

	    // Attach button handler
	    attachBtnClick();

	    function attachBtnClick() {
		    // Add a test alert message on click for fun
		    var domids = Highbrow.DomIds;
		    var btn = document.getElementById(domids.get("ff-b-send"));	    	
		    btn.addEventListener("click", function() {alert("hello") });
	    };


	};
})(window, HighresiO.Highbrow);

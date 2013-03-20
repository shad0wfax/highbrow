// Follow the IIFE style decleration so that mimifiers can optimize namespace (HighresiO.Highbrow)
(function(window, Highbrow, undefined) {
	// config is an object with options override. It is optional and works with sensible defaults.
	Highbrow.FormFeedback = function(config) {
		this.config = config || {};
		// TODO: Override init logic needed (like passed in styles / lablels)

		var template = Highbrow.Handlebars.templates["form_feedback.hbs"];
	    
	    var div = document.createElement("div");
	    div.innerHTML = template(Highbrow.Util.handlebarsContext());

	    if(document.body != null){ document.body.appendChild(div);}
	};
})(window, HighresiO.Highbrow);

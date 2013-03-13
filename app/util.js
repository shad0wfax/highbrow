(function(window, Highbrow, Handlebars, undefined) {	
	// Util namespace
	Highbrow.Util = Highbrow.Util || (Highbrow.Util = {});

    //TODO: Disable for production...
    var cons = window.console || {log: function(msg){}};
    Highbrow.Util.log = function(msg) {
        cons.log(msg);
    };

    Highbrow.Util.getProp = function(prop, obj) {
		if (prop) {
			var s = obj[prop]; 
			return s ? s : "";
		} else {
			return "";
		}
    };

    // var registerHandlebarHooks = (function() {
	   //  var h = Highbrow.Handlebars;
	   //  // Style helper
	   //  h.registerHelper("sty", function(context, key) {
	   //  	var r = Highbrow.Styles.get(key);
	   //  	Highbrow.Util.log("style helper, returning:" + r + " for key " + JSON.stringify(context) + JSON.stringify(key));
	   //  	return Highbrow.Handlebars.SafeString(r);
	    	
	   //  });
	   //  // Label helper
	   //  h.registerHelper("lab", function(key) {
	   //  	var r = Highbrow.Labels.get(key);
	   //  	Highbrow.Util.log("Labels helper, returning:" + r + " for key " + key);
	   //  	return Highbrow.Handlebars.SafeString(r);
	   //  });	    	
    // })();

    // Get the context object to pass to handlebars. Computed by concatenating styles and labels.
    Highbrow.Util.handlebarsContext = function() {
    	// TODO: Cache this for repeated lookups.
    	return {
    		"s": Highbrow.Styles.all(),
    		"l": Highbrow.Labels.all()
    	}

    }

})(window, HighresiO.Highbrow);
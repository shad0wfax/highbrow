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

    // Get the context object to pass to handlebars. Computed by concatenating styles and labels.
    Highbrow.Util.handlebarsContext = function() {
    	// TODO: Cache this for repeated lookups.
    	return {
    		"s": Highbrow.Styles.all(),
    		"l": Highbrow.Labels.all()
    	}

    }

})(window, HighresiO.Highbrow);
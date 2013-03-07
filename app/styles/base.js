(function(window, Highbrow, undefined) {

	// Based on Functional inheritance pattern as defined by Douglas Crockford. 
	// The flaw here is that all the other styles that derive from this can change its state and there is only one copy of each style.
	Highbrow.Styles = function(){
		// List the styles
		var styles = {
		    "email-box": "textbox",
		    "comm-box": "text-area",
		    "send-btn": "btn btn-small btn-primary"
		};

		var init = function(newStyles) {
			if (!newStyles)
				return
		    
		    for(var prop in newStyles) {
		        if(newStyles.hasOwnProperty(prop)){
		            styles[prop] = newStyles[prop];
		        }
		    }
		}
		var get = function(style) {
			if (style)
				return styles[style];
			else 
				return "";
		}

		return {
			init: init,
			get: get
		}
	}();

})(window, HighresiO.Highbrow);

(function(window, Highbrow, undefined) {

	// Based on Functional inheritance pattern as defined by Douglas Crockford. 
	// Designed this way to permit overriding by passing config in init.
	// Has the flaw of singleton inheritance (one child changing affects others.), but it is also how we want it.
	Highbrow.Styles = function(){
		// List the styles
		var styles = {
		    "email-box": "textbox",
		    "comm-box": "text-area",
		    "send-btn": "btn btn-small btn-primary"
		};

		// Will add and override the passed in styles. Designed to override from inheritence.
		var init = function(newStyles) {
			if (!newStyles)
				return
		    
		    for(var prop in newStyles) {
		        if(newStyles.hasOwnProperty(prop)){
		            styles[prop] = newStyles[prop];
		        }
		    }
		};
		
		var get = function(style) {
			return Highbrow.Util.getProp(style, styles);
		};

		var all = function() {
			return styles;
		};

		return {
			init: init,
			get: get,
			all:all
		}
	}();

})(window, HighresiO.Highbrow);

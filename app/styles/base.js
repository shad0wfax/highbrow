(function(window, Highbrow, undefined) {

	// Based on Functional inheritance pattern as defined by Douglas Crockford. 
	// Designed this way to permit overriding by passing config in init.
	// Has the flaw of singleton inheritance (one child changing affects others.), but it is also how we want it.
	Highbrow.Styles = function(){
		// List the styles
		var styles = {
		    "t-email": "textbox",
		    "t-comm": "text-area",
		    "b-send": "btn btn-small btn-primary"
		};

		// Will add and override the passed in styles. Designed to override from inheritence.
		var add = function(newStyles) {
		 	Highbrow.Util.mergeProps(newStyles, styles);
		};
		
		var get = function(style) {
			return Highbrow.Util.getProp(style, styles);
		};

		var all = function() {
			return styles;
		};

		return {
			add: add,
			get: get,
			all:all
		}
	}();

})(window, HighresiO.Highbrow);

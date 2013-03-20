(function(window, Highbrow, undefined) {

	// Based on Functional inheritance pattern as defined by Douglas Crockford. 
	// Designed this way to permit overriding by passing config in init.
	// Has the flaw of singleton inheritance (one child changing affects others.), but it is also how we want it.
	Highbrow.DomIds = function(){
		// No default dom_ids
		var dom_ids = {};

		// Will add and override the passed in styles. Designed to override from inheritence.
		var add = function(newIds) {
		 	Highbrow.Util.mergeProps(newIds, dom_ids);
		};
		
		var get = function(id) {
			return Highbrow.Util.getProp(id, dom_ids);
		};

		var all = function() {
			return dom_ids;
		};

		return {
			add: add,
			get: get,
			all:all
		}
	}();

})(window, HighresiO.Highbrow);

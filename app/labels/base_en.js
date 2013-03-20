// This is content as key value pair. This makes it easy to support internalization.
// One locale per file. 
(function(window, Highbrow, undefined) {

	// Based on Functional inheritance pattern as defined by Douglas Crockford. 
	// Designed this way to permit overriding by passing config in init.
	// Has the flaw of singleton inheritance (one child changing affects others.), but it is also how we want it.
	Highbrow.Labels = function(){
		// List the labels
		var labels = {
		    "l-feedback": "Give Feedback",
		    "b-feedback": "Feedback",
		    "b-send": "Send"
		};

		// Will add and override the passed in labels. Designed to override from inheritence.
		var add = function(newLabels) {
		 	Highbrow.Util.mergeProps(newLabels, labels);
		};

		var get = function(label) {
			return Highbrow.Util.getProp(label, labels);
		};

		var all = function() {
			return labels;
		};

		return {
			add: add,
			get: get,
			all: all
		};
	}();

})(window, HighresiO.Highbrow);

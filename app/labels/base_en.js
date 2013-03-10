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

		var init = function(newLabels) {
			if (!newLabels)
				return
		    
		    for(var prop in newLabels) {
		        if(newLabels.hasOwnProperty(prop)){
		            labels[prop] = newLabels[prop];
		        }
		    }
		}
		var get = function(label) {
			if (label)
				return labels[label];
			else 
				return "";
		}

		return {
			init: init,
			get: get
		}
	}();

})(window, HighresiO.Highbrow);

(function(window, Highbrow, undefined) {

	// Based on Functional inheritance pattern as defined by Douglas Crockford. 
	Highbrow.PhotoLabels = function(){
		var labels = {
		    "l-feedback": "Click a pic and share your feedback!",
		    "b-feedback": "Send us a pic!",
		    "b-snap": "Click"
		};
		// Instance of Labels (this is the inheritence logic)
		var baseLabels = Highbrow.Labels;
		
		// Init with photo labels
		baseLabels.init(labels);
		return baseLabels;
	}();
})(window, HighresiO.Highbrow);

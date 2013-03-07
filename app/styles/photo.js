(function(window, Highbrow, undefined) {

	// Based on Functional inheritance pattern as defined by Douglas Crockford. 
	Highbrow.PhotoStyles = function(){
		var styles = {
		    "email-box": "textbox-photo",
		    "webcam-on-btn": "btn webcam-btn",
		    "click-btn": "btn click-primary"
		};
		// Instance of ElStyles (this is the inheritence logic)
		var baseStyles = Highbrow.Styles;
		
		// Init with photo style
		baseStyles.init(styles);
		return baseStyles;
	}();
})(window, HighresiO.Highbrow);

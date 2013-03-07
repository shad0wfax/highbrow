(function(window, Highbrow, undefined) {

	// Based on Functional inheritance pattern as defined by Douglas Crockford. 
	Highbrow.BaseElStyle = function(){
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
		var getStyle = function(style) {
			if (style)
				return styles[style];
			else 
				return "";
		}

		return {
			init: init,
			getStyle: getStyle
		}
	}();

	Highbrow.PhotoElStyle = function(){
		var styles = {
		    "email-box": "textbox-photo",
		    "webcam-on-btn": "btn webcam-btn",
		    "click-btn": "btn click-primary"
		};
		var baseStyles = Highbrow.BaseElStyle;
		// Init with photo style
		baseStyles.init(styles);
		return baseStyles;
	}();



})(window, HighresiO.Highbrow);

// Follow the IIFE style decleration so that mimifiers can optimize namespace (HighresiO.Highbrow)
(function(window, Highbrow, undefined) {
	var util = Highbrow.Util;
	
	Highbrow.func1 = function() {
	    //util.log(Highbrow);
	    Highbrow.mainFunc(" Hi called from app.js");
	};

	Highbrow.Photo = function (options) {
	    this.options = options || (options = {});
	    options.emailAdd =  options.emailAdd || "noadd@noadd.com";
	    options.emailLabel =  options.emailLabel || "Email adress (optional)";

	    util.log(options);
	    util.log("returning this - " + this);
	    return this;
	};

	Highbrow.Photo.prototype.snapPic = function() {
	    util.log(this.options);
	
		var template = Highbrow.Handlebars.templates["test.hbs"];
	    
	    var div = document.createElement("div");
	    div.innerHTML = template(Highbrow.Util.handlebarsContext());

	    if(document.body != null){ document.body.appendChild(div);}
	}
})(window, HighresiO.Highbrow);

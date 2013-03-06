require("./initialize.js");

(function(HighresiO){
    HighresiO.Highbrow.func1 = function() {
        //console.log(Highbrow);
        HighresiO.Highbrow.mainFunc(" Hi called from app.js");
    };

    HighresiO.Highbrow.Photo = function (options) {
        this.options = options || {};
        options.emailAdd =  options.emailAdd || "noadd@noadd.com";
        options.emailLabel =  options.emailLabel || "Email adress (optional)";

        console.log(options);
        console.log("returning this - " + this);
        return this;
    };

    HighresiO.Highbrow.Photo.prototype.snapPic = function() {
        console.log(this.options);
    }

})(HighresiO);
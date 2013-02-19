require("./initialize.js");

(function(){
    Highbrow.func1 = function() {
        //console.log(Highbrow);
        Highbrow.mainFunc(" Hi called from app.js");
    };

    Highbrow.Photo = function (options) {
        this.options = options || {};
        options.emailAdd =  options.emailAdd || "noadd@noadd.com";
        options.emailLabel =  options.emailLabel || "Email adress (optional)";

        console.log(options);
        console.log("returning this - " + this);
        return this;
    };

    Highbrow.Photo.prototype.snapPic = function() {
        console.log(this.options);
    }

})();
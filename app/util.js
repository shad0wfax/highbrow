(function(window, Highbrow, Handlebars, undefined) {	
	// Util namespace
	Highbrow.Util = Highbrow.Util || (Highbrow.Util = {});

    //TODO: Disable for production...
    var cons = window.console || {log: function(msg){}};
    Highbrow.Util.log = function(msg) {
        cons.log(msg);
    };

    Highbrow.Util.getProp = function(prop, obj) {
		if (prop) {
			var s = obj[prop]; 
			return s ? s : "";
		} else {
			return "";
		}
    };

    // Douglas Crockford way :)
    Highbrow.Util.createObject = function(obj) {

        if (typeof Object.create !== 'function') {
              Object.create = function (o) {
                var F = function () {};
                F.prototype = o;
                return new F();
            };
         }
         return Object.create(obj);
    };

    Highbrow.Util.mergeProps = function(props, into) {
        if (!props)
            return
        
        for(var prop in props) {
            if(props.hasOwnProperty(prop)){
                into[prop] = props[prop];
            }
        }
    };

    // Get the context object to pass to handlebars. Computed by concatenating styles and labels.
    /*
         config = {
            "styles":{"key1":"val1","key2":"val2"...},
            "labels":{"key1":"val1","key2":"val2"...}, 
            "domids":{"key1":"val1","key2":"val2"...}
        }
    */
    Highbrow.Util.handlebarsContext = function(options) {
    	// TODO: Cache this for repeated lookups??

    	return {
    		"s": mergeAfterCloneIfNeeded(Highbrow.Styles.all(), options["styles"]),
            "l": mergeAfterCloneIfNeeded(Highbrow.Labels.all(), options["labels"]),
            "d": mergeAfterCloneIfNeeded(Highbrow.DomIds.all(), options["domids"])
    	}
    };

    function mergeAfterCloneIfNeeded(origProps, newProps) {
        if (!newProps)
            return origProps;

        var p  = Highbrow.Util.createObject(origProps);
        Highbrow.Util.mergeProps(newProps, p);
        return p;
    };

})(window, HighresiO.Highbrow);
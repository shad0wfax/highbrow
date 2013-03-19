(function(window, Highbrow, undefined) {

	Highbrow.KeyValClass = Highbrow.Class.extend({
		props: {},
		put: function(p) {
			if (!p)
				return
		    
		    for(var prop in p) {
		        if(p.hasOwnProperty(prop)){
		            this.props[prop] = p[prop];
		        }
		    };
		    console.log("Put - " + p);
		},
		get: function(id) {
			return Highbrow.Util.getProp(id, this.props);
		}
	});

})(window, HighresiO.Highbrow);

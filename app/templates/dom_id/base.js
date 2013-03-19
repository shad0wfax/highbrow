(function(window, Highbrow, undefined) {

	Highbrow.DomId = Class.extend({
		dom_ids: {},
		put: function(props) {
			if (!props)
				return
		    
		    for(var prop in props) {
		        if(this.dom_ids.hasOwnProperty(prop)){
		            this.dom_ids[prop] = props[prop];
		        }
		    }
		},
		get: function(id) {
			return Highbrow.Util.getProp(id, this.dom_ids);
		}

	});

})(window, HighresiO.Highbrow);

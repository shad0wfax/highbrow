(function(window, Highbrow, undefined) {	
    //TODO: Disable for production...
    var cons = window.console || {log: function(msg){}};
    Highbrow.log = function(msg) {
        cons.log(msg);
    };

})(window, HighresiO.Highbrow);
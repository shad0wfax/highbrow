// Akshay hack - Added the following line to the TEMPLATES_OUTPUT_FILE in order for the variable Handlebars to be visible.
var Handlebars = window.Handlebars || window.HighresiO.Highbrow.Handlebars;
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['test.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div>\n	";
  if (stack1 = helpers.foo) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.foo; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n</div>";
  return buffer;
  });
templates['test2.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div>\n	";
  if (stack1 = helpers.whoha) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.whoha; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n</div>";
  return buffer;
  });
})();

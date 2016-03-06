//--------------
// Models
//--------------
app.Todo = Backbone.Model.extend({
	defaults: {
		title: '',
		completed: false,
		section:'callback_queue',
		pos:0,
		deleted:false,
	},
	toggle: function(){
		this.save({ completed: !this.get('completed')});
	}
});

app.Thread = Backbone.Model.extend({
	defaults: {
		active:false,
		title: '',
		pos:0,
		deleted:false,
	},
	toggle: function(){
		this.save({ completed: !this.get('completed')});
	}
});
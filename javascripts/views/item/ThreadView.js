// The view for the individual thread
app.ThreadView = Backbone.View.extend({
	// model - A thread view be created with a model
	// el - this will be generated. 
	template: _.template($('#thread_template').html()),
	// This generates the html for the item
	generate_item_html: function(){
		// console.log("inside generate_item_html function");
		var model = this.model.toJSON();
		this.$el.html(this.template(model));
		return this.template(model);
	},
	// this is an alternative for generate_item_html
	render: function(){
		var model = this.model.toJSON();
		this.$el.html(this.template(model));
		return this; // enable chained calls
	},
	initialize: function(){
		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this); // remove: Convenience Backbone's function for removing the view from the DOM.
		// this.model.on('change',this.pushTaskToStackIfEmpty);		
	},      
	events: {
		// 'dblclick label' : 'edit',
		'click .thread': 'click_thread',
	},
	edit: function(){
		this.$el.addClass('editing');
		// console.log("editing");
		// console.log(this.$el);
		this.input.focus();
	},
	click_thread:function(){
		app.threadList.each(function(thread){
			thread.set('active',false);
			thread.save();
		});
		this.model.set('active',true);
		this.model.save();
		app.thread=this.model.get('title');
  		app.stackView.addAll();
		app.callbackView.addAll();
		app.reminderView.addAll();
		// this.
	}

	 
});

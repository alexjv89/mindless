app.AllThreadsView = Backbone.View.extend({
	el: '#threads',
	initialize: function () {
		// this.input = this.$('#reminder-new-todo');
		app.threadList.on('add', this.addAll, this);
		app.threadList.on('reset', this.addAll, this);
		app.threadList.fetch(); // Loads list from local storage
		app.threadList.each(function(thread){
			if(thread.get('active')){
				app.thread=thread.get('title');
				app.stackView.addAll();
				app.callbackView.addAll();
				app.reminderView.addAll();
			}
		});

	},
	events: {
		'click #create_thread': 'create_thread',
	},
	addOne: function(thread){
		// console.log();
		// if (thread.get('title')=='Ather2')
		// {
		// 	thread.set('active',true);
		// 	thread.save();
		// }
		// else{
		// 	thread.set('active',false);
		// 	thread.save();
		// }
		var threadView = new app.ThreadView({model:thread});
		threadView.generate_item_html()
		this.$el.append(threadView.el);
		// this.$el.append(threadView.render().el);

	},
	addAll: function(){
		this.$el.html(''); // clean the todo list
		// app.threadList.each(this.addOne, this);
		app.threadList.each(this.addOne,this);
		this.$el.append('<a class="item" id="create_thread"><i class="icon plus"></i></a>');
	},
	create_thread:function(){
		// app.threadList.create({title})
		alert("plus button clicked");
	},

	
});

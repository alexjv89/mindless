app.AllThreadsView = Backbone.View.extend({
	el: '#threads',
	initialize: function () {
		// this.input = this.$('#reminder-new-todo');
		app.threadList.on('add', this.addAll, this);
		app.threadList.on('update', this.addAll, this);
		app.threadList.fetch(); // Loads list from local storage
		if (app.threadList.length==0) // default thread if using the app for the first time
		{
			var default_thread='General'
			app.threadList.create({'title':default_thread});
			app.threadList.models[0].set('active',true);
			app.thread=default_thread;
		}
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
		'keypress .search' : 'searchOnEnter',
		'keypress .add' : 'addOnEnter',
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
		if(thread.get('deleted')==false)
		{
			// console.log(thread.get('title'));
			// console.log(thread.get('deleted'));
			var threadView = new app.ThreadView({model:thread});
			threadView.generate_item_html()
			this.$el.append(threadView.el);
		}
		// this.$el.append(threadView.render().el);

	},
	addAll: function(){
		this.$el.html(''); // clean the todo list
		// app.threadList.each(this.addOne, this);
		app.threadList.each(this.addOne,this);
		this.$el.append('<a class="item" id="create_thread"><i class="icon plus"></i></a>');
		this.$el.append('<input class="add" style="display:none" placeholder="New thread">');
		// this if for the sarch text
		this.$el.append('<div class="right item"><div class="ui icon mini input"><input class="search" id="search" type="text" placeholder="Search..."><i class="search icon"></i></div></div>');
	},
	create_thread:function(){
		// app.threadList.create({title})
		// alert("plus button clicked");
		this.$el.find('#create_thread').hide();
		this.$el.find('input.add').show().focus();
		// this.$el.append('<a class="item" id="create_thread"><i class="icon plus"></i></a>');

	},
	searchOnEnter:function(e){
		if(e.which == 13){
			var value = this.$('.search').val().trim();
			// console.log(value);
			findString(value);
			// this.$('.edit').focus();
			// $('#stack-new-todo').focus()
			$('#search').focus()
			// if(value) {
			// 	this.model.save({title: value});
			// }
			// this.$el.removeClass('editing');
		}
	},
	addOnEnter:function(e){
		if(e.which == 13){
			var value = this.$('.add').val().trim();
			// console.log(value);
			app.threadList.create({'title':value});
			this.$el.find('#create_thread').show();
			this.$el.find('input.add').hide();
		}

	},


});

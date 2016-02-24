// renders individual todo items list (li)
app.TodoView = Backbone.View.extend({
	// tagName: 'li',
	template: _.template($('#item_template').html()),
	template_stack_first_item: _.template($('#item_template_stack_first_item').html()),
	render: function(){
		var model = this.model.toJSON();
		if (model.completed==false)
			this.$el.html(this.template(model));
		this.input = this.$('.edit');
		return this; // enable chained calls
	},
	initialize: function(){
		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this); // remove: Convenience Backbone's function for removing the view from the DOM.
		// this.model.on('change',this.pushTaskToStackIfEmpty);

		
	},      
	events: {
		'dblclick label' : 'edit',
		'keypress .edit' : 'updateOnEnter',
		'blur .edit' : 'close',
		'click .toggle': 'toggleCompleted',
		'click .destroy': 'destroy',
		'click .rml': 'pushTaskToReminderList',
		'click .mcq': 'pushTaskToCallbackQueue',
		'click .mcq_from_stack': 'pushTaskToCallbackQueueFromStack',
		// 'click .ather': 'moveToAther',
		// 'click .ikp': 'moveToIKP',
		// 'click .startup': 'moveToStartup',
	},
	// moveToAther:function(){
	// 	this.model.set('thread','Ather');
	// 	this.model.save();
	// },
	// moveToIKP:function(){
	// 	this.model.set('thread','IKP');
	// 	this.model.save();
	// },
	// moveToStartup:function(){
	// 	this.model.set('thread','Startup');
	// 	this.model.save();
	// },
	edit: function(){
		this.$el.addClass('editing');
		console.log("editing");
		console.log(this.$el);
		this.input.focus();
	},
	close: function(){
		var value = this.input.val().trim();
		if(value) {
			this.model.save({title: value});
		}
		this.$el.removeClass('editing');
	},
	updateOnEnter: function(e){
		if(e.which == 13){
			this.close();
		}
	},
	toggleCompleted: function(){
		this.model.toggle();
		app.stackView.addAll();
		if (getTopOfStackPos()==0)
				this.pushTaskToStackIfEmpty();
	},
	destroy: function(){
		var section = this.model.get('section');
		console.log("removing task");
		this.model.destroy();
		if (section=='stack')
		{
			app.stackView.addAll();
			// console.log('check');
			// top_of_stack=getTopOfStackPos()
			// console.log('top of stack - '+top_of_stack);
			if (getTopOfStackPos()==0)
				this.pushTaskToStackIfEmpty();
		}
			// this.pushTaskToStackIfEmpty();


	},
	pushTaskToReminderList: function(){
		this.model.set('section','reminder');
		this.model.save();
		app.stackView.addAll();
		app.reminderView.addAll();
		if (getTopOfStackPos()==0)
				this.pushTaskToStackIfEmpty();
	},
	pushTaskToCallbackQueue: function(){
		this.model.set('section','callback_queue');
		this.model.set('pos',getBottomOfCallbackQueuePos());
		this.model.save();
		app.todoList.sort();
		app.callbackView.addAll();
		app.reminderView.addAll();
	},
	pushTaskToCallbackQueueFromStack: function(){
		this.model.set('section','callback_queue');
		this.model.set('pos',getBottomOfCallbackQueuePos());
		this.model.save();
		app.todoList.sort();
		app.callbackView.addAll();
		app.stackView.addAll();
		if (getTopOfStackPos()==0)
				this.pushTaskToStackIfEmpty();
	},
	pushTaskToStackIfEmpty: function(){
		console.log("hello%%%%%%");
		if (getTopOfStackPos()==0)
			console.log("stackEmpty");
		// this pushes the top of callback queue to the stack
		app.todoList.some(function(todo){
			if (todo.get('section')=='callback_queue'&&todo.get('thread')==app.thread)
			{
				console.log(todo.get('title'));
				todo.set('section','stack');
				todo.save();
				app.stackView.addAll();
				var pos=1;
				app.todoList.each(function(todo){
					if(todo.get('completed')==false && todo.get('section')=='callback_queue'&&todo.get('thread')==app.thread)
					{
						todo.set('pos',pos);
						pos++
					}
				});
				app.callbackView.addAll();
				return true;
			}
		});
		
	}           
});

app.ReminderView = Backbone.View.extend({
	el: '#reminder',
	initialize: function () {
		this.input = this.$('#reminder-new-todo');
		app.todoList.on('add', this.addAll, this);
		app.todoList.on('reset', this.addAll, this);
		app.todoList.fetch(); // Loads list from local storage
	},
	events: {
		'keypress #reminder-new-todo': 'createTodoOnEnter'
	},
	createTodoOnEnter: function(e){
		if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
			return;
		}
		app.todoList.create(this.newAttributes());
		this.input.val(''); // clean input box
	},
	addOne: function(todo){
		if(todo.attributes.section=='reminder'&&todo.get('thread')==app.thread)
		{
			var view = new app.TodoView({model: todo});
			$('#reminder-todo-list').append(view.render().el);
		}
	},
	addAll: function(){
		this.$('#reminder-todo-list').html(''); // clean the todo list
		app.todoList.each(this.addOne, this);
	},
	newAttributes: function(){
		return {
			title: this.input.val().trim(),
			completed: false,
			section:'reminder'
		}
	}
});
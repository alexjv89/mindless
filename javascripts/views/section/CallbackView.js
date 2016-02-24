// renders the full list of todo items calling TodoView for each one.
app.CallbackView = Backbone.View.extend({
	el: '#callback',
	pos:1,
	initialize: function () {
		this.input = this.$('#callback-new-todo');
		app.todoList.on('add', this.addAll, this);
		app.todoList.on('reset', this.addAll, this);
		app.todoList.fetch(); // Loads list from local storage
	},
	events: {
		'keypress #callback-new-todo': 'createTodoOnEnter'
	},
	createTodoOnEnter: function(e){
		if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
			return;
		}
		app.todoList.create(this.newAttributes());
		this.input.val(''); // clean input box
	},
	addOne: function(todo){

		if(todo.get('section')=='callback_queue' && todo.get('completed')==false&&todo.get('thread')==app.thread)
		{
			if(todo.get('pos')!=this.pos)
			{
				todo.set('pos',this.pos);
				todo.save();
			}
			this.pos++;
			var view = new app.TodoView({model: todo});
			$('#callback-todo-list').append(view.render().el);
		}
	},
	addAll: function(){
		this.pos=1;
		this.$('#callback-todo-list').html(''); // clean the todo list
		app.todoList.each(this.addOne, this);
	},
	newAttributes: function(){
		return {
			title: this.input.val().trim(),
			completed: false,
			section:'callback_queue',
			pos:getBottomOfCallbackQueuePos()+1,
			thread:app.thread,
		}
	}
});
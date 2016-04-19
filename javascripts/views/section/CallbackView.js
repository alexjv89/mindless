/*
	All interactions associated with the call back queue section.
*/
// renders the full list of todo items calling TodoView for each one.
app.CallbackView = Backbone.View.extend({
	el: '#callback',
	pos:1,
	initialize: function () {
		this.input = this.$('#callback-new-todo');
		app.todoList.on('add', this.addAll, this);
		app.todoList.on('update', this.addAll, this);
	        app.todoList.fetch();
	},
	events: {
		'keypress #callback-new-todo': 'createTodoOnEnter',
		'click .add': 'createTask'
	},

	createTodoOnEnter: function(e){
		if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
			return;
		}
		this.createTask();
	},
	createTask: function(e){
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
		// updates the counter label and its color
		$('#callback_count').html(this.pos-1);
		if (this.pos-1<=10)
	      $('#callback_count').removeClass('red').addClass('teal');
	    else
	      $('#callback_count').removeClass('teal').addClass('red');
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

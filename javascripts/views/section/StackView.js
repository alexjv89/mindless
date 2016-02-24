// renders the full list of todo items calling TodoView for each one.
app.StackView = Backbone.View.extend({
  el: '#stack',
  pos: 1,
  initialize: function () {
    this.input = this.$('#stack-new-todo');
    app.todoList.on('add', this.addAll, this);
    app.todoList.on('reset', this.addAll, this);
    app.todoList.fetch(); // Loads list from local storage
  },
  events: {
    'keypress #stack-new-todo': 'createTodoOnEnter'
  },
  createTodoOnEnter: function(e){
    if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
      return;
    }
    app.todoList.create(this.newAttributes());
    this.input.val(''); // clean input box
  },
  addOne: function(todo){
    if(todo.attributes.section=='stack'&&todo.get('completed')==false&&todo.get('thread')==app.thread)
    {
      if(todo.get('pos')!=this.pos)
      {
        todo.set('pos',this.pos);
        todo.save();
      }
      // console.log(this.pos);
      // console.log(todo.get('pos'));
      // console.log(todo.get('title'));
      this.pos++;
      var view = new app.TodoView({model: todo});
      $('#stack-todo-list').prepend(view.render().el);
    }
  },
  addAll: function(){
    console.log("stackView addAll() called - "+app.thread);
    this.pos=1;
    this.$('#stack-todo-list').html(''); // clean the todo list
    app.todoList.each(this.addOne, this);
  },
  newAttributes: function(){
    return {
      title: this.input.val().trim(),
      completed: false,
      section:'stack',
      pos:getTopOfStackPos()+1,
      thread:app.thread,
    }
  }
});
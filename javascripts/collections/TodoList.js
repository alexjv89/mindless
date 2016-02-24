app.TodoList = Backbone.Collection.extend({
  model: app.Todo,
  //this is to help with sorting the list
  comparator: function( collection ){
    return( collection.get( 'pos' ) );
  },
  localStorage: new Store("backbone-todo")
});

// initializing an instance of the collection
app.todoList = new app.TodoList();

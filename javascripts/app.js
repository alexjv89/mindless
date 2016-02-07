    'use strict';

    var app = {}; // create namespace for our app
    var top_of_stack=4;
    //--------------
    // General functions
    //--------------
    
    var getTopOfStackPos=function(){
      var top=0;
      app.todoList.each(function(todo){
        // console.log("came here");
        // console.log(todo);
        if(todo.get('section')=='stack' && todo.get('completed')==false)
        {
          // console.log("part of stack");
          // console.log(todo.get('title'));
          top++;
        }

      },this);
      console.log("top of stack pos = "+top);
      return top;
    }


    //--------------
    // Models
    //--------------
    app.Todo = Backbone.Model.extend({
      defaults: {
        title: '',
        completed: false,
        section:'callback_queue',
        pos:0
      },
      toggle: function(){
        this.save({ completed: !this.get('completed')});
      }
    });

    //--------------
    // Collections
    //--------------
    app.TodoList = Backbone.Collection.extend({
      model: app.Todo,
      localStorage: new Store("backbone-todo")
    });

    // instance of the Collection
    app.todoList = new app.TodoList();

    //--------------
    // Views
    //--------------
    
    // renders individual todo items list (li)
    app.TodoView = Backbone.View.extend({
      tagName: 'li',
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
        'click .mcq': 'pushTaskToCallbackQueue'
      },
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
        this.model.save();
        app.callbackView.addAll();
        app.reminderView.addAll();
      },
      pushTaskToStackIfEmpty: function(){
        console.log("hello%%%%%%");
        if (getTopOfStackPos()==0)
          console.log("stackEmpty");
        // this pushes the top of callback queue to the stack
        app.todoList.some(function(todo){
          if (todo.get('section')=='callback_queue')
          {
            console.log(todo.get('title'));
            todo.set('section','stack');
            todo.save();
            app.callbackView.addAll();
            app.stackView.addAll();
            return true;
          }
        });
        
      }           
    });

    // renders the full list of todo items calling TodoView for each one.
    app.AppView = Backbone.View.extend({
      el: '#todoapp',
      initialize: function () {
        this.input = this.$('#new-todo');
        app.todoList.on('add', this.addAll, this);
        app.todoList.on('reset', this.addAll, this);
        app.todoList.fetch(); // Loads list from local storage
      },
      events: {
        'keypress #new-todo': 'createTodoOnEnter'
      },
      createTodoOnEnter: function(e){
        if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
          return;
        }
        app.todoList.create(this.newAttributes());
        this.input.val(''); // clean input box
      },
      addOne: function(todo){
        var view = new app.TodoView({model: todo});
        $('#todo-list').append(view.render().el);
      },
      addAll: function(){
        this.$('#todo-list').html(''); // clean the todo list
        app.todoList.each(this.addOne, this);
      },
      newAttributes: function(){
        return {
          title: this.input.val().trim(),
          completed: false
        }
      }
    });

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
        if(todo.attributes.section=='stack'&&todo.get('completed')==false)
        {
          todo.set('pos',this.pos);
          this.pos++;
          var view = new app.TodoView({model: todo});
          $('#stack-todo-list').prepend(view.render().el);
        }
      },
      addAll: function(){
        this.pos=1;
        this.$('#stack-todo-list').html(''); // clean the todo list
        app.todoList.each(this.addOne, this);
      },
      newAttributes: function(){
        return {
          title: this.input.val().trim(),
          completed: false,
          section:'stack'
        }
      }
    });

    // renders the full list of todo items calling TodoView for each one.
    app.CallbackView = Backbone.View.extend({
      el: '#callback',
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
        if(todo.attributes.section=='callback_queue')
        {
          var view = new app.TodoView({model: todo});
          $('#callback-todo-list').append(view.render().el);
        }
      },
      addAll: function(){
        this.$('#callback-todo-list').html(''); // clean the todo list
        app.todoList.each(this.addOne, this);
      },
      newAttributes: function(){
        return {
          title: this.input.val().trim(),
          completed: false,
          section:'callback_queue'
        }
      }
    });

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
        if(todo.attributes.section=='reminder')
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
    //--------------
    // Initializers
    //--------------   

    app.appView = new app.AppView(); 
    app.stackView = new app.StackView(); 
    app.callbackView = new app.CallbackView(); 
    app.reminderView = new app.ReminderView(); 

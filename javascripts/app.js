'use strict';

var app = {}; // create namespace for our app
app.thread='random';
var top_of_stack=4;
//--------------
// General functions
//--------------

var getTopOfStackPos=function(){
  var top=0;
  app.todoList.each(function(todo){
    // console.log("came here");
    // console.log(todo);
    if(todo.get('section')=='stack' && todo.get('completed')==false&&todo.get('thread')==app.thread)
    {
      // console.log("part of stack");
      // console.log(todo.get('title'));
      top++;
    }

  },this);
  // console.log("top of stack pos = "+top);
  return top;
}

var getBottomOfCallbackQueuePos=function(){
  var bottom=0;
  app.todoList.each(function(todo){
    // console.log("came here");
    // console.log(todo);
    if(todo.get('section')=='callback_queue' && todo.get('completed')==false&&todo.get('thread')==app.thread)
    {
      // console.log("part of stack");
      // console.log(todo.get('title'));
      bottom++;
    }

  },this);
  console.log("bottom of callback_queue pos = "+bottom);
  return bottom;
}


    


    

    // instance of the Collection

    //--------------
    // Views
    //--------------
    
    
    // // renders the full list of todo items calling TodoView for each one.
    // // app.AppView = Backbone.View.extend({
    // //   el: '#todoapp',
    // //   initialize: function () {
    // //     this.input = this.$('#new-todo');
    // //     app.todoList.on('add', this.addAll, this);
    // //     app.todoList.on('reset', this.addAll, this);
    // //     app.todoList.fetch(); // Loads list from local storage
    // //   },
    // //   events: {
    // //     'keypress #new-todo': 'createTodoOnEnter'
    // //   },
    // //   createTodoOnEnter: function(e){
    // //     if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
    // //       return;
    // //     }
    // //     app.todoList.create(this.newAttributes());
    // //     this.input.val(''); // clean input box
    // //   },
    // //   addOne: function(todo){
    // //     var view = new app.TodoView({model: todo});
    // //     $('#todo-list').append(view.render().el);
    // //   },
    // //   addAll: function(){
    // //     this.$('#todo-list').html(''); // clean the todo list
    // //     app.todoList.each(this.addOne, this);
    // //   },
    // //   newAttributes: function(){
    // //     return {
    // //       title: this.input.val().trim(),
    // //       completed: false
    // //     }
    // //   }
    // // });

    

    

    
    


    
    var ipc = require("electron").ipcRenderer;
    ipc.on('ping', function(event,message) {
      console.log(message); // prints "pong"
    });


/*
  Using this function to find a string in the page
*/
var lastSearchedString='';
function findString (str) {
 var strFound;
 if (window.find) {

  // CODE FOR BROWSERS THAT SUPPORT window.find

  strFound=self.find(str);
  console.log(strFound);
  if (!strFound) {
    // console.log("came here");
    // console.log(strFound);
    strFound=self.find(str,0,1);
    while (self.find(str,0,1)) continue;
  }
 }
 
  if (lastSearchedString!=str && !strFound) alert ("String '"+str+"' not found!")
  lastSearchedString=str;  
 return;
}

function pushAllTasksInCallbackToStack(){
  app.todoList.each(function(todo){
    if(todo.get('section')=='callback_queue')
    {
      console.log(todo.attributes);
      todo.set('section','stack');
      todo.set('pos',getTopOfStackPos()+getBottomOfCallbackQueuePos());
      todo.save();
      console.log(todo.attributes);
      console.log(getTopOfStackPos());
    }
  });
  app.todoList.sort();
  app.callbackView.addAll();
  app.stackView.addAll();
}

app.ThreadList = Backbone.Collection.extend({
  model: app.Thread,
  comparator: function( collection ){
    return( collection.get( 'pos' ) );
  },
  localStorage: new Backbone.LocalStorage("backbone-thread")
});

//initializing an instance of the collection
app.threadList = new app.ThreadList();

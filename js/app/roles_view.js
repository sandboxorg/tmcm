 $(function(){
  var Role = Backbone.Model.extend({

    // Default attributes for the todo item.
    defaults: function() {
      return {        
        name: "",
		id: 0,
		maxSeats:0,   
		occupiedSeats:0,		
		dependency:0,
		club:0,
		snippet: ""
      };
    }
  });
  
  var RoleList = Backbone.Collection.extend( {

    // Reference to this collection's model.
    model: Role,
	
	url:'js/app/roles.json',

    // Save all of the todo items under the `"todos-backbone"` namespace.
    //localStorage: new Backbone.LocalStorage("roles-backbone"),

    // Todos are sorted by their original insertion order.
    comparator: 'id'

  }); 
  
  
  var Roles = new RoleList;

  // Todo Item View
  // --------------

  // The DOM element for a todo item...
  var RoleView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      //"dblclick .role_name"  : "edit",
	  //"dblclick .role_snippet"  : "edit",
	  "click a.edit" : "edit",
      "click a.destroy" : "clear",
      "keypress .edit_name"  : "updateOnEnter",
      "blur .edit_name"      : "close"
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    // Re-render the titles of the todo item.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.input = this.$('.edit_name');
      return this;
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
		console.log("editing");
        this.$el.addClass("editing");
        this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      var value = this.input.val();
      if (!value) {
        //this.clear();
		this.$el.removeClass("editing");
      } else {
        this.model.save({name: value});
        this.$el.removeClass("editing");
		console.log("exit");
      }
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }

  });

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-todo":  "createOnEnter"
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {

      this.input = this.$("#new-todo");

      this.listenTo(Roles, 'add', this.addOne);
      this.listenTo(Roles, 'reset', this.addAll);
      this.listenTo(Roles, 'all', this.render);

      this.footer = this.$('footer');
      this.main = $('#main');

      Roles.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {

      if (Roles.length) {
        this.main.show();
        this.footer.show();
        this.footer.html(this.statsTemplate());
      } else {
        this.main.hide();
        this.footer.hide();
      }
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(role) {
      var view = new RoleView({model: role});
      this.$("#todo-list").append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
      Roles.each(this.addOne, this);
    },

    // If you hit return in the main input field, create new **Todo** model,
    // persisting it to *localStorage*.
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;

      Roles.create({name: this.input.val()});
      this.input.val('');
    }

  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;
  });
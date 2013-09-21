// Create global template
var templateHtml = $('#templates .list').html(); 
var template = _.template(templateHtml);

// A view for the individual list items
var ItemView = Backbone.View.extend({
  className: 'item',

  events: {
    // @ TODO
  },

  initialize: function (options) {
    this.name = options.name;
    this.complete = false;
  },

  render: function() {
    var newItemHtml = template({
      name: this.name,
      complete: this.complete
    });

    $(this.el).html(newItemHtml);
    return this;
  }
});


// A view for the list (collection) of items
var List = Backbone.View.extend({
  initialize: function (options) {
    this.itemViews = [];

    for (var i = 0; i < options.tasks.length; i++){
      var newItemView = new ItemView(options.tasks[i]);
      this.itemViews.push(newItemView);
    }

  },

  addItem: function (name){
    var newItemView = new ItemView({ name: name });
    this.itemViews.push(newItemView);
    $(this.el).append(newItemView.render().el);
  },

  render: function () {
    $(this.el).empty();

    console.log('render');

    for (var i = 0; i < this.itemViews.length; i++){
      var newItem = this.itemViews[i].render().el;
      $(this.el).append(newItem);
      console.log(newItem);
    }

    return this;
  }
});


var sampleTasks = [
  {
    name: "Take out trash",
    complete: false
  },
  {
    name: "Walk dog",
    complete: false
  }
];

var todolist = new List({
  tasks: sampleTasks,
  el: $('#todo-list')
});
console.log('going to render...');
todolist.render();





var checkTime = function () {
  // TODO check to see if time is up...
}

// Call every 20 seconds
window.setInterval(function(){
  console.log('tick');
  checkTime();
}, 20000);


// Call when list item is submitted
$(document).on('submit', function (e) {
  e.preventDefault();
  console.log('submit');
});
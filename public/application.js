

// A view for the individual list items
var itemView = Backbone.View.extend({
  className: 'item',

  events: {
    // @ TODO
  },

  initialize: function (options) {
    this.name = options.name;
  },

  render: function() {
    var newItemHtml = commentTemplate({
      
    });
  }
});


// A view for the list (collection) of items
var list = Backbone.View.extend({
  initialize: function () {
    this.itemViews = [];

  },

  addItem: function (){

  }
});










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
  console.log();
});
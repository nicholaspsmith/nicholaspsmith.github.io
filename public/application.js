// Create reference to Firebase database
var firebase = new Firebase('https://todonkey.firebaseio.com/items');

$('#task').keypress(function (e){

  var input = $('#task').val();

  if(jQuery.trim(input).length > 0 && e.keyCode == 13){
    e.preventDefault();

    var item = $('#task').val();
    console.log(item);

    var newListObject = {"name": item, "complete": false};

    firebase.child(item).set(newListObject);

  $('#task').val('');
  } 
});

// Update firebase on change
firebase.on('child_added', function(snapshot){
  var message = snapshot.val();
  displayNewTask(message.name, message.complete);
});
firebase.on('child_changed', function(snapshot){
  var message = snapshot.val();
  displayCompleteTask(message.name, message.complete);
});


// Display a task
var displayNewTask = function (name, complete){
  //$('#todo-list').prependTo()
  $('<div class="item"/>').text(name, complete).prependTo($('#todo-list'));
};
// Complete a task
var displayNewTask = function (name, complete){
  //$('#todo-list').prependTo()
  $('<div class="item checked"/>').text(name, complete).prependTo($('#todo-list'));
};

$(document).on('click', '.item', function (e){

  var title = $(this).html();
  console.log("Index: ", title);
  


  firebase.child(title).set({name: title, complete: true});



  // var temp = [];
  // for (var i = 0; i < index; i++){
  //   // Add items that are before selected index to a temporary array
  //   var child = document.getElementsByClassName('todo-list')[i].firstElementChild;

  //   temp.push(child);
  // }

  // for (var i = 0; i < index+1; i++){
  //   var popRef = firebase.pop();
  // }

  // Remove from page
  //this.remove();
});



// @TODO Start timer 
$(document).on('click', '#start', function (e) {
  e.preventDefault();

  var timeDue = $('#due-time').val()

  var currentTime = new Date;
  var currentHour = currentTime.getHours();
  var currentMinute = currentTime.getMinutes();

  console.log('Current time hours: ', currentHour);
  console.log('Time Due: ', timeDue);
});

// Runs every 1 second
var tick = setInterval(timer, 1000);

function timer() {
  //timeLeft = 
};
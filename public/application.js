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
  console.log('child chagned');
  var message = snapshot.val();
  displayCompleteTask(message.name, message.complete);
});


// Display a task
var displayNewTask = function (name, complete){
  if (complete == false){
    $('<div class="item"/>').text(name).prependTo($('#todo-list'));
  } else {
    if (name !== true){//For some reason, it kept printing 'true'
    $('<div class="item checked"/>').text(name).prependTo($('#todo-list'));
    }
  }
};
// Complete a task
var displayCompleteTask = function (task, title){
  $(task).remove();
  displayNewTask(title, true);
};

$(document).on('click', '.item', function (e){

  var title = $(this).html();
  console.log("Index: ", title);

  firebase.child(title).set({name: title, complete: true});


  displayCompleteTask($(this), title);
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
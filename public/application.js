// Create reference to Firebase database
var firebase = new Firebase('https://todonkey.firebaseio.com/items');
var firebaseDue = new Firebase('https://todonkey.firebaseio.com/due');

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

  timeLeft = $('#hours').val();
  // convert to seconds
  timeLeft *= 3600;

  // Get time (in millis) and convert to seconds
  var dateTime = new Date().getTime() / 1000;
  var settime =  dateTime + timeLeft;

  firebaseDue.set({'due':settime});

  start();
});

function start () {
  // Runs every 1 second
  this.running = true;
  this.tick = setInterval(timer, 1000);
};

function stop () {
  running = false;
}

function timer() {
  if (running){
    timeLeft -= 1;
    console.log('time left: ', timeLeft);
    if (timeLeft <= 0){
      alert('Time up!');
      stop();
    }
  }
};


$(document).ready(function () {
  console.log('firebase: ', firebaseDue); 

  firebaseDue.once('value', function(dataSnapshot) {

    x = dataSnapshot.exportVal();

    var seconds = new Date().getTime() / 1000;

    var difference = x.due - seconds;
    // Drop the decimal
    difference = Math.floor(difference);
    console.log('Time remaining in seconds:', difference);
    timeLeft = difference;

    if (difference > 0){
      start();
    }
  });
});








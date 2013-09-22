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
  var message = snapshot.val();
  displayCompleteTask(message.name, message.complete);
});
firebaseDue.on('child_changed', function(snapshot){
  var time = snapshot.val();
  console.log('time changed');
  // Reload page
  location.reload();
});


// Display a task
var displayNewTask = function (name, complete){
  if (complete == false){
    $('<li class="item"/>').text(name).prependTo($('#todo-list'));
  } else {
    if (name !== true){//For some reason, it kept printing 'true'
    $('#todo-list').append($('<li class="item checked"/>').text(name));
    }
  }
};
// Complete a task
var displayCompleteTask = function (task, title){
  $(task).remove();
  displayNewTask(title, true);
};

$(document).on('click', '.item', function (e){
  if (window.running){
    var title = $(this).html();
    console.log("Index: ", title);

    firebase.child(title).set({name: title, complete: true});

    displayCompleteTask($(this), title);
  }
});




// Start timer 
$(document).on('click', '#start', function (e) {
  e.preventDefault();

  timeLeft = $('#hours').val();
  // convert to seconds
  timeLeft *= 3600;

  if (timeLeft > 0){
    // Get time (in millis) and convert to seconds
    var dateTime = new Date().getTime() / 1000;
    var settime =  dateTime + timeLeft;

    firebaseDue.set({'due':settime});

    start();
  }
});

function start () {
  // Runs every 1 second
  window.running = true;
  var tick = setInterval(timer, 1000);
  $('#task').hide();
  $('#time-input').hide();
  $('#countdown').show();
};

function stop () {
  window.running = false;
  // Delete all items from firebase
  firebase.remove();

  // Change time to zero
  firebaseDue.set({'due':0});

  // Reload page
  location.reload();
}

function timer() {
  if (window.running){
    checkComplete();


    timeLeft -= 1;

    if (timeLeft <= 0 && window.running){

      $('html').addClass('fail');
      //alert('Mission Failed!');
      setTimeout(stop, 5000);
    }

    if (timeLeft % 10 === 0){
      firebaseDue.once('value', function(snapshot){
        var seconds = new Date().getTime() / 1000;
        var dbTime = snapshot.exportVal().due;
        timeLeft = Math.floor(dbTime - seconds);
        console.log('syncing time with db');
      });
    }

    var message = "This message will self destruct in: ";

    console.log('timeLeft', timeLeft);
    var hours = Math.floor(timeLeft/60/60);
    hours %= 24;
    var minutes = Math.floor(timeLeft/60);
    minutes %= 60;
    var seconds = timeLeft;
    seconds %= 60;

    if (seconds >= 10 && minutes >= 10){
      var countdown = hours + ":" + minutes + ":" + seconds;
      $('#countdown').html(message + countdown);
    }
    else if (minutes >= 10) {
      countdown = hours + ":" + minutes + ":0" + seconds;
      $('#countdown').html(message + countdown);
    } else if (seconds >= 10){
      countdown = hours + ":0" + minutes + ":" + seconds;
      $('#countdown').html(message + countdown);
    } else {
      countdown = hours + ":0" + minutes + ":0" + seconds;
      $('#countdown').html(message + countdown);
    }
  }
};


var checkComplete = function () {
  var allCount = 0;
  var completeCount = 0;

  firebase.once('value', function(allMessagesSnapshot){
    allMessagesSnapshot.forEach(function(messageSnapshot) {
      // Will be called with a messageSnapshot for each message under message_list.
      var name = messageSnapshot.child('name').val();
      var complete = messageSnapshot.child('complete').val();

      if (complete !== false){
        completeCount += 1;
      } 
      allCount += 1;
    });
    if (allCount === completeCount){
      alert('Mission:Complete');
      stop();
    }
  });
};

var startCountdown = function () {


  firebaseDue.once('value', function(dataSnapshot) {

  dbTime = dataSnapshot.exportVal().due;


    var seconds = new Date().getTime() / 1000;

    var difference = Math.floor(dbTime - seconds);
    console.log('Time remaining in seconds:', difference);
    timeLeft = difference;

    if (difference > 0){
      start();
    }
  });
};


$(document).ready(function () {
  window.running = false;
  $('#countdown').hide();
  startCountdown();
});








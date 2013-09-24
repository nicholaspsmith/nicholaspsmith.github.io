/*global document, window, location, $, jQuery, console, alert, Firebase, setInterval, setTimeout*/
var firebase = new Firebase('https://todonkey.firebaseio.com/items');
var firebaseDue = new Firebase('https://todonkey.firebaseio.com/due');
var timeLeft, dbTime;

$('#task').keypress(function (e) {
    "use strict";
    console.log('clicked');
    var input = $('#task').val();
    if (jQuery.trim(input).length > 0 && e.keyCode === 13) {
        e.preventDefault();

        firebase.child(input).set({"name": input, "complete": false});

        $('#task').val('');
    }
});

function stop() {
    "use strict";
    window.running = false;
    // Delete all items from firebase
    firebase.remove();

    // Change time to zero
    firebaseDue.set({'due': 0});

    // Reload page
    location.reload();
}

var checkComplete = function () {
    "use strict";
    var allCount, completeCount;
    allCount = 0;
    completeCount = 0;

    firebase.once('value', function (allMessagesSnapshot) {
        allMessagesSnapshot.forEach(function (messageSnapshot) {
            // Will be called with a messageSnapshot for each message under message_list.
            var complete;
            complete = messageSnapshot.child('complete').val();

            if (complete !== false) {
                completeCount += 1;
            }
            allCount += 1;
        });
        if (allCount === completeCount) {
            alert('Mission:Complete');
            stop();
        }
    });
};

function timer() {
    "use strict";
    if (window.running) {
        checkComplete();
        timeLeft -= 1;

        if (timeLeft <= 0 && window.running) {
            $('html').addClass('fail');
            $('#todo-list').remove();
            $('h1').html('Mission:Failed');
            setTimeout(stop, 5000);
        }

        if (timeLeft % 10 === 0) {
            firebaseDue.once('value', function (snapshot) {
                var seconds, dbTime;
                seconds = new Date().getTime() / 1000;
                dbTime = snapshot.exportVal().due;
                timeLeft = Math.floor(dbTime - seconds);
                console.log('syncing time with db');
            });
        }
        var message, hours, minutes, seconds, countdown;
        message = "This message will self destruct in: ";
        hours = (Math.floor(timeLeft / 60 / 60)) % 24;
        minutes = (Math.floor(timeLeft / 60)) % 60;
        seconds = timeLeft % 60;
        if (seconds >= 10 && minutes >= 10) {
            countdown = hours + ":" + minutes + ":" + seconds;
            $('#countdown').html(message + countdown);
        } else if (minutes >= 10) {
            countdown = hours + ":" + minutes + ":0" + seconds;
            $('#countdown').html(message + countdown);
        } else if (seconds >= 10) {
            countdown = hours + ":0" + minutes + ":" + seconds;
            $('#countdown').html(message + countdown);
        } else {
            countdown = hours + ":0" + minutes + ":0" + seconds;
            $('#countdown').html(message + countdown);
        }
    }
}

function start() {
    "use strict";
    // Runs every 1 second
    window.running = true;
    setInterval(timer, 1000);
    $('#task').hide();
    $('#time-input').hide();
    $('#countdown').show();
}





// Display a task
var displayNewTask = function (name, complete) {
    "use strict";
    if (complete === false) {
        $('<li class="item"/>').text(name).prependTo($('#todo-list'));
    } else {
        if (name !== true) {//For some reason, it kept printing 'true'
            $('#todo-list').append($('<li class="item checked"/>').text(name));
        }
    }
};
// Complete a task
var displayCompleteTask = function (task, title) {
    "use strict";
    $(task).remove();
    displayNewTask(title, true);
};

$(document).on('click', '.item', function () {
    "use strict";
    if (window.running) {
        var title = $(this).html();

        firebase.child(title).set({name: title, complete: true});

        displayCompleteTask($(this), title);
    }
});



// Start timer 
$(document).on('click', '#start', function (e) {
    "use strict";
    e.preventDefault();

    timeLeft = $('#hours').val();
    // convert to seconds
    timeLeft *= 3600;

    if (timeLeft > 0) {
        // Get time (in millis) and convert to seconds
        var settime =  new Date().getTime() / 1000 + timeLeft;

        firebaseDue.set({'due': settime});

        start();
    }
});



var startCountdown = function () {
    "use strict";
    firebaseDue.once('value', function (dataSnapshot) {
        dbTime = dataSnapshot.exportVal().due;
        var seconds, difference;
        seconds = new Date().getTime() / 1000;
        difference = Math.floor(dbTime - seconds);
        timeLeft = difference;

        if (difference > 0) {
            start();
        }
    });
};

// Update firebase on change
firebase.on('child_added', function (snapshot) {
    "use strict";
    var message = snapshot.val();
    displayNewTask(message.name, message.complete);
});
firebase.on('child_changed', function (snapshot) {
    "use strict";
    var message = snapshot.val();
    displayCompleteTask(message.name, message.complete);
});
firebaseDue.on('child_changed', function () {
    "use strict";
    // Reload page
    location.reload();
});

$(document).ready(function () {
    "use strict";
    window.running = false;
    // Create reference to Firebase database
    $('#countdown').hide();
    startCountdown();
});

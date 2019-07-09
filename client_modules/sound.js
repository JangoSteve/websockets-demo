msg.install("sound.js", "https://github.com/JangoSteve/websockets-demo/blob/master/client_modules/sound.js");

var context = new AudioContext(),
    oscillator,
    averageWindow = 3000,
    received = [],
    started = null,
    sound = false;

function newOscillator() {
  started = false;
  oscillator = context.createOscillator();
  oscillator.type = "sine";
  oscillator.connect(context.destination);
}

function enableAndSend() {
  if (!sound) {
    sound = true;
    newOscillator();
    $('#sound').addClass('success');
    $('#no-sound').removeClass('alert');
    msg.log("Sound mode enabled.");
  }

  var message = JSON.stringify({type: 'sound', msg: 'sound pressed'});
  connection.send(message);
}

function disable() {
  oscillator.stop();
  sound = false;
  newOscillator();

  $('#sound').removeClass('success');
  $('#no-sound').addClass('alert');
  msg.log("Sound mode disabled.");
}

$('#connected-clients').append('<div style="font-size:16px;position:fixed;bottom:0;left:0;"><button id="sound" class="secondary">&#128266;</button><button id="no-sound" class="secondary">&#128263;</button>');

msg.sound = function(data) {
  if (sound) {
    var now = new Date(),
        sinceTimestamp = now - averageWindow,
        i,
        freq;

    received.push(now.getTime());

    // Remove entries older than averageWindow
    i = received.findIndex( function(el) { return el >= sinceTimestamp });
    if (i > 0) {
      received = received.slice(i);
    }

    // Compute frequency based on events received over 3 seconds, multiply by 100 to get usable frequencies
    freq = Math.round( 1000 * 100 / (averageWindow/received.length) );

    if (!started) {
      started = true;
      oscillator.start();
    }

    msg.log('Sound received from client ' + (data.sender === connection.id ? 'you' : data.sender) + '. Setting frequency to ' + freq + 'Hz');

    oscillator.frequency.value = freq;
    lastReceived = now;
  }
}

$(document).bind('keyup', function (e) {
  if(e.keyCode == 32) { // space
    enableAndSend();
  }

  if (e.keyCode == 27 && sound) { // esc
    disable();
  }
});

$('#sound').bind('click', function(e) {
  enableAndSend();
});
$('#no-sound').bind('click', function(e) {
  disable();
});

var connection = new WebSocket('ws://localhost:8080'),
    count,
    msg = {
      console: $('#event-console'),
      log: function(message) {
        var log = $('<div class="event-msg"></div>');
        log.html(message).prependTo(msg.console);
      }
    };

// When the connection is open, send some data to the server
connection.onopen = function () {
  connection.send('Ping'); // Send the message 'Ping' to the server
};

// Log errors
connection.onerror = function (error) {
  console.log('WebSocket Error ' + error);
};

// Log messages from the server
connection.onmessage = function (e) {
  var response = JSON.parse(e.data);
  console.log('Server: ' + e.data);
  switch (response.type) {
    case 'connection':
      updateCount(response.clients);
      break;
    case 'connected':
      connection.id = response.id;
      break;
    case 'closed':
      updateCount(response.clients);
      break;
    case 'error':
      break;
    default:
      //console.log('custom type: ' + response.type);
  }
  if (typeof(msg[response.type]) === 'function') {
    msg[response.type](response);
  }
};

var updateCount = function(newCount) {
  count = newCount;
  $('#client-count').html(count);
};

// Message functions

msg.connection = function(data) {
  if (data.id > connection.id) {
    msg.log('client ' + data.id + ' has joined');
  }

  var client = $('<li class="client"></li>'),
      ul = $('#connected-clients');

  if (data.id === connection.id) {
    client.addClass('you');
  }
  client.attr('data-id', data.id).html('<span class="client-id">' + data.id + '</span>').appendTo(ul);
};

msg.connected = function(data) {
  msg.log('you are connected as client ' + data.id);
};

msg.closed = function(data) {
  msg.log('client ' + data.id + ' has left the session');

  var client = $('.client[data-id=' + data.id + ']').remove();
};

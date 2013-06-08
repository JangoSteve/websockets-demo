var connection = new WebSocket('ws://localhost:8080'),
    count,
    msg = {};

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
      count = response.clients;
      break;
    case 'connected':
      connection.id = response.id
      break;
    case 'cloased':
      count = response.clients;
      break;
    default:
      console.log('unknown type: ' + response.type);
  }
  if (typeof(msg[response.type]) === 'function') {
    msg[response.type](response);
  }
};

// Message functions

msg.connection = function(data) {
  var client = $('<li class="client"></li>'),
      ul = $('#connected-clients');

  if (data.id === connection.id) {
    client.addClass('you');
  }
  client.attr('data-id', data.id).html('<span class="client-id">' + data.id + '</span>').appendTo(ul);
};

msg.closed = function(data) {
  var client = $('.client[data-id=' + data.id + ']').remove();
};

msg.install("connection.js", "https://github.com/JangoSteve/websockets-demo/blob/master/client_modules/connection.js");

msg.connection = function(data) {
  if (data.id > connection.id) {
    msg.log('Client ' + data.id + ' has joined.');
  }

  var client = $('<li class="client"></li>'),
      ul = $('#connected-clients');

  if (data.id === connection.id) {
    client.addClass('you');
  }
  client.attr('data-id', data.id).html('<span class="client-id">' + data.id + '</span>').appendTo(ul);

  $('#client-count').html(data.clients);
};

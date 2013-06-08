msg.closed = function(data) {
  msg.log('client ' + data.id + ' has left the session');

  var client = $('.client[data-id=' + data.id + ']').remove();

  $('#client-count').html(data.clients);
};

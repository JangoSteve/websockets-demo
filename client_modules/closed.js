msg.install("closed.js", "https://github.com/JangoSteve/websockets-demo/blob/master/client_modules/closed.js");

msg.closed = function(data) {
  msg.log('Client ' + data.id + ' has left the session.');

  var client = $('.client[data-id=' + data.id + ']').remove();

  $('#client-count').html(data.clients);
};

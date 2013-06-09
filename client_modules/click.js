msg.install("click.js", "#");

msg.click = function(data) {
  msg.log('Click received from client ' + data.sender + '.');
}

$(document).delegate('.client[data-id]', 'click', function (e) {
  var target = $(this).data('id'),
      message = JSON.stringify({type: 'click', target: target});
  if (target !== connection.id) {
    connection.send(message);
    msg.log('Click sent to client ' + target + '.');
  }
});

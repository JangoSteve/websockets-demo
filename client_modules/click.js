msg.click = function(data) {
  msg.log('click received from ' + data.sender + '!');
}

$(document).delegate('.client[data-id]', 'click', function (e) {
  var target = $(this).data('id'),
      message = JSON.stringify({type: 'click', target: target});
  connection.send(message);
  msg.log('click sent to ' + target + '!');
});

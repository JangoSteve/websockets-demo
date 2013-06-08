msg.click = function(data) {
  msg.log('click from ' + data.sender + '!');
}

$(document).delegate('*', 'click', function (e) {
  var msg = JSON.stringify({type: 'click'});
  connection.send(msg);
});

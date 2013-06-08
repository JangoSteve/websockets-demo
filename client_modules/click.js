msg.click = function(data) {
  alert('click from ' + data.sender + '!');
}

$(document).delegate('*', 'click', function (e) {
  var msg = JSON.stringify({type: 'click'});
  connection.send(msg);
});

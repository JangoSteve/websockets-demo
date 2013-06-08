msg.install("connected.js", "#");

msg.connected = function(data) {
  connection.id = data.id;
  msg.log('You are connected as client ' + data.id + '.');
};

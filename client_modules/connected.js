msg.connected = function(data) {
  connection.id = data.id;
  msg.log('you are connected as client ' + data.id);
};

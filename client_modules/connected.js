msg.install("connected.js", "https://github.com/JangoSteve/websockets-demo/blob/master/client_modules/connected.js");

msg.connected = function(data) {
  connection.id = data.id;
  msg.log('You are connected as client ' + data.id + '. Local network IP address: ' + data.localIps.join(', '));
};

var ws = require('ws').Server,
    server = new ws({port: 8080}),
    allClients = {},
    i = 0;

server.on('connection', function(websock) {
  i++;
  websock.id = i;
  console.log('connected!');
  allClients[i] = websock;
  websock.on('message', function(message) {
    console.log(message);
    for (var client in allClients) {
      allClients[client].send(message);
    }
  });

  websock.on('close', function() {
    delete allClients[websock.id];
  });
});


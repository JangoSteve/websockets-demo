var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 8080}),
    i = 0,
    connections = {};

wss.on('connection', function(ws) {
  i++;
  connections[i] = ws;
  ws.id = i;

  ws.on('message', function(message) {
    console.log('received: %s', message);
  });

  for (var id in connections) {
    connections[id].send(JSON.stringify({
      type: 'connection',
      id: ws.id,
      clients: Object.keys(connections).length
    }));
  }

  ws.send(JSON.stringify({
    type: 'connected',
    id: ws.id
  }));

  ws.on('close', function() {
    console.log('deleting ' + ws.id);
    delete connections[ws.id];
  });
});

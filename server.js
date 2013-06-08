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

  ws.send(JSON.stringify({
    type: 'connected',
    id: ws.id
  }));

  for (var id in connections) {

    // Notify all clients of new connection
    connections[id].send(JSON.stringify({
      type: 'connection',
      id: ws.id,
      clients: Object.keys(connections).length
    }));

    // Notify current client of all existing connections
    if (id < ws.id) {
      ws.send(JSON.stringify({
        type: 'connection',
        id: id,
        clients: Object.keys(connections).length
      }));
    }
  }

  ws.on('close', function() {
    console.log('deleting ' + ws.id);
    delete connections[ws.id];

    for (var id in connections) {
      connections[id].send(JSON.stringify({
        type: 'closed',
        id: ws.id,
        clients: Object.keys(connections).length
      }));
    }
  });
});

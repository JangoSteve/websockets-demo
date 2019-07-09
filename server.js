var WebSocketServer = require('ws').Server,
    i = 0,
    connections = {},
    connect = require('connect'),
    clientServer = connect.createServer(connect.static(__dirname)).listen(process.env.PORT || 8081),
    wss = new WebSocketServer({server: clientServer}),
    os = require('os'),
    ifaces = os.networkInterfaces(),
    localIps = [];

// Adapted from https://stackoverflow.com/a/8440736/366381
Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      localIps.push(iface.address);
    } else {
      // this interface has only one ipv4 adress
      localIps.push(iface.address);
    }
    ++alias;
  });
});

wss.on('connection', function(ws) {
  i++;
  connections[i] = ws;
  ws.id = i;

  ws.on('message', function(message) {
    try {
      var msg = JSON.parse(message);
      msg.sender = ws.id;
      sendToConnections(msg);
    } catch (e) {
      ws.send(JSON.stringify({
        type: 'error',
        error: e,
        received: message
      }));
    }
  });

  // Connected event
  ws.send(JSON.stringify({
    type: 'connected',
    id: ws.id,
    localIps: localIps
  }));

  // Connection events
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

  // Closed event
  ws.on('close', function() {
    console.log('deleting ' + ws.id);
    delete connections[ws.id];

    sendToConnections({
      type: 'closed',
      id: ws.id,
      clients: Object.keys(connections).length
    });
  });
});

console.log('NODE_ENV: ' + process.env.NODE_ENV);

var sendToConnections = function(obj) {
  var msg = JSON.stringify(obj);
  if (obj.target) {
    if (process.env.NODE_ENV !== "production") {
      console.log('sending from ' + obj.sender + ' to ' + obj.target + ': ' + msg);
    }
    connections[obj.target].send(msg);
  } else {
    if (process.env.NODE_ENV !== "production") {
      console.log('sending from ' + obj.sender + ' to everyone: ' + msg);
    }
    for (var id in connections) {
      connections[id].send(msg);
    }
  }
};

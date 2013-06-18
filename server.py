import json
import logging

from tornado import ioloop, web, websocket


class WebSocketServer(websocket.WebSocketHandler):

    def open(self):
        self.application.i += 1
        self.connection_id = self.application.i
        self.application.connections[self.connection_id] = self

        # Connected event
        self.write_message(json.dumps({
                'type': 'connected',
                'id': self.connection_id,
                }))

        # Connection events
        for each_id, each_connection in self.application.connections.iteritems():

            # Notify all clients of new connection
            each_connection.write_message(json.dumps({
                    'type': 'connection',
                    'id': self.connection_id,
                    'clients': len(self.application.connections),
                    }))

            # Notify current client of all existing connections
            if each_id < self.connection_id:
                self.write_message(json.dumps({
                        'type': 'connection',
                        'id': each_id,
                        'clients': len(self.application.connections),
                        }))

    def on_message(self, message):
        try:
            msg = json.loads(message)
            msg['sender'] = self.connection_id
            self.__send_to_connections(msg)

        except Exception, e:
            self.write_message(json.dumps({
                'type': 'error',
                'error': str(e),
                'received': message,
                }))

    def on_close(self):
        self.application.log.debug('deleting %d', self.connection_id)

        del self.application.connections[self.connection_id]

        self.__send_to_connections({
                'type': 'closed',
                'id': self.connection_id,
                'clients': len(self.application.connections),
                })
        pass

    def __send_to_connections(self, msg):
        if 'target' in msg:
            self.application.log.debug('sending from %s to %s: %s',
                    msg.get('sender', None), msg['target'], msg)

            self.application.connections[msg['target']].write_message(
                    json.dumps(msg))

        else:
            self.application.log.debug('sending from %s to everyone: %s',
                    msg.get('sender', None), msg)

            for each_connection in self.application.connections.itervalues():
                each_connection.write_message(json.dumps(msg))


if __name__ == '__main__':
    application = web.Application([
            (r'/', WebSocketServer),
            ])

    application.i = 0
    application.connections = {}

    # Set up logging
    handler = logging.StreamHandler()
    handler.setFormatter(
            logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))

    application.log = logging.getLogger('websockets-demo')
    application.log.setLevel(logging.DEBUG)
    application.log.addHandler(handler)

    application.listen(8081)
    ioloop.IOLoop.instance().start()

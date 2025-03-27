const jwt = require('jsonwebtoken');
const CONSTANTS = require('../../constants');

class WebSocket {
  connect (namespace, io) {
    this.io = io.of(namespace);
    this.listen();
  }

  listen () {
    this.io.on(CONSTANTS.SOCKET_CONNECTION, socket => {
      const token = socket.handshake.auth?.token;

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const userId = decoded.userId;

          if (userId) {
            socket.join(userId);
            console.log(`User ${userId} joined their room`);
          }
        } catch (err) {
          console.error('Token verification failed:', err.message);
        }
      } else {
        console.warn(' No token found in socket handshake!');
      }

      this.onSubscribe(socket);
      this.onUnsubscribe(socket);
      this.anotherSubscribes(socket);
    });
  }

  anotherSubscribes (socket) {}

  onSubscribe (socket) {
    socket.on(CONSTANTS.SOCKET_SUBSCRIBE, id => {
      socket.join(id);
    });
  }

  onUnsubscribe (socket) {
    socket.on(CONSTANTS.SOCKET_UNSUBSCRIBE, id => {
      socket.leave(id);
    });
  }
}

module.exports = WebSocket;

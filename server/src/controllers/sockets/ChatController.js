const WebSocket = require('./WebSocket');
const CONSTANTS = require('../../constants');

class ChatController extends WebSocket {
  anotherSubscribes (socket) {
    this.onSubscribeChat(socket);
    this.onUnsubscribeChat(socket);
  }

  onSubscribeChat (socket) {
    socket.on('subscribeChat', conversationId => {
      if (!conversationId) {
        return;
      }

      socket.join(conversationId);
    });
  }

  onUnsubscribeChat (socket) {
    socket.on('unsubscribeChat', id => {
      socket.join(id);
    });
  }

  emitNewMessage (conversationId, message, preview) {
    this.io.to(conversationId).emit('newMessage', { message, preview });
  }

  emitChangeBlockStatus (target, message) {
    this.io
      .to(parseInt(target))
      .emit(CONSTANTS.CHANGE_BLOCK_STATUS, { message });
  }
}

module.exports = ChatController;

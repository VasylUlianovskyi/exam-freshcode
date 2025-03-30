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

  async emitNewMessage (conversationId, message, preview) {
    const recipientId = preview.interlocutor.id;

    const isChatOpen = this.activeChats?.get(recipientId) === conversationId;

    let updatedMessage = message;

    if (isChatOpen) {
      updatedMessage = await message.update({ isRead: true });

      if (preview.lastMessage) {
        preview.lastMessage.isRead = true;
      } else {
        preview.isRead = true;
      }
    }

    this.io.to(conversationId).emit('newMessage', {
      message: updatedMessage,
      preview,
    });
  }

  emitChangeBlockStatus (target, message) {
    this.io
      .to(parseInt(target))
      .emit(CONSTANTS.CHANGE_BLOCK_STATUS, { message });
  }
}

module.exports = ChatController;

import WebSocket from './WebSocket';
import CONTANTS from '../../../constants';
import {
  addMessage,
  changeBlockStatusInStore,
  getPreviewChat,
} from '../../../store/slices/chatSlice';

class ChatSocket extends WebSocket {
  constructor (dispatch, getState, room) {
    super(dispatch, getState, room);
  }

  anotherSubscribes = () => {
    this.onNewMessage();
    this.onChangeBlockStatus();
  };

  onChangeBlockStatus = () => {
    this.socket.on(CONTANTS.CHANGE_BLOCK_STATUS, data => {
      this.dispatch(changeBlockStatusInStore(data.message));
    });
  };

  onNewMessage = () => {
    this.socket.on('newMessage', ({ message, preview }) => {
      const { chatData, userId } = this.getState().chatStore;
      const isChatOpened =
        chatData?.id === message.conversationId && message.senderId !== userId;

      if (isChatOpened) {
        message.isRead = true;
        preview.unreadCount = 0;
      }

      this.dispatch(addMessage({ message, preview }));
    });

    this.dispatch(getPreviewChat());
  };

  setActiveChat = conversationId => {
    if (!this.socket) return;
    this.socket.emit('setActiveChat', { conversationId });
  };

  subscribeChat = id => {
    if (!this.socket) {
      console.error('[SOCKET] WebSocket is NOT initialized!');
      return;
    }

    if (!id) {
      console.error('[SOCKET] Chat ID missing!');
      return;
    }

    this.socket.emit('subscribeChat', id);
  };

  unsubscribeChat = conversationId => {
    this.socket.emit('unsubscribeChat', conversationId);
  };

  subscribeToAllChats = previews => {
    if (!this.socket || !Array.isArray(previews)) return;

    previews.forEach(preview => {
      if (preview?.id) {
        this.socket.emit('subscribeChat', preview.id);
      }
    });
  };
}

export default ChatSocket;

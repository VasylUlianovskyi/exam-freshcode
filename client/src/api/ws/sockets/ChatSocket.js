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
      this.dispatch(addMessage({ message, preview }));
    });
    this.dispatch(getPreviewChat());
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
}

export default ChatSocket;

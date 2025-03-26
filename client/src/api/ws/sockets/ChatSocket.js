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
    this.socket.on('newMessage', data => {
      this.dispatch(addMessage(data));
    });

    this.dispatch(getPreviewChat());
  };

  subscribeChat = id => {
    if (!this.socket) {
      console.error('❌ [SOCKET] WebSocket НЕ ініціалізований!');
      return;
    }

    if (!id) {
      console.error('❌ [SOCKET] ID чату відсутній!');
      return;
    }

    this.socket.emit('subscribeChat', id);
  };

  unsubscribeChat = conversationId => {
    this.socket.emit('unsubscribeChat', conversationId);
  };
}

export default ChatSocket;

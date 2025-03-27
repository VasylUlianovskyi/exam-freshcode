import socketIoClient from 'socket.io-client';
import CONSTANTS from '../../../constants';

class WebSocket {
  constructor (dispatch, getState, room) {
    this.dispatch = dispatch;
    this.getState = getState;

    this.socket = socketIoClient(`${CONSTANTS.BASE_URL}${room}`, {
      auth: {
        token: localStorage.getItem('accessToken'),
      },
    });

    this.listen();
  }

  listen = () => {
    this.socket.on('connect', () => {
      this.anotherSubscribes();
    });

    this.socket.on('disconnect', () => {});
  };

  anotherSubscribes = () => {};
}

export default WebSocket;

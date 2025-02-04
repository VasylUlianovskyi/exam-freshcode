import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import className from 'classnames';
import {
  getDialogMessages,
  clearMessageList,
} from '../../../../store/slices/chatSlice';
import ChatHeader from '../../ChatComponents/ChatHeader/ChatHeader';
import styles from './Dialog.module.sass';
import ChatInput from '../../ChatComponents/ChatInut/ChatInput';

class Dialog extends React.Component {
  componentDidMount () {
    if (this.props.interlocutor) {
      this.props.getDialog({ interlocutorId: this.props.interlocutor.id });
    }
    this.scrollToBottom();
  }

  messagesEnd = React.createRef();

  scrollToBottom = () => {
    if (this.messagesEnd.current) {
      this.messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  componentWillReceiveProps (nextProps) {
    if (nextProps.interlocutor && this.props.interlocutor) {
      if (nextProps.interlocutor.id !== this.props.interlocutor.id) {
        this.props.getDialog({ interlocutorId: nextProps.interlocutor.id });
      }
    }
  }

  componentWillUnmount () {
    this.props.clearMessageList();
  }

  componentDidUpdate () {
    this.scrollToBottom();
  }

  renderMainDialog = () => {
    const messagesArray = [];
    const { messages = [], userId } = this.props;

    if (!messages.length) {
      return <p className={styles.noMessages}>No messages yet</p>;
    }

    let currentTime = moment();
    messages.forEach((message, i) => {
      if (!currentTime.isSame(message.createdAt, 'date')) {
        messagesArray.push(
          <div key={message.createdAt} className={styles.date}>
            {moment(message.createdAt).format('MMMM DD, YYYY')}
          </div>
        );
        currentTime = moment(message.createdAt);
      }
      messagesArray.push(
        <div
          key={i}
          className={className(
            userId === message.senderId ? styles.ownMessage : styles.message
          )}
        >
          <span>{message.body}</span>
          <span className={styles.messageTime}>
            {moment.utc(message.createdAt).local().format('HH:mm')}
          </span>
          <div ref={this.messagesEnd} />
        </div>
      );
    });
    return <div className={styles.messageList}>{messagesArray}</div>;
  };

  blockMessage = () => {
    const { userId, chatData } = this.props;

    if (!chatData) return null;

    const { blackList = [], participants = [] } = chatData;
    const userIndex = participants.indexOf(userId);

    if (Array.isArray(blackList)) {
      if (blackList[userIndex]) {
        return <span className={styles.messageBlock}>You block him</span>;
      }
      if (blackList.includes(true)) {
        return <span className={styles.messageBlock}>He block you</span>;
      }
    }

    return null;
  };

  render () {
    const { chatData, userId } = this.props;

    return (
      <>
        <ChatHeader userId={userId} />
        {this.renderMainDialog()}
        <div ref={this.messagesEnd} />
        {chatData &&
        Array.isArray(chatData.blackList) &&
        chatData.blackList.includes(true) ? (
          this.blockMessage()
        ) : (
          <ChatInput />
        )}
      </>
    );
  }
}

const mapStateToProps = state => state.chatStore;

const mapDispatchToProps = dispatch => ({
  getDialog: data => dispatch(getDialogMessages(data)),
  clearMessageList: () => dispatch(clearMessageList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);

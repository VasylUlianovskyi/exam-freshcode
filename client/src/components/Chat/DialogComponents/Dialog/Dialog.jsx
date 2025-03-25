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
    if (this.props.chatData) {
      this.props.getDialog({
        conversationId: this.props.chatData.id,
        interlocutorId: this.props.interlocutor?.id,
      });
    } else {
      console.warn('😡 chatData is NULL on mount');
    }
    this.scrollToBottom();
  }

  messagesEnd = React.createRef();

  scrollToBottom = () => {
    if (this.messagesEnd.current) {
      this.messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  componentDidUpdate (prevProps) {
    if (prevProps.messages.length !== this.props.messages.length) {
      this.scrollToBottom();
    }
  }

  shouldComponentUpdate (nextProps) {
    return this.props.messages.length !== nextProps.messages.length;
  }

  componentWillUnmount () {
    this.props.clearMessageList();
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
          <ChatInput chatData={chatData} />
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  messages: state.chatStore.messages.slice(),
  chatData: state.chatStore.chatData,
  interlocutor: state.chatStore.interlocutor,
});

const mapDispatchToProps = dispatch => ({
  getDialog: data => dispatch(getDialogMessages(data)),
  clearMessageList: () => dispatch(clearMessageList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);

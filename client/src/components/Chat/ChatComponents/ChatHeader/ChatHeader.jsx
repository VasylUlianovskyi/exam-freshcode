import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  backToDialogList,
  changeChatFavorite,
  changeChatBlock,
} from '../../../../store/slices/chatSlice';
import styles from './ChatHeader.module.sass';
import CONSTANTS from '../../../../constants';

const ChatHeader = props => {
  const { backToDialogList, chatData, interlocutor } = props;

  if (!interlocutor) {
    return (
      <div className={styles.chatHeader}>
        <span>Loading chat...</span>
      </div>
    );
  }

  const changeFavorite = event => {
    if (!chatData || !chatData.id) {
      return;
    }

    props.changeChatFavorite({
      conversation_id: chatData.id,
      favoriteFlag: !chatData.favoriteList,
    });

    event.stopPropagation();
  };

  const changeBlackList = event => {
    if (!chatData || !chatData.id) {
      return;
    }

    props.changeChatBlock({
      conversation_id: chatData.id,
      blackListFlag: !chatData.blacklist,
    });

    event.stopPropagation();
  };

  const { avatar = 'anon.png', firstName = 'Anonymous' } = interlocutor;
  const avatarSrc =
    avatar === 'anon.png'
      ? CONSTANTS.ANONYM_IMAGE_PATH
      : `${CONSTANTS.publicURL}${avatar}`;

  return (
    <div className={styles.chatHeader}>
      <div className={styles.buttonContainer} onClick={backToDialogList}>
        <img
          src={`${CONSTANTS.STATIC_IMAGES_PATH}arrow-left-thick.png`}
          alt='back'
        />
      </div>
      <div className={styles.infoContainer}>
        <div>
          <img src={avatarSrc} alt='user' />
          <span>{firstName}</span>
        </div>
        {chatData && (
          <div>
            <i
              onClick={changeFavorite}
              className={classNames({
                'far fa-heart': !chatData.favoriteList,
                'fas fa-heart': chatData.favoriteList,
              })}
            />
            <i
              onClick={changeBlackList}
              className={classNames({
                'fas fa-user-lock': !chatData.blacklist,
                'fas fa-unlock': chatData.blacklist,
              })}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  chatData: state.chatStore.chatData,
  interlocutor: state.chatStore.interlocutor,
});

const mapDispatchToProps = dispatch => ({
  backToDialogList: () => dispatch(backToDialogList()),
  changeChatFavorite: data => dispatch(changeChatFavorite(data)),
  changeChatBlock: data => dispatch(changeChatBlock(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatHeader);

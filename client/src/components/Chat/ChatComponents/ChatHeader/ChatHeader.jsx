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
  const changeFavorite = event => {
    if (!props.chatData || !props.chatData.id) {
      console.warn(
        '⚠️ Warning: chatData or chatData.id is missing',
        props.chatData
      );
      return;
    }

    const payload = {
      conversation_id: props.chatData.id,
      favoriteFlag: !props.chatData.favoriteList,
    };

    console.log('📤 Dispatching changeChatFavorite with payload:', payload);

    props.changeChatFavorite(payload);
    event.stopPropagation();
  };

  const changeBlackList = event => {
    if (!props.chatData || !props.chatData.id) {
      console.warn(
        '⚠️ Warning: chatData or chatData.id is missing',
        props.chatData
      );
      return;
    }

    const payload = {
      conversation_id: props.chatData.id,
      blackListFlag: !props.chatData.blacklist,
    };

    props.changeChatBlock(payload);
    event.stopPropagation();
  };
  const { avatar, firstName } = props.interlocutor;
  const { backToDialogList, chatData } = props;
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
          <img
            src={
              avatar === 'anon.png'
                ? CONSTANTS.ANONYM_IMAGE_PATH
                : `${CONSTANTS.publicURL}${avatar}`
            }
            alt='user'
          />
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

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  backToDialogList,
  changeChatFavorite,
  changeChatBlock,
} from '../../../../store/slices/chatSlice';
import styles from './ChatHeader.module.sass';
import CONSTANTS from '../../../../constants';

const ChatHeader = () => {
  const dispatch = useDispatch();

  const chatData = useSelector(state => state.chatStore.chatData);
  const interlocutor = useSelector(state => state.chatStore.interlocutor);
  if (!interlocutor) {
    return (
      <div className={styles.chatHeader}>
        <span>Loading chat...</span>
      </div>
    );
  }

  const changeFavorite = event => {
    if (!chatData || !chatData.id || !interlocutor?.id) return;

    dispatch({
      type: 'chat/changeChatFavorite/fulfilled',
      payload: {
        conversation: {
          userId: interlocutor.id,
          favoriteList: !chatData.favoriteList,
        },
      },
    });

    dispatch(
      changeChatFavorite({
        conversationId: chatData.id,
        interlocutorId: interlocutor.id,
        favoriteFlag: !chatData.favoriteList,
      })
    );

    event.stopPropagation();
  };

  const changeBlackList = event => {
    if (!chatData || !chatData.id || !interlocutor?.id) return;

    dispatch({
      type: 'chat/changeChatBlock/fulfilled',
      payload: {
        conversation: {
          userId: interlocutor.id,
          blacklist: !chatData.blacklist,
        },
      },
    });

    dispatch(
      changeChatBlock({
        conversationId: chatData.id,
        interlocutorId: interlocutor.id,
        blacklistFlag: !chatData.blacklist,
      })
    );

    event.stopPropagation();
  };

  const handleBack = () => dispatch(backToDialogList());

  const { avatar = 'anon.png', firstName = 'Anonymous' } = interlocutor;
  const avatarSrc =
    avatar === 'anon.png'
      ? CONSTANTS.ANONYM_IMAGE_PATH
      : `${CONSTANTS.publicURL}${avatar}`;

  return (
    <div className={styles.chatHeader}>
      <div className={styles.buttonContainer} onClick={handleBack}>
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

export default ChatHeader;

import React from 'react';
import classNames from 'classnames';
import styles from './DialogBox.module.sass';
import CONSTANTS from '../../../../constants';

const DialogBox = ({
  chatPreview,
  unreadCount,
  getTimeStr,
  changeFavorite,
  changeBlackList,
  catalogOperation,
  goToExpandedDialog,
  chatMode,
  interlocutor,
}) => {
  const {
    favoriteList = false,
    blacklist = false,
    id,
    text,
    createAt,
  } = chatPreview;

  const { firstName, avatar = 'anon.png' } = interlocutor || {};

  const avatarUrl =
    avatar === 'anon.png'
      ? CONSTANTS.ANONYM_IMAGE_PATH
      : `${CONSTANTS.publicURL}${avatar}`;

  const handleOpenDialog = () => {
    goToExpandedDialog({
      interlocutor,
      conversationData: { id, blacklist, favoriteList },
    });
  };

  return (
    <div className={styles.previewChatBox} onClick={handleOpenDialog}>
      <img src={avatarUrl} alt='user' />

      <div className={styles.infoContainer}>
        <div className={styles.interlocutorInfo}>
          <span
            className={classNames(styles.interlocutorName, {
              [styles.bold]: unreadCount > 0,
            })}
          >
            {firstName}
          </span>
          <span
            className={classNames(styles.interlocutorMessage, {
              [styles.bold]: unreadCount > 0,
            })}
          >
            {text}
          </span>
          {unreadCount > 0 && (
            <div className={styles.unreadBadge}>{unreadCount}</div>
          )}
        </div>

        <div className={styles.buttonsContainer}>
          <span className={styles.time}>{getTimeStr(createAt)}</span>

          <i
            onClick={e => changeFavorite(chatPreview, e)}
            className={classNames({
              'far fa-heart': !favoriteList,
              'fas fa-heart': favoriteList,
            })}
          />

          <i
            onClick={e => changeBlackList(chatPreview, e)}
            className={classNames({
              'fas fa-user-lock': !blacklist,
              'fas fa-unlock': blacklist,
            })}
          />

          <i
            onClick={e => catalogOperation(e, id)}
            className={classNames({
              'far fa-plus-square':
                chatMode !== CONSTANTS.CATALOG_PREVIEW_CHAT_MODE,
              'fas fa-minus-circle':
                chatMode === CONSTANTS.CATALOG_PREVIEW_CHAT_MODE,
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default DialogBox;

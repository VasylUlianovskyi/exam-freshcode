import React from 'react';
import { connect, useDispatch } from 'react-redux';
import moment from 'moment';
import CONSTANTS from '../../../../constants';
import {
  goToExpandedDialog,
  changeChatFavorite,
  changeChatBlock,
  changeShowAddChatToCatalogMenu,
} from '../../../../store/slices/chatSlice';
import DialogBox from '../DialogBox/DialogBox';
import styles from './DialogList.module.sass';

const DialogList = ({
  preview,
  chatMode,
  userId,
  goToExpandedDialog,
  changeChatFavorite,
  changeChatBlock,
  changeShowAddChatToCatalogMenu,
  removeChat,
}) => {
  const dispatch = useDispatch();

  const changeFavorite = (chatPreview, event) => {
    if (!chatPreview?.id) return;

    dispatch({
      type: 'chat/changeChatFavorite/fulfilled',
      payload: {
        conversation: {
          userId: chatPreview.interlocutor?.id,
          favoriteList: !chatPreview.favoriteList,
        },
      },
    });

    changeChatFavorite({
      conversationId: chatPreview.id,
      interlocutorId: chatPreview.interlocutor?.id,
      favoriteFlag: !chatPreview.favoriteList,
    });

    event.stopPropagation();
  };

  const changeBlackList = (chatPreview, event) => {
    if (!chatPreview?.id) return;

    dispatch({
      type: 'chat/changeChatBlock/fulfilled',
      payload: {
        conversation: {
          userId: chatPreview.interlocutor?.id,
          blacklist: !chatPreview.blacklist,
        },
      },
    });

    changeChatBlock({
      conversationId: chatPreview.id,
      interlocutorId: chatPreview.interlocutor?.id,
      blacklistFlag: !chatPreview.blacklist,
    });

    event.stopPropagation();
  };

  const changeShowCatalogCreation = (event, chatId) => {
    changeShowAddChatToCatalogMenu(chatId);
    event.stopPropagation();
  };

  const onlyFavoriteDialogs = chatPreview => chatPreview.favoriteList === true;
  const onlyBlockDialogs = chatPreview => chatPreview.blacklist === true;

  const getTimeStr = time => {
    const currentTime = moment();
    if (currentTime.isSame(time, 'day')) return moment(time).format('HH:mm');
    if (currentTime.isSame(time, 'week')) return moment(time).format('dddd');
    if (currentTime.isSame(time, 'year')) return moment(time).format('MM DD');
    return moment(time).format('MMMM DD, YYYY');
  };

  const renderPreview = filterFunc => {
    const list = preview.filter(chat => {
      if (chat.interlocutor?.id === userId) return false;
      if (filterFunc && !filterFunc(chat)) return false;
      return true;
    });

    if (!list.length) {
      return <span className={styles.notFound}>Not found</span>;
    }

    return list.map(chatPreview => (
      <DialogBox
        key={`${chatPreview.id}-${chatPreview.favoriteList}-${chatPreview.blacklist}`}
        interlocutor={chatPreview.interlocutor}
        chatPreview={chatPreview}
        getTimeStr={getTimeStr}
        changeFavorite={changeFavorite}
        changeBlackList={changeBlackList}
        chatMode={chatMode}
        catalogOperation={
          chatMode === CONSTANTS.CATALOG_PREVIEW_CHAT_MODE
            ? removeChat
            : changeShowCatalogCreation
        }
        goToExpandedDialog={goToExpandedDialog}
      />
    ));
  };

  const renderChatPreview = () => {
    switch (chatMode) {
      case CONSTANTS.FAVORITE_PREVIEW_CHAT_MODE:
        return renderPreview(onlyFavoriteDialogs);
      case CONSTANTS.BLOCKED_PREVIEW_CHAT_MODE:
        return renderPreview(onlyBlockDialogs);
      default:
        return renderPreview();
    }
  };

  return <div className={styles.previewContainer}>{renderChatPreview()}</div>;
};

const mapStateToProps = state => state.chatStore;

const mapDispatchToProps = {
  goToExpandedDialog,
  changeChatFavorite,
  changeChatBlock,
  changeShowAddChatToCatalogMenu,
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogList);

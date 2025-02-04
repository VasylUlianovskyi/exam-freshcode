import React from 'react';
import { connect } from 'react-redux';
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

const DialogList = props => {
  const changeFavorite = (chatPreview, event) => {
    if (!chatPreview || !chatPreview.id) return;
    props.changeChatFavorite({
      conversation_id: chatPreview.id,
      favoriteFlag: !chatPreview.favoriteList,
    });
    event.stopPropagation();
  };

  const changeBlackList = (chatPreview, event) => {
    if (!chatPreview || !chatPreview.id) return;
    props.changeChatBlock({
      conversation_id: chatPreview.id,
      blackListFlag: !chatPreview.blackList,
    });
    event.stopPropagation();
  };

  const changeShowCatalogCreation = (event, chatId) => {
    props.changeShowAddChatToCatalogMenu(chatId);
    event.stopPropagation();
  };

  const getTimeStr = time => {
    const currentTime = moment();
    if (currentTime.isSame(time, 'day')) return moment(time).format('HH:mm');
    if (currentTime.isSame(time, 'week')) return moment(time).format('dddd');
    if (currentTime.isSame(time, 'year')) return moment(time).format('MM DD');
    return moment(time).format('MMMM DD, YYYY');
  };

  const renderPreview = () => {
    const { preview, goToExpandedDialog, chatMode, removeChat } = props;

    return preview.length ? (
      preview.map((chatPreview, index) => (
        <DialogBox
          interlocutor={chatPreview.interlocutor}
          chatPreview={chatPreview}
          key={index}
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
      ))
    ) : (
      <span className={styles.notFound}>Not found</span>
    );
  };

  return <div className={styles.previewContainer}>{renderPreview()}</div>;
};

const mapStateToProps = state => state.chatStore;

const mapDispatchToProps = dispatch => ({
  goToExpandedDialog: data => dispatch(goToExpandedDialog(data)),
  changeChatFavorite: data => dispatch(changeChatFavorite(data)),
  changeChatBlock: data => dispatch(changeChatBlock(data)),
  changeShowAddChatToCatalogMenu: data =>
    dispatch(changeShowAddChatToCatalogMenu(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DialogList);

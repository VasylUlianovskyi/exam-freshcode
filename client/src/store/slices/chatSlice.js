import { createSlice } from '@reduxjs/toolkit';
import { isEqual, remove } from 'lodash';
import * as restController from '../../api/rest/restController';
import CONSTANTS from '../../constants';
import {
  decorateAsyncThunk,
  createExtraReducers,
  rejectedReducer,
} from '../../utils/store';

const CHAT_SLICE_NAME = 'chat';

const initialState = {
  userId: null,
  isFetching: true,
  addChatId: null,
  isShowCatalogCreation: false,
  currentCatalog: null,
  chatData: null,
  messages: [],
  error: null,
  isExpanded: false,
  interlocutor: null,
  messagesPreview: [],
  isShow: false,
  chatMode: CONSTANTS.NORMAL_PREVIEW_CHAT_MODE,
  catalogList: [],
  isRenameCatalog: false,
  isShowChatsInCatalog: false,
  catalogCreationMode: CONSTANTS.ADD_CHAT_TO_OLD_CATALOG,
};

//---------- getPreviewChat
export const getPreviewChat = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/getPreviewChat`,
  thunk: async () => {
    const { data } = await restController.getPreviewChat();
    return data;
  },
});

const getPreviewChatExtraReducers = createExtraReducers({
  thunk: getPreviewChat,
  fulfilledReducer: (state, { payload }) => {
    const existingInterlocutorIds = state.messagesPreview.map(
      p => p.interlocutor?.id
    );

    const uniquePreviews = payload.filter(
      chat => !existingInterlocutorIds.includes(chat.interlocutor?.id)
    );

    if (uniquePreviews.length && window.chatSocket) {
      const conversationIds = uniquePreviews.map(p => p.id);
      window.chatSocket.subscribeChat(conversationIds);
    }

    state.messagesPreview = [...state.messagesPreview, ...uniquePreviews];
    state.error = null;
  },
  rejectedReducer: (state, { payload }) => {
    state.error = payload;
    state.messagesPreview = [];
  },
});

//---------- getDialogMessages
export const getDialogMessages = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/getDialogMessages`,
  thunk: async payload => {
    const { data } = await restController.getDialog(payload);
    return data;
  },
});

const getDialogMessagesExtraReducers = createExtraReducers({
  thunk: getDialogMessages,
  fulfilledReducer: (state, { payload }) => {
    state.messages = payload.messages;
    state.interlocutor = payload.interlocutor;
    state.chatData = {
      ...(state.chatData || {}),
      id: payload.conversationId,
    };
  },
});

//---------- sendMessage
export const sendMessage = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/sendMessage`,
  thunk: async payload => {
    const { data } = await restController.newMessage(payload);

    return { ...data, conversationId: payload.conversationId };
  },
});

const sendMessageExtraReducers = createExtraReducers({
  thunk: sendMessage,
  fulfilledReducer: (state, { payload }) => {
    const { message, preview } = payload;
    const { messagesPreview, userId } = state;

    let isNew = true;

    const updatedPreviews = messagesPreview.map(prev => {
      if (
        prev.id === message.conversationId &&
        prev.interlocutor?.id === preview?.interlocutor?.id
      ) {
        isNew = false;
        return {
          ...prev,
          text: message.body,
          sender: message.senderId,
          createAt: message.createdAt,
          interlocutor: preview.interlocutor,
        };
      }
      return prev;
    });

    if (isNew && preview) {
      updatedPreviews.push({
        ...preview,
        text: message.body,
        sender: message.senderId,
        createAt: message.createdAt,
        unreadCount: !message.isRead && message.senderId !== userId ? 1 : 0,
      });
    }

    if (!state.chatData?.id && message.conversationId) {
      state.chatData = {
        ...(state.chatData || {}),
        id: message.conversationId,
      };
    }

    state.messagesPreview = updatedPreviews;
    state.messages = [...state.messages, message];
  },
});

//---------- changeChatFavorite
export const changeChatFavorite = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/changeChatFavorite`,
  thunk: async payload => {
    const { data } = await restController.changeChatFavorite(payload);
    return data;
  },
});

const changeChatFavoriteExtraReducers = createExtraReducers({
  thunk: changeChatFavorite,
  fulfilledReducer: (state, { payload }) => {
    const updatedParticipant = payload.conversation;

    state.messagesPreview = state.messagesPreview.map(preview =>
      preview.interlocutor?.id === updatedParticipant.userId
        ? { ...preview, favoriteList: updatedParticipant.favoriteList }
        : preview
    );

    if (
      state.chatData &&
      state.interlocutor?.id === updatedParticipant.userId
    ) {
      state.chatData.favoriteList = updatedParticipant.favoriteList;
    }
  },

  rejectedReducer: (state, { payload }) => {
    state.error = payload;
  },
});

//---------- changeChatBlock
export const changeChatBlock = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/changeChatBlock`,
  thunk: async payload => {
    const { data } = await restController.changeChatBlock(payload);
    return data;
  },
});

const changeChatBlockExtraReducers = createExtraReducers({
  thunk: changeChatBlock,

  fulfilledReducer: (state, { payload }) => {
    const updatedParticipant = payload.conversation;

    state.messagesPreview = state.messagesPreview.map(preview =>
      preview.interlocutor?.id === updatedParticipant.userId
        ? { ...preview, blacklist: updatedParticipant.blacklist }
        : preview
    );

    if (
      state.chatData &&
      state.interlocutor?.id === updatedParticipant.userId
    ) {
      state.chatData.blacklist = updatedParticipant.blacklist;
    }
  },

  rejectedReducer: (state, { payload }) => {
    state.error = payload;
  },
});

//---------- getCatalogList
export const getCatalogList = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/getCatalogList`,
  thunk: async payload => {
    const { data } = await restController.getCatalogList(payload);
    return data;
  },
});

const getCatalogListExtraReducers = createExtraReducers({
  thunk: getCatalogList,
  fulfilledReducer: (state, { payload }) => {
    state.isFetching = false;
    state.catalogList = [...payload];
  },
  rejectedReducer,
});

//---------- addChatToCatalog
export const addChatToCatalog = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/addChatToCatalog`,
  thunk: async (payload, thunkAPI) => {
    try {
      const { data } = await restController.addChatToCatalog(payload);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: 'Unexpected error' }
      );
    }
  },
});

const addChatToCatalogExtraReducers = createExtraReducers({
  thunk: addChatToCatalog,
  fulfilledReducer: (state, { payload }) => {
    if (!payload.success && payload.message === 'Chat already in catalog') {
      alert(`Chat already exits in ${payload.catalogName} catalog`);
      state.isShowCatalogCreation = false;
      return;
    }

    const { catalogList } = state;

    for (let i = 0; i < catalogList.length; i++) {
      if (catalogList[i].id === payload.id) {
        catalogList[i].chats = payload.chats;
        break;
      }
    }

    alert(`Chat added to ${payload.catalogName} catalog`);

    state.catalogList = [...catalogList];
    state.isShowCatalogCreation = false;
  },

  rejectedReducer: (state, { payload }) => {
    state.error = payload;
    state.isShowCatalogCreation = false;
  },
});

//---------- createCatalog
export const createCatalog = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/createCatalog`,
  thunk: async payload => {
    const { data } = await restController.createCatalog(payload);
    return data;
  },
});

const createCatalogExtraReducers = createExtraReducers({
  thunk: createCatalog,
  fulfilledReducer: (state, { payload }) => {
    state.catalogList = [...state.catalogList, payload];
    state.isShowCatalogCreation = false;
  },
  rejectedReducer: (state, { payload }) => {
    state.isShowCatalogCreation = false;
    state.error = payload;
  },
});

//---------- deleteCatalog
export const deleteCatalog = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/deleteCatalog`,
  thunk: async payload => {
    await restController.deleteCatalog(payload);
    return payload;
  },
});

const deleteCatalogExtraReducers = createExtraReducers({
  thunk: deleteCatalog,
  fulfilledReducer: (state, { payload }) => {
    const { catalogList } = state;
    const newCatalogList = remove(
      catalogList,
      catalog => payload.catalogId !== catalog.id
    );
    state.catalogList = [...newCatalogList];
  },
  rejectedReducer: (state, { payload }) => {
    state.error = payload;
  },
});

//---------- removeChatFromCatalog
export const removeChatFromCatalog = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/removeChatFromCatalog`,
  thunk: async payload => {
    const { data } = await restController.removeChatFromCatalog(payload);
    return data;
  },
});

const removeChatFromCatalogExtraReducers = createExtraReducers({
  thunk: removeChatFromCatalog,
  fulfilledReducer: (state, { payload }) => {
    const { catalogList } = state;

    for (let i = 0; i < catalogList.length; i++) {
      if (catalogList[i].id === payload.id) {
        catalogList[i].Conversations = payload.Conversations;
        break;
      }
    }

    state.currentCatalog = payload;
    state.catalogList = [...catalogList];
  },

  rejectedReducer: (state, { payload }) => {
    state.error = payload;
  },
});

//---------- changeCatalogName
export const changeCatalogName = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/changeCatalogName`,
  thunk: async payload => {
    const { data } = await restController.changeCatalogName(payload);
    return data;
  },
});

const changeCatalogNameExtraReducers = createExtraReducers({
  thunk: changeCatalogName,
  fulfilledReducer: (state, { payload }) => {
    const { catalogList } = state;
    for (let i = 0; i < catalogList.length; i++) {
      if (catalogList[i]._id === payload._id) {
        catalogList[i].catalogName = payload.catalogName;
        break;
      }
    }
    state.catalogList = [...catalogList];
    state.currentCatalog = payload;
    state.isRenameCatalog = false;
  },
  rejectedReducer: state => {
    state.isRenameCatalog = false;
  },
});
//-------------------------------------------------------

const reducers = {
  changeBlockStatusInStore: (state, { payload }) => {
    const { messagesPreview } = state;
    messagesPreview.forEach(preview => {
      if (isEqual(preview.participants, payload.participants))
        preview.blackList = payload.blackList;
    });
    state.chatData = payload;
    state.messagesPreview = messagesPreview;
  },

  setUserId: (state, { payload }) => {
    state.userId = payload;
  },

  addMessage: (state, { payload }) => {
    const { message, preview } = payload;
    if (!message) return;

    const { messagesPreview, userId } = state;

    let isNew = true;

    const updatedPreviews = messagesPreview.map(p => {
      if (p.id === message.conversationId) {
        isNew = false;
        return {
          ...p,
          text: message.body,
          sender: message.senderId,
          createAt: message.createdAt,
          unreadCount:
            !message.isRead && message.senderId !== userId
              ? (p.unreadCount || 0) + 1
              : p.unreadCount || 0,
        };
      }
      return p;
    });

    if (isNew && preview) {
      const exists = updatedPreviews.some(
        p => p.interlocutor?.id === preview.interlocutor?.id
      );

      if (!exists && preview.interlocutor?.id !== userId) {
        updatedPreviews.push({
          ...preview,
          text: message.body,
          sender: message.senderId,
          createAt: message.createdAt,
          unreadCount: !message.isRead && message.senderId !== userId ? 1 : 0,
        });
      }
    }

    state.messagesPreview = [...updatedPreviews];
    state.messages.push(message);
  },

  backToDialogList: state => {
    state.isExpanded = false;
  },

  goToExpandedDialog: (state, { payload }) => {
    const { interlocutor, conversationData } = payload;

    if (interlocutor && interlocutor.id) {
      state.interlocutor = interlocutor;
    } else {
      state.interlocutor = interlocutor || null;
    }

    const { id, blacklist, favoriteList } = conversationData || {};

    state.chatData = {
      id: id || null,
      blacklist: typeof blacklist !== 'undefined' ? blacklist : false,
      favoriteList: typeof favoriteList !== 'undefined' ? favoriteList : false,
    };

    state.isShow = true;
    state.isExpanded = true;
    state.messages = [];
  },

  clearMessageList: state => {
    state.messages = [];
  },

  changeChatShow: state => {
    state.isShowCatalogCreation = false;
    state.isShow = !state.isShow;
  },

  setPreviewChatMode: (state, { payload }) => {
    state.chatMode = payload;
  },

  changeShowModeCatalog: (state, { payload }) => {
    state.currentCatalog = { ...state.currentCatalog, ...payload };
    state.isShowChatsInCatalog = !state.isShowChatsInCatalog;
    state.isRenameCatalog = false;
  },

  changeTypeOfChatAdding: (state, { payload }) => {
    state.catalogCreationMode = payload;
  },

  changeShowAddChatToCatalogMenu: (state, { payload }) => {
    state.addChatId = payload;
    state.isShowCatalogCreation = !state.isShowCatalogCreation;
  },

  changeRenameCatalogMode: state => {
    state.isRenameCatalog = !state.isRenameCatalog;
  },

  clearChatError: state => {
    state.error = null;
  },
};

const extraReducers = builder => {
  getPreviewChatExtraReducers(builder);
  getDialogMessagesExtraReducers(builder);
  sendMessageExtraReducers(builder);
  changeChatFavoriteExtraReducers(builder);
  changeChatBlockExtraReducers(builder);
  getCatalogListExtraReducers(builder);
  addChatToCatalogExtraReducers(builder);
  createCatalogExtraReducers(builder);
  deleteCatalogExtraReducers(builder);
  removeChatFromCatalogExtraReducers(builder);
  changeCatalogNameExtraReducers(builder);
};

const chatSlice = createSlice({
  name: CHAT_SLICE_NAME,
  initialState,
  reducers,
  extraReducers,
});

const { actions, reducer } = chatSlice;

export const {
  changeBlockStatusInStore,
  setUserId,
  addMessage,
  backToDialogList,
  goToExpandedDialog,
  clearMessageList,
  changeChatShow,
  setPreviewChatMode,
  changeShowModeCatalog,
  changeTypeOfChatAdding,
  changeShowAddChatToCatalogMenu,
  changeRenameCatalogMode,
  clearChatError,
} = actions;

export default reducer;

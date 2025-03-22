const Catalog = require('../models/mongoModels/Catalog');
const db = require('../models');
const controller = require('../socketInit');
const _ = require('lodash');
const {
  findOrCreateConversation,
  createMessage,
  getChatMessages,
  getInterlocutor,
  getUserConversationsWithPreview,
  findConversationById,
  updateConversation,
} = require('./queries/chatQueries');

module.exports.addMessage = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { recipient, messageBody } = req.body;

  try {
    const conversation = await findOrCreateConversation(userId, recipient);
    const message = await createMessage(conversation.id, userId, messageBody);

    const preview = {
      _id: conversation.id,
      sender: userId,
      text: messageBody,
      createAt: message.createdAt,
      participants: [userId, recipient],
      blacklist: conversation.blacklist,
      favoriteList: conversation.favoriteList,
    };

    controller.getChatController().emitNewMessage(message.conversationId, {
      message,
      preview: {
        ...preview,
        interlocutor: {
          id: userId,
          firstName: req.tokenData.firstName,
          lastName: req.tokenData.lastName,
          displayName: req.tokenData.displayName,
          avatar: req.tokenData.avatar,
          email: req.tokenData.email,
        },
      },
      interlocutorId: recipient,
    });

    res.send({
      message,
      preview: {
        ...preview,
        interlocutor: req.body.interlocutor,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getChat = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { interlocutorId } = req.body;

  try {
    let conversation = await findOrCreateConversation(userId, interlocutorId);

    const messages = await getChatMessages(conversation.id);

    const interlocutor = await getInterlocutor(interlocutorId);

    res.send({
      messages,
      interlocutor: interlocutor || null,
      conversationId: conversation.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getPreview = async (req, res, next) => {
  const { userId } = req.tokenData;

  try {
    const previews = await getUserConversationsWithPreview(userId);

    res.send(previews);
  } catch (error) {
    next(error);
  }
};

module.exports.blackList = async (req, res, next) => {
  const { conversation_id, blackListFlag } = req.body;

  try {
    const conversation = await findConversationById(conversation_id);

    if (!conversation) {
      return res.status(404).send({ message: 'Conversation not found' });
    }

    const updatedConversation = await updateConversation(conversation_id, {
      blacklist: blackListFlag,
    });

    res.send({ success: true, conversation: updatedConversation });
  } catch (error) {
    next(error);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  const { conversation_id, favoriteFlag } = req.body;
  const { userId } = req.tokenData;

  try {
    const conversation = await findConversationById(conversation_id, userId);

    if (!conversation) {
      return res.status(404).send({ message: 'Conversation not found' });
    }

    const updatedConversation = await updateConversation(conversation_id, {
      favoriteList: favoriteFlag,
    });

    res.send({ success: true, conversation: updatedConversation });
  } catch (error) {
    next(error);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  const catalog = new Catalog({
    userId: req.tokenData.userId,
    catalogName: req.body.catalogName,
    chats: [req.body.chatId],
  });
  try {
    await catalog.save();
    res.send(catalog);
  } catch (error) {
    next(error);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalog.findOneAndUpdate(
      {
        _id: req.body.catalogId,
        userId: req.tokenData.userId,
      },
      { catalogName: req.body.catalogName },
      { new: true }
    );
    res.send(catalog);
  } catch (error) {
    next(error);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalog.findOneAndUpdate(
      {
        _id: req.body.catalogId,
        userId: req.tokenData.userId,
      },
      { $addToSet: { chats: req.body.chatId } },
      { new: true }
    );
    res.send(catalog);
  } catch (error) {
    next(error);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalog.findOneAndUpdate(
      {
        _id: req.body.catalogId,
        userId: req.tokenData.userId,
      },
      { $pull: { chats: req.body.chatId } },
      { new: true }
    );
    res.send(catalog);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  try {
    await Catalog.remove({
      _id: req.body.catalogId,
      userId: req.tokenData.userId,
    });
    res.end();
  } catch (error) {
    next(error);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  try {
    const catalogs = await Catalog.aggregate([
      { $match: { userId: req.tokenData.userId } },
      {
        $project: {
          _id: 1,
          catalogName: 1,
          chats: 1,
        },
      },
    ]);
    res.send(catalogs);
  } catch (error) {
    next(error);
  }
};

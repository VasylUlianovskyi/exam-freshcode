const Catalog = require('../models/mongoModels/Catalog');
const db = require('../models');
const controller = require('../socketInit');
const _ = require('lodash');
const logger = require('../utils/logger');
const {
  findOrCreateConversation,
  createMessage,
  getChatMessages,
  getInterlocutor,
  getUserConversationsWithPreview,
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
    logger.err(
      `Failed to add message from user ${userId} to recipient ${recipient}`,
      500,
      error
    );
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
    logger.err(
      `Failed to retrieve chat for participants: ${userId}, ${interlocutorId}`,
      500,
      error
    );
    next(error);
  }
};

module.exports.getPreview = async (req, res, next) => {
  const { userId } = req.tokenData;

  try {
    const previews = await getUserConversationsWithPreview(userId);

    res.send(previews);
  } catch (error) {
    logger.err(`Failed to get preview for user ${userId}`, 500, error);
    next(error);
  }
};

module.exports.blackList = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { conversation_id, blackListFlag } = req.body;

  try {
    const conversation = await db.Conversations.findOne({
      where: { id: conversation_id },
    });

    if (!conversation) {
      return res.status(404).send({ message: 'Conversation not found' });
    }

    await db.Conversations.update(
      { blacklist: blackListFlag },
      { where: { id: conversation_id } }
    );

    const updatedConversation = await db.Conversations.findOne({
      where: { id: conversation_id },
    });

    res.send({ success: true, conversation: updatedConversation });
  } catch (error) {
    logger.err(' Error updating blacklist:', error);
    next(error);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { conversation_id, favoriteFlag } = req.body;

  try {
    const conversation = await db.Conversations.findOne({
      where: { id: conversation_id },
      include: [
        {
          model: db.ConversationParticipants,
          where: { userId },
        },
      ],
    });

    if (!conversation) {
      return res.status(404).send({ message: 'Conversation not found' });
    }

    await db.Conversations.update(
      { favoriteList: favoriteFlag },
      { where: { id: conversation_id } }
    );

    const updatedConversation = await db.Conversations.findOne({
      where: { id: conversation_id },
    });

    res.send({ success: true, conversation: updatedConversation });
  } catch (error) {
    logger.err(
      `Failed to update favorite chat for participants: ${conversation_id.join(
        ', '
      )}`,
      500,
      error
    );
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
    logger.err(
      `Failed to create catalog for user ${req.tokenData.userId} with name ${req.body.catalogName}`,
      500,
      err
    );
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
    logger.err(
      `Failed to update catalog name for catalog ID ${req.body.catalogId} by user ${req.tokenData.userId}`,
      500,
      err
    );
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
    logger.err(
      `Failed to add chat ${req.body.chatId} to catalog ${req.body.catalogId} for user ${req.tokenData.userId}`,
      500,
      err
    );
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
    logger.err(
      `Failed to remove chat ${req.body.chatId} from catalog ${req.body.catalogId} for user ${req.tokenData.userId}`,
      500,
      err
    );
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
    logger.err(
      `Failed to delete catalog ${req.body.catalogId} for user ${req.tokenData.userId}`,
      500,
      err
    );
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
    logger.err(
      `Failed to retrieve catalogs for user ID ${req.tokenData.userId}`,
      500,
      err
    );
    next(error);
  }
};

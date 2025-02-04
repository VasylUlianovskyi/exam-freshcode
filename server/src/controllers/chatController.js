const Catalog = require('../models/mongoModels/Catalog');
const db = require('../models');
const controller = require('../socketInit');
const _ = require('lodash');
const logger = require('../utils/logger');

module.exports.addMessage = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { recipient, messageBody } = req.body;

  const participants = [userId, recipient].sort((a, b) => a - b);

  try {
    let conversation = await db.Conversations.findOne({
      include: [
        {
          model: db.ConversationParticipants,
          where: {
            userId: participants,
          },
        },
      ],
    });

    if (!conversation) {
      conversation = await db.Conversations.create(
        {
          blacklist: false,
          favoriteList: false,
          ConversationParticipants: [{ userId: userId }, { userId: recipient }],
        },
        { include: [db.ConversationParticipants] }
      );
    } else {
      const existingParticipants = conversation.ConversationParticipants.map(
        p => p.userId
      );
      if (!existingParticipants.includes(recipient)) {
        await db.ConversationParticipants.create({
          conversationId: conversation.id,
          userId: recipient,
        });
      }
      if (!existingParticipants.includes(userId)) {
        await db.ConversationParticipants.create({
          conversationId: conversation.id,
          userId: userId,
        });
      }
    }

    const message = await db.Messages.create({
      senderId: userId,
      conversationId: conversation.id,
      body: messageBody,
    });

    const interlocutorId = participants.find(
      participant => participant !== userId
    );

    const preview = {
      _id: conversation.id,
      sender: userId,
      text: messageBody,
      createAt: message.createdAt,
      participants,
      blacklist: conversation.blacklist,
      favoriteList: conversation.favoriteList,
    };

    controller.getChatController().emitNewMessage(interlocutorId, {
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
    });

    res.send({
      message,
      preview: {
        ...preview,
        interlocutor: req.body.interlocutor,
      },
    });
  } catch (error) {
    logger.error(
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
    const conversation = await db.Conversations.findOne({
      include: [
        {
          model: db.ConversationParticipants,
          where: {
            userId: userId,
          },
        },
        {
          model: db.ConversationParticipants,
          where: {
            userId: interlocutorId,
          },
        },
      ],
    });

    if (!conversation) {
      return res.send({ messages: [], interlocutor: null });
    }

    const messages = await db.Messages.findAll({
      where: { conversationId: conversation.id },
      order: [['createdAt', 'ASC']],
      attributes: ['id', 'senderId', 'body', 'conversationId', 'createdAt'],
    });

    const interlocutor = await db.Users.findOne({
      where: { id: interlocutorId },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });

    res.send({
      messages,
      interlocutor: interlocutor || null,
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
    const conversations = await db.Conversations.findAll({
      include: [
        {
          model: db.ConversationParticipants,
          attributes: ['userId'],
        },
        {
          model: db.Messages,
          attributes: ['id', 'senderId', 'body', 'createdAt'],
          order: [['createdAt', 'DESC']],
          limit: 1,
        },
      ],
    });

    const interlocutorIds = conversations
      .map(convo => {
        const participantIds = convo.ConversationParticipants.map(
          p => p.userId
        );
        return participantIds.find(id => id !== userId);
      })
      .filter(id => id !== undefined);

    if (!interlocutorIds.length) {
      return res.send([]);
    }

    const interlocutors = await db.Users.findAll({
      where: { id: interlocutorIds },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });

    const previews = conversations.map(convo => {
      const lastMessage = convo.Messages[0] || {};
      const interlocutor = interlocutors.find(i =>
        convo.ConversationParticipants.some(p => p.userId === i.id)
      );

      return {
        id: convo.id,
        sender: lastMessage.senderId || null,
        text: lastMessage.body || '',
        createAt: lastMessage.createdAt || null,
        blacklist: convo.blacklist,
        favoriteList: convo.favoriteList,
        interlocutor,
      };
    });

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
      include: [{ model: db.ConversationParticipants }],
    });

    if (!conversation) {
      return res.status(404).send({ message: 'Conversation not found' });
    }

    await db.ConversationParticipants.update(
      { blacklist: blackListFlag },
      { where: { conversationId: conversation_id, userId } }
    );

    const updatedConversation = await db.Conversations.findOne({
      where: { id: conversation_id },
      include: [{ model: db.ConversationParticipants }],
    });

    console.log(' Updated Conversation:', updatedConversation);

    res.send({ success: true, conversation: updatedConversation });
  } catch (error) {
    logger.err(`Failed to update blacklist`, error);
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
  console.log(req.body);
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

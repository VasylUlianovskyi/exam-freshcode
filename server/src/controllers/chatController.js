const Conversation = require('../models/mongoModels/Conversation');
const Message = require('../models/mongoModels/Message');
const Catalog = require('../models/mongoModels/Catalog');
const db = require('../models');
const userQueries = require('./queries/userQueries');
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
      where: {
        id: participants,
      },
    });

    if (!conversation) {
      conversation = await db.Conversations.create(
        {
          blacklist: false,
          favoriteList: false,
          ConversationParticipants: participants.map(participant => ({
            userId: participant,
          })),
        },
        { include: [db.ConversationParticipants] }
      );
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
  const participants = [req.tokenData.userId, req.body.interlocutorId];
  participants.sort(
    (participant1, participant2) => participant1 - participant2
  );
  try {
    const messages = await Message.aggregate([
      {
        $lookup: {
          from: 'conversations',
          localField: 'conversation',
          foreignField: '_id',
          as: 'conversationData',
        },
      },
      { $match: { 'conversationData.participants': participants } },
      { $sort: { createdAt: 1 } },
      {
        $project: {
          _id: 1,
          sender: 1,
          body: 1,
          conversation: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    const interlocutor = await userQueries.findUser({
      id: req.body.interlocutorId,
    });
    res.send({
      messages,
      interlocutor: {
        firstName: interlocutor.firstName,
        lastName: interlocutor.lastName,
        displayName: interlocutor.displayName,
        id: interlocutor.id,
        avatar: interlocutor.avatar,
      },
    });
  } catch (error) {
    logger.error(
      `Failed to retrieve chat for participants: ${participants.join(', ')}`,
      500,
      err
    );
    next(error);
  }
};

module.exports.getPreview = async (req, res, next) => {
  try {
    const conversations = await Message.aggregate([
      {
        $lookup: {
          from: 'conversations',
          localField: 'conversation',
          foreignField: '_id',
          as: 'conversationData',
        },
      },
      {
        $unwind: '$conversationData',
      },
      {
        $match: {
          'conversationData.participants': req.tokenData.userId,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $group: {
          _id: '$conversationData._id',
          sender: { $first: '$sender' },
          text: { $first: '$body' },
          createAt: { $first: '$createdAt' },
          participants: { $first: '$conversationData.participants' },
          blackList: { $first: '$conversationData.blackList' },
          favoriteList: { $first: '$conversationData.favoriteList' },
        },
      },
    ]);
    const interlocutors = [];
    conversations.forEach(conversation => {
      interlocutors.push(
        conversation.participants.find(
          participant => participant !== req.tokenData.userId
        )
      );
    });
    const senders = await db.Users.findAll({
      where: {
        id: interlocutors,
      },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });
    conversations.forEach(conversation => {
      senders.forEach(sender => {
        if (conversation.participants.includes(sender.dataValues.id)) {
          conversation.interlocutor = {
            id: sender.dataValues.id,
            firstName: sender.dataValues.firstName,
            lastName: sender.dataValues.lastName,
            displayName: sender.dataValues.displayName,
            avatar: sender.dataValues.avatar,
          };
        }
      });
    });
    res.send(conversations);
  } catch (error) {
    logger.error(
      `Failed to get preview for user ${req.tokenData.userId}`,
      500,
      err
    );
    next(error);
  }
};

module.exports.blackList = async (req, res, next) => {
  const predicate =
    'blackList.' + req.body.participants.indexOf(req.tokenData.userId);
  try {
    const chat = await Conversation.findOneAndUpdate(
      { participants: req.body.participants },
      { $set: { [predicate]: req.body.blackListFlag } },
      { new: true }
    );
    res.send(chat);
    const interlocutorId = req.body.participants.filter(
      participant => participant !== req.tokenData.userId
    )[0];
    controller.getChatController().emitChangeBlockStatus(interlocutorId, chat);
  } catch (error) {
    logger.error(
      `Failed to update blacklist for conversation with participants: ${req.body.participants.join(
        ', '
      )}`,
      500,
      err
    );
    res.send(error);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  const predicate =
    'favoriteList.' + req.body.participants.indexOf(req.tokenData.userId);
  try {
    const chat = await Conversation.findOneAndUpdate(
      { participants: req.body.participants },
      { $set: { [predicate]: req.body.favoriteFlag } },
      { new: true }
    );
    res.send(chat);
  } catch (error) {
    logger.error(
      `Failed to update favorite chat for participants: ${req.body.participants.join(
        ', '
      )}`,
      500,
      err
    );
    res.send(error);
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
    logger.error(
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
    logger.error(
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
    logger.error(
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
    logger.error(
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
    logger.error(
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
    logger.error(
      `Failed to retrieve catalogs for user ID ${req.tokenData.userId}`,
      500,
      err
    );
    next(error);
  }
};

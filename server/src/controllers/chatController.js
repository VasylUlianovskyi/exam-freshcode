const moment = require('moment');
const db = require('../models');
const userQueries = require('./queries/userQueries');
const controller = require('../socketInit');
const _ = require('lodash');

module.exports.addMessage = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { recipient, messageBody } = req.body;

  try {
    const allConversations = await db.Conversations.findAll({
      include: [
        {
          model: db.ConversationParticipants,
          as: 'participants',
          where: { userId },
        },
      ],
    });

    let conversation = null;

    for (const convo of allConversations) {
      const participants = await convo.getParticipants();
      const participantIds = participants.map(p => p.userId);

      if (
        participantIds.length === 2 &&
        participantIds.includes(userId) &&
        participantIds.includes(recipient)
      ) {
        conversation = convo;
        conversation.participants = participants;
        break;
      }
    }

    if (!conversation) {
      const newConversation = await db.Conversations.create();

      await db.ConversationParticipants.bulkCreate([
        { userId, conversationId: newConversation.id },
        { userId: recipient, conversationId: newConversation.id },
      ]);

      const participants = await db.ConversationParticipants.findAll({
        where: { conversationId: newConversation.id },
      });

      conversation = newConversation;
      conversation.participants = participants;
    }

    const message = await db.Messages.create({
      senderId: userId,
      conversationId: conversation.id,
      body: messageBody,
      isRead: false,
    });

    const recipientData = await db.Users.findByPk(recipient, {
      attributes: [
        'id',
        'firstName',
        'lastName',
        'displayName',
        'avatar',
        'email',
      ],
    });

    const senderParticipant = conversation.participants.find(
      p => p.userId === userId
    );

    const preview = {
      id: conversation.id,
      sender: userId,
      text: message.body,
      createAt: message.createdAt,
      participants: conversation.participants.map(p => p.userId),
      blacklist: senderParticipant?.blacklist || false,
      favoriteList: senderParticipant?.favoriteList || false,
    };

    controller.getChatController().emitNewMessage(conversation.id, message, {
      ...preview,
      interlocutor: recipientData,
    });

    res.send({
      message,
      preview: {
        ...preview,
        interlocutor: recipientData,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getChat = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { interlocutorId } = req.body;

  try {
    const allConversations = await db.Conversations.findAll({
      include: [
        {
          model: db.ConversationParticipants,
          as: 'participants',
          where: { userId },
        },
      ],
    });

    let conversation = null;

    for (const convo of allConversations) {
      const participants = await convo.getParticipants();
      const participantIds = participants.map(p => p.userId);

      if (
        participantIds.length === 2 &&
        participantIds.includes(userId) &&
        participantIds.includes(interlocutorId)
      ) {
        conversation = convo;
        break;
      }
    }

    if (!conversation) {
      const newConversation = await db.Conversations.create();

      await db.ConversationParticipants.bulkCreate([
        { userId, conversationId: newConversation.id },
        { userId: interlocutorId, conversationId: newConversation.id },
      ]);

      conversation = newConversation;
    }

    const messages = await db.Messages.findAll({
      where: { conversationId: conversation.id },
      order: [['createdAt', 'ASC']],
    });

    const interlocutor = await db.Users.findByPk(interlocutorId, {
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });

    res.send({
      messages,
      interlocutor,
      conversationId: conversation.id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getPreview = async (req, res, next) => {
  const { userId } = req.tokenData;

  try {
    const conversations = await db.Conversations.findAll({
      include: [
        {
          model: db.ConversationParticipants,
          as: 'participants',
          required: true,
          attributes: ['userId', 'blacklist', 'favoriteList'],
        },
        {
          model: db.Messages,
          as: 'Messages',
          required: false,
          separate: true,
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    const validConversations = conversations.filter(convo => {
      const participantIds = convo.participants.map(p => p.userId);
      return participantIds.length === 2 && participantIds.includes(userId);
    });

    const previews = await Promise.all(
      validConversations.map(async convo => {
        const lastMessage = convo.Messages[0] || null;
        const participantIds = convo.participants.map(p => p.userId);
        const interlocutorId = participantIds.find(id => id !== userId);

        const interlocutor = await db.Users.findByPk(interlocutorId, {
          attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
        });

        const currentParticipant = convo.participants.find(
          p => p.userId === userId
        );

        return {
          id: convo.id,
          sender: lastMessage?.senderId || null,
          text: lastMessage?.body || '',
          createAt: lastMessage?.createdAt || null,
          participants: participantIds,
          blacklist: currentParticipant?.blacklist || false,
          favoriteList: currentParticipant?.favoriteList || false,
          interlocutor,
        };
      })
    );

    res.send(previews);
  } catch (err) {
    next(err);
  }
};

module.exports.blackList = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { interlocutorId, blacklistFlag, conversationId } = req.body;

  try {
    let conversation;
    if (conversationId) {
      conversation = await db.Conversations.findOne({
        where: { id: conversationId },
      });
    } else {
      const possibleConversations = await db.Conversations.findAll({
        include: [
          {
            model: db.ConversationParticipants,
            as: 'participants',
            where: { userId: [userId, interlocutorId] },
          },
        ],
      });

      conversation = possibleConversations.find(
        c => c.participants?.length === 2
      );
    }

    if (!conversation) {
      return res.status(404).send({ message: 'Conversation not found' });
    }

    const [updatedCount] = await db.ConversationParticipants.update(
      { blacklist: blacklistFlag },
      {
        where: {
          userId,
          conversationId: conversation.id,
        },
      }
    );

    if (updatedCount === 0) {
      return res
        .status(500)
        .send({ message: 'Failed to update blacklist status' });
    }

    const updatedParticipant = await db.ConversationParticipants.findOne({
      where: {
        userId,
        conversationId: conversation.id,
      },
    });

    res.send({ conversation: updatedParticipant });
  } catch (err) {
    console.error('Blacklist update error:', err);
    next(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { interlocutorId, favoriteFlag, conversationId } = req.body;

  try {
    let conversation;

    if (conversationId) {
      conversation = await db.Conversations.findOne({
        where: { id: conversationId },
        include: [
          {
            model: db.ConversationParticipants,
            as: 'participants',
            where: { userId: [userId, interlocutorId] },
          },
        ],
      });
    } else {
      conversation = await db.Conversations.findOne({
        include: [
          {
            model: db.ConversationParticipants,
            as: 'participants',
            where: { userId: [userId, interlocutorId] },
          },
        ],
        group: ['Conversations.id'],
        having: db.Sequelize.literal('COUNT(*) = 2'),
      });
    }

    if (!conversation) {
      return res.status(404).send({ message: 'Conversation not found' });
    }

    await db.ConversationParticipants.update(
      { favoriteList: favoriteFlag },
      {
        where: {
          userId,
          conversationId: conversation.id,
        },
      }
    );

    const updatedParticipant = await db.ConversationParticipants.findOne({
      where: {
        userId,
        conversationId: conversation.id,
      },
    });

    res.send({ conversation: updatedParticipant });
  } catch (err) {
    next(err);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  try {
    const catalog = await db.Catalogs.create({
      userId: req.tokenData.userId,
      catalogName: req.body.catalogName,
    });

    await db.CatalogConversations.create({
      catalogId: catalog.id,
      conversationId: req.body.chatId,
    });

    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  try {
    const updated = await db.Catalogs.update(
      { catalogName: req.body.catalogName },
      {
        where: {
          id: req.body.catalogId,
          userId: req.tokenData.userId,
        },
      }
    );
    res.send(updated);
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  try {
    await db.CatalogConversations.create({
      catalogId: req.body.catalogId,
      conversationId: req.body.chatId,
    });
    res.send({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  try {
    await db.CatalogConversations.destroy({
      where: {
        catalogId: req.body.catalogId,
        conversationId: req.body.chatId,
      },
    });
    res.send({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  try {
    await db.Catalogs.destroy({
      where: {
        id: req.body.catalogId,
        userId: req.tokenData.userId,
      },
    });
    res.end();
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  try {
    const catalogs = await db.Catalogs.findAll({
      where: {
        userId: req.tokenData.userId,
      },
      include: [
        {
          model: db.Conversations,
          through: {
            attributes: [],
          },
        },
      ],
    });

    res.send(catalogs);
  } catch (err) {
    next(err);
  }
};

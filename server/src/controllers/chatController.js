const db = require('../models');
const chatQueries = require('./queries/chatQueries');
const catalogQueries = require('./queries/catalogQueries');
const controller = require('../socketInit');

module.exports.addMessage = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { recipient, messageBody } = req.body;

  try {
    const conversation = await chatQueries.getOrCreateConversation(
      userId,
      recipient
    );

    const message = await db.Messages.create({
      senderId: userId,
      conversationId: conversation.id,
      body: messageBody,
      isRead: false,
    });

    const recipientData = await chatQueries.getUserPreview(recipient);

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
    const conversation = await chatQueries.getOrCreateConversation(
      userId,
      interlocutorId
    );

    await db.Messages.update(
      { isRead: true },
      {
        where: {
          conversationId: conversation.id,
          isRead: false,
          senderId: interlocutorId,
        },
      }
    );

    const messages = await db.Messages.findAll({
      where: { conversationId: conversation.id },
      order: [['createdAt', 'ASC']],
    });

    const interlocutor = await chatQueries.getUserPreview(interlocutorId);

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
        const interlocutor = await chatQueries.getUserPreview(interlocutorId);

        const currentParticipant = convo.participants.find(
          p => p.userId === userId
        );

        const unreadCount = await chatQueries.getUnreadMessageCount(
          convo.id,
          userId
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
          unreadCount,
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
    const conversation = conversationId
      ? await db.Conversations.findOne({ where: { id: conversationId } })
      : await chatQueries.getOrCreateConversation(userId, interlocutorId);

    if (!conversation) {
      return res.status(404).send({ message: 'Conversation not found' });
    }

    const updated = await chatQueries.updateParticipantFlag(
      userId,
      conversation.id,
      'blacklist',
      blacklistFlag
    );

    if (!updated) {
      return res
        .status(500)
        .send({ message: 'Failed to update blacklist status' });
    }

    res.send({ conversation: updated });
  } catch (err) {
    next(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { interlocutorId, favoriteFlag, conversationId } = req.body;

  try {
    const conversation = conversationId
      ? await db.Conversations.findOne({ where: { id: conversationId } })
      : await chatQueries.getOrCreateConversation(userId, interlocutorId);

    if (!conversation) {
      return res.status(404).send({ message: 'Conversation not found' });
    }

    const updated = await chatQueries.updateParticipantFlag(
      userId,
      conversation.id,
      'favoriteList',
      favoriteFlag
    );

    if (!updated) {
      return res
        .status(500)
        .send({ message: 'Failed to update favorite status' });
    }

    res.send({ conversation: updated });
  } catch (err) {
    next(err);
  }
};

//// CATALOGS CONTROLLER

module.exports.createCatalog = async (req, res, next) => {
  try {
    const { catalogName, chatId } = req.body;
    const { userId } = req.tokenData;

    const catalog = await catalogQueries.createCatalog(userId, catalogName);

    if (chatId) {
      try {
        await catalogQueries.addChatToCatalog(catalog.id, chatId);
      } catch (err) {
        return res.status(400).send({ message: err.message });
      }
    }

    res.status(201).send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  try {
    const { catalogId, catalogName } = req.body;
    const { userId } = req.tokenData;

    const updatedCatalog = await catalogQueries.updateCatalogName(
      userId,
      catalogId,
      catalogName
    );

    res.status(200).send(updatedCatalog);
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  try {
    const { catalogId, chatId } = req.body;

    if (!catalogId || !chatId) {
      return res.status(400).send({ message: 'Missing catalogId or chatId' });
    }

    const { alreadyExists, updatedCatalog, catalog } =
      await catalogQueries.addChatToCatalog(catalogId, chatId);

    if (alreadyExists) {
      return res.status(200).send({
        success: false,
        message: 'Chat already in catalog',
        catalogName: catalog.catalogName,
      });
    }

    res.send({
      success: true,
      id: updatedCatalog.id,
      catalogName: updatedCatalog.catalogName,
      Conversations: updatedCatalog.Conversations,
    });
  } catch (err) {
    if (
      err.message === 'Catalog not found' ||
      err.message === 'Chat not found'
    ) {
      return res.status(404).send({ message: err.message });
    }
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  try {
    const { catalogId, chatId } = req.body;

    const updatedCatalog = await catalogQueries.removeChatFromCatalog(
      catalogId,
      chatId
    );

    res.status(200).send({
      id: updatedCatalog.id,
      catalogName: updatedCatalog.catalogName,
      Conversations: updatedCatalog.Conversations,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  try {
    const { catalogId } = req.body;
    const { userId } = req.tokenData;

    if (!catalogId) {
      return res.status(400).send({ message: 'catalogId is required' });
    }

    const deletedCount = await catalogQueries.deleteCatalog(userId, catalogId);

    if (deletedCount === 0) {
      return res
        .status(404)
        .send({ message: 'Catalog not found or not yours' });
    }

    res.send({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  try {
    const { userId } = req.tokenData;

    const catalogs = await catalogQueries.getUserCatalogs(userId);

    res.send(catalogs);
  } catch (err) {
    next(err);
  }
};

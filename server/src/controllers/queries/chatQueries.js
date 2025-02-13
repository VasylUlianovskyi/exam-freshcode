const db = require('../../models/index');

const findOrCreateConversation = async (userId, recipient) => {
  const participants = [userId, recipient].sort((a, b) => a - b);

  let conversation = await db.Conversations.findOne({
    include: [
      {
        model: db.ConversationParticipants,
        where: { userId: participants },
      },
    ],
  });

  if (!conversation) {
    conversation = await db.Conversations.create(
      {
        blacklist: false,
        favoriteList: false,
        ConversationParticipants: participants.map(id => ({ userId: id })),
      },
      { include: [db.ConversationParticipants] }
    );
  }

  return conversation;
};

const createMessage = async (conversationId, senderId, body) => {
  return db.Messages.create({
    senderId,
    conversationId,
    body,
  });
};

const getChatMessages = async conversationId => {
  return db.Messages.findAll({
    where: { conversationId },
    order: [['createdAt', 'ASC']],
    attributes: ['id', 'senderId', 'body', 'conversationId', 'createdAt'],
  });
};

const getInterlocutor = async interlocutorId => {
  return db.Users.findOne({
    where: { id: interlocutorId },
    attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
  });
};

module.exports = {
  findOrCreateConversation,
  createMessage,
  getChatMessages,
  getInterlocutor,
};

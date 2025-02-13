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

const getUserConversationsWithPreview = async userId => {
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

  const filteredConversations = conversations.filter(convo =>
    convo.ConversationParticipants.some(p => p.userId === userId)
  );

  const interlocutorIds = filteredConversations
    .map(convo => {
      const participantIds = convo.ConversationParticipants.map(p => p.userId);
      return participantIds.find(id => id !== userId);
    })
    .filter(id => id !== undefined);

  if (!interlocutorIds.length) return [];

  const interlocutors = await db.Users.findAll({
    where: { id: interlocutorIds },
    attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
  });

  return filteredConversations.map(convo => {
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
};

const findConversationById = async conversationId => {
  return db.Conversations.findOne({
    where: { id: conversationId },
  });
};

const updateConversation = async (conversationId, updateData) => {
  await db.Conversations.update(updateData, { where: { id: conversationId } });

  return findConversationById(conversationId);
};

module.exports = {
  findOrCreateConversation,
  createMessage,
  getChatMessages,
  getInterlocutor,
  getUserConversationsWithPreview,
  findConversationById,
  updateConversation,
};

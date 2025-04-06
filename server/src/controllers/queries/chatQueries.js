// chatQueries.js
const db = require('../../models');
const { Op, Sequelize } = db.Sequelize;

module.exports = {
  async getUserConversations (userId) {
    return await db.Conversations.findAll({
      include: [
        {
          model: db.ConversationParticipants,
          as: 'participants',
          where: { userId },
        },
      ],
    });
  },

  async getParticipants (conversation) {
    return await conversation.getParticipants();
  },

  async getOrCreateConversation (userId, otherUserId) {
    const allConversations = await this.getUserConversations(userId);

    for (const convo of allConversations) {
      const participants = await this.getParticipants(convo);
      const ids = participants.map(p => p.userId);

      if (
        ids.length === 2 &&
        ids.includes(userId) &&
        ids.includes(otherUserId)
      ) {
        convo.participants = participants;
        return convo;
      }
    }

    const newConversation = await db.Conversations.create();
    await db.ConversationParticipants.bulkCreate([
      { userId, conversationId: newConversation.id },
      { userId: otherUserId, conversationId: newConversation.id },
    ]);

    newConversation.participants = await db.ConversationParticipants.findAll({
      where: { conversationId: newConversation.id },
    });

    return newConversation;
  },

  async getUserPreview (userId) {
    return await db.Users.findByPk(userId, {
      attributes: [
        'id',
        'firstName',
        'lastName',
        'displayName',
        'avatar',
        'email',
      ],
    });
  },

  async getLastMessage (conversationId) {
    const messages = await db.Messages.findAll({
      where: { conversationId },
      limit: 1,
      order: [['createdAt', 'DESC']],
    });
    return messages[0] || null;
  },

  async getUnreadMessageCount (conversationId, userId) {
    return await db.Messages.count({
      where: {
        conversationId,
        senderId: { [Op.ne]: userId },
        isRead: false,
      },
    });
  },

  async updateParticipantFlag (userId, conversationId, field, value) {
    const [updated] = await db.ConversationParticipants.update(
      { [field]: value },
      {
        where: {
          userId,
          conversationId,
        },
      }
    );
    if (!updated) return null;

    return await db.ConversationParticipants.findOne({
      where: {
        userId,
        conversationId,
      },
    });
  },
};

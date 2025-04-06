const db = require('../../models');

module.exports = {
  async createCatalog (userId, catalogName) {
    return await db.Catalogs.create({ userId, catalogName });
  },

  async addChatToCatalog (catalogId, chatId) {
    const catalog = await db.Catalogs.findByPk(catalogId, {
      include: [
        {
          model: db.Conversations,
          through: { attributes: [] },
        },
      ],
    });

    if (!catalog) throw new Error('Catalog not found');

    const conversation = await db.Conversations.findByPk(chatId);
    if (!conversation) throw new Error('Chat not found');

    const existing = await db.CatalogConversations.findOne({
      where: { catalogId, conversationId: chatId },
    });

    if (existing) return { alreadyExists: true, catalog };

    await db.CatalogConversations.create({
      catalogId,
      conversationId: chatId,
    });

    const updatedCatalog = await db.Catalogs.findByPk(catalogId, {
      include: [
        {
          model: db.Conversations,
          through: { attributes: [] },
        },
      ],
    });

    return { updatedCatalog, alreadyExists: false };
  },

  async removeChatFromCatalog (catalogId, chatId) {
    await db.CatalogConversations.destroy({
      where: { catalogId, conversationId: chatId },
    });

    return await db.Catalogs.findByPk(catalogId, {
      include: [
        {
          model: db.Conversations,
          through: { attributes: [] },
        },
      ],
    });
  },

  async updateCatalogName (userId, catalogId, catalogName) {
    await db.Catalogs.update(
      { catalogName },
      {
        where: { id: catalogId, userId },
      }
    );

    return await db.Catalogs.findByPk(catalogId, {
      include: [
        {
          model: db.Conversations,
          through: { attributes: [] },
        },
      ],
    });
  },

  async deleteCatalog (userId, catalogId) {
    return await db.Catalogs.destroy({
      where: { id: catalogId, userId },
    });
  },

  async getUserCatalogs (userId) {
    return await db.Catalogs.findAll({
      where: { userId },
      include: [
        {
          model: db.Conversations,
          through: { attributes: [] },
        },
      ],
    });
  },
};

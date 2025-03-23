const db = require('../models');
const ServerError = require('../errors/ServerError');
const { handleOfferApproval } = require('./queries/offerQueries');

module.exports.getAllOffers = async (req, res, next) => {
  try {
    const { limit = 10, offset = 0, isApproved } = req.query;

    const where = {};
    if (isApproved !== undefined) {
      where.isApproved =
        isApproved === 'true' ? true : isApproved === 'false' ? false : null;
    }

    const { count, rows: offers } = await db.Offers.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['id', 'DESC']],
      include: [
        {
          model: db.Contests,
          as: 'Contest',
          attributes: ['title', 'typeOfName', 'industry'],
        },
      ],
    });

    res.status(200).json({
      total: count,
      offers: offers || [],
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getPendingOffers = async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const { count, rows: offers } = await db.Offers.findAndCountAll({
      where: { isApproved: null },
      include: [
        {
          model: db.Contests,
          attributes: ['title', 'typeOfName', 'industry'],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'DESC']],
    });

    res.status(200).json({
      total: count,
      offers,
    });
  } catch (err) {
    next(new ServerError(err));
  }
};

module.exports.approveOffer = (req, res, next) => {
  handleOfferApproval(req, res, next, true);
};

module.exports.rejectOffer = (req, res, next) => {
  handleOfferApproval(req, res, next, false);
};

module.exports.getApprovedOffers = async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const { count, rows: offers } = await db.Offers.findAndCountAll({
      where: { isApproved: true },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'DESC']],
    });

    res.status(200).json({
      total: count,
      offers,
    });
  } catch (err) {
    next(new ServerError(err));
  }
};

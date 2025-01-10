const db = require('../models');
const emailService = require('./../utils/emailService');
const ServerError = require('../errors/ServerError');

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
    });

    console.log('Fetched offers:', offers);

    res.status(200).json({
      total: count,
      offers: offers || [],
    });
  } catch (error) {
    console.error('Error in getAllOffers:', error);
    next(error);
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
  } catch (error) {
    console.error('Error in getPendingOffers:', error);
    next(new ServerError(error));
  }
};

module.exports.approveOffer = async (req, res, next) => {
  try {
    const { offerId } = req.params;

    const updatedOffer = await db.Offers.update(
      { isApproved: true },
      {
        where: { id: offerId },
        returning: true,
      }
    );

    if (!updatedOffer[0]) {
      return next(new ServerError('Failed to approve offer.'));
    }

    const offer = updatedOffer[1][0];

    const creative = await db.Users.findOne({ where: { id: offer.userId } });

    if (!creative) {
      return next(
        new ServerError(
          'Failed to find the Creative associated with the offer.'
        )
      );
    }

    await emailService.sendEmail(
      creative.email,
      'Your offer has been approved',
      `Hello ${creative.firstName},\n\nYour offer "${offer.text}" has been approved by the moderator.\n\nBest regards,\nSquadhelp team`
    );

    res.status(200).json({
      message: 'Offer approved successfully and email sent.',
      offer: offer,
    });
  } catch (error) {
    console.error('Error in approveOffer:', error);
    next(new ServerError(error));
  }
};

module.exports.rejectOffer = async (req, res, next) => {
  try {
    const { offerId } = req.params;

    const updatedOffer = await db.Offers.update(
      { isApproved: false },
      {
        where: { id: offerId },
        returning: true,
      }
    );

    if (!updatedOffer[0]) {
      return next(new ServerError('Failed to reject offer.'));
    }

    const offer = updatedOffer[1][0];

    const creative = await db.Users.findOne({ where: { id: offer.userId } });

    if (!creative) {
      return next(
        new ServerError(
          'Failed to find the Creative associated with the offer.'
        )
      );
    }

    await emailService.sendEmail(
      creative.email,
      'Your offer has been rejected',
      `Hello ${creative.firstName},\n\nUnfortunately, your offer "${offer.text}" has been rejected by the moderator for violating company policy.\n\nBest regards,\nSquadhelp team`
    );

    res.status(200).json({
      message: 'Offer rejected successfully and email sent.',
      offer: offer,
    });
  } catch (error) {
    console.error('Error in rejectOffer:', error);
    next(new ServerError(error));
  }
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
  } catch (error) {
    console.error('Error in getApprovedOffers:', error);
    next(new ServerError(error));
  }
};

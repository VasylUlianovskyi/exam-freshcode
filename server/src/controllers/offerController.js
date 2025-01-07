const db = require('../models');
const ServerError = require('../errors/ServerError');

module.exports.getAllOffers = async (req, res, next) => {
  try {
    const offers = await db.Offers.findAll();
    console.log(offers);
    res.status(200).json(offers);
  } catch (error) {
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

    res.status(200).json({
      message: 'Offer approved successfully.',
      offer: updatedOffer[1][0],
    });
  } catch (error) {
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

    res.status(200).json({
      message: 'Offer rejected successfully.',
      offer: updatedOffer[1][0],
    });
  } catch (error) {
    next(new ServerError(error));
  }
};

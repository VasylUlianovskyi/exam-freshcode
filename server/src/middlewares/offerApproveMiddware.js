const db = require('../models');
const ServerError = require('../errors/ServerError');
const RightsError = require('../errors/RightsError');
const CONSTANTS = require('../constants');

module.exports.checkOfferApproval = async (req, res, next) => {
  try {
    const offer = await db.Offers.findOne({
      where: { id: req.params.offerId },
    });

    if (!offer) {
      return next(new RightsError('Offer not found'));
    }

    if (req.tokenData.role === CONSTANTS.MODERATOR) {
      if (offer.isApproved !== null) {
        return next(new RightsError('Offer has already been reviewed.'));
      }
      next();
    } else if (req.tokenData.role === CONSTANTS.CREATOR) {
      if (offer.isApproved === false) {
        return res
          .status(403)
          .json({ message: 'Your offer has been rejected.' });
      }
      next();
    } else if (req.tokenData.role === CONSTANTS.CUSTOMER) {
      if (offer.isApproved !== true) {
        return next(new RightsError('You can view only approved offers.'));
      }
      next();
    } else {
      return next(new RightsError('Access denied.'));
    }
  } catch (error) {
    next(new ServerError(error));
  }
};

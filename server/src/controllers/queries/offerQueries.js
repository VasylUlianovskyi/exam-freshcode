const db = require('../../models');
const emailService = require('../../utils/emailService');
const ServerError = require('../../errors/ServerError');
const handleOfferApproval = async (req, res, next, isApproved) => {
  try {
    const { offerId } = req.params;

    const updatedOffer = await db.Offers.update(
      { isApproved },
      {
        where: { id: offerId },
        returning: true,
      }
    );

    if (!updatedOffer[0]) {
      return next(
        new ServerError(`Failed to ${isApproved ? 'approve' : 'reject'} offer.`)
      );
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

    const subject = isApproved
      ? 'Your offer has been approved'
      : 'Your offer has been rejected';

    const message = isApproved
      ? `Hello ${creative.firstName},\n\nYour offer "${offer.text}" has been approved by the moderator.\n\nBest regards,\nSquadhelp team`
      : `Hello ${creative.firstName},\n\nUnfortunately, your offer "${offer.text}" has been rejected by the moderator for violating company policy.\n\nBest regards,\nSquadhelp team`;

    await emailService.sendEmail(creative.email, subject, message);

    res.status(200).json({
      message: `Offer ${
        isApproved ? 'approved' : 'rejected'
      } successfully and email sent.`,
      offer: offer,
    });
  } catch (err) {
    next(new ServerError(err));
  }
};

module.exports = {
  handleOfferApproval,
};

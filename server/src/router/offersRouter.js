const express = require('express');
const checkToken = require('../middlewares/checkToken');
const offerApproveMiddleware = require('../middlewares/offerApproveMiddware');
const offerController = require('../controllers/offerController');

const router = express.Router();

router.get('/offers', checkToken.checkToken, offerController.getAllOffers);

router.get(
  '/offers/pending',
  checkToken.checkToken,
  offerController.getPendingOffers
);

router.patch(
  '/offers/:offerId/approve',
  checkToken.checkToken,
  offerApproveMiddleware.checkOfferApproval,
  offerController.approveOffer
);

router.patch(
  '/offers/:offerId/reject',
  checkToken.checkToken,
  offerApproveMiddleware.checkOfferApproval,
  offerController.rejectOffer
);

router.get(
  '/offers/creative-offers',
  checkToken.checkToken,
  offerController.getCreativeOffers
);

router.get(
  '/offers/approved',
  checkToken.checkToken,
  offerController.getApprovedOffers
);
module.exports = router;

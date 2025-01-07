const express = require('express');
const checkToken = require('../middlewares/checkToken');
const chatController = require('../controllers/chatController');
const router = express.Router();

router.post('/newMessage', checkToken.checkToken, chatController.addMessage);

router.post('/getChat', checkToken.checkToken, chatController.getChat);

router.post('/getPreview', checkToken.checkToken, chatController.getPreview);

router.post('/blackList', checkToken.checkToken, chatController.blackList);

router.post('/favorite', checkToken.checkToken, chatController.favoriteChat);

router.post(
  '/createCatalog',
  checkToken.checkToken,
  chatController.createCatalog
);

router.post(
  '/updateNameCatalog',
  checkToken.checkToken,
  chatController.updateNameCatalog
);

router.post(
  '/addNewChatToCatalog',
  checkToken.checkToken,
  chatController.addNewChatToCatalog
);

router.post(
  '/removeChatFromCatalog',
  checkToken.checkToken,
  chatController.removeChatFromCatalog
);

router.post(
  '/deleteCatalog',
  checkToken.checkToken,
  chatController.deleteCatalog
);

router.post('/getCatalogs', checkToken.checkToken, chatController.getCatalogs);

module.exports = router;

const express = require('express');
const checkToken = require('../middlewares/checkToken');
const usersRouter = require('./usersRouter');
const contestsRouter = require('./contestsRouter');
const offersRouter = require('./offersRouter');
const chatRouter = require('./chatRouter');
const router = express.Router();

router.use(usersRouter);
router.use(contestsRouter);
router.use(offersRouter);
router.use(chatRouter);

router.post('/getUser', checkToken.checkAuth);
module.exports = router;

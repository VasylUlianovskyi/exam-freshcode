const express = require('express');
const usersRouter = require('./usersRouter');
const contestsRouter = require('./contestsRouter');
const offersRouter = require('./offersRouter');
const chatRouter = require('./chatRouter');
const router = express.Router();

router.use(usersRouter);
router.use(contestsRouter);
router.use(offersRouter);
router.use(chatRouter);

module.exports = router;

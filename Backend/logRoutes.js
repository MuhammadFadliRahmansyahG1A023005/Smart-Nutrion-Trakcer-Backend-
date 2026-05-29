const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, logController.getLogsByDate);
router.post('/', authMiddleware, logController.createLog);
router.delete('/:id', authMiddleware, logController.deleteLog);
router.get('/history', authMiddleware, logController.getHistory);

module.exports = router;

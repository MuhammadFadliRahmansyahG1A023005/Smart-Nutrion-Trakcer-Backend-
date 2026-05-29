const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, foodController.searchFoods);
router.get('/:code', authMiddleware, foodController.getFoodByCode);

module.exports = router;

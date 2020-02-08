const express = require('express');
const CategoryController = require('../controllers/CategoryController');

const router = express.Router();


router.get("/", CategoryController.categoryList);

module.exports = router;

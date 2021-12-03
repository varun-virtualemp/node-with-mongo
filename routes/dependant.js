const express = require('express');
const router = express.Router();

const dependantDataController = require('../controllers/dependantData');

router.get('/',dependantDataController.welcome);
router.get('/buildData',dependantDataController.buildData);

module.exports = router;
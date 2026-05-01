const express = require('express');
const router = express.Router();
const { getMosqueLocations } = require('../controllers/locationController');

router.get('/', getMosqueLocations);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getPincodeDetails, reverseGeocode } = require('../controllers/locationController');

router.get('/pincode/:pincode', getPincodeDetails);
router.post('/reverse-geocode', reverseGeocode);
router.get('/reverse-geocode', reverseGeocode);

module.exports = router;

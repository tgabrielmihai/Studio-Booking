const express = require('express');
const router = express.Router();
const { getGear, addGear } = require('../controllers/gearController');


router.get('/', getGear);

router.post('/', addGear);

module.exports = router;
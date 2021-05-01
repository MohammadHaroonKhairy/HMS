
const express = require('express');

const home_page_controler = require('../controllers/home_page');

const router = express.Router();

router.get('/',home_page_controler.getIndex)


module.exports = router;
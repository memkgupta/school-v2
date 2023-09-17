const express = require('express');
const auth = require('../middlewares/auth');
const { getData } = require('../controllers/adminController');

const router = express.Router();
router.route('/').get(auth,getData)
module.exports=router
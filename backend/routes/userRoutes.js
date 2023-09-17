const express = require('express');
const userController = require('../controllers/userController');
const isAuthenticated = require('../middlewares/auth');
const router = express.Router();

router.post('/register',userController.registerUser);
router.post('/login',userController.login);
router.route('/me').get(isAuthenticated,userController.me)
module.exports = router;
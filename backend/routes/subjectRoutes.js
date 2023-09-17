const express = require('express');
const isAuthenticated = require('../middlewares/auth');
const subjectController = require('../controllers/subjectController');
const router = express.Router();

router.route('/add').post(isAuthenticated,subjectController.addSubject);
router.route('/all').get(isAuthenticated,subjectController.getAllSubjects);
router.route('/get/:sid').get(isAuthenticated,subjectController.getSubject).put(isAuthenticated,subjectController.changeTeacher).delete(isAuthenticated,subjectController.removeSubject);
module.exports = router
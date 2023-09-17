const express = require('express');
const isAuthenticated = require('../middlewares/auth');
const classController = require('../controllers/classController');
const router = express.Router();
router.route('/add').post(isAuthenticated,classController.addClass);
router.route('/subjects/add/:cid').post(isAuthenticated,classController.addSubjects);
router.route('/subjects/update/:sid').put(isAuthenticated,classController.updateSubject);
router.route('/students/:cid').get(isAuthenticated,classController.getStudents);
router.route('/get/:cid').put(isAuthenticated,classController.updateClassTeacher).get(isAuthenticated,classController.getClass);
router.route('/').get(isAuthenticated,classController.getClasses)
router.route('/attendance/:cid').get(isAuthenticated,classController.getAttendance);
module.exports=router;
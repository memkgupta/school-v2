const express = require('express');
const teacherController = require('../controllers/teacherController');
const router = express.Router();
const isAuthenticated = require('../middlewares/auth');
const singleUpload = require('../middlewares/multer');
router.route('/manage/data').get(isAuthenticated,teacherController.teacherPanel)
router.route('/add').post(singleUpload,isAuthenticated,teacherController.addTeacher);
router.route('/addClass/:tid').post(isAuthenticated,teacherController.addClassSubjects);
router.route('/:tid').put(singleUpload,isAuthenticated,teacherController.updateTeacher).delete(isAuthenticated,teacherController.removeTeacher).get(isAuthenticated,teacherController.getTeacher);
router.route('/attendance/:cid').post(isAuthenticated,teacherController.markAttendance).get(isAuthenticated,teacherController.generateAttendanceReport);
router.route('/submit-report/:eid').post(isAuthenticated,teacherController.submitReport);
router.route('/').get(isAuthenticated,teacherController.getTeachers)
router.route('/replace/replace-teachers').put(isAuthenticated,teacherController.replaceTeachers);
module.exports=router;

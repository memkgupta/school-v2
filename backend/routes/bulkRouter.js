const express = require('express');
const auth = require('../middlewares/auth');
const { addClasses,  addStudents, addAttendance, addTeachers } = require('../controllers/bulkController');
const singleUpload = require('../middlewares/multer');

const router = express.Router();

router.route('/class').post(auth,singleUpload,addClasses);
router.route('/teacher').post(auth,singleUpload,addTeachers);
router.route('/student').post(auth,singleUpload,addStudents);
router.route('/attendance/:cid').post(auth,singleUpload,addAttendance);

module.exports = router;
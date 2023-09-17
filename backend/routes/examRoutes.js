const express = require('express');
const isAuthenticated = require('../middlewares/auth');
const { addExam, getExamDetails, getExams, changeSubjectDate, getStudentReportCard, getAllStudentReport } = require('../controllers/examController');
const router = express.Router();

router.route('/add').post(isAuthenticated,addExam);
router.route('/:eid').get(isAuthenticated,getExamDetails);
router.route('/exams/getAll').get(isAuthenticated,getExams);
router.route('/change-subject-date/:eid').put(isAuthenticated,changeSubjectDate);
router.route('/student-report/:eid').get(isAuthenticated,getStudentReportCard);
router.route('/all-student-report/:eid').get(isAuthenticated,getAllStudentReport)
module.exports = router;
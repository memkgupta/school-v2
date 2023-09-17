const express = require('express');
const isAuthenticated = require('../middlewares/auth');
const studentController = require('../controllers/studentController');
const singleUpload = require('../middlewares/multer');
const { submitFee } = require('../controllers/feeController');
const { sendSingleMessage } = require('../middlewares/message');
const pool = require('../config/db');
const router = express.Router();

router.route('/add').post(singleUpload,isAuthenticated,studentController.addStudent);
router.route('/all').get(isAuthenticated,studentController.getStudents);
router.route('/:sid').put(singleUpload,isAuthenticated,studentController.updateStudent).get(isAuthenticated,studentController.getStudent);
router.route('/fee/submit/:sid').post(isAuthenticated,submitFee)
router.route('/message/').post(isAuthenticated,async(req,res)=>{
    console.log(req.body)
   try {
   await sendSingleMessage(req.body.message,req.body.phone,req,res)
   } catch (error) {
    console.log(error);
   }
  
})
module.exports=router;
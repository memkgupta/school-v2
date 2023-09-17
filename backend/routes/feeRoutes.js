const express = require('express');
const { addFeeStructure, updateFeeStructure, getFeePayments, getFeeStructures, getAllFeePayments } = require('../controllers/feeController');
const isAuthenticated = require('../middlewares/auth');
const router = express.Router();

router.route('/add-fee-structure').post(isAuthenticated,addFeeStructure);
router.route('/update-fee-structure/:cid').put(isAuthenticated,updateFeeStructure);
router.route('/get-fee-payments/:sid').get(isAuthenticated,getFeePayments);
router.route(`/get-fee-structures`).get(isAuthenticated,getFeeStructures);
router.route(`/get-fee-payments`).get(isAuthenticated,getAllFeePayments);
module.exports = router;
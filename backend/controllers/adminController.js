const pool = require("../config/db");
const errorHandler = require("../middlewares/error");
const ErrorHandler = require("../utils/ErrorHandler");
const adminQueries = require("../queries/adminQueries");
const getData = async (req, res, next) => {
  if (req.user.role === "Admin") {

  

  
  
  
  
  
    const total_fee_payments = (
      await pool.query(adminQueries.TOTAL_FEE_PAYMENTS)
    ).rows[0];
    const total_classes = (await pool.query(adminQueries.TOTAL_CLASSES))
      .rows[0];
    const total_students = (await pool.query(adminQueries.TOTAL_STUDENTS))
      .rows[0];
    const total_teachers = (await pool.query(adminQueries.TOTAL_TEACHERS))
      .rows[0];
    const fee_stats_classwise = (
      await pool.query(adminQueries.FEE_STATS_CLASSWISE)
    ).rows;
    const fee_stats_monthly = (await pool.query(adminQueries.FEE_STATS_MONTHLY))
      .rows;
    const fee_pending = (await pool.query(adminQueries.FEE_PENDING_CLASSWISE))
      .rows;
    const student_classwise = (
      await pool.query(adminQueries.STUDENTS_CLASS_WISE)
    ).rows;
    res
      .status(200)
      .json({
        success: true,
        data: {
          total_fee_payments,
          total_classes,
          total_students,
          total_teachers,
          fee_pending,
          fee_stats_classwise,
          fee_stats_monthly,
          student_classwise,
        },
      });
  } else {
    return next(
      errorHandler(new ErrorHandler("You are Not Authorized", 401), req, res)
    );
  }
};
module.exports = { getData };

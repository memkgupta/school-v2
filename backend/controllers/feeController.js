const format = require("pg-format");
const pool = require("../config/db");
const errorHandler = require("../middlewares/error");
const ErrorHandler = require("../utils/ErrorHandler");
const generateInvoice = require("../middlewares/invoice");
const { sendSingleMessage } = require("../middlewares/message");

const submitFee = async (req, res, next) => {
  if (req.user.role !== "Admin") {
    return next(
      errorHandler(new ErrorHandler("You are not authorized", 401), req, res)
    );
  }
  function getShortMonthNames(monthNumbers) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const shortMonthNames = [];

    for (const monthNumber of monthNumbers) {
      if (monthNumber >= 1 && monthNumber <= 12) {
        shortMonthNames.push(months[monthNumber - 1]);
      } else {
        shortMonthNames.push("Invalid Month");
      }
    }

    return shortMonthNames;
  }

  const student_id = req.params.sid;
  const { class_id, feeData, date } = req.body;
  const invoice_count = (
    await pool.query(`SELECT id FROM fee_payments ORDER BY id DESC LIMIT 1`)
  ).rows[0].id;
  const amount = (
    await pool.query(
      `SELECT monthly_amount FROM fee_structures WHERE class_id = ${class_id}`
    )
  ).rows[0].monthly_amount;

  const sql_query = `INSERT INTO fee_payments (amount,month,student_id) VALUES %L RETURNING *`;
  pool
    .query(
      format(
        sql_query,
        feeData.map((month) => [amount, month, student_id])
      )
    )

    .then(async (result) => {
      try {
        const update_student = await pool.query(`
    UPDATE students AS s
    SET due_fee =CASE WHEN  s.due_fee > 0 THEN s.due_fee - ${amount}*${feeData.length} ELSE s.due_fee END
    WHERE s.student_id = ${student_id}
    RETURNING *
    `);
        console.log(amount * feeData.length);
        const student_data = update_student.rows[0];
        generateInvoice(
          {
            student: {
              name: student_data.first_name + " " + student_data.last_name,
              admission_no: student_data.admission_no,
              phone: student_data.phone,
            },
            months: getShortMonthNames(feeData),
            total: amount * feeData.length,
            invoice_nr: invoice_count + 1,
          },
          `./invoices/invoice-${invoice_count + 1}.pdf`
        );

        try {
          await pool.query(
            `UPDATE fee_payments  SET invoice =' http://localhost:3000/invoice/invoice-${
              invoice_count + 1
            }.pdf' WHERE student_id = ${student_id}`
          );
          sendSingleMessage(
            "Your fee payment Reciept \n" +
              `http://localhost:3000/invoice/invoice-${invoice_count + 1}.pdf`,
            "+919358288484"
          ).then(()=>{
            res
            .status(200)
            .json({
              success: true,
              message: "Fee Paid SuccessFully",
              payments: result.rows,
            });
          });
        } catch (error) {
          console.log(error.message);
        }
      } catch (error) {
        console.log(error);
      }

    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err.message });
    });
};
const addFeeStructure = async (req, res, next) => {
  if (req.user.role !== "Admin") {
    return next(
      errorHandler(new ErrorHandler("You are not authorized", 401), req, res)
    );
  }
  else{
    const { class_id, monthly_amount, total_amount } = req.body;
    const sql_query = `INSERT INTO fee_structures (monthly_amount,total_amount,class_id) VALUES(${monthly_amount},${total_amount},${class_id}) RETURNING *`;
    console.log(sql_query);
    let classPresent;
    try {
      classPresent = (await pool.query(`SELECT * FROM fee_structures WHERE class_id = ${class_id}`)).rowCount>0;
    } catch (error) {
      
    }
    if(classPresent){
      res.status(200).json({success:false,message:"Fee Structure For the class exist"})
    }
    else{
      pool
      .query(sql_query)
      .then((result) => {
        res
          .status(200)
          .json({
            success: true,
            message: "Fee Structure Added SuccessFully",
            structure: result.rows[0],
          });
      })
      .catch((err) => {
        return next(errorHandler(new ErrorHandler(err.message, 500), req, res));
      });
    }
  
  }

};

const updateFeeStructure = async (req, res, next) => {
  if (req.user.role !== "Admin") {
    return next(
      errorHandler(new ErrorHandler("You are not authorized", 401), req, res)
    );
  }
  const class_id = req.params.cid;
  const { monthly_amount, total_amount } = req.body;
  const query_params = [];
  if (monthly_amount) {
    query_params.push(`monthly_amount = ${monthly_amount}`);
  }
  if (total_amount) {
    query_params.push(`total_amount = ${total_amount}`);
  }

  const sql_query = `UPDATE fee_structures SET ${query_params.join(
    " , "
  )} WHERE class_id = ${class_id} RETURNING *`;
  pool
    .query(sql_query)
    .then((result) => {
      res.status(200).json({ success: true, fee_structure: result.rows[0] });
    })
    .catch((err) => {
      return next(errorHandler(new ErrorHandler(err.message, 500), req, res));
    });
};
const getFeePayments = async (req, res, next) => {
  if (req.user.role !== "Admin") {
    return next(
      errorHandler(new ErrorHandler("You are not authorized", 401), req, res)
    );
  }
  const { from, to } = req.query;

  pool
    .query(
      `SELECT * FROM fee_payments WHERE student_id = ${req.params.sid} ${
        !from && `AND EXTRACT(YEAR FROM date)<=EXTRACT(YEAR FROM NOW())`
      } ${from ? `AND date>=${from}` : ""} ${
        to ? `${from ? "AND" : ""} date<=${to}` : ``
      }`
    )
    .then((result) => {
      res.status(200).json({ success: true, payments: result.rows });
    })
    .catch((err) => {
      return next(errorHandler(new ErrorHandler(err.message, 500), req, res));
    });
};
const getFeeStructures = async(req,res,next)=>{
    if(req.user.role==='Admin'){
pool.query(`SELECT fee_structures.*,CONCAT(classes.name,' ',classes.section) AS class FROM fee_structures JOIN classes ON classes.id=fee_structures.class_id`).then((result)=>{
    res.status(200).json({success:true,fee_structures:result.rows});
}).catch((err)=>{
    return next(errorHandler(new ErrorHandler(err.message,500),req,res));
})
    }
    else{
        res.status(401).json({success:false,message:"Not Authorized"})
    }
}
const getAllFeePayments = async(req,res,next)=>{
    if(req.user.role==='Admin'){
       
        const {keyword,from,to,page} = req.query;
       let sqlQuery = `SELECT fee_payments.*,CONCAT(student.first_name,' ' , student.last_name) AS name, CONCAT(classes.name,' ',classes.section) AS class FROM fee_payments JOIN students student ON student.student_id = fee_payments.student_id
        JOIN classes ON student.class_id = classes.id  
       WHERE 
           fee_payments.date >=  ${from?`DATE '${from}'`:`CURRENT_DATE - INTERVAL '1 month'`}
          AND `;
if(keyword){
 sqlQuery += ` student.first_name ILIKE '%${keyword}%' OR student.last_name ILIKE '%${keyword}%' AND`
}
if(to){
    sqlQuery += ` fee_payments.date <= DATE '${to}' AND`
}
if(sqlQuery.trim().endsWith('AND')){
    sqlQuery = sqlQuery.slice(0, -4);
}
if(sqlQuery.endsWith("WHERE")){
    sqlQuery = sqlQuery.slice(0, -6);
}
console.log(sqlQuery)
const total = (await pool.query(sqlQuery)).rowCount;
sqlQuery+= ` ORDER BY fee_payments.id DESC LIMIT 20 OFFSET ${page?(page-1)*20:0} `;


        pool.query(sqlQuery).then((result)=>{
            res.status(200).json({success:true,fee_payments:result.rows,total:total});
        }).catch((err)=>{
            console.log(err)
            return next(errorHandler(new ErrorHandler(err.message,500),req,res));
        })
            }
            else{
                res.status(401).json({success:false,message:"Not Authorized"})
            }
}
module.exports = {
  submitFee,
  getFeeStructures,
  updateFeeStructure,
  addFeeStructure,
  getFeePayments,
  getAllFeePayments
};

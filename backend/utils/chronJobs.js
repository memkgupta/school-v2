var cron = require('node-cron');
const pool = require('../config/db');
const { notify } = require('../middlewares/message');


const updateFee = cron.schedule('01 00 10 * *',async()=>{
    const student_query =  `
    UPDATE students AS s
    SET due_fee = s.due_fee + (
      SELECT fee_structure.monthly_amount
      FROM fee_structures AS fee_structure
      WHERE fee_structure.class_id = s.class_id
    )
    WHERE s.student_id NOT IN (
      SELECT DISTINCT fp.student_id 
      FROM fee_payments AS fp
      WHERE
        EXTRACT(YEAR FROM fp.date) = EXTRACT(YEAR FROM NOW()) AND
       fp.month > EXTRACT(MONTH FROM NOW())
    )
    RETURNING *
    `
    
   try {
    const update_due_fee = await pool.query(student_query);
    const numbers = [];
    update_due_fee.rows.forEach(row=>{
        numbers.push(row.phone);
    })
    notify("Your Ward Fee For this month is due , please Ignore if already paid",numbers);
   } catch (error) {
    console.log(error);
   }
  


});

module.exports = {updateFee};


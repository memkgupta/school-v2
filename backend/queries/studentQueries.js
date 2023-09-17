const ADD_STUDENT = "INSERT INTO students ( first_name, last_name, father_name,mother_name,profile_pic, class_id, student_address, transport, adhaar, due_fee, phone, whatsapp_number, email,dob) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *";
const IS_STUDENT_PRESENT = "SELECT student_id FROM students WHERE student_id = $1 RETURNING student_id, first_name, last_name";
const DELETE_STUDENT = "DELETE FROM students WHERE student_id = $1";
const GET_STUDENTS = (queryParams)=>{
    if(queryParams.length<1){
        return `SELECT * FROM students ORDER BY admission_no ASC`;
    }
    return `SELECT * FROM students WHERE ${queryParams.join(' ')} ORDER BY first_name `;
}
const GET_STUDENT = `SELECT students.*, json_build_object(
    'class_id', fee_structures.class_id,
    'monthly_amount', fee_structures.monthly_amount,
    'total_amount', fee_structures.total_amount
) AS fee_structure, 
json_build_object(
    'class_name', classes.name,
     'section',classes.section
) AS class
FROM students LEFT JOIN fee_structures ON fee_structures.class_id = students.class_id JOIN classes ON classes.id= students.class_id WHERE students.student_id = $1`;
module.exports = {ADD_STUDENT,IS_STUDENT_PRESENT,DELETE_STUDENT,GET_STUDENTS,GET_STUDENT};
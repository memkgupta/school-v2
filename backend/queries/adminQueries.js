const TOTAL_FEE_PAYMENTS =
  "SELECT SUM(amount) AS total_fee_payments FROM fee_payments WHERE EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM NOW()) ";
const TOTAL_CLASSES = "SELECT COUNT(*) AS total_classes FROM classes";
const TOTAL_STUDENTS =
  "SELECT SUM(due_fee) AS total_fee_pending ,SUM(CASE WHEN gender = 'Male' THEN 1 ELSE 0 END) AS male_students_count,SUM(CASE WHEN gender = 'Female' THEN 1 ELSE 0 END) AS female_students_count,COUNT(*) AS total_students FROM students";
const TOTAL_TEACHERS = "SELECT COUNT(*) AS total_teachers FROM teachers";
const STUDENTS_CLASS_WISE = "SELECT CONCAT(classes.name,' ' ,classes.section) AS name , SUM(CASE WHEN gender = 'Male' THEN 1 ELSE 0 END) AS male_students_count,SUM(CASE WHEN gender = 'Female' THEN 1 ELSE 0 END) AS female_students_count ,COUNT(*) FROM students JOIN classes ON students.class_id = classes.id GROUP BY CONCAT(classes.name,' ' ,classes.section)";
const FEE_STATS_MONTHLY = "SELECT EXTRACT(MONTH FROM date) AS month, SUM(amount) FROM fee_payments GROUP BY EXTRACT(MONTH FROM date)"
const FEE_STATS_CLASSWISE = "SELECT CONCAT(class.name,' ' ,class.section) AS name , SUM(amount) AS amount , SUM(student.due_fee) AS fee_pending FROM fee_payments JOIN students AS student ON student.student_id = fee_payments.student_id JOIN classes AS class ON student.class_id=class.id WHERE EXTRACT(MONTH FROM NOW()) - EXTRACT(MONTH FROM date) <= 3 GROUP BY CONCAT(class.name,' ' ,class.section) "
const FEE_PENDING_CLASSWISE = "SELECT CONCAT(classes.name,' ',classes.section) AS name, SUM(students.due_fee) FROM students JOIN classes ON classes.id = students.class_id GROUP BY CONCAT(classes.name,' ',classes.section)";

module.exports = {TOTAL_FEE_PAYMENTS,TOTAL_CLASSES,TOTAL_STUDENTS,TOTAL_TEACHERS,STUDENTS_CLASS_WISE,FEE_PENDING_CLASSWISE,FEE_STATS_CLASSWISE,FEE_STATS_MONTHLY}
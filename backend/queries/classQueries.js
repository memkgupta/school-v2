const ADD_CLASS = "INSERT INTO classes (name,section,class_teacher) VALUES($1,$2,$3) RETURNING *";
const UPDATE_CLASS_TEACHER = "UPDATE classes SET class_teacher = $1 WHERE id = $2";
const GET_STUDENTS = "SELECT * FROM  students WHERE class_id = $1";
const ADD_SUBJECT = "INSERT INTO subjects (name,class,teacher_id) VALUES ($1,$2,$3) RETURNING *";
const DELETE_SUBJECT = "DELETE FROM subjects WHERE id = $1";
const CHANGE_TEACHER = "UPDATE subjects SET teacher_id = $1 WHERE id = $2";
const GET_SUBJECTS = (queryParams)=>{
    if(queryParams.length==0){
        return `SELECT subjects.id,subjects.class AS class_id,
        subjects.name AS subject_name , CONCAT(classes.name,' ',classes.section) AS class ,teachers.name AS teacher_name ,teachers.email
        FROM subjects LEFT JOIN classes ON classes.id = subjects.class 
        LEFT JOIN teachers ON teachers.id=subjects.teacher_id
        `;
    }
    return `SELECT subjects.id,subjects.class AS class_id,
    subjects.name AS subject_name , CONCAT(classes.name,' ',classes.section) AS class ,teachers.name AS teacher_name,teachers.email
    FROM subjects LEFT JOIN classes ON classes.id = subjects.class 
    LEFT JOIN 
     teachers ON teachers.id=subjects.teacher_id
      WHERE ${queryParams.join(' OR ' )} `;
}
module.exports ={ADD_CLASS,UPDATE_CLASS_TEACHER,GET_STUDENTS,ADD_SUBJECT,DELETE_SUBJECT,CHANGE_TEACHER,GET_SUBJECTS};
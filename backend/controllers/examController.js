const format = require('pg-format');
const pool = require('../config/db');
const errorHandler = require('../middlewares/error');
const ErrorHandler = require('../utils/ErrorHandler');
const addExam = async(req,res,next)=>{
    const {start_date,end_date,total_marks,passing_marks,class_id,subjects} = req.body;
    
    const EXAM_QUERY = "INSERT INTO exams (start_date,end_date,total_marks,passing_marks,class_id) VALUES ($1,$2,$3,$4,$5) RETURNING *";

    const subject_query = "INSERT INTO exam_subject (exam_id,subject_id,total_marks,passing_marks,date) VALUES %L "

    pool.query(EXAM_QUERY,[start_date,end_date,total_marks,passing_marks,class_id])
    .then((result)=>{

      
       
        pool.query(format(
            subject_query,subjects.map(subject=>[result.rows[0].id,subject.subject_id,subject.total_marks,subject.passing_marks,subject.date])
        )).then((resultFinal)=>{
            res.status(200).json({success:true,message:"Exam Added SuccessFully",result:resultFinal});
        })
       
    })
   
    .catch((err)=>{
return next(errorHandler(new ErrorHandler(err.message,500),req,res) )
    })
    

}
const getExamDetails = async(req,res,next)=>{
    console.log("function called")
    const exam_id = req.params.eid;
    const query = `SELECT exams.start_date , exams.end_date ,exams.passing_marks , exams.total_marks, CONCAT (classes.name,' ',classes.section ) AS class   FROM exams  JOIN classes ON exams.class_id = classes.id  WHERE exams.id=${exam_id}`;
    const subjects_query = `SELECT subjects.name , exam_subject.date , exam_subject.total_marks , exam_subject.passing_marks FROM exam_subject JOIN subjects ON exam_subject.subject_id = subjects.id WHERE exam_subject.exam_id = ${exam_id}`;

   
    pool.query(query)
    .then(async (result)=>{
        const exam_data = result.rows[0];
        try {
            const x =await pool.query(subjects_query);
            exam_data.subjects = x.rows;
        } catch (error) {
            console.log(error)
        }
      
res.status(200).json({success:true,exam:exam_data});
    })
    .catch((err)=>{
return next(errorHandler(new ErrorHandler(err.message,500),req,res));
    })
}
const getExams = (req,res,next)=>{
    const query_params = [];
    const {class_id,start_date,end_date} = req.query;
    if(start_date){
        query_params.push(`start_date = ${start_date} OR`);
    }
    if(end_date){
        query_params.push(`end_date = ${end_date} AND`);
    }
    if(class_id){
        query_params.push(`class_id = ${class_id}`);
    }
    let sql_query;
if(query_params.length==0){
    sql_query = `SELECT * FROM exams`;
}
else{
    sql_query = `SELECT * FROM exams WHERE ${query_params.join(' , ')};`
}
console.log(sql_query)
pool.query(sql_query)

.then((result)=>{
    console.log(result.rows)
    res.status(200).json({success:true,exams:result.rows});
  
})
.catch((error)=>{
    console.log("E: ",error)
    // return next(errorHandler(new ErrorHandler(error.message,500),req,res))
})
  
}
const updateExam = (req,res,next)=>{
    const exam_id= req.params.eid;
    const {start_date,end_date}= req.body;
const updateQuery = [];
if(start_date){
    updateQuery.push(`start_date = ${start_date}`);
}
if(end_date){
    updateQuery.push(`end_date = ${end_date}`);
}
if(updateQuery.length==0){
    return next(errorHandler(new ErrorHandler("No updates",400),req,res));
}
const update_query = `UPDATE exams SET ${updateQuery.join(' , ')} WHERE id = ${exam_id} RETURNING *`;
pool.query(update_query).then((result)=>{
res.status(200).json({success:true,message:"Exam Updated SuccessFuly"});
}).catch((err)=>{
    return next(errorHandler(new ErrorHandler(err.message,500),req,res));
})
}
const changeSubjectDate = (req,res,next)=>{
    const exam_subjects = req.body.subjects;
    const exam_id = req.params.eid;

let condition_string = " ";
exam_subjects.forEach(subject => {
    condition_string+=`WHEN id = ${subject.id} THEN '${subject.date}' ` 
});

console.log(" f ",condition_string)
const sql_query = `UPDATE exam_subject SET date = 
CASE 
${condition_string}
ELSE date
END
WHERE  exam_id = ${exam_id} RETURNING *`;
console.log(sql_query)
    pool.query(sql_query)
    
    .then((result)=>{
        res.status(200).json({success:true,message:"Exam UPDATED SUCCESS FULLY",result:result.rows})
    }).catch((err)=>{
        return next(errorHandler(new ErrorHandler(err.message,500),req,res));
    });
}
const getStudentReportCard = (req,res,next)=>{
    const exam_id = req.params.eid;
    const student_id = req.query.sid;
    const sql_query = `SELECT  exam.exam_name ,subject.name ,report.total_marks , report.marks_obtained , report.status , report.remarks FROM exam_reports AS report JOIN exams AS exam ON exam.id=${exam_id} JOIN subjects AS subject ON subject.id=report.subject_id WHERE exam_id = ${exam_id} AND student_id = ${student_id}`

    pool.query(sql_query).then((result)=>{
    res.status(200).json({success:true,report:result.rows});
}).catch((err)=>{
    return next(errorHandler(new ErrorHandler(err.message,500),req,res));
})
}
const getAllStudentReport = (req,res,next)=>{
    pool.query(`
    SELECT student.student_id,student.admission_no , CONCAT(student.first_name,' ' ,student.last_name) AS name , SUM(exam_reports.total_marks) AS total_marks , SUM(exam_reports.marks_obtained) FROM exam_reports JOIN students AS student ON student.student_id = exam_reports.student_id GROUP BY student.student_id,student.admission_no,CONCAT(student.first_name,' ' ,student.last_name)  `
    ).then((result)=>{
        res.status(200).json({success:true,result:result.rows});
    }).catch((err)=>{
        return next(errorHandler(new ErrorHandler(err.message,500),req,res));
    })
}
module.exports = {addExam,getExamDetails,getExams,updateExam,changeSubjectDate,getStudentReportCard,getAllStudentReport};




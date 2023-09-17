const errorHandler = require("../middlewares/error");
const format = require("pg-format");
const cloudinary = require('cloudinary');
const getUri = require('../middlewares/datauri');
const ErrorHandler = require("../utils/ErrorHandler");
const pool = require("../config/db");
const { ADD_TEACHER, REMOVE_TEACHER } = require("../queries/teacherQueries");
const replaceTeachers = async(req,res,next)=>{
  const {oldTeacher,newTeacher,classes} = req.body;
  let subjects_query = `UPDATE subjects SET teacher_id = ${newTeacher} WHERE teacher_id = ${oldTeacher} `;
  if(classes!=null){
    subjects_query+= `AND class IN (${classes.join(' , ')}) `;
    
  }
  pool.query(subjects_query).then(async(result)=>{
    if(classes!=null){
      try {
        await pool.query(`UPDATE classes SET class_teacher = ${newTeacher} WHERE id = ANY($1::int[])`,[classes]);
     console.log("class Teacher query ran")
      } catch (error) {
        
      }
    }
   
res.status(200).json({success:true,message:"Teacher Replaced SuccessFully"});
  }).catch((err)=>{
return next(errorHandler(new ErrorHandler(err.message,500),req,res));
  });
}
const addTeacher = async(req, res, next) => {
  if (req.user.role === "Admin") {
    const {
      name,
      salary,
      email,
      address,
      phone,
      whatsapp_number,
      
      subjects,
    } = req.body;
    console.log(subjects);
const file = req.file;
const data_uri  = getUri(file);
let myCloud;
try {
 myCloud =   await cloudinary.v2.uploader.upload(data_uri.content);
} catch (error) {
    console.log(error);
    return next(errorHandler(new ErrorHandler(error.message,500),req,res))
}

const profile_pic = myCloud.url;
    pool.query(
      ADD_TEACHER,
      [name, salary, email, address, phone, whatsapp_number, profile_pic],
      (err, result) => {
        if (err) {
          return next(
            errorHandler(new ErrorHandler(err.message, 500), req, res)
          );
        } else {
          if (subjects) {
          
            const SUBJECT_QUERY = `INSERT INTO subjects (name,class,teacher_id) VALUES %L RETURNING *`;
            const values = subjects.map((subject) => [
              subject.name,
              subject.class,
              result.rows[0].id,
            ]);

            pool.query(format(SUBJECT_QUERY, values), (err, Subjectresult) => {
              if (err) {
                return next(
                  errorHandler(new ErrorHandler(err.message, 500), req, res)
                );
              }
              res
                .status(200)
                .json({
                  success: true,
                  message: "Teacher Added SuccessFully",
                  teacher: result.rows[0],
                  subjects: Subjectresult.rows,
                });
            });
            return;
          }
          res
            .status(200)
            .json({
              success: true,
              message: "Teacher Added SuccessFully",
              teacher: result.rows[0],
            });
        }
      }
    );
  } else {
    return next(
      errorHandler(new ErrorHandler("You are not authorized", 401), req, res)
    );
  }
};
const getTeachers = (req,res,next)=>{
pool.query(`SELECT * FROM teachers`).then((result)=>{
res.status(200).json({success:true,teachers:result.rows});
})
.catch((err)=>{
  return(next(errorHandler(new ErrorHandler(err.message,500),req,res)))
})
}
const updateTeacher = (req, res, next) => {
  if (req.user.role === "Admin") {
    const teacher_id = parseInt(req.params.tid);
    const { phone, whatsapp_number, address, email } = req.body;
    const updates = [];
    if (phone) {
      updates.push(`phone = ${phone}`);
    }
    if (whatsapp_number) {
      updates.push(`whatsapp_number=${whatsapp_number}`);
    }
    if (address) {
      updates.push(`address=${address}`);
    }
    if (email) {
      updates.push(`email = ${email}`);
    }
    const UPDATE_QUERY = `UPDATE teachers SET ${updates.join(
      " , "
    )} WHERE id = ${teacher_id} RETURNING *`;
    pool.query(UPDATE_QUERY, (err, result) => {
      if (err) {
        return next(errorHandler(new ErrorHandler(err.message, 500), req, res));
      } else {
        res
          .status(200)
          .json({
            success: true,
            message: "Teacher Updated SuccessFully",
            teacher: result.rows[0],
          });
      }
    });
  } else {
    return next(
      errorHandler(new ErrorHandler("You are not authorized", 401), req, res)
    );
  }
};

const removeTeacher = async (req, res, next) => {
  if (req.user.role === "Admin") {
    const teacher_id = req.params.tid;
    const relationship_backup = (
      await pool.query(
        `SELECT * FROM teacher_subject_relationship WHERE teacher_id = ${teacher_id}`
      )
    ).rows;
    const query_subject_relationship = `DELETE FROM teacher_subject_relationship WHERE teacher_id = ${teacher_id}`;
    pool.query(query_subject_relationship, (err, result) => {
      if (err) {
        return next(errorHandler(new ErrorHandler(err.message, 500), req, res));
      } else {
        pool.query(REMOVE_TEACHER, [teacher_id], (error, teacher_result) => {
          if (error) {
            pool
              .query(
                format(
                  `INSERT INTO teacher_subject_relationship (subject_id,teacher_id) %L`,
                  relationship_backup
                )
              )
              .then((result) => {
                return next(errorHandler(new ErrorHandler(error.message, 500)));
              });
          }
          res
            .status(200)
            .json({ success: true, message: "Teacher Removed SuccessFully" });
        });
      }
    });
  } else {
    return next(
      errorHandler(new ErrorHandler("You are not authorized", 401), req, res)
    );
  }
};

const addClassSubjects = async (req, res, next) => {
  if (req.user.role === "Admin") {
    const teacher_id = req.params.tid;
    const subjects = req.body.subjects;
    const isTeacher = await pool.query("SELECT * FROM teachers WHERE id =$1", [
      teacher_id,
    ]);
    if (isTeacher.rowCount < 1) {
      return next(
        errorHandler(new ErrorHandler("Teacher Not Exists", 400), req, res)
      );
    }
    if (subjects) {
      console.log(subjects.map((subject) => [subject, parseInt(teacher_id)]));
      const sqlQuery = `INSERT INTO subjects (name,class,teacher_id) VALUES %L RETURNING *`;
      pool
        .query(
          format(
            sqlQuery,
            subjects.map((subject) => [subject.name,subject.class, parseInt(teacher_id)])
          )
        )
        .then((result) => {
          res
            .status(200)
            .json({
              success: true,
              subjects:result.rows,
              message: "Subjects And CLasses Assigned To Teacher SuccessFully",
            });
        })
        .catch((err) => {
          return next(
            errorHandler(new ErrorHandler(err.message, 500), req, res)
          );
        });
    }
  } else {
    return next(
      errorHandler(new ErrorHandler("You are not authorized", 401), req, res)
    );
  }
};
const getTeacher = async (req, res, next) => {
  if (req.user.role === "Admin"||req.user.role==="Teacher") {
    const teacher_id = req.params.tid;
    pool.query(
      "SELECT * FROM teachers WHERE teachers.id = $1",
      [teacher_id],
      async (err, result) => {
        if (err) {
          return next(
            errorHandler(new ErrorHandler(err.message, 500), req, res)
          );
        } else {
         
          const subjects = await pool.query(
            `SELECT subjects.*,CONCAT(classes.name,' ',classes.section) AS class_name FROM subjects JOIN classes ON subjects.class = classes.id WHERE subjects.teacher_id=${teacher_id}`
          );
          res
            .status(200)
            .json({
              success: true,
              teacher: result.rows[0],
              subjects: subjects.rows,
            });
        }
      }
    );
  } else {
    return next(
      errorHandler(new ErrorHandler("You are not authorized", 401), req, res)
    );
  }
};

const getAll = (req, res, next) => {
  if (req.user.role === "Admin") {
  } else {
    return next(
      errorHandler(new ErrorHandler("You are not authorized", 401), req, res)
    );
  }
};

const submitReport = (req, res, next) => {
  if (req.user.role === "Admin" || req.user.role === "Teacher") {
    const exam_id = req.params.eid;
    const { subject_id, data } = req.body;
    const sql_query = `
        
INSERT INTO exam_reports (exam_id,subject_id,total_marks,marks_obtained,status,remarks,student_id) VALUES %L 

                   RETURNING *`;

    pool
      .query(
        format(
          sql_query,
          data.map((student) => [
            exam_id,
            subject_id,
            student.total_marks,
            student.marks_obtained,
            student.status,
            student.remarks,
            student.student_id,
          ])
        )
      )
      .then((result) => {
        res
          .status(200)
          .json({ success: true, message: "Report Submitted SuccessFully" });
      })
      .catch((err) => {
        return next(errorHandler(new ErrorHandler(err.message, 500), req, res));
      });
  } else {
    return next(
      errorHandler(new ErrorHandler("You are not authorized", 401), req, res)
    );
  }
};
const generateReportCard = (req, res, next) => {
  if (req.user.role === "Teacher") {
  } else {
    return next(
      errorHandler(new ErrorHandler("You are not authorized", 401), req, res)
    );
  }
};
const markAttendance = (req, res, next) => {
  if (req.user.role === "Admin" || req.user.role === "Teacher") {
    const { studentData } = req.body;
    const class_id = req.params.cid;

    const SQL_QUERY =
      "INSERT INTO attendance (class_id,student_id,is_present,date) VALUES %L RETURNING *";
    const date = new Date();

    pool
      .query(
        format(
          SQL_QUERY,
          studentData.map((std) => [
            class_id,
            std.student_id,
            std.isPresent,
            `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`,
          ])
        )
      )
      .then((result) => {
        res.status(200).json({ success: true, attendance: result.rows });
      })
      .catch((err) => {
        return next(errorHandler(new ErrorHandler(err.message, 500), req, res));
      });
  } else {
    return next(
      errorHandler(new ErrorHandler("You are not authorized", 401), req, res)
    );
  }
};

const generateAttendanceReport = (req, res, next) => {
  if (req.user.role === "Admin" || req.user.role === "Teacher") {
    const class_id = req.params.cid;
    const month = req.query.month;
    const sqlQuery = `SELECT students.admission_no , CONCAT( students.first_name,' ',students.last_name) AS student_name ,students.admission_no, COUNT(*) AS total_attendance FROM attendance  JOIN students ON students.student_id = attendance.student_id WHERE attendance.class_id = ${class_id} AND attendance.is_present = true GROUP BY attendance.student_id , students.admission_no , students.first_name , students.last_name`;
    console.log(sqlQuery);
    pool
      .query(sqlQuery)
      .then((result) => {
        res.status(200).json({ success: true, report: result.rows });
      })
      .catch((err) => {
        return next(errorHandler(new ErrorHandler(err.message, 500), req, res));
      });
  } else {
    return next(
      errorHandler(new ErrorHandler("You are not authorized", 401), req, res)
    );
  }
};

const teacherPanel = (req,res,next)=>{
  if(req.user.role==="Admin"||req.user.role==="Teacher"){
    const teacherQuery = `SELECT teachers.*, 
    class.id AS class_id
    FROM teachers LEFT JOIN classes class ON teachers.id = class.class_teacher WHERE teachers.email = '${req.user.email}'`

  pool.query(teacherQuery)
  .then((result)=>{
    res.status(200).json({success:true,data:result.rows[0]})
  })
  .catch((err)=>{
    return next(errorHandler(new ErrorHandler(err.message,500),req,res));
  })
  }
  else{
    return next(errorHandler(new ErrorHandler("Not Authorized",500),req,res))
  }
}
module.exports = {
  teacherPanel,
  replaceTeachers,
  addTeacher,
  updateTeacher,
  removeTeacher,
  addClassSubjects,
  getAll,
  getTeacher,
  getTeachers,
  markAttendance,
  generateAttendanceReport,
  submitReport,
};

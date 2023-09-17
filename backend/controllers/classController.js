const format = require("pg-format");
const pool = require("../config/db");
const errorHandler = require("../middlewares/error");
const {
  ADD_CLASS,
  UPDATE_CLASS_TEACHER,
  GET_STUDENTS,
} = require("../queries/classQueries");

const ErrorHandler = require("../utils/ErrorHandler");

const addClass = async (req, res, next) => {
  const { name, section, class_teacher,subjects } = req.body;
  const isClass = await pool.query(`SELECT * FROM classes WHERE UPPER(classes.name)='${name.toUpperCase()}' 
  AND UPPER(classes.section)='${section.toUpperCase()}'`);
  if(isClass.rowCount>0){
    res.status(201).json({success:false,message:"Class Already Exists"})
  }
  else{
    pool.query(
      ADD_CLASS,
      [name.toUpperCase(), section.toUpperCase(), class_teacher || null],
      (err, result) => {
        if (err) {
          return next(
            new errorHandler(new ErrorHandler(err.message, 400), req, res)
          );
        }
        else{
          if(subjects){
            pool.query(format(`INSERT INTO subjects (name,class,teacher_id) VALUES %L RETURNING *`,subjects.map(subject=>[subject.name,result.rows[0].id,subject.teacher])))
            .then((result)=>{
               
              res
              .status(200)
              .json({ success: true, message: "Class Added Successfully" });
  
            })
            .catch((err)=>{
              console.log(err);
            })
          }
         
          
        }
  
      }
    );
  }

};
const updateClassTeacher = async (req, res, next) => {
  if (!req.user.role === "Admin") {
    return next(
      errorHandler(new ErrorHandler("You Are not Authorized", 401), req, res)
    );
  }
  const class_id = req.params.cid;
  const newTeacher = req.body.class_teacher;
  const isTeacher = pool
    .query("SELECT * FROM teacher WHERE id = ${newTeacher}")
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      return null;
    });

  if (isTeacher) {
    pool.query(UPDATE_CLASS_TEACHER, [newTeacher, class_id], (err, result) => {
      if (err) {
        return next(
          errorHandler(new ErrorHandler("Can't Update Teacher", 400), req, res)
        );
      } else {
        res
          .status(200)
          .json({ success: true, message: "Teacher Updated SuccessFully" });
      }
    });
  } else {
    return next(
      errorHandler(new ErrorHandler("Teacher Not Exist", 500), req, res)
    );
  }
};
const addSubjects = async(req,res,next)=>{
const {subjects} = req.body;
const cid = req.params.cid;
const query = format(`INSERT INTO subjects (name,class,teacher_id) VALUES %L RETURNING *`,subjects.map((subject)=>[subject.name,cid,subject.teacher]));
pool.query(query).then((result)=>{
res.status(200).json({success:true,subjects:result.rows});
})
.catch((err)=>{
  return next(errorHandler(new ErrorHandler(err.message,500),req,res));
})
}
const updateSubject = async(req,res,next)=>{
const {sid} = req.params;
const {name,teacher_id}= req.body;

pool.query(`UPDATE subjects SET name = '${name}',teacher_id =${teacher_id} WHERE id = ${sid} RETURNING *`).then((result)=>{
res.status(200).json({success:true,message:"Subject Updated SuccessFully"});
}).catch((err)=>{
return next(errorHandler(new ErrorHandler(err.message,500),req,res));
})
}
const getStudents = async (req, res, next) => {
  const class_id = req.params.cid;
  const isClass = (
    await pool.query(`SELECT * FROM classes WHERE id = ${class_id}`)
  ).rowCount;
  if (!isClass.length > 0) {
    return next(
      errorHandler(new ErrorHandler("Class Not Found", 404), req, res)
    );
  }
  pool.query(GET_STUDENTS, [class_id], (err, result) => {
    if (err) {
      return next(errorHandler(new ErrorHandler(err.message, 404)));
    }
    res.status(200).json({ success: true, students: result.rows });
  });
};
const getAttendance = async (req, res, next) => {
    if(req.user.role==="Admin"||req.user.role==="Teacher"){
        const cid = req.params.cid;
        const {from,to} = req.query;
let query = 
`
SELECT COUNT(*) AS present , TO_CHAR(date, 'DD/MM')  AS date  FROM attendance  WHERE attendance.class_id = ${cid} AND attendance.is_present = true AND attendance.date>=${from?`DATE '${from}'`:`CURRENT_DATE- INTERVAL  '2 month' `} AND`
if(to){
    query+= ` attendance.date<= DATE ${to}`
}
if(query.endsWith('AND')){
    query = query.slice(0,-4);
}
query += ` GROUP BY attendance.date `
console.log(query);
    pool.query(query).then((result)=>{
        res.status(200).json({success:true,attendance:result.rows});
    })
    .catch((err)=>{
return next(errorHandler(new ErrorHandler(err.message,500),req,res));
    });
}
    else{
        return next(errorHandler(new ErrorHandler("Unauthorized Access",401),req,res));
    }
};
const getClasses = async (req, res, next) => {
  if (req.user.role === "Admin") {
    pool
      .query(
        `SELECT  classes.* , COUNT(students.student_id) AS total_students, teachers.name AS teacher_name 
         FROM classes LEFT JOIN students ON students.class_id = classes.id LEFT JOIN teachers ON classes.class_teacher = teachers.id GROUP BY classes.id,teachers.name ORDER BY classes.id ASC `
      )
      .then((result) => {
        res.status(200).json({ success: true, classes: result.rows });
      })
      .catch((err) => {
        res.status(500).json({ success: true, message: err.message });
      });
  } else {
    return next(
      errorHandler(new ErrorHandler("Not authorized", 401), req, res)
    );
  }
};
const getClass = async (req, res, next) => {
  if (req.user.role === "Admin" || req.user.role === "Teacher") {
    const cid = req.params.cid;
    const query = `
SELECT 
     class_data.*,ct.name AS class_teacher_name,
     (
      SELECT COALESCE(
        json_agg(
          json_build_object(
          'name',CONCAT(s.first_name,' ',s.last_name),
           'father_name' , s.father_name,
            'student_id',s.student_id,
          'admission_no',s.admission_no,
          'phone',s.phone
      )
      ),'[]'
      )  FROM students s WHERE s.class_id = class_data.id
    ) AS students
    ,
(
    SELECT json_agg(
    json_build_object(
      'id',subject.id,
        'name',subject.name,
        'teacher',teacher.name,
        'teacher_id',teacher.id
                      )
                    ) FROM subjects subject  LEFT JOIN teachers teacher ON teacher.id = subject.teacher_id 
                     WHERE subject.class = class_data.id
 ) AS subjects


     
   
FROM classes class_data JOIN teachers ct ON ct.id = class_data.class_teacher   WHERE class_data.id = ${cid};
`;
console.log(query)
pool.query(query).then((result)=>{
    res.status(200).json({success:true,data:result.rows[0]});
}).catch((err)=>{
    console.log(err);
res.status(500).json({success:false,message:err.message})
})
  } else {
    return next(
      errorHandler(new ErrorHandler("Not authorized", 401), req, res)
    );
  }
};
module.exports = { addClass, updateClassTeacher, getStudents, getClasses,getClass,getAttendance,addSubjects,updateSubject };

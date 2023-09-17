const pool = require("../config/db");
const errorHandler = require("../middlewares/error");
const { ADD_SUBJECT, DELETE_SUBJECT, CHANGE_TEACHER, GET_SUBJECTS } = require("../queries/classQueries");
const ErrorHandler = require("../utils/ErrorHandler")

const addSubject = async(req,res,next)=>{
if(req.user.role==="Admin"){
const {name,class_id,teacher} = req.body;
const isClass =  (await pool.query(`SELECT * FROM classes WHERE id = ${class_id}`)).rowCount;
if(!isClass){
 return next(errorHandler(new ErrorHandler("Class Not Found",404),req,res));
}
pool.query(ADD_SUBJECT,[name,class_id,teacher],(err,result)=>{
    if(err){
        return next(errorHandler(new ErrorHandler(err.message,500),req,res));
    }
    res.status(200).json({success:true,message:"Subject Added SuccessFully",subject:result.rows[0]});
});
}
else{
    return next(errorHandler(new ErrorHandler("Not Authorized",401),req,res));
}
}
const removeSubject = async(req,res,next)=>{
    if(req.user.role==="Admin"){
        const subject_id = req.params.sid;
const isSubject = (await pool.query(`SELECT * FROM subjects WHERE id = ${subject_id}`)).rowCount;
if(isSubject<1){
    return next(errorHandler(new ErrorHandler("Subject Not Found",404),req,res));
}
pool.query(DELETE_SUBJECT,[subject_id],(err,result)=>{
    if(err){
        return next(errorHandler(new ErrorHandler(err.message,500),req,res));
    }
   res.status(200).json({success:true,message:"Subject Deleted SuccessFull"});
})
    }
    else{
        return next(errorHandler(new ErrorHandler("Not Authorized",401),req,res));
    }
}
const changeTeacher = async(req,res,next)=>{
    if(req.user.role==="Admin"){
        const newTeacher = req.body.teacher_id;
        const subject_id = req.params.sid;
const isTeacher = (await pool.query(`SELECT * FROM teachers WHERE id=${newTeacher}`)).rowCount;
if(!isTeacher>0){
    return next(errorHandler(new ErrorHandler("Teacher Not Found",404),req,res));
}
pool.query(CHANGE_TEACHER,[newTeacher,subject_id],(err,result)=>{
    if(err){
        return next(errorHandler(new ErrorHandler(err.message,500),req,res));
        
    }
    res.status(200).json({success:true,message:"Teacher Updated"});
})
    }
    else{
        return next(errorHandler(new ErrorHandler("Not Authorized",401),req,res));
    }
}

const getAllSubjects = async(req,res,next)=>{
    let queryParams=[];
    const {class_id,name,teacher_id} = req.query;
    if(name){
        queryParams.push(`subjects.name ILIKE '%${name}%'`)
    }

    if(teacher_id){
queryParams.push(`teacher_id = ${teacher_id}`);
    }
    if(class_id){
        queryParams.push(`class = ${class_id}`);
    }
const sqlQuery = GET_SUBJECTS(queryParams);

pool.query(sqlQuery,(err,result)=>{
    if(err){
        return next(errorHandler(new ErrorHandler(err.message,500),req,res));
    }
    res.status(200).json({success:true,subjects:result.rows});
});


   
}
const getSubject = async(req,res,next)=>{
    pool.query(`SELECT subjects.id,
    subjects.name AS subject_name , CONCAT(classes.name,' ',classes.section) AS class ,teachers.name AS teacher_name ,teachers.email
    FROM subjects LEFT JOIN classes ON classes.id = subjects.class 
    LEFT JOIN 
    teacher_subject_relationship  ON subjects.id=teacher_subject_relationship.subject_id JOIN teachers ON teachers.id=teacher_subject_relationship.teacher_id WHERE subjects.id=${req.params.sid}`)
    .then((
        result
    )=>{
    
  
            res.status(200).json({success:true,subject:result.rows[0]});
    
    })
    .catch((err)=>{
        if(err){
            return next(errorHandler(new ErrorHandler(err.message,500),req,res));

        }
       
    });
}

module.exports = {addSubject,removeSubject,changeTeacher,getAllSubjects,getSubject};
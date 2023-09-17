const pool = require('../config/db');
const cloudinary = require('cloudinary');
const { ADD_STUDENT, IS_STUDENT_PRESENT, DELETE_STUDENT, GET_STUDENTS, GET_STUDENT } = require('../queries/studentQueries');
const errorHandler = require('../middlewares/error');
const ErrorHandler = require('../utils/ErrorHandler');
const getUri = require('../middlewares/datauri');
const { sendSingleMessage } = require('../middlewares/message');
const addStudent = async(req,res,next)=>{
    const {
        first_name,last_name,father_name,mother_name,class_id,student_address,transport,adhaar,due_fee,phone,whatsapp_number,email,dob
    } = req.body;
    const file = req.file;
    let profile_pic;
    if(file){
        const data_uri  = getUri(file);
        let myCloud;
        try {
         myCloud =   await cloudinary.v2.uploader.upload(data_uri.content);
        } catch (error) {
            console.log(error);
            return next(errorHandler(new ErrorHandler(error.message,500),req,res))
        }
    
 profile_pic = myCloud.url;
    }
    else{
        profile_pic = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.veryicon.com%2Ficons%2Finternet--web%2Fprejudice%2Fuser-128.html&psig=AOvVaw26PPislSSEUXT_dqcyU6px&ust=1694074819746000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCNCFrdHGlYEDFQAAAAAdAAAAABAD"
    }
    
 if(req.user.role==="Admin"){
    pool.query(ADD_STUDENT,[first_name,last_name,father_name,mother_name,profile_pic,class_id,student_address,transport,adhaar,due_fee,phone,whatsapp_number||null,email||null,dob],(err,result)=>{
        if(err){
return next(errorHandler(new ErrorHandler(err.message,400),req,res));
        }
        else{
            sendSingleMessage(`Your Ward ${result.rows[0].first_name+' '+ result.rows[0].last_name} has been admitted to our school 
            with admission no. ${result.rows[0].admission_no} 
            `,`+91${result.rows[0].phone||9358288484}`)
            res.status(200).json({success:true,message:"Student inserted Successfully",student:result.rows[0]});
        }
       
    });
 }
   else{
    return next(errorHandler(new ErrorHandler("You Are Not Authorized",401),req,res));
   }

}

const updateStudent = async(req,res,next)=>{
    if(req.user.role==="Admin"){
        const student_id = req.params.sid;
        const file = req.file;
     console.log(req.body);
const {first_name,student_address,transport,phone,whatsapp_number,email} = req.body;
const setClauses = [];

  // Create an array to store the values for the prepared statement
  const values = [student_id];

  // Check if each field should be updated and add to the SET clauses and values
  if (first_name) {
    setClauses.push('first_name = $2');
    values.push(first_name);
  }
  if (file) {

    const data_uri  = getUri(file);
    let myCloud;
    try {
     myCloud =   await cloudinary.v2.uploader.upload(data_uri.content);
    } catch (error) {
        console.log(error);
        return next(errorHandler(new ErrorHandler(error.message,500),req,res))
    }

const profile_pic = myCloud.url;
    setClauses.push('profile_pic =' +profile_pic );
    values.push(profile_pic);
  }
  if (student_address) {
    setClauses.push('student_address = ' + student_address);
    values.push(student_address);
  }
  if (transport !== undefined) {
    setClauses.push('transport = ' + transport);
    values.push(transport);
  }
  if (phone) {
    setClauses.push('phone = ' + phone);
    values.push(phone);
  }
  if (whatsapp_number) {
    setClauses.push('whatsapp_number = ' + whatsapp_number);
    values.push(whatsapp_number);
  }
  if (email) {
    setClauses.push('email = ' + email);
    values.push(email);
  }

  if (setClauses.length === 0) {
    res.status(400).send('No valid update fields provided.');
    return;
  }

  const UPDATE_QUERY = `UPDATE STUDENTS SET ${setClauses.join(', ')} WHERE student_id = $1`;
console.log(UPDATE_QUERY)
  pool.query(UPDATE_QUERY,values,(err,result)=>{
    if(err){
        return next(errorHandler(new ErrorHandler(err.message,404),req,res));
    }
    res.status(200).json({success:true,message:"Student Data Updated SuccessFully",result:result.rows[0]});
  })
    }
    else{
        return next(errorHandler(new ErrorHandler("You Are Not Authorized",401),req,res));
    }
}

const removeStudent = async(req,res,next)=>{
    if(req.user.role==="Admin"){
        const student_id = req.params.sid;
        let isStudentPresent = pool.query(IS_STUDENT_PRESENT,[student_id],(err,result)=>{
            if(err){
return false;
            }
            return true;
        });
        if(!isStudentPresent){
            return next(errorHandler(new ErrorHandler("Student Not Found",404),req,res));
        }
        pool.query(DELETE_STUDENT,[student_id],(err,result)=>{
            if(err){
                return next(errorHandler(new ErrorHandler(err.message,400),req,res));
            }
            res.status(200).json({success:true, message:"Student Removed SuccessFully"});
        });
    }
    else{
        return next(errorHandler(new ErrorHandler("You are not authorized",401),req,res))
    }
}
const getStudents = async(req,res,next)=>{
    const {class_id,keyword,f_name} = req.query;
    const query_params=[]
if(req.user.role==="Admin"||req.user.role==="Teacher"){
      
    const limit = 30;
    if(keyword){
        query_params.push(`first_name ILIKE '%${keyword}%' OR last_name ILIKE '%${keyword}%'`)
    }
    if(f_name){
        query_params.push(`${keyword?'AND':''} father_name ILIKE '%${f_name}%'`);
    }
    if(class_id){
        query_params.push(`${keyword||f_name?'AND':''} class_id=${class_id}`);
    }
    const sqlQuery = GET_STUDENTS(query_params);
    
    const totalStudents =  (await pool.query(sqlQuery)).rowCount;
    const offset = ((req.query.page?req.query.page:1)-1)*(limit);
sqlQuery.concat(`LIMIT ${limit} OFFSET ${offset}`)


    pool.query(sqlQuery,(err,result)=>{
        if(err){
            return next(errorHandler(new ErrorHandler(err.message,404),req,res));
        }
        else{
            res.status(200).json({success:true,total:totalStudents,students:result.rows});
        }

    });
}
else{
    return next(
        errorHandler(new ErrorHandler("You are not authorized", 401), req, res)
      );
}

}
const getStudent = (req,res,next)=>{
    const student_id = req.params.sid;

    pool.query(GET_STUDENT,[student_id],(err,result)=>{
        if(err){
            return next(errorHandler(new ErrorHandler(err.message,404),req,res));
        }
        else{
            res.status(200).json({success:true,student:result.rows[0]});
        }
       
    })
}
module.exports={addStudent,updateStudent,removeStudent,getStudents,getStudent};
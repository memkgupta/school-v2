const reader = require('xlsx');
const error = require('../middlewares/error');
const ErrorHandler = require('../utils/ErrorHandler');
const pool = require('../config/db');
const format = require('pg-format');

const addClasses = (req,res,next)=>{
const xlFile = req.file
if(!xlFile){
    return next(error(new ErrorHandler("Please Provide Excel Spreadsheet ",400),req,res));
}
const workbook = reader.read(xlFile.buffer,{type:'buffer'});
const sheets = workbook.SheetNames[0];
const data = reader.utils.sheet_to_json(workbook.Sheets[sheets]);
console.log(data)
const query = 
`
INSERT INTO classes (name,section,class_teacher) VALUES %L RETURNING *
`
pool.query(format(query,data.map((item)=>[item.name,item.section,item.class_teacher])))
.then((result)=>{
    res.status(200).json({success:true,result:result.rows});
})
.catch((err)=>{
    return next(error(new ErrorHandler(err.message,500),req,res));
})

}
const addStudents = (req,res,next)=>{
    const xlFile = req.file
if(!xlFile){
    return next(error(new ErrorHandler("Please Provide Excel Spreadsheet ",400),req,res));
}
const workbook = reader.read(xlFile.buffer,{type:'buffer'});
const sheets = workbook.SheetNames[0];
const data = reader.utils.sheet_to_json(workbook.Sheets[sheets]);
const query = 
`
INSERT INTO students (
    admission_no,first_name,last_name,father_name,mother_name,profile_pic,class_id,student_address,transport,adhaar,due_fee,phone,whatsapp_number,email,gender,dob
)
VALUES %L 
`
const date = (input)=>{
    console.log(input)
    const unixTimestamp = (input - 25569) * 86400 * 1000

    // Create a Date object using the parts (note that months are 0-indexed in JavaScript, so we subtract 1 from the month)
    const dateObject = new Date(unixTimestamp);
    return `${dateObject.getFullYear()}/${dateObject.getMonth()}/${dateObject.getDate()}`;
}
pool.query(format(query,data.map(student=>[
    student.admission_no,student.first_name,student.last_name,
    student.father_name,student.mother_name,student.profile_pic,student.class_id,
    student.student_address,student.transport,student.adhaar,student.due_fee,
    student.phone,student.whatsapp_number,student.email,student.gender,date(student.dob)
])))
.then((result)=>{
    res.status(200).json({success:true,message:"Student Bulk Uploaded SuccessFully"});
})
.catch((err)=>{
    return next(error(new ErrorHandler(err.message,500),req,res));
})
}
const addAttendance = (req,res,next)=>{
    const class_id = req.params.cid;
    const xlFile = req.file
    if(!xlFile){
        return next(error(new ErrorHandler("Please Provide Excel Spreadsheet ",400),req,res));
    }
    else{
        const workbook = reader.read(xlFile.buffer,{type:'buffer'});
        const sheets = workbook.SheetNames[0];
        const data = reader.utils.sheet_to_json(workbook.Sheets[sheets]);
        const query = `INSERT INTO attendance(class_id,student_id,date,is_present) VALUES %L`;
        pool.query(format(query,data.map((item)=>[class_id,item.student_id,item.date,item.is_present])))
        .then((result)=>{
            res.status(200).json({success:true,message:"Attendance Recorded SuccessFully"});
        })
        .catch((err)=>{
            return next(error(new ErrorHandler(err.message,500),req,res));
        });
    }
   

}
const addTeachers = (req,res,next)=>{
    const xlFile = req.file
    if(!xlFile){
        return next(error(new ErrorHandler("Please Provide Excel Spreadsheet ",400),req,res));
    }
    else{
        const workbook = reader.read(xlFile.buffer,{type:'buffer'});
        const sheets = workbook.SheetNames[0];
        const data = reader.utils.sheet_to_json(workbook.Sheets[sheets]);

        const query = 
        `
        INSERT INTO teachers (name,salary,email,address,phone,whatsapp_number,profile_pic) VALUES %L RETURNING *
        `

        pool.query(format(query,data.map(item=>[item.name,item.salary,item.address,item.phone,item.whatsapp_number,item.profile_pic])))
        .then((result)=>{
            res.status(200).json({success:true,result:result.rows})
        })
        .catch((err)=>{
            return next(error(new ErrorHandler(err.message,500),req,res));
        })
}
}
module.exports={addClasses,addStudents,addAttendance,addTeachers}

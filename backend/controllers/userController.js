const pool = require("../config/db");
const jwt = require('jsonwebtoken');
const errorHandler = require('../middlewares/error');
const ErrorHandler = require('../utils/ErrorHandler')
const { REGISTER_QUERY, LOGIN_QUERY } = require("../queries/userQueries");

const registerUser = async(req,res,next)=>{
const {name,uname,email,password,role} = req.body;
pool.query(REGISTER_QUERY,[uname,email,password,role,name],(err,result)=>{
    if(err){
        return next(errorHandler(new ErrorHandler(err.message,403),req,res));
    }
    res.status(200).json({success:true,message:"User added SuccessFully"});
});
}

const login = async(req,res,next)=>{
    const {uname,password} = req.body;
    
    pool.query(LOGIN_QUERY,[uname,password],(err,result)=>{
        if(err){
            console.log(err)
            return next(errorHandler(new ErrorHandler("User Not Found",404),req,res));
        }
      
        try {
            const payload = {
                id:result.rows[0].uid,
                uname:result.rows[0].uname
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'30d'});
            res.status(200).cookie("token",token,{maxAge:30 * 24 * 60 * 60 * 1000}).json({success:true,user:result.rows[0],token:token});
        } catch (error) {
            return next(errorHandler(new ErrorHandler(error.message,500),req,res))
        }
      
    })
}
const me = async(req,res,next)=>{
 
   if(req.user){
    res.status(200).json({success:true,user:req.user});
   }
    else{
        return next(errorHandler(new ErrorHandler(errro.message,500),req,res))
    }
   


}
module.exports={registerUser,login,me}
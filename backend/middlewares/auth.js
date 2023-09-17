const jwt = require('jsonwebtoken');
const error = require('./error');
const pool = require('../config/db');
const ErrorHandler = require('../utils/ErrorHandler');
const { AUTH_QUERY } = require('../queries/userQueries');


const auth = async(req,res,next)=>{
    const token = req.headers['authorization']?.split(' ')[1];
 
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
      }
      let userCredentials;
      try {
        userCredentials = await jwt.verify(token,process.env.JWT_SECRET);
      } catch (err) {
       return res.status(404).json({success:false,message:"Not Allowed"})
      }
      if(!userCredentials){
        return(next(error(new ErrorHandler("Please Login First",401),req,res)));
      }
     
       pool.query(AUTH_QUERY,[userCredentials.id],(error,result)=>{
        if(error){
            res.status(404).json({success:false,message:"User Does Not Exist"});
            return;
        }

        req.user = result.rows[0];
        next();
      })

}

module.exports=auth
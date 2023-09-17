const error = (err,req,res)=>{
    err.code = err.code||500;
    err.message = err.message||"Internal Server Error";
    
    res.status(err.code).json({success:false,message:err.message});
}

module.exports = error;
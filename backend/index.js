const express = require('express');
var cors = require('cors');
var cookieParser = require('cookie-parser')
const cloudinary = require('cloudinary');
require('dotenv').config({path:'./process.env'});
const classRouter = require('./routes/classRoutes');
const bodyParser = require('body-parser')
const userRouter = require('./routes/userRoutes');
const studentRouter = require('./routes/studentsRoutes');
const subjectRouter = require('./routes/subjectRoutes');
const examRouter = require('./routes/examRoutes');
const teacherRouter = require('./routes/teacherRoutes');
const feeRouter = require('./routes/feeRoutes');
const adminRouter = require('./routes/adminRoutes');
const bulkRouter = require('./routes/bulkRouter')
const error = require('./middlewares/error');
const { updateFee } = require('./utils/chronJobs');
const { notify } = require('./middlewares/message');
const port = process.env.PORT||3000;
const app = express();
app.use(cookieParser());
app.use('/invoice',express.static(__dirname+'/invoices'));
app.use(cors());
updateFee.start();
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/v1/admin',adminRouter)
app.use('/api/v1/user',userRouter);
app.use('/api/v1/student',studentRouter);
app.use('/api/v1/class',classRouter)
app.use('/api/v1/subject',subjectRouter)
app.use('/api/v1/teacher',teacherRouter);
app.use('/api/v1/exam',examRouter);
app.use('/api/v1/fee',feeRouter);
app.use('/api/v1/bulk-upload',bulkRouter)
app.get('/',(req,res)=>{
  res.status(200).json("Hello")
})
app.listen(port,()=>{
    console.log("Application Started");
});


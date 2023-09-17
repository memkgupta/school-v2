import React, { useEffect ,useState} from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar';
import axios from 'axios';
import {BASE_URL} from '../constants/global';
import { useToken } from '../hooks/useCookie';
import { ColorRing } from 'react-loader-spinner';
import { Toaster, toast } from 'react-hot-toast';
import student_icon from '../assets/student_icon.jpeg'
import teacher_icon from '../assets/teacher_icon.png'
import fee_icon from '../assets/fee_icon.png';
import pending_fee_icon from '../assets/pending_fee_icon.png';
import DashboardCard from '../components/cards/DashboardCard';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Sector } from 'recharts';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [adminData,setAdminData] = useState(null);
  const navigate = useNavigate();
  const [student_data_ratio,setStudentRatio] = useState([]);
  function monthNumberToName(monthNumber) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    if (monthNumber >= 1 && monthNumber <= 12) {
        return monthNames[monthNumber - 1];
    } else {
        return "Invalid month number. Please enter a number between 1 and 12.";
    }
}
  const COLORS = ['#0088FE', '#00C49F', ];
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
    const user = useSelector(state=>state.user);
const token = useToken();
    useEffect(()=>{
      if(user.user.role==="Admin"){
       
          axios.get(`${BASE_URL}/admin`,{headers:{'Authorization':`Bearer ${token}`}}).then((res)=>{
            const admin_data = res.data;
        
            if(admin_data.success){
  setAdminData({success:true,data:admin_data.data});
  setStudentRatio([
    { name: 'Boys', value: parseInt(admin_data.data.total_students.male_students_count) },
    { name: 'Girls', value: parseInt(admin_data.data.total_students.female_students_count )},

  ])
            }
            else{
              setAdminData({success:false,error:"Some Error Occured"})
            }
          }).catch((error)=>{
            setAdminData({success:false,error:error.message});
            console.log(error)
            toast.error(error.message);
          })
   
       
      }
    
    },[user])
    
    return(

  <>

  <Toaster position='top-center'></Toaster>
  {adminData==null?
  <div className='grid place-items-center  min-h-screen min-w-screen'>
  <ColorRing
  visible={true}
  height="80"
  width="80"
  ariaLabel="blocks-loading"
  wrapperStyle={{}}
  wrapperClass="blocks-wrapper"
  colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
/>
  </div>
  :
(adminData.success?<>

<div className="grid grid-cols-1 md:grid-cols-3">
<DashboardCard image={student_icon} heading={"Total Students"} number={adminData.data.total_students.total_students}></DashboardCard>
<DashboardCard image={teacher_icon} heading={"Total Teachers"} number={adminData.data.total_teachers.total_teachers}></DashboardCard>
<DashboardCard image={fee_icon} heading={"Fee Collected This Month"} number={adminData.data.total_fee_payments.total_fee_payments}></DashboardCard>
<DashboardCard image = {pending_fee_icon} heading={"Total Fee Pending" } number={adminData.data.total_students.total_fee_pending}></DashboardCard>
</div>

{/* Students Stats */}
<div className="grid grid-cols-1 md:grid-cols-2 mt-8">
  {/* Sex Ratio */}
  <div style={{height:'400px'}} className=''>
    <p className='text-center'>Student Sex Ratio</p>
  <ResponsiveContainer width="100%" height="100%">
        <PieChart width={300} height={300}>
      <Tooltip></Tooltip>
          <Pie
            data={student_data_ratio}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {student_data_ratio.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            
          </Pie>
          <Legend/>
        </PieChart>
      </ResponsiveContainer>
     
  </div>

</div>
  {/* Classwise Strength */}
  <div className='mt-12' style={{height:'500px'}}>
    <p className="text-center">Student Strength ClassWise</p>
  <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={adminData.data.student_classwise}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="male_students_count" fill="#8884d8" />
          <Bar dataKey="female_students_count" fill="#eb5449" />
        </BarChart>
      </ResponsiveContainer>
  </div>
{/* Fee Payments Monthly */}
<div className='mt-12' style={{height:'500px'}}>

<ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={adminData.data.fee_stats_monthly.map(fee=>({month:monthNumberToName(parseInt(fee.month)),amount:parseInt(fee.sum)}))}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" />
          
        </BarChart>
      </ResponsiveContainer>
</div>
{/* Fee Section */}
<div className='grid grid-cols-1 md:grid-cols-2 mt-12'>
  {/* Fee Pending */}



  <div style={{height:'500px'}}>
    <p className="text-center mb-5">Fee Paid ClassWise This Month</p>

  <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={adminData.data.fee_stats_classwise}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" />
          
        </BarChart>
      </ResponsiveContainer>
  </div>
  <div style={{height:'500px'}}>
  <p className="text-center mb-5">Fee Pending ClassWise </p>
  <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={adminData.data.fee_pending}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sum" fill="#8884d8" />
          
        </BarChart>
      </ResponsiveContainer>
  </div>
</div>


</>:(<div>
  Some Error Occured
</div>))  
}
  </>
    )
    }
export default Home
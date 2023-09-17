import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../constants/global';
import { useToken } from '../hooks/useCookie';
import toast from 'react-hot-toast';
import TeachersTable from '../components/tables/TeachersTable';
import { ColorRing } from 'react-loader-spinner';
import { Link } from 'react-router-dom';

function Teachers() {
    const [isLoading,setLoading] = useState(true);
    const [teachers,setTeachers] = useState([]);
  
    
       
      
 
    useEffect(()=>{
        axios.get(`${BASE_URL}/teacher`,{headers:{'Authorization':`Bearer ${useToken()}`}})
        .then((res)=>{
   toast.success("Data Loaded SuccessFully");
  setTeachers(res.data.teachers);
  console.log(res.data)
   setLoading(false);

        })
        .catch((err)=>{
            toast.error("Some Error Occured");
            console.log(err.message);
        })
    },[])
  return (
    <>
  {
    isLoading ?<div className='grid place-items-center  min-h-screen min-w-screen bg-gray-200 bg-opacity-75'>
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
    <>
    {/* Main Content */}
<h3 className="text-3xl font-bold text-center mt-3">Teachers</h3>
<div className="flex justify-center">
    <Link to={'/teacher/add'} className='bg-red-500 p-3 rounded-md text-white mt-3'>Add Teacher</Link>
    <Link to={'/bulk/teacher'} className='bg-red-500 p-3 rounded-md text-white mt-3'>Bulk Add Teachers</Link>
   
    <Link to={'/teacher/replace'} className='bg-red-500 p-3 rounded-md text-white mt-3 mx-3'>Replace Teachers</Link>
</div>
<TeachersTable teachers={teachers}></TeachersTable>
    </>
  }
    </>
  )
}
export default Teachers
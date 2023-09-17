import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BASE_URL } from '../constants/global'
import { useToken } from '../hooks/useCookie'
import toast, { Toaster } from 'react-hot-toast'
import AttendanceInterface from '../components/Modals/AttendanceInterface'

function TeacherPanel() {
    const user = useSelector(state=>state.user.user);
    const [teacher,setTeacher] = useState(null);
    const [subjects,setSubjects] = useState([])
    
useEffect(()=>{
    if(user!={}){
        axios.get(`${BASE_URL}/teacher/manage/data`,{headers:{'Authorization':`Bearer ${useToken()}`}})
        .then((res)=>{
setTeacher(res.data.data);
        })
        .catch((err)=>{
            toast.error("Some Error Occured")
        })
    }
},[]);
useEffect(()=>{
    if(teacher!==null){
 axios.get(`${BASE_URL}/teacher/${teacher.id}`,{headers:{'Authorization':`Bearer ${useToken()}`}})

.then((res)=>{
    const data = res.data;
   
    setSubjects(data.subjects)
})
.catch((err)=>{
    console.log(err);
    toast.error("Some Error Occured")
})
    }
},[teacher])
  return (
  <>
  <Toaster></Toaster>
{teacher!==null&&<AttendanceInterface teacher={teacher}></AttendanceInterface>}
  </>
  )
}

export default TeacherPanel
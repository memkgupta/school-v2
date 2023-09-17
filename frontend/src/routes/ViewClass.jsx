import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ColorRing } from 'react-loader-spinner';
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { BASE_URL } from '../constants/global';
import { useToken } from '../hooks/useCookie';
import toast, { Toaster } from 'react-hot-toast';
import {BsPencilSquare} from 'react-icons/bs'
import StudentTable from '../components/tables/StudentTable';
import { useDispatch } from 'react-redux';
import { getStudentsThunk } from '../slices/studentSlice';
import ClassStudentsTable from '../components/tables/ClassStudentsTable';
import AttendanceCharts from '../components/charts/AttendanceCharts';
import SubjectTable from '../components/tables/SubjectTable';
import AddSubjects from '../components/Modals/AddSubjects';
import { getTeachers } from '../slices/teacherSlice';
function ViewClass() {
    const {cid} = useParams();
    const [isLoading,setLoading] = useState(true);
    const [data,setData] = useState({});
    const [addSubject,setAddSubject] = useState(false);
    const dispatch  = useDispatch();
    const close = ()=>{
        setAddSubject(false);
    }
useEffect(()=>{
axios.get(`${BASE_URL}/class/get/${cid}`,{headers:{'Authorization':`Bearer ${useToken()}`}}).then((res)=>{
    setData(res.data.data)
   console.log(res.data)
   dispatch(getTeachers(useToken()))
    setLoading(false);
}).catch((err)=>{
    console.log(err.message);
    toast.error("some error occured")
})
},[])
  return (
    <>
    <Toaster position='top-center'></Toaster>
    {
         isLoading?
         <div className='grid place-items-center  min-h-screen min-w-screen bg-gray-200 bg-opacity-75'>
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

{data&&
<>
<div className={`${addSubject?'':'hidden'}`}>
    <AddSubjects close={close} prevSubject={data.subjects} cid={cid}></AddSubjects>
</div>
<div className='grid grid-cols-1 md:grid-cols-2 justify-items-center mt-5 gap-y-3'>
        <div className="flex">
            <p className="text-xl font-bold">
                Name:-
            </p>
            <p className='ml-3 text-xl'>{data.name}</p>
        </div>
        <div className="flex">
            <p className="text-xl font-bold">
                Section:-
            </p>
            <p className='ml-3 text-xl'>{data.section}</p>
        </div>
        <div className="flex">
            <p className="text-xl font-bold">
                Class Teacher:-
            </p>
            <Link to={'/teacher/'+data.class_teacher} className='ml-3 text-xl'>{data.class_teacher_name}</Link>
             <button className='p-3 bg-red-500 text-white rounded-lg mx-3'><BsPencilSquare></BsPencilSquare></button>
        </div>
        <div className="flex">
            <p className="text-xl font-bold">
                Total Students:-
            </p>
            <p className='ml-3 text-xl'>{data.students.length}</p>
        </div>
     </div>
     <div className='mt-5' style={{maxHeight:'600px'}}>
        <p className="text-center text-2xl font-bold mb-5">Students</p>
     <ClassStudentsTable students={data.students}></ClassStudentsTable>
     </div>
     <div className='mt-5' style={{maxHeight:'600px'}}>
        <div className="flex justify-between p-12">
        <p className="text-center text-2xl font-bold mb-5">Subjects</p>
        <button className="bg-red-500 p-3 text-white rounded-md" onClick={(e)=>{
            setAddSubject(true);
        }}>Add Subjects</button>
        </div>
       
     <SubjectTable subjects={data.subjects}></SubjectTable>
     </div>
<div style={{height:'500px'}} className='mt-5'>
    <p className="text-center text-3xl font-bold mb-5">Attendance Trends Of Last month</p>
    <AttendanceCharts ></AttendanceCharts>
</div>
</>
   
     
     }
     </>
    }
    </>
   
  )
}

export default ViewClass
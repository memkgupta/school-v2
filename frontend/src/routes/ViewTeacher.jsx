import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ColorRing } from 'react-loader-spinner';
import { useParams } from 'react-router-dom';
import { useToken } from '../hooks/useCookie';
import toast, { Toaster } from 'react-hot-toast';
import { BASE_URL } from '../constants/global';
import ClassSubjectTable from '../components/tables/ClassSubjectTable';
import AddTeacherSubjects from '../components/Modals/AddTeacherSubjects';
import { useDispatch } from 'react-redux';
import { loadClassThunk } from '../slices/classSlice';

function ViewTeacher() {
    const [data,setData] = useState({});
    const [subjects,setSubjects] = useState([]);
    const [isLoading,setLoading] = useState(true);
    const [addSubject,setAddSubject] = useState(false);
    const dispatch = useDispatch()
    const close = ()=>{
        setAddSubject(false);
        setLoading(true)
        axios.get(`${BASE_URL}/teacher/${tid}`,{headers:{'Authorization':`Bearer ${useToken()}`}})
        .then((res)=>{
const data = res.data;
setData(data.teacher);
setSubjects(data.subjects)
setLoading(false);
console.log(data);
        })
        .catch((err)=>{
            toast.error("Some Error Occured");
        });
    }
    const {tid} = useParams();
    useEffect(()=>{
        dispatch(loadClassThunk(useToken()));
        axios.get(`${BASE_URL}/teacher/${tid}`,{headers:{'Authorization':`Bearer ${useToken()}`}})
        .then((res)=>{
const data = res.data;
setData(data.teacher);
setSubjects(data.subjects)
setLoading(false);
console.log(data);
        })
        .catch((err)=>{
            toast.error("Some Error Occured");
        });
    },[])
  return (
 <>
 <Toaster position='top-center'></Toaster>
{isLoading?<div className='grid place-items-center  min-h-screen min-w-screen bg-gray-200 bg-opacity-75'>
    <ColorRing
    visible={true}
    height="80"
    width="80"
    ariaLabel="blocks-loading"
    wrapperStyle={{}}
    wrapperClass="blocks-wrapper"
    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
  />
    </div>:
    // Main COntent
<>
{addSubject && <AddTeacherSubjects prevSubject={subjects} close={close} tid={tid}></AddTeacherSubjects>}
<div className='p-12'>
    {/* Info */}
<div className="rounded-lg shadow-lg mt-5 p-5">
    <div className="flex justify-center">
        <img src={data.profile_pic} alt="" className='rounded-full w-2/6 h-2/6 mb-5' />
    </div>
    <div className="mt-5 grid grid-cols-1 md:grid-cols-3 justify-items-center mt-3">
        <div className="flex items-center ">
            <h1 className='text-2xl mx-3 font-bold'>Name :</h1> <p className='text-2xl'>{data.name}</p>
        </div>
        <div className="flex items-center ">
            <h1 className='text-2xl mx-3 font-bold'>Email :</h1> <p className='text-2xl'>{data.email}</p>
        </div>
        <div className="flex items-center ">
            <h1 className='text-2xl mx-3 font-bold'>Phone :</h1> <p className='text-2xl'>{data.phone}</p>
        </div>
        <div className="flex items-center ">
            <h1 className='text-2xl mx-3 font-bold'>Whatsapp :</h1> <p className='text-2xl'>{data.whatsapp_number}</p>
        </div>
        <div className="flex items-center ">
            <h1 className='text-2xl mx-3 font-bold'>Salary :</h1> <p className='text-2xl'>{data.salary}</p>
        </div>
        <div className="flex items-center flex-wrap">
            <h1 className='text-2xl mx-3 font-bold'>Address :</h1> <p className='text-2xl'>{data.address}</p>
        </div>
    </div>
 </div>
 <p className="text-center text-3xl font-bold mt-8">Subjects And classes</p>
 <div className="rounded-lg shadow-lg mt-5 p-5">
    <div className="float-right">
        <button className='bg-red-500 p-3 text-white rounded-md mx-3 my-3' onClick={()=>{setAddSubject(true)}}>Add Subject</button>
    </div>
    <ClassSubjectTable data={subjects}></ClassSubjectTable>
 </div>
</div>
</>}
 </>
  )
}

export default ViewTeacher
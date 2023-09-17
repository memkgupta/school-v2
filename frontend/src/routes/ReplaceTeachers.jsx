import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../constants/global';
import { useToken } from '../hooks/useCookie';
import toast, { Toaster } from 'react-hot-toast';
import { getTeachers } from '../slices/teacherSlice';

function ReplaceTeachers() {
    const teachers = useSelector(state=>state.teacher.teachers);
    const dispatch = useDispatch();
    const [isLoading,setLoading] = useState(false);
    const [oldTeacher,setOldTeacher]=useState('');
    const [newTeacher,setNewTeacher]=useState('');
    const [teacherClasses,setTeacherClasses] = useState([]);
    const [classes,setClasses] = useState(null);
    const handleSelectorChange =(e)=>{
        if(e.target.name==='all'){
            setClasses(e.target.checked?null:[]);document.getElementById('select').checked = false;
        }
        else{
            setClasses(e.target.checked?[]:null);document.getElementById('all').checked = false;
        }
    }
    const handleAddClass = (cid,e)=>{
        if(e.target.checked){
            console.log(cid)
            setClasses([...classes,cid]);
        }
       else{
        const filtered = classes.filter(c=>c.class_id!=cid);
        setClasses(filtered);
       }
    }
    const handleSubmit = ()=>{
        setLoading(true);
        axios.put(`${BASE_URL}/teacher/replace/replace-teachers`,{oldTeacher:oldTeacher,newTeacher:newTeacher,classes},{headers:{'Authorization':`Bearer ${useToken()}`}})
        .then((res)=>{
            toast.success("Teacher Replaced SuccessFully");
            setNewTeacher('');
            setOldTeacher('');
            setLoading(false);
        })
        .catch((error)=>{
            toast.error("Some Error Occured")
        });
    }
    const loadClasses = (tid)=>{
        axios.get(`${BASE_URL}/subject/all?teacher_id=${tid}`,{headers:{'Authorization':`Bearer ${useToken()}`}})
        .then((res)=>{
            const data = res.data;
setTeacherClasses(data.subjects);
console.log(data)
        })
        .catch(()=>{
            toast.error("Some Error Occured");
        });
    }
    useEffect(()=>{
dispatch(getTeachers(useToken()));
    },[])
  return (
  <>
  <Toaster position='top-center'></Toaster>
{  isLoading ?<div className='grid place-items-center  min-h-screen min-w-screen bg-gray-200 bg-opacity-75'>
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
    <>
      <p className="text-center text-3xl font-bold mt-5">Replace Teachers</p>
{/* Teacher Selector */}
  <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center gap-5 mt-5">
    {/* old teacher */}
<div className="flex items-center">
<label>Select Teacher To be replaced</label>
  <select
                className="mx-5 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={oldTeacher}
                onChange={(e) =>{ setOldTeacher(e.target.value); loadClasses(e.target.value)}}
                required
              >
                <option value={''}>Select Teacher</option>
                {teachers.filter(teacher=>teacher.id!=newTeacher).map(teacher=>{
                    return(
                        <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                    )
                })}
                </select>
</div>
{/* new teacher */}
<div className="flex items-center">
<label>Select New Teacher </label>
  <select
                className="mx-5 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={newTeacher}
                onChange={(e) => setNewTeacher(e.target.value)}
                required
              >
                <option value={''}>Select Teacher</option>
                {teachers.filter(teacher=>teacher.id!=oldTeacher).map(teacher=>{
                    return(
                        <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                    )
                })}
                </select>
</div>
  </div>
  {/* Class Box */}
  {oldTeacher!=''&&
  <div className="md:flex p-4 justify-center mt-12">
<div className="grid">
    <div className="flex items-center">
        <label htmlFor="">All</label>
        <input type="radio" name="all" checked={classes===null} id="all" onChange={(e)=>{handleSelectorChange(e)}} />
    </div>
    <div className="flex items-center">
        <label htmlFor="">Select</label>
        <input type="radio" name="select" id="select" onChange={(e)=>{handleSelectorChange(e)}} />
    </div>
</div>

  <div className="grid grid-cols-4 gap-2 mx-5 shadow-lg rounded-lg">
    {
          teacherClasses.map((ele)=>{
            return(
               <div key={ele.class_id} className="flex p-3">
                 <input className='mx-3' type='checkbox' disabled={classes===null} onChange={(e)=>{handleAddClass(ele.class_id,e)}}/>
                <label htmlFor="">{ele.class}</label>
               </div>
            )
        })
    }
  </div>

  </div>
  
  }
  <div className="flex justify-center">

  <button className='bg-red-500 p-3 text-white' disabled={oldTeacher===''} onClick={handleSubmit}>Submit</button>
  </div>
    </>
}
  
  </>
  )
}

export default ReplaceTeachers
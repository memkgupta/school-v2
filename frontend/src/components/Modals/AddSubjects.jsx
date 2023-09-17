import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../constants/global';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useToken } from '../../hooks/useCookie';

function AddSubjects({prevSubject,cid,close}) {
    const [prevSubjects,setPrevSubjects] = useState(prevSubject);
    const teachers = useSelector(state=>state.teacher.teachers)
    const [subjects, setSubjects] = useState([{ name: '', teacher: '' }]);
    const handleSubjectChange = (index, field, value) => {
        const updatedSubjects = [...subjects];
        updatedSubjects[index][field] = value;
        setSubjects(updatedSubjects);
      };
      const handlePrevSubjectChange = (index, field, value) => {
        const updatedSubjects = [...prevSubjects];
        updatedSubjects[index][field] = value;
        setPrevSubjects(updatedSubjects);
      };
      const addSubject = () => {
        setSubjects([...subjects, { name: '', teacher: '' }]);
      };
      const removeSubject = (index) => {
        const updatedSubjects = [...subjects];
        updatedSubjects.splice(index, 1);
        setSubjects(updatedSubjects);
      };
      const updateSubject = (index)=>{
        const subject = prevSubjects[index];
     axios.put(`${BASE_URL}/class/subjects/update/${subject.id}`,{name:subject.name,teacher_id:subject.teacher_id},{headers:{'Authorization':`Bearer ${useToken()}`}})
     .then((res)=>{
        toast.success("Subject Updated SuccessFully");
     })
     .catch((err)=>{
        console.log(err.message)
        toast.error("Some Error Occured")
     })
      }
      const handleSubmit = (e)=>{
        e.preventDefault();
        console.log(subjects);
        axios.post(`${BASE_URL}/class/subjects/add/${cid}`,{subjects},{headers:{'Authorization':`Bearer ${useToken()}`}})
        .then((res)=>{
            const data = res.data;
      console.log(data.subjects)
            if(data.success){
                setSubjects([]);
                toast.success("Subjects Added SuccessFully");
                data.subjects.forEach(subject=>{
                    setPrevSubjects([...prevSubject,subject]);
                })
               
            }
else{
    toast.error("Some Error Occured");
    console.log(data.message);
}
        })
        .catch((err)=>{
            console.log(err);
            toast.error(err);
        })
      }
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75' style={{zIndex:999}}>

 <div className="bg-white rounded p-4">
 <button onClick={close} className="relative mb-5 bg-red-500 text-white rounded-md p-3" style={{position:'relative',left:'80%'}}>Close</button>
 {
            prevSubjects.map((subject,index)=>{
           return(
            <div key={index} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Subject {index + 1}
            </label>
            <div className="flex items-center">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Enter subject name"
                value={subject.name}
                onChange={(e) => handlePrevSubjectChange(index, 'name', e.target.value)}
                required
              />
              <select
                className="ml-2 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={subject.teacher_id}
                onChange={(e) => handlePrevSubjectChange(index, 'teacher', e.target.value)}
                required
              >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher)=>{
                    return <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                   })}
   
                {/* Add options for teachers here */}
              </select>
              <button
                className="ml-2 bg-red-500 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => updateSubject(index)}
              >
                Update
              </button>
            </div>
          </div>
           )
            })
        }
        <hr></hr>
              {subjects.map((subject, index) => (
        <div key={index} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Subject {index + 1}
          </label>
          <div className="flex items-center">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Enter subject name"
              value={subject.name}
              onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
              required
            />
            <select
              className="ml-2 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={subject.teacher}
              onChange={(e) => handleSubjectChange(index, 'teacher', e.target.value)}
              required
            >
                <option value="">Select Teacher</option>
                {teachers.map((teacher)=>{
                  return <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                 })}
 
              {/* Add options for teachers here */}
            </select>
            <button
              className="ml-2 bg-red-500 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => removeSubject(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
          <button
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={addSubject}
      >
        Add Subject
      </button>
      <button
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        disabled ={subjects.length<1}
        onClick={handleSubmit}
      >
        Submit
      </button>
 </div>
    </div>
  )
}

export default AddSubjects
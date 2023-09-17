import axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { BASE_URL } from '../constants/global';
import { useToken } from '../hooks/useCookie';
import toast from 'react-hot-toast';

function AddClassForm() {
    const [className, setClassName] = useState('');
    const [classSection, setClassSection] = useState('');
    const [subjects, setSubjects] = useState([{ name: '', teacher: '' }]);
    const [class_teacher,setClassTeacher] = useState('');
    const [fee_structure,setFeeStructure] = useState({monthly_amount:0,total_amount:0})
    const teachers = useSelector(state=>state.teacher.teachers)||[];
  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };
  const addSubject = () => {
    setSubjects([...subjects, { name: '', teacher: '' }]);
  };
  const removeSubject = (index) => {
    const updatedSubjects = [...subjects];
    updatedSubjects.splice(index, 1);
    setSubjects(updatedSubjects);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${BASE_URL}/class/add`,{name:className,section:classSection,subjects:subjects,class_teacher},{headers:{'Authorization':`Bearer ${useToken()}`}})
    .then((res)=>{
      console.log(res.data);
     if(res.data.success){
toast.success("Class Added SuccessFully");
     }
     else{
      toast.error(res.data.message)
     }
    })
    .catch((err)=>{
      console.log(err.message);
      toast.error(err.message)
    })
    // Handle form submission logic here (e.g., sending data to a server).
    // You can use className and classDescription state variables to access form data.
  };
  return (
    <div className="w-full max-w-md mx-auto">
      
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
     
      {/* Other fields */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="classSection">
          Class Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="className"
          type="text"
          placeholder="Enter class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="classSection">
          Class Section
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="classSection"
          type="text"
          placeholder="Enter class section"
          value={classSection}
          onChange={(e) => setClassSection(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="classSection">
          Class Teacher
        </label>
        <select
              className="ml-2 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={class_teacher}
              onChange={(e) => setClassTeacher(e.target.value)}
              required
            >
                <option value="">Select Teacher</option>
                 {teachers.map((teacher)=>{
                  return <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                 })}
   
              {/* Add options for teachers here */}
            </select>
      </div>
      {/* Subjects */}
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

      {/* Submit button */}
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Add Class
        </button>
      </div>
    </form>
  </div>
  )
}

export default AddClassForm
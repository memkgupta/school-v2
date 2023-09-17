import React, { useState } from 'react'
import {useToken} from '../hooks/useCookie'
import axios from 'axios';
import {BASE_URL} from '../constants/global';
import { useDispatch } from 'react-redux';
import {getStudentsThunk, updateStudents} from '../slices/studentSlice';
import { toast } from 'react-hot-toast';
function FilterBox() {
  const dispatch=useDispatch();
  const token = useToken();
function clearFilters(){
  document.getElementById('student_class').value = '';
  document.getElementById('keyword').innerText='';
  document.getElementById('f_name').innerText='';
  dispatch(getStudentsThunk(token));
}
    function filterStudents(field,value){
      
setTimeout(async()=>{

  const student_class = document.getElementById('student_class').value;
  const keyword = document.getElementById('keyword').value;
  const f_name = document.getElementById('f_name').value;
  try {
    const res = await axios.get(`${BASE_URL}/student/all?${student_class!=null?`class_id=${student_class}`:''}${keyword!=null&&keyword.length>1?`&keyword=${keyword}`:''}${f_name!=null&&f_name.length>1?`&f_name=${f_name}`:''}`,{headers:{'Authorization':`Bearer ${token}`}})
   console.log(res.data.students)
    dispatch(updateStudents(res.data.students));
  } catch (error) {
     toast.error("Some Error Occured");
  }

},1000);
    }
    
  return (
    <div className="bg-white p-4 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-4 justify-items-center">
    <div className="mb-4">
      <label htmlFor="class" className="block text-gray-600 font-semibold mb-2">
        Class
      </label>
      <select
      onChange={(e)=>{filterStudents('student_class',e.target.value)}}
        id="student_class"
        name="class"
        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-red-300"
      >
        {/* Add options for different classes */}
        <option value={""}>All</option>
        <option value={1}>class 1</option>
        {/* Add more options as needed */}
      </select>
    </div>

    <div className="mb-4">
      <label htmlFor="studentName" className="block text-gray-600 font-semibold mb-2">
        Student Name
      </label>
      <input
      onChange={(e)=>{filterStudents('keyword',e.target.value)}}
        type="text"
        id="keyword"
        name="studentName"
        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-red-300"
      />
    </div>

    <div>
      <label htmlFor="fatherName" className="block text-gray-600 font-semibold mb-2">
        Father Name
      </label>
      <input
      onChange={(e)=>{filterStudents('f_name',e.target.value)}}
        type="text"
        id="f_name"
        name="fatherName"
        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-red-300"
      />
    </div>
    <button onClick={(e)=>{clearFilters()}} className='bg-red-500 rounded-md p-2 my-3'>Clear Filters</button>
  </div>
  )
}

export default FilterBox
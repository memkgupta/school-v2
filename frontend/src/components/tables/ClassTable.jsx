import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../constants/global';
import { useToken } from '../../hooks/useCookie';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

function ClassTable({setLoading}) {
    const [data,setData] = useState([]);
    useEffect(()=>{
        axios.get(`${BASE_URL}/class/`,{headers:{'Authorization':`Bearer ${useToken()}`}})
        .then((res)=>{
            const data = res.data;
console.log(data)
            setData(data.classes);
            setLoading();
        })
        .catch((err)=>{
            console.log(err.message);
            toast.error("Can't load Data")
        })
    },[])
  return (
    <table className="min-w-full table-auto border-collapse border border-gray-300 p-5 rounded-md">
    <thead className='bg-slate-800   text-white'>
      <tr>
        <th className="border border-gray-300 py-2">ID</th>
        <th className="border border-gray-300 py-2">Name</th>
        <th className="border border-gray-300 py-2">SECTION</th>
        <th className="border border-gray-300 py-2">Class Teacher</th>
        <th className="border border-gray-300 py-2">Total Students</th>
        <th className="border border-gray-300 py-2">Actions</th>
       
      </tr>
    </thead>
    <tbody>
      {data.map((cls) => (
        <tr key={cls.id}>
          <td className="py-2 px-3 border border-gray-300">{cls.id}</td>
          <td className="py-2 px-3 border border-gray-300">{cls.name}</td>
          <td className="py-2 px-3 border border-gray-300">{cls.section}</td>
          <td className="py-2 px-3 border border-gray-300">{cls.teacher_name}</td>
          <td className="py-2 px-3 border border-gray-300">{cls.total_students}</td>
          <td className="py-2 px-3 border border-gray-300"><Link to={`/class/${cls.id}`}>View</Link></td>
       
        </tr>
      ))}
    </tbody>
  </table>
  )
}

export default ClassTable
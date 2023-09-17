import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom';
import { BASE_URL } from '../../constants/global';

function StudentTable() {
    const data = useSelector(state=>state.student);
    const students = data.students;
  console.log(students)
    return (
    <div className="w-full">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200 border border-gray-300">ID</th>
            <th className="py-2 px-4 bg-gray-200 border border-gray-300">Admission No.</th>
            <th className="py-2 px-4 bg-gray-200 border border-gray-300"> Name</th>

            <th className="py-2 px-4 bg-gray-200 border border-gray-300">Father Name</th>
            
            <th className="py-2 px-4 bg-gray-200 border border-gray-300">Mother Name</th>
            <th className="py-2 px-4 bg-gray-200 border border-gray-300">Address</th>
            <th className="py-2 px-4 bg-gray-200 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.student_id}>
              <td className="py-2 px-4 border border-gray-300">{student.student_id}</td>
              <td className="py-2 px-4 border border-gray-300">{student.admission_no}</td>
              <td className="py-2 px-4 border border-gray-300">{student.first_name+" "+student.last_name}</td>
              <td className="py-2 px-4 border border-gray-300">{student.father_name}</td>
              <td className="py-2 px-4 border border-gray-300">{student.mother_name}</td>
              <td className="py-2 px-4 border border-gray-300">{student.student_address}</td>
              <td className="py-2 px-4 border border-gray-300">{<NavLink to={`/student/${student.student_id}`} className={`text-red-500`}>View</NavLink>}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentTable
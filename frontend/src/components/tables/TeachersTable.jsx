import React from 'react'
import { NavLink } from 'react-router-dom'

function TeachersTable({teachers}) {
  return (
   <>
   {/* Table Form */}
    <div className="w-full  md:block mt-8">
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-1 bg-gray-200 border border-gray-300">ID</th>
            <th className="py-2 px-1 bg-gray-200 border border-gray-300"> Profile Pic</th>
            <th className="py-2 px-1 bg-gray-200 border border-gray-300"> Name</th>

            <th className="py-2 px-1 bg-gray-200 border border-gray-300">Email</th>
            
            <th className="py-2 px-1 bg-gray-200 border border-gray-300">Phone Number</th>
         
            <th className="py-2 px-1 bg-gray-200 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td className="py-2 px-1 border border-gray-300">{teacher.id}</td>
              <td className="py-2 px-1 border border-gray-300"><img src={teacher.profile_pic} alt="" className="rounded-full w-10 h-10" /></td>
              <td className="py-2 px-1 border border-gray-300">{teacher.name}</td>
              <td className="py-2 px-1 border border-gray-300">{teacher.email}</td>
              <td className="py-2 px-1 border border-gray-300">{teacher.phone}</td>
           
              <td className="py-2 px-1 border border-gray-300">{<NavLink to={`/teacher/view/${teacher.id}`} className={`text-red-500`}>View</NavLink>}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
   </>
  )
}

export default TeachersTable
import React from 'react'
import { Link } from 'react-router-dom'

function SubjectTable({subjects}) {
  return (
    <>
        <div className="w-full">
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr>

          <th className="py-2 px-4 bg-gray-200 border border-gray-300">S.no</th>
          <th className="py-2 px-4 bg-gray-200 border border-gray-300"> Name</th>

          <th className="py-2 px-4 bg-gray-200 border border-gray-300">Teacher</th>
          

          <th className="py-2 px-4 bg-gray-200 border border-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody>
        {subjects.map((subject,index) => (
          <tr key={index}>

            <td className="py-2 px-4 border border-gray-300">{index+1}</td>
            <td className="py-2 px-4 border border-gray-300">{subject.name}</td>
            <td className="py-2 px-4 border border-gray-300 text-center"><Link to={`/teacher/${subject.teacher_id}`}>{subject.teacher}</Link></td>

            

          </tr>
        ))}
      </tbody>
    </table>
  </div>
    </>
  )
}

export default SubjectTable
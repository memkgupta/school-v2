import React from 'react'
import { Link } from 'react-router-dom'

function ClassStudentsTable({students}) {
  return (
    <div className="w-full">
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr>

          <th className="py-2 px-4 bg-gray-200 border border-gray-300">Admission No.</th>
          <th className="py-2 px-4 bg-gray-200 border border-gray-300"> Name</th>

          <th className="py-2 px-4 bg-gray-200 border border-gray-300">Father Name</th>
          

          <th className="py-2 px-4 bg-gray-200 border border-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody>
        {students&&students.sort((a,b)=>a.admission_no-b.admission_no).map((student) => (
          <tr key={student.student_id}>

            <td className="py-2 px-4 border border-gray-300">{student.admission_no}</td>
            <td className="py-2 px-4 border border-gray-300">{student.name}</td>
            <td className="py-2 px-4 border border-gray-300">{student.father_name}</td>

            <td className="py-2 px-4 border border-gray-300">{<Link to={`/student/${student.student_id}`} className={`text-red-500`}>View</Link>}</td>

          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default ClassStudentsTable
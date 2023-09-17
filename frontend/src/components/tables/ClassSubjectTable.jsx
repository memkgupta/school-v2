import React from 'react'
import { Link } from 'react-router-dom'

function ClassSubjectTable({data}) {
  return (
    <table className="min-w-full table-auto border-collapse border border-gray-300 p-5 rounded-md">
    <thead className='bg-slate-800   text-white'>
      <tr>
        <th className="border border-gray-300 py-2">ID</th>
        <th className="border border-gray-300 py-2">Name</th>
        <th className="border border-gray-300 py-2">Class</th>

        <th className="border border-gray-300 py-2">Actions</th>
       
      </tr>
    </thead>
    <tbody>
      {data.map((subject) => (
        <tr key={subject.id}>
          <td className="py-2 px-3 border border-gray-300 text-center">{subject.id}</td>
          <td className="py-2 px-3 border border-gray-300 text-center">{subject.name}</td>
          <td className="py-2 px-3 border border-gray-300 text-center">{subject.class_name}</td>

          <td className="py-2 px-3 border border-gray-300 text-center"><Link to={`/subject/replace-teacher/${subject.id}`}>Replace</Link></td>
       
        </tr>
      ))}
    </tbody>
  </table>
  )
}

export default ClassSubjectTable
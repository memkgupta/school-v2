import React, { useEffect, useState } from 'react'

function ExcelTable({data}) {
    const [keys,setKeys] = useState([]);

const d = (input)=>{
    const unixTimestamp = (input - 25569) * 86400 * 1000;

// Create a JavaScript Date object
const dateObject = new Date(unixTimestamp);
return `${dateObject.getFullYear()}/${dateObject.getMonth()}/${dateObject.getDate()}`
}
useEffect(()=>{
   data[0] && setKeys(Object.keys(data[0]))
},[data])
    return (
    <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded my-6">
    <thead>
      <tr>
      {keys.map(key=>{
     return(
        <th className="w-1/5 bg-gray-100 border text-left px-4 py-2">{key}</th>
     )
      })}

      </tr>
    </thead>
    <tbody>
      {data.map((item,index) => (
        <tr key={index}>
      {
       keys.map((key)=>{
        return(<td key={key} className='border px-4 py-2'>{item[key]}</td>)
       })
      }
  
            
        
        </tr>
      ))}
    </tbody>
  </table>
  )
}

export default ExcelTable
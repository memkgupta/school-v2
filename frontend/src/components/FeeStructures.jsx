import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../constants/global';
import axios from 'axios';
import { useToken } from '../hooks/useCookie';
import toast from 'react-hot-toast';
import { ColorRing } from 'react-loader-spinner';

function FeeStructures({openAddDialogue,showEditModal}) {
    const [data,setData] = useState([
      
    ]);
 
    const [isLoading,setIsLoading] = useState(true); 
    useEffect(()=>{
        setIsLoading(true);
        axios.get(`${BASE_URL}/fee/get-fee-structures`,{headers:{'Authorization':`Bearer ${useToken()}`}}).then((res)=>{
            const data = res.data;
            setIsLoading(false);
            setData(data.fee_structures);
        }).catch((error)=>{
            setIsLoading(false);
            console.log(error.message)
            toast.error("Some Error Occured")
        })
    },[])
  return (
    <>
       { isLoading ?
 <>
 <div className="w-full overflow-hidden rounded-lg shadow-xs  mt-12">
<p className="text-center font-bold text-4xl mb-2">Fee Structures</p>
<div className="w-full overflow-x-auto ">
<table className="w-full whitespace-no-wrap">
<thead>
 <tr className="text-left bg-gray-800">
   <th className="px-6 py-3 text-gray-200">ID</th>
   <th className="px-6 py-3 text-gray-200">Class</th>
   <th className="px-6 py-3 text-gray-200">Monthly Amount</th>
   <th className="px-6 py-3 text-gray-200">Total Amount</th>
 </tr>
</thead>

</table>
</div>
<div className='relative top-0 w-full    bg-gray-200 bg-opacity-75' style={{zIndex:'9999'}}>
        
    <div className="flex justify-center">

    <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
        />
    </div>
        
          </div>
</div>
 </>
    :
<div className="w-full overflow-hidden rounded-lg shadow-xs  mt-12">
<p className="text-center font-bold text-4xl mb-2">Fee Structures</p>
<div className="w-full overflow-x-auto ">
<table className="w-full whitespace-no-wrap">
<thead>
  <tr className="text-left bg-gray-800">
    <th className="px-6 py-3 text-gray-200">ID</th>
    <th className="px-6 py-3 text-gray-200">Class</th>
    <th className="px-6 py-3 text-gray-200">Monthly Amount</th>
    <th className="px-6 py-3 text-gray-200">Total Amount</th>
    <th className="px-6 py-3 text-gray-200">Action</th>
  </tr>
</thead>
<tbody>
  {data.map((row,index) => (
    <tr key={row.id} className={`${index%2==0&& 'bg-gray-200'}`}>
      <td className="px-6 py-4">{row.id}</td>
      <td className="px-6 py-4">{row.class}</td>
      <td className="px-6 py-4">{row.monthly_amount}</td>
      <td className="px-6 py-4">{row.total_amount}</td>
      <td className="px-6 py-4"><button className='bg-red-500 p-2 rounded-lg text-white' onClick={(e)=>{showEditModal(row)}}>Edit</button></td>
    </tr>
  ))}
</tbody>
</table>
<div className="flex justify-center">
  <button className='bg-red-500 p-3 rounded-lg text-white mt-3' onClick={openAddDialogue}>Add Fee Structure</button>
</div>
</div>
</div>}
    </>

  )
}

export default FeeStructures
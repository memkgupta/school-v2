import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../constants/global';
import toast from 'react-hot-toast';
import { useToken } from '../hooks/useCookie';
import { ColorRing } from 'react-loader-spinner';

function FeePayments() {
    const [isLoading,setIsLoading] = useState(true); 
    const [data,setData] = useState([
  
    ]);
    const [total,setTotal] = useState(0);
    const [keyword,setKeyword] = useState(null);
    const [from,setFrom] = useState(null);
    const [to,setTo] = useState(null);
    const [page,setPage] = useState(1)
    const formateDate = (input)=>{
        const date = new Date(input);
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    }
//     const formateDate2 = (input)=>{
//         const dateString = '2023-09-09';

// // Split the date string into year, month, and day parts
// const [year, month, day] = dateString.split('-').map(Number);

// // Create a new Date object
// const dateObject = new Date(year, month - 1, day);
//      return formateDate()
//     }
const handlePageChange = (page)=>{
setPage(page);
}
    useEffect(()=>{
        let query = ``;
        if(keyword!=null){
            query+=`keyword=${keyword}&`;
        }
        if(from!=null){
            query+=`from=${formateDate(from)}&`
        }
        if(to!=null){
            query+=`to=${formateDate(to)}&`;
        }
        if(page){
            query+=`page=${page}`;
        }
        if(query.endsWith('&')){
            query.slice(0,-1);
        }
        console.log(query);
        setIsLoading(true);
     
        axios.get(`${BASE_URL}/fee/get-fee-payments?${query}`,{headers:{'Authorization':`Bearer ${useToken()}`}}).then((res)=>{
            console.log(res.data);
            setData(res.data.fee_payments);
                setTotal(res.data.total);
                setIsLoading(false);
         
        })
        .catch((err)=>{
toast(err.message,{duration:'2000',iconTheme:'error'})
        })
    },[keyword,from,to,page])
  return (
    <>
   
        <div className="w-full overflow-hidden rounded-lg shadow-lg mt-12">
        <p className="text-center text-4xl font-bold mb-2">Fee Payments</p>
        <div className="grid grid-cols-1 md:grid-cols-3 justify-items-center mb-2">
            <div className="flex">
                <label htmlFor="keyword" className='p-3'>Student Name</label>
                <input type="text" name="keyword" id="keyword" onChange={(e)=>{setKeyword(e.target.value)}} className='border border-black mx-3 p-3 outline-red-500 leading-tight' placeholder='Filter By Student name'/>
            </div>
            <div className="flex">
                <label htmlFor="from" className='p-3'>From :-</label>
                <input  type="date" name="from" id="from" onChange={(e)=>{setFrom(e.target.value)}} className='mx-3 p-3 border border-black  '/>
            </div>
            <div className="flex">
                <label htmlFor="to" className='p-3'>To :-</label>
                <input type="date" name="to" id="to" onChange={(e)=>{setTo(e.target.value)}} className='mx-3 p-3 border border-black'/>
            </div>
        </div>
    <div className="w-full overflow-x-auto " style={{maxHeight:'700px'}}>
        <p className="text-center">Total</p>
        {
       
       isLoading?
      
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
         
           </div>:
    data.length>0 &&   <table className="w-full whitespace-no-wrap p-3">
     
    <thead>
      <tr className="text-left bg-blue-500 text-white">
        <th className="px-6 py-3">S.no</th>
        <th className="px-6 py-3">Payment Id</th>
        <th className="px-6 py-3">Student Name</th>
        <th className="px-6 py-3">Date (yyyy-mm-dd)</th>
        <th className="px-6 py-3">Class</th>
        <th className="px-6 py-3"> Amount</th>
        <th className="px-6 py-3">Invoice</th>
      </tr>
    </thead>
 
    <tbody>
   
      {data.map((payment,index) => (
        <tr key={payment.id}>
             <td className="px-6 py-4">{index+1}</td>
          <td className="px-6 py-4">{payment.id}</td>
          <td className="px-6 py-4">{payment.name}</td>
          <td className="px-6 py-4">{formateDate(payment.date)}</td>
          <td className="px-6 py-4">{payment.class}</td>
          <td className="px-6 py-4">{payment.amount}</td>
          <td className="px-6 py-4"><a href={payment.invoice?payment.invoice:'/not-found'}>Invoice</a></td>
        </tr>
      ))}
    </tbody>
  </table>
 }
  
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center">
{total!=0&&<>

    <button className='bg-blue-500 p-3 rounded-lg' onClick={(e)=>{handlePageChange(page-1)}} disabled={page===1}>Prev</button>
<button className='bg-blue-500 p-3 rounded-lg' onClick={(e)=>{handlePageChange(page+1)}} disabled={Math.ceil(total/20)==page}>Next</button>
</>}
    </div>
  </div>
    </>

  )
}

export default FeePayments
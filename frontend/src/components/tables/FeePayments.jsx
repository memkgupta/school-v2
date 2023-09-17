import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../constants/global';
import { useToken } from '../../hooks/useCookie';
import { Toaster, toast } from 'react-hot-toast';
import { ColorRing } from 'react-loader-spinner';

function FeePayments({sid}) {
   const currentDate = new Date();
    const [loading,setLoading] =useState(false);
    const [payments,setPayments] = useState([]);
    const formatDate = (input)=>{
        const date = new Date(input);
        const year = date.getFullYear();
        const day = date.getDate();
        const month = date.getMonth()+1;
    
        return `${year}-${month}-${day}`
    }
    const unformatDate = (input)=>{
        return new Date(input).toISOString().split('T')[0];
    }
    
    const monthName = (month)=>{
        let tempDate = new Date();
    tempDate.setMonth(month);
 
    return tempDate.toLocaleDateString('en-us',{month:'short'})
    }
  useEffect(()=>{
    setLoading(true);
axios.get(`${BASE_URL}/fee/get-fee-payments/${sid}`,{headers:{'Authorization':`Bearer ${useToken()}`}}).then((res)=>{
const data = res.data;
setPayments(data.payments);

}).catch((error)=>{
    console.log(error.message)
toast.error("Some Error Occured while loading fee payments")
}).finally(setLoading(false))
  },[sid]);

    return (

<>
<Toaster position='top-center'></Toaster>
{payments&&

<>
<div className="container mx-auto p-5">
     <div className="grid grid-cols-1 md:grid-cols-2">
     <h2 className="text-2xl font-semibold mb-4">Fee Payments</h2>
    
     </div>
      <table className="min-w-full bg-white border rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="w-1/4 py-2 px-4">S.No</th>
            <th className="w-1/4 py-2 px-4">Amount</th>
            <th className="w-1/4 py-2 px-4">Month</th>
            <th className="w-1/4 py-2 px-4">Date(yyyy-mm-dd)</th>
            <th className="w-1/4 py-2 px-4">Invoice</th>
          </tr>
        </thead>
       {loading?
       <div className='grid place-items-center  min-h-screen min-w-screen bg-gray-200 bg-opacity-75'>
        <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
      />
        </div>:
        
       
      payments.length>0?
            <>
           <tbody className="text-gray-700">
            {           payments.map((payment)=>{
            return(
                <tr>
                <td className="py-2 px-4">{payment.id}</td>
                <td className="py-2 px-4">{payment.amount}</td>
                <td className="py-2 px-4">{monthName(payment.month)}</td>
                <td className="py-2 px-4">{formatDate(payment.date)}</td>
                <td className='py-2 px-4'><a href={payment.invoice} target='_blank'>Invoice</a></td>
              </tr>
            )
                       } )} </tbody>
            </>
    :<>
    </>
         
        
     
       
                    }
      </table>
      
    </div>
</>

  
}
{payments.length<1&&<div className='mt-auto mb-auto  text-4xl font-bold flex justify-center min-w-screen'><p>No Payments Found</p></div>}
</>
  )
}

export default FeePayments
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { BASE_URL } from '../../constants/global';
import { useToken } from '../../hooks/useCookie';

function EditFeeStructure({structure,closeModal}) {
    const [monthlyAmount, setMonthlyAmount] = useState(structure&&structure.monthly_amount);
    const [totalAmount, setTotalAmount] = useState(structure&&structure.total_amount);
    const submit = (e)=>{
        e.preventDefault();
       
        axios.put(`${BASE_URL}/fee/update-fee-structure/${structure.class_id}`,{monthly_amount:monthlyAmount,total_amount:totalAmount},{headers:{'Authorization':`Bearer ${useToken()}`}})
        .then((result)=>{
            const data= result.data;
           
            if(data.success){
                toast.success("Fee Structure Edited SuccessFully");
                
            }
        else{
            toast.error(data.message);
        }
        })
        .catch((err)=>{
        toast.error(err.message)
        })
        .finally(
        
        )
            }
            useEffect(()=>{
                structure&&setMonthlyAmount(structure.monthly_amount)
                structure&&setTotalAmount(structure.total_amount);
            },[structure])
    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75`} style={{zIndex:9999}}>
    <div className="modal-overlay ">
        <Toaster position='top-center'></Toaster>
    </div>

    <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
      {/* Modal content */}
      <div className="modal-content py-4 text-left px-6">
        {/* Add your modal content here */}
        <h2 className="text-xl font-semibold mb-4 text-red-600">Edit Fee Structure</h2>
        
        <div className="container mx-auto mt-5">
      <h2 className="text-xl font-semibold mb-4">Edit Fee Structure</h2>
      <form onSubmit={submit}>
  
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="monthlyAmount">
            Monthly Amount
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            id="monthlyAmount"
            required
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalAmount">
            Total Amount
          </label>
          <input
            type="number"
            required
            className="w-full px-3 py-2 border rounded-lg"
            id="totalAmount"
            min={monthlyAmount*12}
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />
        </div>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full mt-4 ml-2"
          type='submit'
        >
          Submit
        </button>
      </form>
    </div>
        
         <div className="flex justify-center">
         <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full mt-4 ml-2"
          onClick={closeModal}
        >
          Close Modal
        </button>
       
         </div>
     

      </div>
    </div>
  </div>
  )
}

export default EditFeeStructure
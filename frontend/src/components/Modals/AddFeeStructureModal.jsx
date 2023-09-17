import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import {AiOutlineWarning} from 'react-icons/ai'
import axios from 'axios';
import { BASE_URL } from '../../constants/global';
import { useToken } from '../../hooks/useCookie';
function AddFeeStructureModal({closeModal}) {
    const classes = useSelector(state=>state.class.classes)
    const [classValue, setClassValue] = useState('');
    const [monthlyAmount, setMonthlyAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const submit = (e)=>{
e.preventDefault();
if(classValue===''){
    toast.error("Please Select the class")
    return ;
}
axios.post(`${BASE_URL}/fee/add-fee-structure`,{class_id:classValue,monthly_amount:monthlyAmount,total_amount:totalAmount},{headers:{'Authorization':`Bearer ${useToken()}`}})
.then((result)=>{
    const data= result.data;

    if(data.success){
      toast.success("Fee Structure Added SuccessFully");
        closeModal()
     
  
    }
else{
  toast.error("Fee Structure Already Exist For this class");
    closeModal()
   
}
})
.catch((err)=>{
toast.error(err.message)
})
.finally(

)
    }
  return (
    <>
    
      <div className={`fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75`} style={{zIndex:9999}}>
    <div className="modal-overlay ">
        <Toaster position='top-center'></Toaster>
    </div>

    <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
      {/* Modal content */}
      <div className="modal-content py-4 text-left px-6">
        {/* Add your modal content here */}
        <h2 className="text-xl font-semibold mb-4 text-red-600">Add Fee Structure</h2>
        
        <div className="container mx-auto mt-5">
      <h2 className="text-xl font-semibold mb-4">Add Fee Structure</h2>
      <form onSubmit={submit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="class">
            Class
          </label>
          <select
            className="w-full px-3 py-2 border rounded-lg appearance-none"
            id="class"
            value={classValue}
            onChange={(e) => setClassValue(e.target.value)}
          >
           
            <option value="">Select Class</option>
          
            {classes&&classes.map((class_item)=>(
                <option key={class_item.class_id} value={class_item.id}>{class_item.name+' '+class_item.section}</option>
            ))}
         
          </select>
        </div>
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
    </>
  
  )
}

export default AddFeeStructureModal
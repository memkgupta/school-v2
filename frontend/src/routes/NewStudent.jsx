import React, { useEffect, useState } from 'react'
import student_icon from '../assets/student_icon.jpeg';
import axios from 'axios';
import { useToken } from '../hooks/useCookie';
import { Toaster, toast } from 'react-hot-toast';
import { BASE_URL } from '../constants/global';
import { ColorRing } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'react-redux';
import { loadClassThunk } from '../slices/classSlice';
function NewStudent() {
  const dispatch =useDispatch();
    const [isLoading,setIsLoading] = useState(false);
    const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
const [formData,setFormData] = useState({
    first_name:"",
    last_name:"",
    father_name:"",
    mother_name:"",
    dob:null,
    class_id:null,
    student_address:"",
    transport:false,
    adhaar:null,
    due_fee:0,
    gender:'Male',
    phone:null,
    whatsapp:null,
    email:null,
    file:null
});
const classes = useSelector((state)=>state.class.classes)
// Set the min and max attributes of the date input

function formatDateInput(inputDate) {
    // Create a new Date object from the input value (assuming it's in yyyy-mm-dd format)
    const date = new Date(inputDate);
  
    // Extract year, month, and day components from the Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');
  
    // Create the formatted date string in yyyy/mm/dd format
    const formattedDate = `${year}/${month}/${day}`;
  
    return formattedDate;
  }
  
const handleFormChange = (field,value)=>{
    setFormData({...formData,[field]:value});
}
const handleSubmit = (e)=>{
    setIsLoading(true)
    const token = useToken();
    const form = new FormData();
    form.append('first_name',formData.first_name);
    form.append('last_name',formData.last_name);
    form.append('father_name',formData.father_name);
    form.append('mother_name',formData.mother_name);
    form.append('class_id',formData.class_id);
    form.append('dob',formData.dob);
    form.append('due_fee',formData.due_fee);
    form.append('student_address',formData.student_address);
    form.append('transport',formData.transport);
    form.append('adhaar',formData.adhaar);
    form.append('phone',formData.phone);
    form.append('whatsapp',formData.whatsapp);
    form.append('email',formData.email);
    form.append('file',formData.file);
  
    e.preventDefault();
    console.log(formData);
    axios.post(`${BASE_URL}/student/add`,form,{headers:{'Authorization':`Bearer ${token}`}}).then((res)=>{
      console.log(res.data);
      setIsLoading(false);
        toast.success("Student Added SuccessFully");

    }).catch((err)=>{
        console.log(err)
        toast.error("Some Error Occured");
    }).finally(
        setIsLoading(false)
    )
}
    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setFormData({...formData,file:file});
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    const selectFile = (e)=>{
        document.getElementById('fileInput').click();
    }
    useEffect(()=>{
        const currentDate = new Date();
    
        // Calculate the minimum date (5 years ago from the current date)
        const minDateObj = new Date(currentDate);
        minDateObj.setFullYear(minDateObj.getFullYear() - 17);
        
        // Calculate the maximum date (17 years from the current date)
        const maxDateObj = new Date(currentDate);
        maxDateObj.setFullYear(maxDateObj.getFullYear() -5);
    
        // Format the minimum and maximum dates as strings in yyyy-mm-dd format
        const minDateStr = minDateObj.toISOString().split('T')[0];
        const maxDateStr = maxDateObj.toISOString().split('T')[0];
    
        setMinDate(minDateStr);
        setMaxDate(maxDateStr);

    },[])
    useEffect(()=>{
dispatch(loadClassThunk(useToken()));
    },[])
  return (
   
    <div className="container mx-auto p-4">
         {isLoading&&
         <div className='grid place-items-center  min-h-screen min-w-screen bg-gray-700 bg-opacity-75'>
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
         }
        <Toaster position='top-center'></Toaster>
     
          <div className="mb-4">
          <input type="file" id="fileInput" style={{display:'none'}} onChange={handleImageChange} />
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image Preview:
            </label>
            <img onClick={(e)=>{selectFile(e)}} src={selectedImage?selectedImage:student_icon} alt="Selected" className="max-w-sm mx-auto rounded-full" />
          </div>
      
    <h2 className="text-2xl font-semibold mb-4">Student Admission Form</h2>
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
          First Name:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="firstName"
          type="text"
          placeholder="First Name"
          required
          onChange={(e)=>{handleFormChange('first_name',e.target.value)}}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
          Last Name:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="lastName"
          type="text"
          placeholder="Last Name"
          required
          onChange={(e)=>{handleFormChange('last_name',e.target.value)}}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fatherName">
          Father's Name:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="fatherName"
          type="text"
          placeholder="Father's Name"
          required
          onChange={(e)=>{handleFormChange('father_name',e.target.value)}}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="motherName">
          Mother's Name:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="motherName"
          type="text"
          placeholder="Mother's Name"
          required
          onChange={(e)=>{handleFormChange('mother_name',e.target.value)}}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="classId">
          Class ID:
        </label>
        <select
          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-3 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          id="classId"
          required
          onChange={(e)=>{handleFormChange('class_id',e.target.value)}}
        >
      
          <option value="">Select Class</option>
         {
          classes && classes.map((class_d)=>{
            return(
              <option value={class_d.id} key={class_d.id}>{class_d.name+' '+class_d.section}</option>
            )
           
          })
         }
          {/* Add more class options as needed */}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dob">
          Date Of Birth:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="dob"
          type="date"
          min = {minDate}
          max={maxDate}
          placeholder="Last Name"
          required
          onChange={(e)=>{handleFormChange('dob',e.target.value)}}
        />
      </div>
      <div className="mb-4">
        <div className="flex">
        <div className='mx-5'>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dob">
          Male:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="gender"
          type="checkbox"
          value={'Male'}
          checked={formData.gender==='Male'}
          required = {formData.gender===null}
          onChange={(e)=>{setFormData({...formData,gender:'Male'})}}
        />
        </div>
        <div className='mx-5'>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dob">
          Female:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="gender"
          type="checkbox"
          value={'Female'}
          checked={formData.gender==='Female'}
          required = {formData.gender===null}
          onChange={(e)=>{setFormData({...formData,gender:'Female'})}}
        />
        </div>
        </div>

      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentAddress">
          Student Address:
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="studentAddress"
          placeholder="Student Address"
          rows="4"
          required
          onChange={(e)=>{handleFormChange('student_address',e.target.value)}}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transport">
          Transport Required:
        </label>
        <input
          className="mr-2 leading-tight"
          id="transport"
          type="checkbox"
          required
          onChange={(e)=>{setFormData({...formData,transport:e.target.value==='on'?true:false})}}
        />
        <span className="text-gray-700 text-sm">Yes, I require transport</span>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="aadhaar">
          Aadhaar Number:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="aadhaar"
          type="text"
          maxLength={14}
          placeholder="Aadhaar Number"
          required
          onChange={(e)=>{handleFormChange('adhaar',e.target.value)}}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueFee">
          Due Fee:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="dueFee"
          type="number"
          placeholder="Due Fee"
          onChange={(e)=>{
            handleFormChange('due_fee',e.target.value)
          }}
          value={0}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
          Phone Number:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="phone"
          type="phone"
          maxLength={10}
          placeholder="Phone Number"
          required
          onChange={(e)=>{handleFormChange('phone',e.target.value)}}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="whatsappNumber">
          WhatsApp Number:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="whatsappNumber"
          type="phone"
          maxLength={10}
          placeholder="WhatsApp Number"
          onChange={(e)=>{handleFormChange('whatsapp',e.target.value)}}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          placeholder="Email"
          onChange={(e)=>{handleFormChange('email',e.target.value)}}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
  )
}

export default NewStudent
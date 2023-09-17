import axios from 'axios';
import React, { useState } from 'react'
import { BASE_URL } from '../constants/global';
import { useToken } from '../hooks/useCookie';
import toast, { ToastBar, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function AddTeacher() {
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();
    const [subjects,setSubjects] = useState({name:'',class:''});
    const [teacherData, setTeacherData] = useState({
       
        name: "",
        salary: "",
        email: "",
        address: "",
        phone: null,
        whatsapp_number: "",
        file: "",
      });
const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setTeacherData({...teacherData,file:file})
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
}
 
      const handleChange = (e) => {
        const { name, value } = e.target;
        setTeacherData({
          ...teacherData,
          [name]: value,
        });
      };
      const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here, e.g., send data to the server
        const formData = new FormData();
       Object.keys(teacherData).forEach((key)=>{
formData.append(key,teacherData[key]);
       })
axios.post(`${BASE_URL}/teacher/add`,formData,{headers:{'Authorization':`Bearer ${useToken()}`}})
.then((res)=>{
toast.success("Teacher Added SuccessFully");

})
.catch((err)=>{
    console.log(err);
    toast.error("Some Error Occured")
})
      };    
  return (
   <>
   <Toaster position='top-center'></Toaster>
   <div className="max-w-md mx-auto mt-12">
        <div className="max-w-md mx-auto">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id="imageInput"
      />
      <label
        htmlFor="imageInput"
        className="block bg-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-300"
      >
        <span className="text-gray-700 text-lg">{selectedImage?'Change Image':'Select an Image'}</span>
      </label>
      {selectedImage && (
        <div className="mt-4">
          <img
            src={selectedImage}
            alt="Selected"
            className="max-w-md mx-auto rounded-full"
          />
        </div>
      )}
    </div>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={teacherData.name}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
        />
      </div>
      {/* email */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          email
        </label>
        <input
          type="text"
          id="email"
          name="email"
          value={teacherData.email}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
        />
      </div>
      {/* phone */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="flex items-center">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          type="tel"
          maxLength={10}
          id="phone"
          name="phone"
          value={teacherData.phone}
          onChange={handleChange}
          required
          className="mx-2 mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
        />
        </div>
        <div className="flex items-center">
        <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700">
          Whatsapp Number
        </label>
        <input
          type="tel"
          maxLength={10}
          id="whatsapp_numbere"
          name="whatsapp_number"
          value={teacherData.whatsapp_number}
          onChange={handleChange}
          required
          className="mx-2 mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
        />
        </div>
      </div>
{/* Address */}
<div className="mb-4">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          type="text"
         
          id="address"
          name="address"
          value={teacherData.address}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
        />
        </div>
        {/* Salary */}
        <div className="flex justify-center">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Salary
        </label>
        <input
          type="number"
          maxLength={10}
          id="salary"
          name="salary"
          value={teacherData.salary}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
        />
        </div>
{/* Subjects */}

      <div className="mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          Add Teacher
        </button>
      </div>
    </form>
  </div>
   </>
  )
}
export default AddTeacher
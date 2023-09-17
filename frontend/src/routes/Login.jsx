import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import axios from 'axios';
import { BASE_URL } from '../constants/global';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../hooks/useCookie';
function Login() {
    const navigate = useNavigate();
    const [uname,setUname] = useState('');
    const [pass,setPass] = useState('');
    const loginHandler = async(e)=>{
e.preventDefault();
const req = await axios.post(`${BASE_URL}/user/login`,{uname,password:pass})
const data = req.data;

if(data.success){
    setToken(data.token);
   navigate('/',{replace:true});
}   
}
  return (
   <div className='min-h-screen grid grid-cols-1 justify-items-center content-center'>
      <div className="flex justify-center mt-5">
    <img className='rounded-full w-12 h-12' src={logo} alt="" />
   </div>
     <div className=" flex items-center justify-center ">
 
      <form className="bg-white p-8 rounded-lg shadow-md w-80" onSubmit={(e)=>{loginHandler(e)}}>
        <h2 className="text-2xl font-semibold text-red-500 mb-6">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-600 font-semibold mb-2">Username</label>
          <input
          onChange={(e)=>{setUname(e.target.value)}}
            type="text"
            className="border border-gray-300 p-2 rounded w-full"
            id="username"
            name="username"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 font-semibold mb-2">Password</label>
          <input
          onChange={(e)=>{setPass(e.target.value)}}
            type="password"
            className="border border-gray-300 p-2 rounded w-full"
            id="password"
            name="password"
            required
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Login
          </button>
        </div>
      </form>
    </div>
   </div>
  )
}

export default Login
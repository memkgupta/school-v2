import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import { NavLink } from 'react-router-dom'
function Navbar() {
    const [ishidden,setIsHidden] = useState(true)
  return (
    <nav className="bg-red-500 p-4">
    <div className="container mx-auto">
      <div className="flex justify-between items-center">
        <div className="text-white font-semibold text-xl">
            <img src={logo} alt=""  className='rounded-full w-8 h-8'/>
        </div>
        <div className={`hidden  md:flex grow justify-center`}>
          <NavLink to="/" className="text-white mx-3">Dashboard</NavLink>
          <NavLink to="/students" className="text-white mx-3">Students</NavLink>
          <NavLink to="/teacher" className="text-white mx-3">Teachers</NavLink>
          <NavLink to="/class" className="text-white mx-3">Classes</NavLink>
          <NavLink to="/fee" className="text-white mx-3">Fees</NavLink>
          <NavLink to="#" className="text-white mx-3">Exams</NavLink>
          <NavLink to={'/bulk'} className={"text-white mx-3"}>Bulk Actions</NavLink>
        </div>
        <div className="md:hidden">
          {/* Mobile Menu Button */}
          <button className="text-white" onClick={(e)=>{setIsHidden(ishidden?false:true)}}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
       
      </div>
      <div className={`${ishidden?'hidden':''} grid content-center justify-items-center mt-5`}>
          <NavLink to="/" className="text-white">Dashboard</NavLink>
          <NavLink to="/students" className="text-white">Students</NavLink>
          <NavLink to="/teacher" className="text-white">Teachers</NavLink>
          <NavLink to="/class" className="text-white">Classes</NavLink>
          <NavLink to="/fee" className="text-white">Fees</NavLink>
          <NavLink to="#" className="text-white">Exams</NavLink>
          <NavLink to={'/bulk'} className={"text-white "}>Bulk Actions</NavLink>
        </div>
    </div>
  </nav>
  )
}

export default Navbar
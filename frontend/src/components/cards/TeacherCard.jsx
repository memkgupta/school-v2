import React from 'react'
import {AiFillPhone, AiOutlineMail, AiOutlineWhatsApp} from 'react-icons/ai';
import {FcMoneyTransfer} from 'react-icons/fc'
import { Link } from 'react-router-dom';
function TeacherCard({data}) {
  return (
    <div className='rounded-lg shadow-lg p-4'>
        <div className="">
            <img src={data.profile_pic} alt="" className="float-left rounded-full w-12 h-12" />
            <p className="text-center text-2xl font-bold">Name : - &nbsp; {data.name}</p>
        </div>
        {/* Contact Details */}
        <div className="grid  grid-flow-row auto-rows-max justify-items-center mt-5">
            <div className="flex items-center flex-wrap"><AiFillPhone></AiFillPhone> <p className="text-2xl ml-2">{data.phone}</p></div>
            <div className="flex items-center flex-wrap"><AiOutlineWhatsApp></AiOutlineWhatsApp> <p className="text-2xl ml-2">{data.phone}</p></div>
            <div className="flex items-center flex-wrap"><AiOutlineMail></AiOutlineMail> <p className="text-2xl ml-2">{data.email}</p></div>
            <div className="flex items-center flex-wrap"><FcMoneyTransfer></FcMoneyTransfer> <p className="text-2xl ml-2">Salary &nbsp;:&nbsp;{data.salary}</p></div>
        </div>
        <div className="flex justify-center mt-5">
<Link to={`/teacher/${data.id}`} className='bg-red-500 p-2 text-white'>View</Link>
        </div>
    </div>
  )
}

export default TeacherCard
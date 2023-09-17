import React, { useEffect, useState } from 'react'
import { ColorRing } from 'react-loader-spinner';
import { Link, NavLink } from 'react-router-dom';
import ClassTable from '../components/tables/ClassTable';
import toast, { Toaster } from 'react-hot-toast';

function Classes() {
    const [isLoading,setIsLoading] = useState(true);
   
  const setLoading = ()=>{
   setIsLoading(false);
  }
  useEffect(()=>{
    setTimeout(()=>{setIsLoading(false);},1000)
  },[])
  return (
    <>
    <Toaster position='top-center'></Toaster>
    {
        isLoading?
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
        </div>
        :
        <>
        <div className="flex justify-center mt-5">
            <NavLink to={'/new-class'} className='bg-red-500 p-3 text-white rounded-lg'>Add Class</NavLink>
            <Link to={'/bulk/classes'} className='bg-red-500 p-3 text-white rounded-lg'>Bulk Add Classes</Link>
        </div>
        <div className="overflow-x-auto mt-5">
            
    <ClassTable  setLoading={setLoading} ></ClassTable>
    </div>
        </>
    }
    </>
  )
}

export default Classes
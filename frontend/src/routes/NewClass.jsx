import React, { useEffect } from 'react'
import AddClassForm from '../components/AddClassForm'
import { useDispatch } from 'react-redux'
import { getTeachers } from '../slices/teacherSlice';
import { useToken } from '../hooks/useCookie';
import { ToastBar, Toaster } from 'react-hot-toast';

function NewClass() {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getTeachers(useToken()));
  },[])
  return (
    <div className="container mx-auto mt-8">
      <Toaster position='top-center'></Toaster>
    <h1 className="text-2xl font-bold mb-4">Add Class</h1>
    <AddClassForm />
  </div>
  )
}

export default NewClass
import React, { useEffect, useState } from 'react'
import FilterBox from '../components/FilterBox'
import { getStudentsThunk } from '../slices/studentSlice'
import { useToken } from '../hooks/useCookie'
import { useDispatch, useSelector } from 'react-redux'
import StudentTable from '../components/tables/StudentTable'
import { Link } from 'react-router-dom'

function Students() {
    const dispatch=useDispatch();
    const token = useToken();
    const data = useSelector(state=>state.student);
    const [currentPage,setCurrentPage] = useState(1);
    const [isFirstPage,setIsFirstPage] =useState(true) ;
    const [isLastPage,setLastPage ]= useState(Math.ceil(Math.ceil((data.total/30))/currentPage)<=1);
    const onPageChange = (page)=>{
        if(page!=1){
            setIsFirstPage(false);
        }
        else{
            setIsFirstPage(true);
        }
        setCurrentPage(page);
        dispatch(getStudentsThunk(token,currentPage));
    }
    useEffect(()=>{
        const token = useToken();
dispatch(getStudentsThunk(token));

    },[])
  return (
    <>
    <FilterBox></FilterBox>
    <div className="flex justify-center my-12">
      <Link className='bg-red-500 text-white p-3 mx-2 rounded-lg' to={'/student/new'}>New Student</Link>
      <Link to={'/bulk/student'} className='bg-red-500 text-white p-3 rounded-lg'>Add Bulk Students</Link>
    </div>
    <StudentTable></StudentTable>
    <div className="flex justify-between items-center p-4 bg-gray-100">
      <div>
        <span className="text-gray-600">
          Page {currentPage} of {Math.ceil(data.total/30)}
        </span>
      </div>
      <div className="space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          className={`px-3 py-2 rounded-lg ${
            isFirstPage ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          className={`px-3 py-2 rounded-lg ${
            isLastPage ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'
          }`}
        >
          Next
        </button>
      </div>
    </div>
    </>
  )
}

export default Students
import React, { useEffect, useState } from 'react'
import ExcelTable from '../components/tables/ExcelTable';
import { read, utils, writeFile } from 'xlsx';
import toast, { Toaster } from 'react-hot-toast';
import { ColorRing } from 'react-loader-spinner';
import axios from 'axios';
import { BASE_URL } from '../constants/global';
import { useToken } from '../hooks/useCookie';
function BulkStudents() {
  const [file,setFile] = useState(null);
  const [table,setTable] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const fields = ['admission_no','first_name','last_name','father_name','transport','mother_name','class_id','profile_pic','gender','dob','adhaar','phone','whatsapp_number','due_fee','student_address','email']
  const submit = ()=>{
    setIsLoading(true);
    const keys = Object.keys(table[0]);
    console.log(fields,keys)
   if(
    fields.some((field)=>!keys.includes(field))
   ){
    toast.error(`Not a valid file some fields are missing`);
    setIsLoading(false)
   }
   else{
    const formData = new FormData();
    formData.append('file',file);
    axios.post(`${BASE_URL}/bulk-upload/student`,formData,{headers:{'Authorization':`Bearer ${useToken()}`}})
    .then((res)=>{
setIsLoading(false);
toast.success("Students Uploaded SuccessFully");
    }).catch((err)=>{
      setIsLoading(false);
toast.error(err.message);

    })
   }
  }
  useEffect(()=>{
    if(file!=null){
      setIsLoading(true);
      const reader  = new FileReader();
      reader.onload = function(e){
        const fileBuff = new Uint8Array(e.target.result);
        const wb = read(fileBuff); // parse the array buffer
        const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
        const data = utils.sheet_to_json(ws);
        console.log(data);
        setTable(data);
        setIsLoading(false)
      }
      reader.readAsArrayBuffer(file);
    }
  
  },[file])
  return (
    <>
    <Toaster position='top-center'></Toaster>
    {isLoading?
 
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
   
:<>
  <div className="flex justify-center mt-12">
      <input type="file" id='excelFile' onChange={(e)=>{setFile(e.target.files[0])}} accept='.xlsx' className='hidden' />
      <button className='bg-red-500 p-3 rounded-md text-white' onClick={(e)=>{document.getElementById('excelFile').click()}}>Select File</button>
    </div>
    <div className="max-w-screen overflow-x-auto">
    {
      file && table!=[]&&
      <ExcelTable data={table}></ExcelTable>
    }
    </div>
    <div className="flex justify-center">
      <button className='bg-red-500 p-3 text-white rounded-md' onClick={submit} disabled={table.length<1||file===null}>Submit</button>
    </div>
</>
    }
  
    </>
  )
}

export default BulkStudents
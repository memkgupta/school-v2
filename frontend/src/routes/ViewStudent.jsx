import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ColorRing } from 'react-loader-spinner';
import { useParams } from 'react-router-dom'
import { BASE_URL } from '../constants/global';
import { useToken } from '../hooks/useCookie';
import { Toaster, toast } from 'react-hot-toast';
import MessageBox from '../components/MessageBox';
import FeePayments from '../components/tables/FeePayments';

function ViewStudent() {
  // const monthNames = [
  //   'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  //   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  // ]
    const [student,setStudent] = useState(null);
    const [isLoading,setIsLoading] = useState(true);
  const [sending,setSending] = useState(false);
    const [messageMode,setMessageMode] = useState(false);
    const [months,setMonths] = useState([]);
    const [feeData,setFeeData] = useState([]);
    const [editMode,setEditMode] = useState(false);
    const [selectedImage,setSelectedImage] = useState(null);
    const {sid} = useParams();
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [amount,setAmount]=useState(0);
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
        phone:null,
        whatsapp_number:null,
        email:null,
        file:null
    });
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
        form.append('whatsapp_number',formData.whatsapp);
        form.append('email',formData.email);
        form.append('file',formData.file);
      
        e.preventDefault();
        console.log(formData);
        axios.put(`${BASE_URL}/student/${sid}`,form,{headers:{'Authorization':`Bearer ${token}`}}).then((res)=>{
          console.log(res.data);
          setEditMode(false)
          setIsLoading(false);
            toast.success("Student Updated SuccessFully Please Refresh The Page To see the updates",{duration:'5s'});
    
        }).catch((err)=>{
            console.log(err)
            toast.error("Some Error Occured");
        }).finally(
            setIsLoading(false)
        )
    }
    const close = ()=>{
      setMessageMode(false)
    }
    const sendMessage = (message)=>{
      const token = useToken();
setSending(true);
      axios.post(`${BASE_URL}/student/message`,{message:message||"",phone:`+91${student.phone}`||`+919358288484`},{headers:{'Authorization':`Bearer ${token}`}}).then((res)=>{
        setSending(false);
        close();
        toast.success("Message Sent SuccessFully")
        
      }).catch((err)=>{
        close();
        console.log(err.message)
        toast.error("Can't Send Message")
      })
    }
    
    const submitFee = ()=>{
      setIsLoading(true);
      const fee_data = [];
      feeData.forEach(fee=>{fee_data.push(fee+1)});
      const token = useToken();
      axios.post(`${BASE_URL}/student/fee/submit/${student.student_id}`,{date:new Date(),class_id:student.class_id,feeData:fee_data},{headers:{'Authorization':`Bearer ${token}`}})
      .then((res)=>{
        if(res.data.success){
          setIsLoading(false);
          toast.success("Fee Submitted SuccesFully");
        }
      }).catch((err)=>{
toast.error(err.message);
      })
    }
    const handleFeeMonthChange = (e,month)=>{
      
      if(e.target.checked){
        if(!isMonthDisabled(new Date().getMonth()-month.number,month.number)){
          setFeeData([...feeData,month.number]);
         
        }
     
      }
      else{
     
        setFeeData(feeData.filter(m=>m<month.number))
        
      }

    }
    const isMonthDisabled = (key,month)=>{
 
      let ans = false;
      if(!feeData.includes(month-1)){
        ans = true;
              }
      if(key==months.length){
        
        ans= false;
      }

      console.log(month,key,ans)
      return ans;
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
      
    const showEditModal = ()=>{
        setEditMode(true);
    }
    const formatDate = (input)=>{
        const date = new Date(input);
        const year = date.getFullYear();
        const day = date.getDate();
        const month = date.getMonth()+1;
        return `${year}-${month}-${day}`
    }
    const selectFile = (e)=>{
        document.getElementById('fileInput').click();
    }
    useEffect(()=>{
      student&&setAmount(feeData.length*student.fee_structure.monthly_amount)
    },[feeData,student])
    useEffect(()=>{
        const token = useToken();
axios.get(`${BASE_URL}/student/${sid}`,{headers:{'Authorization':`Bearer ${token}`}}).then((res)=>{
    const data= res.data;
    console.log(data)
    setStudent(data.student);
    setFormData(data.student);
    const date = new Date();
    const currentDate = date.getDate();
    const currentMonth = currentDate>10?date.getMonth()+1:date.getMonth();
    const due_months = Math.round(data.student.due_fee/data.student.fee_structure.monthly_amount);
    const months = [];
  for(let month = currentMonth-1;month>=(currentMonth)-due_months;month--){
    let tempDate = new Date();
    tempDate.setMonth(month);
    let tempMonth = tempDate.toLocaleDateString('en-us',{month:'short'});
months.unshift({number:month,name:tempMonth});
  } 
  console.log(months)
  setMonths(months)
  // setMonths(months.entries);
 
    setIsLoading(false);
}).catch((error)=>{
    console.log(error)
    toast.error("some Error Occured")
}).finally(setIsLoading(false));
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
  return (
    <>
    <Toaster position='top-center'></Toaster>
    {
      messageMode && 
      (
        <MessageBox isLoading={sending} sendMessage={sendMessage} close={close} toast={toast} ></MessageBox>
      )
    }
    {
        editMode&&
        (
            <div className={` p-5 fixed inset-0 ${editMode ? '' : 'hidden'} bg-gray-500 min-w-screen bg-opacity-50  `} style={{overflowY:'auto',zIndex:9999}}>
            <div className="mt-24 bg-white rounded-lg p-8 overflow-y-auto" style={{height:'100%'}}>
              <h2 className="text-xl font-semibold">Edit Student Details</h2>
             {/* Image  */}
              <div className="mb-4">
          <input type="file" id="fileInput" style={{display:'none'}} onChange={handleImageChange} />
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image Preview:
            </label>
            <img onClick={(e)=>{selectFile(e)}} src={selectedImage?selectedImage:student.profile_pic} alt="Selected" className="max-w-sm mx-auto rounded-full" />
          </div>
          {/* form */}
          <div className="flex justify-center  ">
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
          First Name:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="firstName"
          type="text"
          value={formData.first_name}
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
          value={formData.last_name}
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
          value={formData.father_name}
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
          value={formData.mother_name}
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
          value={formData.class_id}
          onChange={(e)=>{handleFormChange('class_id',e.target.value)}}
        >
      
          <option value="">Select Class</option>
          <option value={1}>Class 1</option>
          <option value={2}>Class 2</option>
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
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentAddress">
          Student Address:
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="studentAddress"
          placeholder="Student Address"
          rows="4"
          required
          value={formData.student_address}
          onChange={(e)=>{handleFormChange('student_address',e.target.value)}}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transport">
          Transport Required:
        </label>
{        <input
          className="mr-2 leading-tight"
          id="transport"
          type="checkbox"
          required 
         checked = {formData.transport}
          onChange={(e)=>{setFormData({...formData,transport:e.target.value==='on'?true:false})}}
        />}
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
          value={formData.adhaar}
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
          value={formData.phone}
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
          value={formData.whatsapp_number}
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
          value={formData.email}
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
              <button onClick={(e)=>{setEditMode(false)}} className="mt-4 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600">Close</button>
            </div>
          </div>
        )
    }
       { isLoading||student==null&&
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
        </div>}
        {student!=null&& <>
         
<div className=' my-8 grid grid-cols-1 md:grid-cols-2 justify-items-center gap-12 shadow-md rounded-md p-4'>
<div className="col-span-2">
<button className="mx-3 bg-red-500 p-3 rounded-lg text-white" onClick={showEditModal} style={{position:'relative' , top:'10px' ,left:'45%'}}>
    Edit
</button>
<button className="mx-3 bg-red-500 p-3 rounded-lg text-white" onClick={((e)=>{setMessageMode(true)})} style={{position:'relative' , top:'10px' ,left:'45%'}}>
   Message
</button>
</div>
<div className="mx-5 p-3">
    <img src={student.profile_pic} className='rounded-full ' alt="" />
</div>
<div className="grid grid-cols-1 md:grid-cols-2 w-full justify-items-center">
<div className='flex'>
<h3 className="font-bold mx-2 text-lg">{`Admission No`} </h3> :- <p className='mx-2 text-lg'>{` ${student.admission_no}`}</p>
    </div>
    <div className='flex'>
<h3 className="font-bold mx-2 text-lg">{`Name `} </h3> :- <p className='mx-2 text-lg'>{` ${student.first_name} ${student.last_name}`}</p>
    </div>
    <div className='flex'>
<h3 className="font-bold mx-2 text-lg">{`Class `} </h3> :- <p className='mx-2 text-lg'>{` ${student.class.class_name} ${student.class.section}`}</p>
    </div>
    <div className='flex'>
<h3 className="font-bold mx-2 text-lg">{`Date Of Birth`} </h3> :- <p className='mx-2 text-lg'>{` ${formatDate(student.dob)}`}</p>
    </div>
    <div className='flex'>
<h3 className="font-bold mx-2 text-lg">{`Father Name`} </h3> :- <p className='mx-2 text-lg'>{` ${student.father_name}`}</p>
    </div>
    <div className='flex'>
<h3 className="font-bold mx-2 text-lg">{`Mother Name`} </h3> :- <p className='mx-2 text-lg'>{` ${student.mother_name}`}</p>
    </div>
    <div className='flex'>
<h3 className="font-bold mx-2 text-lg">{`Address`} </h3> :- <p className='mx-2 text-lg'>{` ${student.student_address}`}</p>
    </div>
    <div className='flex'>
<h3 className="font-bold mx-2 text-lg">{`Fee Due`} </h3> :- <p className='mx-2 text-lg'>{` ${student.due_fee}`}</p>
    </div>
    <div className='flex'>
<h3 className="font-bold mx-2 text-lg">{`Gender`} </h3> :- <p className='mx-2 text-lg'>{` ${student.gender}`}</p>
    </div>
    <div className='flex'>
<h3 className="font-bold mx-2 text-lg">{`Phone Number`} </h3> :- <a href={`tel +91${student.phone}`} className='mx-2 text-lg'>{` ${student.phone}`}</a>
    </div>
    <div className='flex'>
<h3 className="font-bold mx-2 text-lg">{`Email`} </h3> :- <a href={`mailto:${student.email}`} className='mx-2 text-lg'>{` ${student.email}`}</a>
    </div>
    <div className='flex'>
<h3 className="font-bold mx-2 text-lg">{`Adhaar No.`} </h3> :- <p className='text-lg'>{student.adhaar}</p>
    </div>
    <div className='flex'>
<h3 className="font-bold mx-2 text-lg">{`Whatsapp`} </h3> :- <a href={`https://wa.me/91${student.whatsapp_number||9358288484}` } target='_blank' className='mx-2 text-lg'>{` ${student.whatsapp_number||9358288484}`}</a>
    </div>
</div>


</div>
{/* Pay fee */}
<section>
<div className="text-center">
  <h3 className="text-xl font-bold">Pay Fee</h3>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-md p-5">
  
        <div className="flex">
        <h3>Amount</h3> <input type="text" readOnly value={amount}/>
        </div>
      <div className="mx-12 shadow-lg grid grid-cols-2 md:grid-cols-5 gap-3">
        {months.length>0?months.map((month)=>{
          

          return(
            
            <div key={month.number}>
              <input  type="checkbox" checked={feeData.includes(month.number)} onChange={(e)=>{handleFeeMonthChange(e,month)}} className='mx-3' id={`${month.number}-${month.name}`} /> <label htmlFor={`${month.number}-${month.name}`}>{month.name}</label>
            </div>
          
          )
        }):<p>No Due Fee</p>}
     
    </div>
    
  <button disabled={feeData.length<1} className='bg-red-500 p-3 rounded-md ml-auto mr-auto' onClick={submitFee}>Submit</button>
</div>
</section>

{/* Fee Payments */}
<FeePayments sid={student.student_id}></FeePayments>
         </>}
   
    </>
 
   
  )
}

export default ViewStudent
import React from 'react'
import { ColorRing } from 'react-loader-spinner';

function MessageBox({sendMessage,close,isLoading}) {
  return (
    <>
 
        <div className='p-5 fixed inset-0   bg-gray-500 min-w-screen bg-opacity-50 ' style={{zIndex:9999}}>
        { isLoading&&
        <div className='grid place-items-center min-h-screen min-w-screen bg-gray-200' style={{zIndex:9999}}>
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
        <div className="bg-white shadow-md rounded-md p-12 grid justify-items-center">
            <h3 className='text-xl my-5'>Send Message</h3>
        <textarea name="message" id="message" className='border-2 rounded-md border-red-500 p-5 w-3/6' cols="30" rows="10">
        
        </textarea>
        <div className="flex">
        <button className='mt-5 bg-red-500 p-3 mx-3' onClick={(e)=>{sendMessage(document.getElementById("message").value);}}>Send</button>
        <button className='bg-red-500 p-3 mx-3 mt-5' onClick={close}>Close</button>
        </div>
        </div>
        
        
            </div>
    </>
   
  )
}

export default MessageBox
import React from 'react'

function UpdateClass({closeModal}) {
    const submit = (e)=>{
        e.preventDefault();
    }
  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75`} style={{zIndex:9999}}>
    <div className="modal-overlay ">
        <Toaster position='top-center'></Toaster>
    </div>

    <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
      {/* Modal content */}
      <div className="modal-content py-4 text-left px-6">
        {/* Add your modal content here */}
        <h2 className="text-xl font-semibold mb-4 text-red-600">Edit Fee Structure</h2>
        
        <div className="container mx-auto mt-5">
      <h2 className="text-xl font-semibold mb-4">Edit Fee Structure</h2>
      <form onSubmit={submit}>
  
      
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full mt-4 ml-2"
          type='submit'
        >
          Submit
        </button>
      </form>
    </div>
        
         <div className="flex justify-center">
         <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full mt-4 ml-2"
          onClick={closeModal}
        >
          Close Modal
        </button>
       
         </div>
     

      </div>
    </div>
  </div>
  )
}

export default UpdateClass
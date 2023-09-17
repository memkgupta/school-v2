import React from 'react'

function DashboardCard({image,heading,number}) {
  return (
    <div className='rounded-md shadow-lg p-5 mx-3 my-3 min-w-24 min-h-18'>
        <div className="flex">
            <div>
                <img src={image} alt="" className='w-12 h-12' />
            </div>
            <div className="ml-2 grow grid">
                <div>
                    <p>{heading}</p>
                </div>
                <div>
                    <h1 className='text-lg'>{number}</h1>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DashboardCard
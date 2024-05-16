import React from 'react'

const Dashboard = () => {
  return (
    <>
    <div className="sm:flex w-full lg:flex-row sm:flex-col md:flex-col">
    <div className="lg:w-2/3 sm:w-full md:w-full">
    <div className="grid grid-cols-2 gap-4">
      <div className="group text-center bg-[#F6F5F5] hover:bg-primary p-5 m-5 rounded-xl">
        <p className='group-hover:text-white'>Total Quize</p>
        <p className='text-primary group-hover:text-white text-5xl font-bold mt-2 p-3'>10</p>
      </div>
      <div className="group text-center bg-[#F6F5F5] hover:bg-primary p-5 m-5 rounded-xl">
        <p className='group-hover:text-white'>Total Exams Feedback</p>
        <p className='text-primary group-hover:text-white text-5xl font-bold mt-2 p-3'>10</p>
      </div>
      <div className="group text-center bg-[#F6F5F5] hover:bg-primary p-5 m-5 rounded-xl">
        <p className='group-hover:text-white'>Total System Feedback</p>
        <p className='text-primary group-hover:text-white text-5xl font-bold mt-2 p-3'>10</p>
      </div>
      <div className="group text-center bg-[#F6F5F5] hover:bg-primary p-5 m-5 rounded-xl">
        <p className='group-hover:text-white'>Total System User</p>
        <p className='text-primary group-hover:text-white text-5xl font-bold mt-2 p-3'>10</p>
      </div>
    </div>
    </div>
    <div className="lg:w-1/3 sm:w-full md:w-full text-center mt-10">
      <img src='..\..\images/image_chart.png' alt="gergwrgr" className='p-5' />
      System Usage
    </div>
    </div>
    </>
  )
}

export default Dashboard
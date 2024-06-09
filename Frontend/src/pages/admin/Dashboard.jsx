import React from 'react'
import { LineChart } from '@mui/x-charts/LineChart';

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
    <div className='sm:col-span-2 col-span-4 items-center w-full h-fill flex justify-center flex-col'>
      {/* <img src='..\..\images/image_chart.png' alt="gergwrgr" className='p-5' /> */}
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
              ]}
              width={500}
              height={300}
            />
            System Usage
          </div>
    </div>
    </>
  )
}

export default Dashboard
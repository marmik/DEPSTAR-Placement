import React from 'react';

function Dashboard() {
  return (

    <div className='p-4 text-secondary'>
        <div className='grid justify-between gap-10  grid-cols-4'>
          <button className='sm:col-span-1 col-span-4 group hover:shadow-2xl bg-light hover:bg-primary transition-all rounded-xl p-6'>
            <p className=' text-xl group-hover:text-light'>Total Quiz Cleared</p>
            <h3 className=' mt-3 text-6xl text-primary group-hover:text-light font-bold'>10</h3>
          </button>
          <button className='sm:col-span-1 col-span-4 group hover:shadow-2xl bg-light hover:bg-primary transition-all rounded-xl p-6'>
            <p className=' text-xl group-hover:text-light'>Total Feedbacks Given</p>
            <h3 className=' mt-3 text-6xl text-primary group-hover:text-light font-bold'>10</h3>
          </button>
          <div className='sm:col-span-2 col-span-4 items-center justify-center flex'>
            <img src="../images/graph.png" alt="" />
          </div>
      </div>
      <div className="bg-white rounded-md p-4 mb-4">
       
  <h3  className="text-2xl font-semibold mb-4">Upcoming Quiz Exams</h3>
  <div className="overflow-x-auto flex flex-wrap">
  <div className="bg-gray-100 w-full w-10/20 rounded-md p-4 mb-4">
    <table className="w-full border-collapse">
      <thead  className="bg-primary text-light border">
        <tr className='divide-x divide-light'>
          <th className="text-left py-3 px-4 uppercase font-semibold text-sm">No</th>
          <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Title</th>
          <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Total Questions</th>
          <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Total Marks</th>
          <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
          <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Start Time</th>
          <th className="text-left py-3 px-4 uppercase font-semibold text-sm">End Time</th>
          <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr className='divide-x divide-light'>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">1</td>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">SE Practical</td>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">30</td>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">30</td>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">21/05/2024</td>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">12:00 PM</td>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">12:30 PM</td>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">
            <button className="text-light bg-primary text-lg  font-bold py-1 px-3 rounded-lg mr-2">
              Start
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<div className="bg-white rounded-md p-4">
  <h3 className="text-2xl font-semibold mb-4">Recently Attempted Quiz</h3>
  <div className="overflow-x-auto flex flex-wrap">
  <div className="bg-gray-200 w-full w-10/20 rounded-md p-4 mb-4">
    <table className="w-full border-collapse">
      <thead className="bg-primary text-light border">
        <tr  className='divide-x divide-light'>
          <th className="text-left py-3 px-4 uppercase font-semibold text-sm">No</th>
          <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Quiz</th>
          <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Total Questions</th>
          <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Total Marks</th>
          <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Obtained Marks</th>
          <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr  className='divide-x divide-light'>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">1</td>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">SE Practical</td>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">30</td>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">30</td>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">25</td>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">
            <button className="text-light bg-primary text-lg  font-bold py-1 px-3 rounded-lg mr-2">
              View
            </button>
          </td>
        </tr>
        <tr  className='divide-x divide-light'>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">2</td>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">DBMS</td>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">30</td>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">30</td>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">25</td>
          <td className="text-left py-3 px-4 uppercase font-semibold text-sm">
            <button className="text-light bg-primary text-lg  font-bold py-1 px-3 rounded-lg mr-2">
              View
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</div>

      </div>
  </div>




  );
}

export default Dashboard
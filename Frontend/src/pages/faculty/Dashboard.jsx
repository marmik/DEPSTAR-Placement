import React from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <>
      <div className='p-4 text-secondary'>
        <div className='grid justify-between gap-10  grid-cols-4'>
          <button className='sm:col-span-1 col-span-4 group hover:shadow-2xl bg-light hover:bg-primary transition-all rounded-xl p-6'>
            <p className=' text-xl group-hover:text-light'>Total Exam Conducted</p>
            <h3 className=' mt-3 text-6xl text-primary group-hover:text-light font-bold'>10</h3>
          </button>
          <button className='sm:col-span-1 col-span-4 group hover:shadow-2xl bg-light hover:bg-primary transition-all rounded-xl p-6'>
            <p className=' text-xl group-hover:text-light'>Total Exam Feedbacks</p>
            <h3 className=' mt-3 text-6xl text-primary group-hover:text-light font-bold'>10</h3>
          </button>
          <div className='sm:col-span-2 col-span-4 items-center justify-center flex'>
            <img src="../images/chartFaculty.png" alt="" />
          </div>
        </div>
        <br /><br />
        <h2 className="text-2xl font-semibold mb-4">Scheduled Exam</h2>
        <div className='overflow-x-auto '>

          <table className="min-w-full   border rounded-lg overflow-hidden">
            <thead className="bg-primary text-light border">
              <tr>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">No</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Title</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Subject</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Total Marks</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Total Questions</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">SEM</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Class</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Action</th>

              </tr>
            </thead>
            <tbody >

              
                <tr className='divide-x hover:bg-slate-100 divide-light'>
                  <td className="py-3 px-4">1</td>
                  <Link to={"/"}><td className="py-3 px-4">DBMS Practical</td></Link>
                  <td className="py-3 px-4">DBMS</td>
                  <td className="py-3 px-4">30</td>
                  <td className="py-3 px-4">30</td>
                  <td className="py-3 px-4">Sem 4</td>
                  <td className="py-3 px-4">4CE</td>
                  <td className="py-3 px-4">10-05-2024</td>
                  <td className="py-3 px-4"><button className="text-light bg-primary text-lg  font-bold py-1 px-3 rounded-lg mr-2">View</button></td>
                </tr>
              

                <tr className='divide-x hover:bg-slate-100 divide-light'>
              
                  <td className="py-3 px-4">2</td>
                  <Link to={"/"}><td className="py-3 px-4">DBMS Practical</td></Link>
                  <td className="py-3 px-4">DBMS</td>
                  <td className="py-3 px-4">30</td>
                  <td className="py-3 px-4">30</td>
                  <td className="py-3 px-4">Sem 4</td>
                  <td className="py-3 px-4">4CE</td>
                  <td className="py-3 px-4">10-05-2024</td>
                  <td className="py-3 px-4"> <button className="text-light bg-primary text-lg  font-bold py-1 px-3 rounded-lg mr-2">View</button></td>
                </tr>
            </tbody>
          </table>
        </div>
        <br /><br />
        <h2 className="text-2xl font-semibold mb-4">Recently Conducted Exams</h2>
        <div className='overflow-x-auto '>

          <table className="min-w-full   border rounded-lg overflow-hidden">
            <thead className="bg-primary text-light border">
              <tr>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">No</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Title</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Total Questions</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Total Marks</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Maximum</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Minimum</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Average</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Feedbacks</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody >

              <tr className='divide-x divide-light'>
                <td className="py-3 px-4">1</td>
                <td className="py-3 px-4">DBMS Practical</td>
                <td className="py-3 px-4">30</td>
                <td className="py-3 px-4">30</td>
                <td className="py-3 px-4">30</td>
                <td className="py-3 px-4">15</td>
                <td className="py-3 px-4">22</td>
                <td className="py-3 px-4">40</td>
                <td className="py-3 px-4"> <button className="text-light bg-primary text-lg  font-bold py-1 px-3 rounded-lg mr-2">View</button></td>
              </tr>

              <tr className='divide-x divide-light'>
                <td className="py-3 px-4">2</td>
                <td className="py-3 px-4">DAA Practical</td>
                <td className="py-3 px-4">30</td>
                <td className="py-3 px-4">30</td>
                <td className="py-3 px-4">30</td>
                <td className="py-3 px-4">15</td>
                <td className="py-3 px-4">22</td>
                <td className="py-3 px-4">40</td>
                <td className="py-3 px-4"> <button className="text-light bg-primary text-lg  font-bold py-1 px-3 rounded-lg mr-2">View</button></td>
              </tr>


            </tbody>
          </table>
        </div>

      </div>
    </>
  )
}

export default Dashboard
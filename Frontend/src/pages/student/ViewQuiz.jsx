import React from 'react'

const ViewQuiz = () => {
  return (
    <div>
    <div className="flex flex-wrap">
      <div className="items-center justify-between mb-8">
      <h2 className="text-2xl px-6 font-semibold mb-4">Search Quiz</h2>
        <div className="bg-white py-3 px-6 flex ">
        <label className="flex flex-col ">
              <input type="text"  placeholder="Search Quiz" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" />
            </label>
        </div>
      </div>

      <div className='p-4 grid text-secondary'>
        <div className='grid justify-between gap-10 grid-cols-4'>
          <button className='sm:col-span-1 col-span-4 group   rounded-xl p-6'>
            <p className=' text-s '>Total Quiz</p>
            <h3 className=' mt-3 text-4xl text-primary  font-bold'>10</h3>
          </button>
          <button className='sm:col-span-1 col-span-4 group  rounded-xl pl-6'>
            <p className='text-s flex-wrap'>Total Attempted Quiz</p>
            <h3 className=' mt-3 text-4xl text-primary font-bold'>10</h3>
          </button>
        </div>
        </div>
        <div className="bg-white w-full rounded-md p-4">
          <h3 className="text-2xl px-4 font-semibold mb-4">Manage Quiz</h3>
          <div className="overflow-x-auto flex flex-wrap">
            <div className="w-full w-10/20 rounded-md p-4 mb-4">
            <table className="min-w-full border rounded-lg overflow-hidden">
              <thead className="bg-primary text-light border">
                  <tr className="divide-x divide-light">
                      <th className="text-left py-3 px-4 uppercase text-sm">No</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Quize</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Total Questions</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Total Marks</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Obtained Marks</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Action</th>
                  </tr>
              </thead>
              <tbody>
                  <tr className="divide-x divide-light">
                      <td className="text-left py-3 px-4 text-sm">1</td>
                      <td className="text-left py-3 px-4 text-sm">SE Practical</td>
                      <td className="text-left py-3 px-4 text-sm">30</td>
                      <td className="text-left py-3 px-4 text-sm">30</td>
                      <td className="text-left py-3 px-4 text-sm">25</td>
                      <td className="text-left py-3 px-4 text-sm">
                        <button className="text-light bg-primary text-lg font-bold py-1 px-3 rounded-lg mr-2">
                          View
                        </button>
                      </td>
                  </tr>
                  <tr className="divide-x divide-light">
                      <td className="text-left py-3 px-4 text-sm">2</td>
                      <td className="text-left py-3 px-4 text-sm">DBMS</td>
                      <td className="text-left py-3 px-4 text-sm">30</td>
                      <td className="text-left py-3 px-4 text-sm">30</td>
                      <td className="text-left py-3 px-4 text-sm">25</td>
                      <td className="text-left py-3 px-4 text-sm">
                        <button className="text-light bg-primary text-lg font-bold py-1 px-3 rounded-lg mr-2">
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
  )
}

export default ViewQuiz
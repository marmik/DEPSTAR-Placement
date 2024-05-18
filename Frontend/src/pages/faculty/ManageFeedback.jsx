import React from 'react'

const ManageFeedback = () => {
  return (
    <div>
     <div className="items-center justify-between  mb-8">
     <h2 className="text-xl px-6 font-bold mb-4">Search Quiz</h2>
        <div className="bg-white py-3 px-6 flex ">
        <label className="flex flex-col ">
              <input type="text"  placeholder="Search Quiz" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" />
            </label>
        </div>
      </div>
      <div>
        <div className="bg-white rounded-md p-4">
          <div className="overflow-x-auto flex flex-wrap">
            <div className="w-full rounded-md p-4 mb-4">
              <div className="flex flex-wrap">
                <table className="min-w-full   border rounded-lg overflow-hidden">
                  <thead className="bg-primary text-light border">
                    <tr className="divide-x divide-light">
                      <th className="text-left py-3 px-4 uppercase  text-sm">No</th>
                      <th className="text-left py-3 px-4 uppercase  text-sm">Title</th>
                      <th className="text-left py-3 px-4 uppercase  text-sm">Subject</th>
                      <th className="text-left py-3 px-4 uppercase  text-sm">Date</th>
                      <th className="text-left py-3 px-4 uppercase  text-sm">Total Feedbacks</th>
                      <th className="text-left py-3 px-4 uppercase  text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="divide-x divide-light">
                      <td className="text-left py-3  px-4  text-sm">1</td>
                      <td className="text-left py-3  px-4 text-sm">SE Practical</td>
                      <td className="text-left py-3  px-4 text-sm">S.E</td>
                      <td className="text-left py-3  px-4 text-sm">12/05/2024</td>
                      <td className="text-left py-3  px-4 text-sm">30</td>
                      <td className="text-left py-3  px-4 text-sm">
                        <button className="text-light bg-primary text-lg font-bold py-1 px-3 rounded-lg mr-2">
                          View Feedback
                        </button>
                      </td>
                    </tr>
                    <tr className="divide-x divide-light">
                      <td className="text-left py-3 px-4 uppercase  text-sm">2</td>
                      <td className="text-left py-3 px-4 uppercase  text-sm">DBMS Practical</td>
                      <td className="text-left py-3 px-4 uppercase  text-sm">DBMS</td>
                      <td className="text-left py-3 px-4 uppercase  text-sm">13/05/2024</td>
                      <td className="text-left py-3 px-4 uppercase  text-sm">30</td>
                      <td className="text-left py-3 px-4 uppercase  text-sm">
                        <button className="text-light bg-primary text-lg font-bold py-1 px-3 rounded-lg mr-2">
                          View Feedback
                        </button>
                      </td>
                    </tr>
                    <tr className="divide-x divide-light">
                      <td className="text-left py-3 px-4 uppercase  text-sm">3</td>
                      <td className="text-left py-3 px-4 uppercase  text-sm">DBMS Practical</td>
                      <td className="text-left py-3 px-4 uppercase  text-sm">DBMS</td>
                      <td className="text-left py-3 px-4 uppercase  text-sm">14/05/2024</td>
                      <td className="text-left py-3 px-4 uppercase  text-sm">30</td>
                      <td className="text-left py-3 px-4 uppercase  text-sm">
                        <button className="text-light bg-primary text-lg font-bold py-1 px-3 rounded-lg mr-2">
                          View Feedback
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
    </div>
  )
}

export default ManageFeedback
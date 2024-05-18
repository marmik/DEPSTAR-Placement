import React from 'react'

const ManageFeedbackSecond = () => {
  return (
    <div>
     <div className="items-center justify-between  mb-8">
     <h2 className="text-xl px-6 font-bold mb-4">Search Student</h2>
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
              <table className="min-w-full border rounded-lg overflow-hidden">
                <thead className="bg-primary text-light border">
                    <tr className="divide-x divide-light">
                        <th className="text-left py-3 px-4 uppercase text-sm">No</th>
                        <th className="text-left py-3 px-4 uppercase text-sm">Student Name</th>
                        <th className="text-left py-3 px-4 uppercase text-sm">ID</th>
                        <th className="text-left py-3 px-4 uppercase text-sm">Marks</th>
                        <th className="text-left py-3 px-4 uppercase text-sm">Correct</th>
                        <th className="text-left py-3 px-4 uppercase text-sm">Wrong</th>
                        <th className="text-left py-3 px-4 uppercase text-sm">Feedback</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="divide-x divide-light">
                        <td className="text-left py-3 px-4 text-sm">1</td>
                        <td className="text-left py-3 px-4 text-sm">Student 1</td>
                        <td className="text-left py-3 px-4 text-sm">D23DCE143</td>
                        <td className="text-left py-3 px-4 text-sm">30</td>
                        <td className="text-left py-3 px-4 text-sm">15</td>
                        <td className="text-left py-3 px-4 text-sm">15</td>
                        <td className="text-left py-3 px-4 text-sm">
                          
                            Good
                        </td>
                    </tr>
                    <tr className="divide-x divide-light">
                        <td className="text-left py-3 px-4 text-sm">2</td>
                        <td className="text-left py-3 px-4 text-sm">Student 2</td>
                        <td className="text-left py-3 px-4 text-sm">D23DCE143</td>
                        <td className="text-left py-3 px-4 text-sm">20</td>
                        <td className="text-left py-3 px-4 text-sm">20</td>
                        <td className="text-left py-3 px-4 text-sm">10</td>
                        <td className="text-left py-3 px-4 text-sm">
                          
                          Very Nice
                        </td>
                    </tr>
                    <tr className="divide-x divide-light">
                        <td className="text-left py-3 px-4 text-sm">3</td>
                        <td className="text-left py-3 px-4 text-sm">Student 3</td>
                        <td className="text-left py-3 px-4 text-sm">D23DCE143</td>
                        <td className="text-left py-3 px-4 text-sm">10</td>
                        <td className="text-left py-3 px-4 text-sm">10</td>
                        <td className="text-left py-3 px-4 text-sm">20</td>
                        <td className="text-left py-3 px-4 text-sm">
                          
                          Easy
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

export default ManageFeedbackSecond
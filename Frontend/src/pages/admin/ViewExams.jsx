import React from 'react'

const ViewExams = () => {
  return (
    <div>
    <div className="flex flex-wrap">
      <div className="items-center mb-4">
      <h2 className="text-2xl px-4 font-semibold mb-4">Search Quiz</h2>
        <div className="bg-white  py-2 px-4 flex ">
        <label className="flex flex-col ">
              <input type="text"  placeholder="Search Quiz" className="p-4 mt-1 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" />
            </label>
        </div>
        </div>
        </div>
      
      <div className="bg-white w-full rounded-md p-4">
          <h3 className="text-2xl px-4 font-semibold mb-4">View Quiz</h3>
          <div className="overflow-x-auto flex flex-wrap">
            <div className="w-full w-10/20 rounded-md p-4 mb-4">
            <table className="min-w-full border rounded-lg overflow-hidden">
              <thead className="bg-primary text-light border">
                  <tr className="divide-x divide-light">
                      <th className="text-left py-3 px-4 uppercase text-sm">No</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Title</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Subject</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Conducted By</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Semester</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Total Student Attempted</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Total Marks</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Total Questions</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Action</th>
                  </tr>
              </thead>
              <tbody>
                  <tr className="divide-x divide-light">
                      <td className="text-left py-3 px-4 text-sm">1</td>
                      <td className="text-left py-3 px-4 text-sm">SE Chapter 1-4</td>
                      <td className="text-left py-3 px-4 text-sm">S.E</td>
                      <td className="text-left py-3 px-4 text-sm">Prof. Kashyap Patel</td>
                      <td className="text-left py-3 px-4 text-sm">4th</td>
                      <td className="text-left py-3 px-4 text-sm">45</td>
                      <td className="text-left py-3 px-4 text-sm">30</td>
                      <td className="text-left py-3 px-4 text-sm">30</td>
                      <td className="text-left py-3 px-4 text-sm">
                        <button onClick={()=>{navigate("../view-given-quiz")}} className="text-light bg-primary text-lg font-bold py-1 px-3 rounded-lg mr-2">
                          View More
                        </button>
                      </td>
                  </tr>
                  <tr className="divide-x divide-light">
                      <td className="text-left py-3 px-4 text-sm">2</td>
                      <td className="text-left py-3 px-4 text-sm">DBMS Chapter 1-4</td>
                      <td className="text-left py-3 px-4 text-sm">DBMS</td>
                      <td className="text-left py-3 px-4 text-sm">Prof. Kashyap Patel</td>
                      <td className="text-left py-3 px-4 text-sm">4th</td>
                      <td className="text-left py-3 px-4 text-sm">45</td>
                      <td className="text-left py-3 px-4 text-sm">30</td>
                      <td className="text-left py-3 px-4 text-sm">30</td>
                      <td className="text-left py-3 px-4 text-sm">
                        <button onClick={()=>{navigate("../view-given-quiz")}} className="text-light bg-primary text-lg font-bold py-1 px-3 rounded-lg mr-2">
                          View More
                        </button>
                      </td>
                  </tr>
                  <tr className="divide-x divide-light">
                      <td className="text-left py-3 px-4 text-sm">3</td>
                      <td className="text-left py-3 px-4 text-sm">DAA Chapter 1-4</td>
                      <td className="text-left py-3 px-4 text-sm">DAA</td>
                      <td className="text-left py-3 px-4 text-sm">Prof. Jay Patel</td>
                      <td className="text-left py-3 px-4 text-sm">4th</td>
                      <td className="text-left py-3 px-4 text-sm">45</td>
                      <td className="text-left py-3 px-4 text-sm">30</td>
                      <td className="text-left py-3 px-4 text-sm">30</td>
                      <td className="text-left py-3 px-4 text-sm">
                        <button onClick={()=>{navigate("../view-given-quiz")}} className="text-light bg-primary text-lg font-bold py-1 px-3 rounded-lg mr-2">
                          View More
                        </button>
                      </td>
                  </tr>
              </tbody>
          </table>

      </div>
      </div>
      </div>
      </div>
  )
}

export default ViewExams

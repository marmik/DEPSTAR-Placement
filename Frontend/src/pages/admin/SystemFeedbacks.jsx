import React, { useState } from 'react';

const SystemFeedbacks = () => {
  const [activeTable, setActiveTable] = useState('faculty');

  const userTables = {
    faculty: {
      headers: ['No', 'Faculty Name', 'ID', 'Email', 'Feedback'],
      data: [
        { no: 1, facultyName: 'Raj Markana', id: 'raj143', email: 'raj@example.com', feedback: 'Great work!' }
      ]
    },
    students: {
      headers: ['No', 'Student', 'ID', 'Email', 'SEM', 'Feedback'],
      data: [
        { no: 1, student: 'Prince Bavishi', id: 'pb123', email: 'prince@example.com', sem: 3, feedback: 'Great work!' }
      ]
    }
  };

  return (
    <div className='p-4 text-secondary'>
      <div className="items-center justify-between mb-8">
        <h2 className="text-xl font-bold mb-2">Search Feedbacks</h2>
        <div className="bg-white flex">
          <label className="flex flex-col">
            <input
              type="text"
              placeholder="Search Feedbacks"
              className="p-4 mt-2 border-2 rounded-md focus:border-primary focus:outline-none"
            />
          </label>
        </div>
      </div>
      <div className="flex border-b-2 border-gray-600 pb-4 mb-4">
        <div className="bg-white p-2 flex border-none">
          <button
            className={`  text-lg px-4 py-2 rounded-full lg:self-end ${activeTable === 'faculty' ? 'text-white bg-primary' : 'text-secondary'}`}
            onClick={() => setActiveTable('faculty')}
          >
            Faculty {activeTable === 'faculty'?"10":""}
          </button>
        </div>
        <div className="bg-white p-2 flex border-none">
          <button
            className={`  text-lg px-4 py-2 rounded-full lg:self-end ${activeTable === 'students' ? 'text-white bg-primary' : 'text-secondary'}`}
            onClick={() => setActiveTable('students')}
          >
            Students {activeTable === 'students'?"10":""}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto pt-4">
      <table className="min-w-full  rounded-lg overflow-hidden ">
          <thead className="bg-primary text-light ">
            <tr className="divide-x divide-light">
              {userTables[activeTable].headers.map((header, index) => (
                <th key={index} className="text-left py-3 px-4 uppercase text-sm">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {userTables[activeTable].data.map((row, index) => (
              <tr key={index} className="divide-x divide-light">
                {Object.entries(row).map(([key, value], cellIndex) => (
                  <td key={cellIndex} className="text-left py-3 px-4 text-sm">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SystemFeedbacks

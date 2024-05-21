import React, { useState } from 'react';

const ViewUsers = () => {
  const [activeTable, setActiveTable] = useState('admin');

  const userTables = {
    admin: {
      headers: ['No', 'User', 'Username', 'Conducted Exams', 'System Feedback', 'Last Login', 'Status'],
      data: [
        { No: 1, User: 'Kashyap Patel', Username: 'kp123', 'Conducted Exams': 10, 'System Feedback': 2, 'Last Login': '12:30 PM', Status: 'Online' }
      ]
    },
    faculty: {
      headers: ['No', 'User', 'Username', 'Status'],
      data: [
        { No: 1, User: 'Raj Markana', Username: 'raj143', Status: 'Online' }
      ]
    },
    students: {
      headers: ['No', 'User', 'Username', 'Semester', 'Exam Attempted', 'System Feedback', 'Last Login', 'Status'],
      data: [
        { No: 1, User: 'Prince Bavishi', Username: 'pb123', Semester: 3, 'Exam Attempted': 10, 'System Feedback': 2, 'Last Login': '12:30 PM', Status: 'Online' }
      ]
    }
  };

  return (
    <div className='p-4 text-secondary'>
      <div className="items-center justify-between  mb-8">
     <h2 className="text-xl  font-bold mb-2">Search User</h2>
        <div className="bg-white  flex ">
        <label className="flex flex-col ">
              <input type="text"  placeholder="Search User" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" />
            </label>
        </div>
      </div>
      <div className="flex border-b-2 border-gray-600  pb-4 mb-4">
        <div className="bg-white p-2 flex">
          <button
            className={`  text-lg px-4 py-2 rounded-full lg:self-end ${activeTable === 'admin' ? 'text-white bg-primary' : 'text-secondary'}`}
            onClick={() => setActiveTable('admin')}
          >
            Admin {activeTable === 'admin'?"10":""}
          </button>
        </div>
        <div className="bg-white p-2 flex">
          <button
            className={`  text-lg px-4 py-2 rounded-full lg:self-end ${activeTable === 'faculty' ? 'text-white bg-primary' : 'text-secondary'}`}
            onClick={() => setActiveTable('faculty')}
          >
            Faculty {activeTable === 'faculty'?"10":""}
          </button>
        </div>
        <div className="bg-white p-2 flex">
          <button
            className={`  text-lg px-4 py-2  rounded-full lg:self-end ${activeTable === 'students' ? 'text-white bg-primary' : 'text-secondary'}`}
            onClick={() => setActiveTable('students')}
          >
            Students {activeTable === 'students'?"10":""}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto pt-4">

        <table className="min-w-full border rounded-lg overflow-hidden ">
          <thead className="bg-primary text-light border">
            <tr className="divide-x ">
              {userTables[activeTable].headers.map((header, index) => (
                <th key={index} className="text-left py-3 px-4 uppercase text-sm">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {userTables[activeTable].data.map((row, index) => (
              <tr key={index} className="divide-x ">
                {Object.entries(row).map(([key, value], cellIndex) => (
                  <td key={cellIndex} className="text-left py-3 px-4 text-sm">
                    {key === 'Status' && value === 'Online' ? (
                      <>
                        <li className='list-disc marker:text-green-500'>Online</li>
                      </>
                    ) : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewUsers;

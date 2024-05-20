import React from 'react';
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


const ViewQuiz = () => {
  const navigate = useNavigate();
  return (
    <div className="flex-wrap">
      <div className="bg-white text-lg p-8 rounded-lg shadow-2xl ">
        <div className="flex sm:flex-row flex-col justify-between ">
        <table className=''>
          <tbody>
            <tr>
              <td className="text-secondary font-bold pr-4">Subject</td>
              <td className="text-gray-600">: DBMS</td>
            </tr>
            <tr>
              <td className="text-secondary font-bold pr-4">Title</td>
              <td className="text-gray-600">: DBMS Practical</td>
            </tr>
            <tr>
              <td className="text-secondary font-bold pr-4">Description</td>
              <td className="text-gray-600">: DBMS Practical Exam Chapter 1 to 4</td>
            </tr>
            <tr>
              <td className="text-secondary font-bold pr-4">Questions</td>
              <td className="text-gray-600">: 30</td>
            </tr>
            <tr>
              <td className="text-secondary font-bold pr-4">Marks</td>
              <td className="text-gray-600">: 30</td>
            </tr>
            <tr>
              <td className="text-secondary font-bold pr-4">Date</td>
              <td className="text-gray-600">: 12/05/2024</td>
            </tr>
            <tr>
              <td className="text-secondary font-bold pr-4">Time</td>
              <td className="text-gray-600">: <span className="">12:00 PM To 12:30 PM</span></td>
            </tr>
            <tr>
              <td className="text-secondary font-bold pr-4">Status</td>
              <td className="text-gray-600">: Not Started</td>
            </tr>
          </tbody>
        </table>
        <div className=''>
          <div className='flex sm:justify-center'>
            <button className='sm:col-span-1 col-span-4 group   rounded-xl p-6'>
              <p className=' text-s '>Total Feedbacks</p>
              <h3 className=' mt-3 text-4xl text-primary  font-bold'>10</h3>
            </button>
            <button className='sm:col-span-1 col-span-4 group  rounded-xl p-6'>
              <p className=' text-s '>Total Completed</p>
              <h3 className=' mt-3 text-4xl text-primary font-bold'>1</h3>
            </button>
          </div>
          <div className='grid  justify-between gap-10 grid-cols-2 '>
            <table>
              <tbody>
                <tr>
                  <td className="text-secondary font-bold pr-4">Total Attendance</td>
                  <td className="text-gray-600">: 10</td>
                </tr>
                <tr>
                  <td className="text-secondary font-bold pr-4">Maximum Marks</td>
                  <td className="text-gray-600">: 30</td>
                </tr>
                <tr>
                  <td className="text-secondary font-bold pr-4">Minimum Marks</td>
                  <td className="text-gray-600">: 12</td>
                </tr>
                <tr>
                  <td className="text-secondary font-bold pr-4">Average Marks</td>
                  <td className="text-gray-600">: 22</td>
                </tr>
              </tbody>
            </table>
          </div>

          </div>
        </div>

          <div className="w-full flex gap-2 flex-wrap  rounded-md mt-16 items-center justify-center">
            <button className="bg-green-500 text-white font-bold py-2 px-4 rounded mr-2">
              Update
            </button>
            <button className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-2">
              Delete
            </button>
            <button onClick={()=>{navigate("../view-data")}} className="bg-primary text-white font-bold py-2 px-4 rounded mr-2">
              View More
            </button>
        </div>
      </div>

      <div className="mt-4 text-lg  p-4 text-secondary">
        <div className="">
          <div className="flex gap-2">
          <h3 className=" text-blue-600 font-bold ">1: Question DBMS Practical Exam Chapter 1 to 4</h3>
          <p className="font-bold">
          (1 Mark)
          </p>
          </div>
          <div className="flex sm:flex-row flex-col "><span className="p-2 font-bold">Options:</span>
            <div className="p-2">A: Option A</div>
            <div className="p-2">B: Option B</div>
            <div className="p-2">C: Option C</div>
            <div className="p-2">D: Option D</div>
          </div>
          <p className="mt-2 font-bold">Correct: A: Option A</p>
        </div>
        <div className="border-b border-gray-300 my-4"></div>

        <div>
        <div className="flex gap-2">
          <h3 className=" text-blue-600 font-bold mb-2">2: Question DBMS Practical Exam Chapter 1 to 4</h3>
          <p className="font-bold">
          (1 Mark)
          </p>
          </div>
          <div className="flex sm:flex-row flex-col "><span className="p-2 font-bold">Options:</span>
            <div className="p-2">A: Option A</div>
            <div className="p-2">B: Option B</div>
            <div className="p-2">C: Option C</div>
            <div className="p-2">D: Option D</div>
          </div>
          <p className="mt-2 font-bold">Correct: A: Option A</p>
        </div>
        <div className="border-b border-gray-300 my-4"></div>
      </div>
    </div>
  );
};

export default ViewQuiz;
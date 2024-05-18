import React from 'react';
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";


const Manageexam3 = () => {
  return (
    <div className="flex-wrap">
      <div className="bg-white p-4 rounded-3xl shadow-md ">
        <div className="flex sm:flex-row flex-col justify-between gap-4">
        <table className=''>
          <tbody>
            <tr>
              <td className="text-gray-600 font-bold pr-4">Subject</td>
              <td className="text-gray-600">: DBMS</td>
            </tr>
            <tr>
              <td className="text-gray-600 font-bold pr-4">Title</td>
              <td className="text-gray-600">: DBMS Practical</td>
            </tr>
            <tr>
              <td className="text-gray-600 font-bold pr-4">Description</td>
              <td className="text-gray-600">: DBMS Practical Exam Chapter 1 to 4</td>
            </tr>
            <tr>
              <td className="text-gray-600 font-bold pr-4">Questions</td>
              <td className="text-gray-600">: 30</td>
            </tr>
            <tr>
              <td className="text-gray-600 font-bold pr-4">Marks</td>
              <td className="text-gray-600">: 30</td>
            </tr>
            <tr>
              <td className="text-gray-600 font-bold pr-4">Date</td>
              <td className="text-gray-600">: 12/05/2024</td>
            </tr>
            <tr>
              <td className="text-gray-600 font-bold pr-4">Time</td>
              <td className="text-gray-600 ">: <span className="">12:00 PM To 12:30 PM</span></td>
            </tr>
            <tr>
              <td className="text-gray-600 font-bold pr-4">Status</td>
              <td className="text-gray-600 ">: Attempted</td>
            </tr>
          </tbody>
        </table>
        <div className=''>
          <div className='grid justify-between'>
            <table className='text-xl'>
              <tbody>
                <tr>
                  <td className="text-gray-600 font-bold pr-4">Total Obtained Marks</td>
                  <td className="text-gray-600 font-bold"> 
                    <h6 className='text-primary text-xl font-bold'>20</h6>
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-600 font-bold pr-4">Total Right Answers</td>
                  <td className="text-gray-600 font-bold"> 
                    <h6 className='text-primary text-xl font-bold'>20</h6>
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-600 font-bold pr-4">Total Wrong Answers</td>
                  <td className="text-gray-600 font-bold"> 
                    <h6 className='text-primary text-xl font-bold'>10</h6>
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-600 font-bold p-4"><img src='../images/image_StudentChart.png' alt="image_StudentChart.png" className="" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          </div>
        </div>
      </div>

      <div className="mt-4 p-4 gap-2 flex flex-col">
        <div className="">
          <div className="flex w-full flex-row justify-between">
          <div className="flex w-10/12 flex-row gap-4">
          <h3 className=" text-secondary font-bold">1: Question DBMS Practical Exam Chapter 1 to 4</h3>
          <p className="font-bold">
          (1 Mark)
          </p>
          </div>
          <p className="font-bold w-fit">
          (0 Mark)
          </p>
          </div>
          <div className="flex sm:flex-row flex-col "><span className="p-2 font-bold">Options:</span>
            <div className="p-2 text-green-600">A: Option A</div>
            <div className="p-2 text-red-600">B: Option B</div>
            <div className="p-2">C: Option C</div>
            <div className="p-2">D: Option D</div>
          </div>
        </div>
        <div className="border-b border-gray-300 my-4"></div>

        <div>
        <div className="flex gap-2">
          <div className="flex w-full flex-row justify-between">
          <div className="flex w-10/12 flex-row gap-4">
          <h3 className=" text-secondary font-bold mb-2">2: Question DBMS Practical Exam Chapter 1 to 4</h3>
          <p className="font-bold">
          (1 Mark)
          </p>
          </div>
          <p className="font-bold w-fit">
          (1 Mark)
          </p>
          </div>
          </div>
          <div className="flex sm:flex-row flex-col "><span className="p-2 font-bold">Options:</span>
            <div className="p-2">A: Option A</div>
            <div className="p-2 text-green-600">B: Option B</div>
            <div className="p-2">C: Option C</div>
            <div className="p-2">D: Option D</div>
          </div>
        </div>
        <div>
        <div className="border-b border-gray-300 my-4"></div>
        <div className="flex gap-2">
          <div className="flex w-full flex-row justify-between">
          <div className="flex w-10/12 flex-row gap-4">
          <h3 className=" text-secondary font-bold mb-2">3: Question DBMS Practical Exam Chapter 1 to 4</h3>
          <p className="font-bold">
          (1 Mark)
          </p>
          </div>
          <p className="font-bold w-fit">
          (1 Mark)
          </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manageexam3;
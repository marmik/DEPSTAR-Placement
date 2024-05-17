import React from 'react';
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";


const Manageexam = () => {
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
          <button className='sm:col-span-1 col-span-4 group  rounded-xl p-6'>
            <p className=' text-s '>Scheduled Quiz</p>
            <h3 className=' mt-3 text-4xl text-primary font-bold'>1</h3>
          </button>
        </div>
        </div>
        <div className="bg-white w-full rounded-md p-4">
          <h3 className="text-2xl px-4 font-semibold mb-4">Manage Quiz</h3>
          <div className="overflow-x-auto flex flex-wrap">
            <div className="w-full w-10/20 rounded-md p-4 mb-4">
              <table className="min-w-full   border rounded-lg overflow-hidden">
                <thead className="bg-primary text-light border">
                  <tr className='divide-x divide-light'>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">No</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Title</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Description</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Subject</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Questions</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Marks</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='divide-x divide-light'>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">1</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">SE Practical</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">chapter1-4</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">SE</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">25</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">25</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">12/05/2024</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">
                      <button className="text-green-600 text-lg font-bold py-1 px-3 rounded-lg mr-2">
                      <FiEdit />
                      </button>
                      <button className="text-red-600 text-lg font-bold py-1 px-3 mr-2">
                      <MdDelete />
                      </button>
                    </td>
                  </tr>
                  <tr className='divide-x divide-light'>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">1</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">SE Practical</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">chapter1-4</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">SE</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">25</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">25</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">12/05/2024</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">
                      <button className="text-green-600 text-lg font-bold py-1 px-3 rounded-lg mr-2">
                      <FiEdit />
                      </button>
                      <button className="text-red-600 text-lg font-bold py-1 px-3 rounded-lg mr-2">
                      <MdDelete />
                      </button>
                    </td>
                  </tr>
                  <tr className='divide-x divide-light'>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">2</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">DBMS Practical</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">DBMS Chapter1-4</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">DBMS</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">50</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">50</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">18/03/2024</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">
                      <button className="text-green-600  text-lg font-bold py-1 px-3 rounded-lg mr-2">
                      <FiEdit />
                      </button>
                      <button className="text-red-600 text-lg font-bold py-1 px-3 rounded-lg mr-2">
                      <MdDelete />
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
};

export default Manageexam;
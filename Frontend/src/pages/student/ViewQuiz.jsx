import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom'

const ViewQuiz = () => {
  const [AttemptedExams, setAttemptedExams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAttemptedExams = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get('http://localhost:3000/api/student/quizzes/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log(response.data);
      setAttemptedExams(response.data);

    } catch (error) {
      console.error('Error fetching exams:', error);
      toast.error("Something Went Wrong ! Please try again Later ");
    }
  };
  fetchAttemptedExams();
  const formateDate =(examdate)=>{
    const isoString = examdate;
    const date = new Date(isoString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
      
    const formattedDate = `${day}-${month}-${year}`; 
    return formattedDate
  }
  const filteredQuizzes = AttemptedExams.filter((quiz) =>
    quiz.Title.toLowerCase().includes(searchQuery.toLowerCase())
  
  );
  return (
    <div>
    <div className="flex flex-wrap">
      <div className="items-center justify-between mb-8">
      <h2 className="text-2xl px-6 font-semibold mb-4">Search Quiz</h2>
        <div className="bg-white py-3 px-6 flex ">
        <label className="flex flex-col ">
        <input
        type="text"
                placeholder="Search Quiz"
                className="p-4 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                      <th className="text-left py-3 px-4 uppercase text-sm">Quiz</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Date</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Total Questions</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Total Marks</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Obtained Marks</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Action</th>
                  </tr>
              </thead>
              <tbody>
              {filteredQuizzes.map((exam, index) => (
                    <tr key={index} className="divide-x hover:bg-slate-100 divide-light">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{exam.Title}</td>
                  <td className="py-3 px-4">{formateDate(exam.SubmissionDate)}</td>
                  <td className="py-3 px-4">{exam.total_question}</td>
                  <td className="py-3 px-4">{exam.total_marks}</td>
                  <td className="py-3 px-4">{exam.obtain_Marks}</td>
                  <td className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  <button
  className="text-light bg-primary text-lg font-bold py-1 px-3 rounded-lg mr-2">View</button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredQuizzes.length === 0 && (
                <p className="text-center py-3">No quizzes found</p>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewQuiz
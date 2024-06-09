import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ManageQuiz = () => {
  const [ManageQuizzes, setManageQuiz] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalQuizzes, setTotalQuizzes] = useState(0);


  const formatDate = (examdate) => {
    const isoString = examdate;
    const date = new Date(isoString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/faculty/allQuizzes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setManageQuiz(response.data);
        setTotalQuizzes(response.data.length);


      } catch (error) {
        // console.error('Error fetching exams:', error);
      }
    };

    fetchExams();
  }, []);

  const filteredQuizzes = ManageQuizzes.filter((quiz) =>
    quiz.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='p-4 text-secondary'>

      <div className="flex flex-wrap items-center justify-start">
        <div className="bg-white sm:w-1/4 w-full py-3">
          <h2 className="text-2xl font-semibold mb-2">Search Quiz</h2>
          <label className="flex w-full flex-col">
            <input
              type="text"
              placeholder="Search Quiz"
              className="p-4 border-2 w-full  border-slate-300 rounded-md focus:border-primary focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </div>

        <div className=' grid text-secondary'>
          <div className='flex justify-between gap-10'>
            <button className='group rounded-xl p-6'>
              <p className='text-s'>Total Quiz</p>
              <h3 className='mt-3 text-4xl text-primary font-bold'>{totalQuizzes}</h3>
            </button>
            <button className='group rounded-xl p-6'>
              <p className='text-s'>Scheduled Quiz</p>
              <h3 className='mt-3 text-4xl text-primary font-bold'>10</h3>
            </button>
          </div>
        </div>
      </div>
      <br />
      <hr />
      <br />
      <div className=" bg-white w-full rounded-md ">
        <h3 className="text-xl py-4">Manage Quiz</h3>
        <div className="overflow-x-auto flex flex-wrap">
          <div className="w-full w-10/20 rounded-md  mb-4">
            <table className="min-w-full border rounded-lg overflow-hidden">
              <thead className="bg-primary text-light border">
                <tr className='divide-x divide-light'>
                  <th className="text-left py-3 px-4 uppercase text-sm">No</th>
                  <th className="text-left py-3 px-4 uppercase text-sm">Title</th>
                  <th className="text-left py-3 px-4 uppercase text-sm">Description</th>
                  <th className="text-left py-3 px-4 uppercase text-sm">Subject</th>
                  <th className="text-left py-3 px-4 uppercase text-sm">Sem</th>
                  <th className="text-left py-3 px-4 uppercase text-sm">Questions</th>
                  <th className="text-left py-3 px-4 uppercase text-sm">Marks</th>
                  <th className="text-left py-3 px-4 uppercase text-sm">Date</th>
                  <th className="text-left py-3 px-4 uppercase text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuizzes.map((exam, index) => (
                  <tr key={index} className="divide-x hover:bg-slate-100 divide-light">
                    <td className="py-3 px-4">{index + 1}</td>
                    <Link to={`../view-quiz/${window.btoa(exam.ExamID)}`}>
                      <td className="py-3 text-primary px-4">{exam.Title}</td>
                    </Link>
                    <td className="py-3 px-4">{exam.Description}</td>
                    <td className="py-3 px-4">{exam.Subject}</td>
                    <td className="py-3 px-4">{exam.sem}</td>
                    <td className="py-3 px-4">{exam.Number_of_Questions}</td>
                    <td className="py-3 px-4">{exam.Exam_Total_Marks}</td>
                    <td className="py-3 px-4">{formatDate(exam.ExamDate)}</td>
                    <td className="py-3 px-4">
                      <Link
                        to={`../view-quiz/${window.btoa(exam.ExamID)}`}
                        className="text-white bg-primary text-lg py-2 px-3 rounded-md mr-2"
                      >
                        <button>
                          View More
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {filteredQuizzes.length == 0 ? (<p className='py-4 text-center w-full'>No any Attempted Quiz</p>) : ("")}
      </div>
    </div>

  );
};

export default ManageQuiz;

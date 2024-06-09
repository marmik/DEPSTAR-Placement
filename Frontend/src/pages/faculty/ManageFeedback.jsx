import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';


const ManageFeedback = () => {

  const [ManageFeedback, setManageFeedback] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");




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
        const response = await axios.get('http://localhost:3000/api/faculty/facultyQuizzes/feedback', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data,"manage feed")
        setManageFeedback(response.data);



      } catch (error) {
        // console.error('Error fetching exams:', error);
      }
    };

    fetchExams();
  }, []);

  const filteredFeedbackzes = ManageFeedback.filter((Feedback) =>
    Feedback.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className='p-4 text-secondary'>

      <div className="py-3 ">
        <h2 className="text-2xl  font-semibold mb-2">Search Quiz</h2>
        <label className="flex flex-col">
          <input
            type="text"
            placeholder="Search Quiz"
            className="p-4 border-2 w-full sm:w-1/4 border-slate-300 rounded-md focus:border-primary focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
      </div>

      <br />
      <hr />
      <br />
      <div>
        <div className="bg-white rounded-md">
          <h2 className="text-xl py-4">Manage Feedbacks</h2>
          <div className="overflow-x-auto flex flex-wrap">

            <div className="w-full rounded-md">
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
                    {filteredFeedbackzes.map((exam, index) => (
                      <tr className="divide-x divide-light">
                        <td className="text-left py-3  px-4 ">{index + 1}</td>
                        <td className="text-left py-3 text-primary  px-4">
                          <Link
                            to={`../view-data/${window.btoa(exam.ExamID)}`}

                          >
                            {exam.title}
                          </Link></td>
                        <td className="text-left py-3  px-4">{exam.subject}</td>
                        <td className="text-left py-3  px-4">{formatDate(exam.ExamDate)}</td>
                        <td className="text-left py-3  px-4">{exam.total_feedback}</td>
                        <td className="text-left py-3  px-4">
                          <Link
                            to={`../view-data/${window.btoa(exam.ExamID)}`}
                            className="text-white bg-primary text-lg py-2 px-3 rounded-md mr-2"
                          >

                            View

                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {filteredFeedbackzes.length == 0 ? (<p className='py-4 text-center w-full'>No any Quiz Conducted</p>) : ("")}
        </div>
      </div>
    </div>
  )
}

export default ManageFeedback
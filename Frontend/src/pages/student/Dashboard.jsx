import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoCloseCircleOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LineChart } from '@mui/x-charts/LineChart';

const Dashboard = () => {
  const navigate = useNavigate();
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [AttemptedExams, setAttemptedExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [headerdetails, Setheaderdetails] = useState({});
  const [keywisedata, setkeywisedata] = useState([]);//this is for graph
  // const [conductedExams, setConductedExams] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  

  const handleStartQuiz = async (QuizID) => {


    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`http://localhost:3000/api/student/quizzes/${QuizID}/start`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.status === 200) {

        toast.success("Quiz Started. ALL THE BEST");

        navigate(`./start-quiz/${window.btoa(QuizID)}`);
      }


    } catch (error) {
      // console.error('Error fetching exams:', error);
      toast.error("Something Went Wrong ! Please try again Later ");
    }

  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStartQuizPopUp = (exam) => {
    setSelectedExam(exam);
    setShowPopup(true);
  };

  const handleToggle = () => {
    setShowPopup(!showPopup);
  };
  const formateDate = (examdate) => {
    const isoString = examdate;
    const date = new Date(isoString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate
  }
  useEffect(() => {
    const fetchUpCommingExams = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:3000/api/student/upcomingExams', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(response.data);
        setUpcomingExams(response.data);

      } catch (error) {
        // console.error('Error fetching exams:', error);
        toast.error("Something Went Wrong ! Please try again Later ");
      }
    };
    fetchUpCommingExams();
    const fetchAttemptedExams = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:3000/api/student/recentExams', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(response.data);
        setAttemptedExams(response.data);

      } catch (error) {
        // console.error('Error fetching exams:', error);
        toast.error("Something Went Wrong ! Please try again Later ");
      }
    };
    fetchAttemptedExams();

    

  }, []);

  useEffect(() => {
    const fetchheaderdetails = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:3000/api/student/dashboard/upcomingExamsCount/examClearedCount', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data);
        Setheaderdetails(response.data);
        
        const studentQuizDetails =response.data.studentQuizDetails;
        const keyWiseArrays = {};
        studentQuizDetails.forEach(item => {
            Object.keys(item).forEach(key => {
                if (!keyWiseArrays[key]) {
                    keyWiseArrays[key] = [];
                }
                keyWiseArrays[key].push(item[key]);
            });
        });
        setkeywisedata(keyWiseArrays);
        // console.log(keyWiseArrays);
      } catch (error) {
        // console.error('Error fetching exams:', error);
        toast.error("Something Went Wrong ! Please try again Later ");
      }
    };
    fetchheaderdetails();
    

  }, []);

  return (
    <div className='p-4 text-secondary'>

      {showPopup && (
        <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg m-2">
            <div className="sm:p-6 p-2 flex flex-col rounded-lg gap-4 w-full justify-center">
              <h2 className="text-xl font-bold mb-4">Quiz info</h2>
              <div className="flex sm:flex-row flex-col gap-8 w-full justify-between">
                <h2 className="sm:w-1/3 w-full text-lg font-bold">
                  Subject :<span className=" text-lg font-light">{selectedExam.Subject}</span>
                </h2>
                <h2 className="sm:w-1/3 w-full text-lg font-bold">
                  Title : <span className=" text-lg font-light">{selectedExam.Title}</span>
                </h2>
                <h2 className="sm:w-1/3 w-full text-lg font-bold">
                  Time :<span className=" text-lg font-light">{selectedExam.StartTime} TO {selectedExam.EndTime}</span>
                </h2>
              </div>
              <div className="flex sm:flex-row flex-col gap-8 w-full justify-between">
                <h2 className="sm:w-1/3 w-full text-lg font-bold">
                  Description : <span className=" text-lg font-light">{selectedExam.Description}</span>
                </h2>
                <h2 className="sm:w-1/3 w-full text-lg font-bold">
                  Total Questions : <span className=" text-lg font-light">{selectedExam.Number_of_Questions}</span>
                </h2>
                <h2 className="sm:w-1/3 w-full text-lg font-bold">
                  Total Marks : <span className=" text-lg font-light">{selectedExam.Exam_Total_Marks}</span>
                </h2>
              </div>
              <div className="flex sm:flex-row flex-col gap-8 w-full justify-between">
                <h2 className="sm:w-1/3 w-full text-lg font-bold">
                  Date : <span className=" text-lg font-light">{formateDate(selectedExam.ExamDate)}</span>
                </h2>
                <h2 className="sm:w-1/3 w-full text-lg font-bold">
                  Status : <span className=" text-lg font-light">{selectedExam.Status}</span>
                </h2>
                <h2 className="sm:w-1/3 w-full text-lg font-bold">
                  <span className=" text-lg font-light"></span>
                </h2>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => { handleStartQuiz(selectedExam.ExamID) }}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded"
              >
                Start Quiz
              </button>

              <button
                className="bg-gray-200 text-secondary font-semibold py-2 px-4 rounded"
                onClick={handleToggle}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

      )}

      <div>
        <div className='grid justify-between gap-10  grid-cols-4 '>
          <button className='sm:col-span-1 col-span-4 group hover:shadow-2xl bg-light hover:bg-primary transition-all rounded-xl p-6'>
            <p className=' text-xl group-hover:text-light'>Total Quiz Cleared</p>
            <h3 className=' mt-3 text-6xl text-primary group-hover:text-light font-bold'>{headerdetails.attemptedQuizzesCount || "0"}</h3>
          </button>
          <button className='sm:col-span-1 col-span-4 group hover:shadow-2xl bg-light hover:bg-primary transition-all rounded-xl p-6'>
            <p className=' text-xl group-hover:text-light'>Total Upcoming Quiz</p>
            <h3 className=' mt-3 text-6xl text-primary group-hover:text-light font-bold'>{headerdetails.upcomingExamsCount || "0"}</h3>
          </button>
          <div className='sm:col-span-2 col-span-4 items-center w-full h-fill flex justify-center'>
            {/* <img src="../images/graph.png" alt="" /> */}
            <LineChart
              width={500}
              height={300}
              series={[
                { data: (keywisedata.total_marks?keywisedata.total_marks:[0]), label: 'Obtaind Marks' },
              ]}
              
              xAxis={[{ scaleType: 'point', data: (keywisedata.exam_id?Array.from({ length: keywisedata.exam_id.length }, (_, i) => `Exam ${i + 1}`):[0]) }]}
            />
          </div>
        </div>

        <br /><br />

        <h3 className="text-2xl font-semibold mb-4">Upcoming Quiz Exams</h3>
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full   border rounded-lg overflow-hidden">
              <thead className="bg-primary text-light border">
                <tr>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">No</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Subject</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Title</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Total Questions</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Total Marks</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Start Time</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">End Time</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Action</th>
                </tr>
              </thead>
              <tbody>

                {upcomingExams.map((exam, index) => (
                  <tr key={exam.id} className='divide-x hover:bg-slate-100 divide-light'>
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{exam.Subject}</td>
                    <td className="py-3 px-4">{exam.Title}</td>
                    <td className="py-3 px-4">{exam.Number_of_Questions}</td>
                    <td className="py-3 px-4">{exam.Exam_Total_Marks}</td>
                    <td className="py-3 px-4">{formateDate(exam.ExamDate)}</td>
                    <td className="py-3 px-4">{exam.StartTime}</td>
                    <td className="py-3 px-4">{exam.EndTime}</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">
                      <button
                        className="text-light bg-primary text-lg font-bold py-1 px-3 rounded-lg mr-2"
                        onClick={() => handleStartQuizPopUp(exam)}>Start</button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
          {upcomingExams.length == 0 ? (<p className='py-4 text-center w-full'>No any Upcoming Quiz</p>) : ("")}

          <br /><br />

          <h3 className="text-2xl font-semibold mb-4">Recently Attempted Quiz</h3>
          <div className="overflow-x-auto flex flex-wrap">

            <table className="min-w-full border rounded-lg overflow-hidden">
              <thead className="bg-primary text-light border">
                <tr>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">No</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Subject</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Quiz</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Total Questions</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Total Marks</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Obtained Marks</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Action</th>
                </tr>
              </thead>
              <tbody>


                {AttemptedExams.map((exam, index) => (
                  <tr key={exam.id} className='divide-x hover:bg-slate-100 divide-light'>
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4"><Link to={`../view-given-quiz/${window.btoa(exam.quizID)}`}
                        className="text-primary">{exam.title}</Link></td>
                    <td className="py-3 px-4">{exam.subject}</td>
                    <td className="py-3 px-4">{formateDate(exam.date)}</td>
                    <td className="py-3 px-4">{exam.totalQuestions}</td>
                    <td className="py-3 px-4">{exam.totalMarks}</td>
                    <td className="py-3 px-4">{exam.obtainMarks}</td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">
                      <Link to={`../view-given-quiz/${window.btoa(exam.quizID)}`}
                        className="text-light bg-primary text-lg font-bold py-1 px-3 rounded-lg mr-2">View</Link>
                    </td>
                  </tr>



                ))}

              </tbody>
            </table>
          </div>
        </div>
        {AttemptedExams.length == 5 ? (

          <div className='text-center py-4 w-full'>
            <Link to={"./view-quiz"} className='rounded-full px-5 py-2 bg-blue-50 text-primary w-full'>View More</Link>
          </div>

        ) : ("")}
        {AttemptedExams.length == 0 ? (<p className='py-4 text-center w-full'>No any Attempted Quiz</p>) : ("")}
      </div>
    </div>
  );
}

export default Dashboard
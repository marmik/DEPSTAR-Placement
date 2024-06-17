import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BarChart } from '@mui/x-charts/BarChart';

const xLabels = [
  'Test 1',
  'Test 2',
  'Test 3',
  'Test 4',
  'Test 5',
  'Test 6',
  'Test 7',
];

const Dashboard = () => {
  const [scheduledExams, setScheduledExams] = useState([]);
  const [conductedExams, setConductedExams] = useState([]);
  const [headerdetails, setheaderdetails] = useState([]);
  const [keywisedata, setkeywisedata] = useState([]);//this is for graph

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
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/faculty/scheduledQuizzes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setScheduledExams(response.data);

      } catch (error) {
        // console.error('Error fetching exams:', error);
      }
    };

    fetchExams();
  }, []);

  useEffect(() => {
    const qHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/faculty/recentExam/details', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setConductedExams(response.data);
        
        const studentQuizDetails =response.data;
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
        console.log(keyWiseArrays);

        // console.log(response.data);
      } catch (error) {
        // console.error('Error fetching exams:', error);
      }
    };

    qHistory();
  }, []);

  useEffect(() => {
    const fetchheaderdetails = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:3000/api/faculty/dashboard/examsConductedCount/examScdeduled', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(response.data);
        setheaderdetails(response.data);

      } catch (error) {
        // console.error('Error fetching exams:', error);
        toast.error("Something Went Wrong ! Please try again Later ");
      }
    };
    fetchheaderdetails();
  }, []);

  return (
    <>
      <div className='p-4 text-secondary'>
        <div className='grid justify-between gap-10 grid-cols-4'>
          <button className='sm:col-span-1 col-span-4 group hover:shadow-2xl bg-light hover:bg-primary transition-all rounded-xl p-6'>
            <p className='text-xl group-hover:text-light'>Total Exam Conducted</p>
            <h3 className='mt-3 text-6xl text-primary group-hover:text-light font-bold'>{headerdetails.totalExamConducted || "0"}</h3>
          </button>
          <button className='sm:col-span-1 col-span-4 group hover:shadow-2xl bg-light hover:bg-primary transition-all rounded-xl p-6'>
            <p className='text-xl group-hover:text-light'>Total Exam Scheduled</p>
            <h3 className='mt-3 text-6xl text-primary group-hover:text-light font-bold'>{headerdetails.totalExamScheduled || "0"}</h3>
          </button>
          <div className='sm:col-span-2 col-span-4 items-center w-full h-fill flex justify-center'>
            {/* <img src="../images/chartFaculty.png" alt="Chart" /> */}
            <BarChart
              series={[
                { data: (keywisedata.total_marks?keywisedata.total_marks:[1]), stack: 'A', label: 'Total Marks' },
                { data: (keywisedata.max_marks?keywisedata.max_marks:[1]), stack: 'A', label: 'Maximum Marks'},
                { data: (keywisedata.min_marks?keywisedata.min_marks:[1]), stack: 'A', label: 'Minimum Marks'},
                { data: (keywisedata.avg_marks?keywisedata.avg_marks:[1]), stack: 'A', label: 'Average Marks'},
              ]}
              xAxis={[{ data: (keywisedata.ExamID?keywisedata.ExamID:[1]), scaleType: 'band' }]}
              width={600}
              height={350}
/>
          </div>
        </div>
        <br /><br />
        <h2 className="text-2xl font-semibold mb-4">Scheduled Exam</h2>
        <div className='overflow-x-auto'>
          <table className="min-w-full border rounded-lg overflow-hidden">
            <thead className="bg-primary text-light border">
              <tr>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">No</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Title</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Subject</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Total Marks</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Total Questions</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">SEM</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Class</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Start Time</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">End Time</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {scheduledExams.map((exam, index) => (
                <tr key={exam.id} className='divide-x hover:bg-slate-100 divide-light'>
                  <td className="py-3 px-4">{index + 1}</td>
                  <Link to={`./view-quiz/${window.btoa(exam.ExamID)}`}><td className="py-3 text-primary px-4">{exam.Title}</td></Link>
                  <td className="py-3 px-4">{exam.Subject}</td>
                  <td className="py-3 px-4">{exam.Exam_Total_Marks}</td>
                  <td className="py-3 px-4">{exam.Number_of_Questions}</td>
                  <td className="py-3 px-4">{exam.sem}</td>
                  <td className="py-3 px-4">{exam.className}</td>
                  <td className="py-3 px-4">{formateDate(exam.ExamDate)}</td>
                  <td className="py-3 px-4">{exam.StartTime}</td>
                  <td className="py-3 px-4">{exam.EndTime}</td>
                  <td className="py-3 px-4">
                    <Link to={`./view-quiz/${window.btoa(exam.ExamID)}`} className="text-light bg-primary text-lg font-bold py-1 px-3 rounded-lg mr-2">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {scheduledExams.length == 0 ? (<p className='py-4 text-center w-full'>No any Quiz Scheduled !</p>) : ("")}
        <br /><br />
        <h2 className="text-2xl font-semibold mb-4">Recently Conducted Exams</h2>
        <div className='overflow-x-auto '>

          <table className="min-w-full   border rounded-lg overflow-hidden">
            <thead className="bg-primary text-light border">
              <tr>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">No</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Title</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Total Questions</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Total Marks</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Maximum</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Minimum</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Average</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Feedbacks</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody >
              {conductedExams.map((item, index) => (
                <tr key={item.SubmissionID} className="divide-x hover:bg-gray-100 divide-gray-200">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 text-blue-600">  
                    <Link to={`./view-quiz/${window.btoa(item.ExamID)}`} >
                    {item.Title}
                  </Link></td>
                  <td className="py-3 px-4">{item.total_questions}</td>
                  <td className="py-3 px-4">{item.total_marks}</td>
                  <td className="py-3 px-4">{item.max_marks}</td>
                  <td className="py-3 px-4">{item.min_marks}</td>
                  <td className="py-3 px-4">{item.avg_marks}</td>
                  <td className="py-3 px-4">{item.feedback_count}</td>
                  <td className="py-3 px-4">
                    {/* ./view-quiz/${window.btoa(item.SubmissionID)} */}
                    <Link to={`./view-quiz/${window.btoa(item.ExamID)}`} className="text-white bg-blue-600 text-lg font-bold py-1 px-3 rounded-lg mr-2">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {conductedExams.length == 5 ? (<div className='w-full bg-red- text-center py-4'><Link to={"./manage-quiz"} className='px-4 py-2 bg-blue-50 text-primary rounded-full'>View More</Link></div>) : ("")}
        {conductedExams.length == 0 ? (<p className='py-4 text-center w-full'>No any Quiz Conducted !</p>) : ("")}

      </div>
    </>
  )
}

export default Dashboard
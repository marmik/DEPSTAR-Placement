import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PieChart } from '@mui/x-charts/PieChart';


const Dashboard = () => {
  const [scheduledExams, setScheduledExams] = useState([]);
  // const [conductedExams, setConductedExams] = useState([]);
  const formateDate =(examdate)=>{
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
        console.error('Error fetching exams:', error);
      }
    };

    fetchExams();
  }, []);

  return (
    <>
      <div className='p-4 text-secondary'>
        <div className='grid justify-between gap-10 grid-cols-4'>
          <button className='sm:col-span-1 col-span-4 group hover:shadow-2xl bg-light hover:bg-primary transition-all rounded-xl p-6'>
            <p className='text-xl group-hover:text-light'>Total Exam Conducted</p>
            <h3 className='mt-3 text-6xl text-primary group-hover:text-light font-bold'>10</h3>
          </button>
          <button className='sm:col-span-1 col-span-4 group hover:shadow-2xl bg-light hover:bg-primary transition-all rounded-xl p-6'>
            <p className='text-xl group-hover:text-light'>Total Exam Feedbacks</p>
            <h3 className='mt-3 text-6xl text-primary group-hover:text-light font-bold'>10</h3>
          </button>
          <div className='sm:col-span-2 col-span-4 items-center w-full h-fill flex justify-center'>
            {/* <img src="../images/chartFaculty.png" alt="Chart" /> */}
            <PieChart
              colors={['#3F5BCC', '#FF8989', '#E347CF']} 
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: 'series A' },
                    { id: 1, value: 15, label: 'series B' },
                    { id: 2, value: 20, label: 'series C' },
                  ],
                  innerRadius: 20,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 5,
                  startAngle: -90,
                  endAngle: 180,
                },
              ]}
              width={400}
              height={250}
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

              <tr className='divide-x divide-light'>
                <td className="py-3 px-4">1</td>
                <td className="py-3 px-4">DBMS Practical</td>
                <td className="py-3 px-4">30</td>
                <td className="py-3 px-4">30</td>
                <td className="py-3 px-4">30</td>
                <td className="py-3 px-4">15</td>
                <td className="py-3 px-4">22</td>
                <td className="py-3 px-4">40</td>
                <td className="py-3 px-4"> <button className="text-light bg-primary text-lg  font-bold py-1 px-3 rounded-lg mr-2">View</button></td>
              </tr>

              <tr className='divide-x divide-light'>
                <td className="py-3 px-4">2</td>
                <td className="py-3 px-4">DAA Practical</td>
                <td className="py-3 px-4">30</td>
                <td className="py-3 px-4">30</td>
                <td className="py-3 px-4">30</td>
                <td className="py-3 px-4">15</td>
                <td className="py-3 px-4">22</td>
                <td className="py-3 px-4">40</td>
                <td className="py-3 px-4"> <button className="text-light bg-primary text-lg  font-bold py-1 px-3 rounded-lg mr-2">View</button></td>
              </tr>


            </tbody>
          </table>
        </div>

      </div>
    </>
  )
}

export default Dashboard
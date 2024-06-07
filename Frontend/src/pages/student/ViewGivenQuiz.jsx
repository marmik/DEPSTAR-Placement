import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { PieChart } from '@mui/x-charts/PieChart';


const ViewGivenQuiz = () => {

  const navigate = useNavigate();
  let { id } = useParams();
  const QuizID = window.atob(id);




  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/student/quizDetails/${QuizID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          console.log('====================================');
          console.log(response.data);
          console.log('====================================');
        } else {
          toast.warn("Internal Server Error !");
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchQuiz();
  }, [QuizID]);

  return (
    <div className="text-lg">
      <div className="bg-white p-8 rounded-3xl shadow-2xl ">
        <div className="flex sm:flex-row flex-col justify-between gap-4">
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
                <td className="text-secondary font-bold pr-4">Obtained Marks</td>
                <td className="text-gray-600">: 30</td>
              </tr>
              <tr>
                <td className="text-secondary font-bold pr-4">Date</td>
                <td className="text-gray-600">: 12/05/2024</td>
              </tr>
              <tr>
                <td className="text-secondary font-bold pr-4">Time</td>
                <td className="text-gray-600 ">: <span className="">12:00 PM To 12:30 PM</span></td>
              </tr>
              <tr>
                <td className="text-secondary font-bold pr-4">Status</td>
                <td className="text-gray-600 ">: Attempted</td>
              </tr>
              <tr>
                <td className="text-secondary font-bold pr-4">Feedback</td>
                <td className="text-gray-600 ">: My Feedback</td>
              </tr>
            </tbody>
          </table>
          <div className=' '>
          <PieChart
              colors={['#408EFC', '#E73B28', '#3BEF74']} 
              series={[
                {
                  data: [
                    { id: 0, value: 30, label: 'Total \nMarks' },
                    { id: 1, value: 30, label: 'Total \n Questions' },
                    { id: 2, value: 25, label: 'Obtained \nMarks' }
                  ],
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 2,
                  cornerRadius: 3,
                  startAngle: -90,
                  // endAngle: 180,
              
                },
              ]}
              width={400}
              height={250}
            />
            <p className='text-center text-secondary'>Performance</p>
          </div>

        </div>
      </div>

      <div className="mt-4 p-4 gap-2 flex flex-col text-secondary">
        <div className="">
          <div className="flex w-full flex-row justify-between">
            <div className="flex w-10/12 flex-row gap-4">
              <h3 className=" text-blue-600 font-bold">1: Question DBMS Practical Exam Chapter 1 to 4</h3>
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
                <h3 className=" text-blue-600 font-bold mb-2">2: Question DBMS Practical Exam Chapter 1 to 4</h3>
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
                <h3 className=" text-blue-600 font-bold mb-2">3: Question DBMS Practical Exam Chapter 1 to 4</h3>
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

export default ViewGivenQuiz;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { PieChart } from '@mui/x-charts/PieChart';


const ViewGivenQuiz = () => {

  const navigate = useNavigate();
  let { id } = useParams();
  const QuizID = window.atob(id);
  
  const [quizdata, setquizdata] = useState([]);
 
  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/student/quizDetails/${QuizID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        // console.log('====================================');
        // console.log(response.data);
        // console.log('====================================');
        setquizdata(response.data);

       
      } else {
        toast.warn("Internal Server Error !");
      }
    } catch (error) {
      // console.error('Error fetching exams:', error);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [QuizID]);

  const formateDate = (examdate) => {
    const isoString = examdate;
    const date = new Date(isoString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate
  }

  return (
    <div className="text-lg">
      <div className="bg-white p-8 rounded-3xl shadow-2xl ">
        <div className="flex sm:flex-row flex-col justify-between gap-4">
          <table className=''>
            <tbody>
              <tr>
                <td className="text-secondary font-bold pr-4">Subject</td>
                <td className="text-gray-600">: {quizdata.exam ? quizdata.exam.Subject : ""}</td>
              </tr>
              <tr>
                <td className="text-secondary font-bold pr-4">Title</td>
                <td className="text-gray-600">: {quizdata.exam ? quizdata.exam.Title : ""}</td>
              </tr>
              <tr>
                <td className="text-secondary font-bold pr-4">Description</td>
                <td className="text-gray-600">: {quizdata.exam ? quizdata.exam.Description : ""}</td>
              </tr>
              <tr>
                <td className="text-secondary font-bold pr-4">Questions</td>
                <td className="text-gray-600">: {quizdata.exam ? quizdata.exam.Number_of_Questions : ""}</td>
              </tr>
              <tr>
                <td className="text-secondary font-bold pr-4">Marks</td>
                <td className="text-gray-600">: {quizdata.exam ? quizdata.exam.Exam_Total_Marks : ""}</td>
              </tr>
              <tr>
                <td className="text-secondary font-bold pr-4">Obtained Marks</td>
                <td className="text-gray-600">: {quizdata.exam ? quizdata.totalMarks : ""}</td>
              </tr>
              <tr>
                <td className="text-secondary font-bold pr-4">Date</td>
                <td className="text-gray-600">: {quizdata.exam ? formateDate(quizdata.exam.ExamDate) : ""}</td>
              </tr>
              <tr>
                <td className="text-secondary font-bold pr-4">Time</td>
                <td className="text-gray-600 ">: <span className="">{quizdata.exam ? quizdata.exam.StartTime+" To "+quizdata.exam.EndTime : ""}</span></td>
              </tr>
              <tr>
                <td className="text-secondary font-bold pr-4">Status</td>
                <td className="text-gray-600 ">: {quizdata.exam ? quizdata.exam.Status : ""}</td>
              </tr>
              <tr>
                <td className="text-secondary font-bold pr-4">Feedback</td>
                <td className="text-gray-600 ">: {quizdata.feedback ? quizdata.feedback : ""}</td>
              </tr>
            </tbody>
          </table>
          <div className=' '>
            <PieChart
              colors={['#408EFC', '#E73B28', '#3BEF74']}
              series={[
                {
                  data: [
                    { id: 0, value:quizdata.exam ? quizdata.exam.Exam_Total_Marks : 0, label: 'Total \nMarks' },
                    { id: 1, value: quizdata.exam ? quizdata.exam.Number_of_Questions :0 , label: 'Total \n Questions' },
                    { id: 2, value: quizdata.exam ? quizdata.totalMarks :0, label: 'Obtained \nMarks' }
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
            
          </div>

        </div>
      </div>
      <div className="mt-4 p-4 gap-2 flex flex-col text-secondary">
        {quizdata.questions && quizdata.questions.map && quizdata.questions.map((question, index) => (
          <div key={index}>
            <div>
              <div className="flex gap-2">
                <div className="flex w-full flex-row justify-between">
                  <div className="flex w-10/12 flex-row gap-4">
                    <h3 className=" text-blue-600 font-bold mb-2">{index + 1} : {question.QuestionText}</h3>
                    <p className="font-bold">
                      ({question.Mark} Mark)
                    </p>
                  </div>
                  <p className="font-bold w-fit">
                    ({(question.selectedOption === question.Correct_Option)?question.Mark:0} Mark)
                  </p>
                </div>
              </div>
              <div className=""><span className="p-2 font-bold">Options:</span>
              
                {['OptionA', 'OptionB', 'OptionC', 'OptionD',].map((option, optionIndex) => {
                  const optionLetter = String.fromCharCode(65 + optionIndex);
                  const optionText = question.options[0][`Option${optionLetter}`];
                  const isSelected = question.selectedOption === question.Correct_Option;
                  const isCorrect = String.fromCharCode(65 + optionIndex) === question.Correct_Option;
                  const optionClassName = (isSelected)
                    ? (isCorrect ? 'p-2 text-green-600' : "p-2")
                    : (isCorrect ? 'p-2 text-green-600' : ((question.selectedOption != optionLetter) ? 'p-2' : 'p-2 text-red-600'));
                  return (
                    <div className={optionClassName}>{String.fromCharCode(65 + optionIndex)}: {optionText}</div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewGivenQuiz;
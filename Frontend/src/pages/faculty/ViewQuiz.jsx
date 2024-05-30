import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';


const ViewQuiz = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const QuizID = window.atob(id);
  const [QuizDetails, setQuizDetails] = useState("");
  const [QuizQuestions, setQuizQuestions] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);

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
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/faculty/quizDetails/${QuizID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setQuizDetails(response.data.exam)
          setQuizQuestions(response.data.questions)
          console.log(QuizQuestions);
          console.log(response.data);
        } else {
          toast.warn("Internal Server Error !");
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchQuiz();
  }, [QuizID]);

  const handleDeleteQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:3000/api/faculty/deleteQuiz/${QuizID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        toast.success('Quiz deleted successfully!');
        navigate('/faculty'); // Adjust the path based on your routing
      } else {
        toast.error('Failed to delete quiz!');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast.error('Error deleting quiz!');
    }
    setShowDeletePopup(false);
  };

  return (
    <div className="flex-wrap">
      <div className="bg-slate-100 text-lg p-8 rounded-lg">
        <div className="flex sm:flex-row flex-col justify-between ">
          <table className=''>
            <tbody>
              <tr>
                <td className="text-secondary font-semibold pr-4">Subject</td>
                <td className="text-gray-600">: {QuizDetails.Subject}</td>
              </tr>
              <tr>
                <td className="text-secondary font-semibold pr-4">Title</td>
                <td className="text-gray-600">: {QuizDetails.Title}</td>
              </tr>
              <tr>
                <td className="text-secondary font-semibold pr-4">Description</td>
                <td className="text-gray-600">: {QuizDetails.Description}</td>
              </tr>
              <tr>
                <td className="text-secondary font-semibold pr-4">Semester </td>
                <td className="text-gray-600">: {QuizDetails.sem}</td>
              </tr>
              <tr>
                <td className="text-secondary font-semibold pr-4">Questions</td>
                <td className="text-gray-600">: {QuizDetails.Number_of_Questions}</td>
              </tr>
              <tr>
                <td className="text-secondary font-semibold pr-4">Marks</td>
                <td className="text-gray-600">: {QuizDetails.Exam_Total_Marks}</td>
              </tr>
              <tr>
                <td className="text-secondary font-semibold pr-4">Date</td>
                <td className="text-gray-600">: {formateDate(QuizDetails.ExamDate)}</td>
              </tr>
              <tr>
                <td className="text-secondary font-semibold pr-4">Time</td>
                <td className="text-gray-600">: <span className="">{QuizDetails.StartTime} to {QuizDetails.EndTime}</span></td>
              </tr>
              <tr>
                <td className="text-secondary font-semibold pr-4">Status</td>
                <td className="text-gray-600">: {QuizDetails.Status}</td>
              </tr>
            </tbody>
          </table>
          {QuizDetails.Status === "Completed" && (
            <div className=''>
              <div className='flex sm:justify-center'>
                <button className='sm:col-span-1 col-span-4 group rounded-xl p-6'>
                  <p className=' text-s '>Total Feedbacks</p>
                  <h3 className=' mt-3 text-4xl text-primary font-semibold'>10</h3>
                </button>
                <button className='sm:col-span-1 col-span-4 group rounded-xl p-6'>
                  <p className=' text-s '>Total Completed</p>
                  <h3 className=' mt-3 text-4xl text-primary font-semibold'>1</h3>
                </button>
              </div>
              <div className='grid justify-between gap-10 grid-cols-2 '>
                <table>
                  <tbody>
                    <tr>
                      <td className="text-secondary font-semibold pr-4">Total Attendance</td>
                      <td className="text-gray-600">: 10</td>
                    </tr>
                    <tr>
                      <td className="text-secondary font-semibold pr-4">Maximum Marks</td>
                      <td className="text-gray-600">: 30</td>
                    </tr>
                    <tr>
                      <td className="text-secondary font-semibold pr-4">Minimum Marks</td>
                      <td className="text-gray-600">: 12</td>
                    </tr>
                    <tr>
                      <td className="text-secondary font-semibold pr-4">Average Marks</td>
                      <td className="text-gray-600">: 22</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="w-full flex gap-2 flex-wrap rounded-md mt-16 items-center justify-center">
          <button className="bg-green-500 text-white font-semibold py-2 px-4 rounded mr-2">
            Update
          </button>
          <button 
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded mr-2"
            onClick={() => setShowDeletePopup(true)}
          >
            Delete
          </button>
          {QuizDetails.Status === "Completed" && (
            <button onClick={() => { navigate("../view-data") }} className="bg-primary text-white font-semibold py-2 px-4 rounded mr-2">
              View More
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 text-lg p-4 text-secondary">
        {QuizQuestions && QuizQuestions.map && QuizQuestions.map((question, index) => (
          <div key={index}>
            <div className="flex gap-2">
              <h3 className=" text-blue-600 font-bold ">{index + 1} : {question.QuestionText}</h3>
              <p className="font-semibold">
                ({question.Mark} Mark)
              </p>
            </div>
            <div className=" "><span className="p-2 font-semibold">Options:</span>
              <div className="p-2">A: {question.options[0].OptionText}</div>
              <div className="p-2">B: {question.options[1].OptionText}</div>
              <div className="p-2">C: {question.options[2].OptionText}</div>
              <div className="p-2">D: {question.options[3].OptionText}</div>
            </div>
            <p className="mt-2 font-semibold">Correct Option : {question.Correct_Option}</p>
            <br />
            <hr />
            <br />
          </div>
        ))}
      </div>

      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this quiz?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button 
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded"
                onClick={handleDeleteQuiz}
              >
                Confirm
              </button>
              <button 
                className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewQuiz;

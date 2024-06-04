import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const StartQuiz = () => {
  const { id } = useParams();
  const QuizID = window.atob(id);
  const navigate = useNavigate();

  const [QuestionList, setQuestionList] = useState([]);
  const [ExamDetails, setExamDetails] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showEndFeedbackQuiz, setShowEndFeedbackQuiz] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ExamFeedback, setExamFeedback] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);


  const submitRef = useRef(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data: { examDetails, questions } } = await axios.get(`http://localhost:3000/api/student/examQuestions/${QuizID}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        
        setExamDetails(examDetails);
        setQuestionList(questions);
        // console.log(questions);
        // console.log(examDetails);
        calculateRemainingTime(examDetails.endTime);
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };
    // console.log(ExamDetails," ExamDetails");
    fetchQuiz();
  }, [QuizID]);
  useEffect(() => {
    if (remainingTime > 0) {
      const timerId = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerId);
            if (!submitted && !submitRef.current) {
              submitRef.current = true;
              handleSubmit();
              toast.warning("Time's up!");
            }else{
              setShowEndFeedbackQuiz(true);
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [remainingTime, submitted]);

  const calculateRemainingTime = (endTime) => {
    const [endHours, endMinutes, endSeconds] = endTime.split(':').map(Number);
    const endDateTime = new Date();
    endDateTime.setHours(endHours, endMinutes, endSeconds, 0);

    const currentDateTime = new Date();
    const timeDiff = Math.max(0, Math.floor((endDateTime - currentDateTime) / 1000));
    setRemainingTime(timeDiff);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionChange = (e, questionId, option) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [questionId]: option,
    }));
  };

  const handleSubmit = () => {
    if (!submitted) {
      submitQuiz({ answers: convertSelectedOptions(selectedOptions) });
      toast.success("Quiz Submitted Successfully");
      setSubmitted(true);
    }
  };

  const handleConfirmSubmit = (event) => {
    event.preventDefault();
    console.log(ExamFeedback);
    setShowEndFeedbackQuiz(false);
    navigate("/");  
  };

  const convertSelectedOptions = (selectedOptions) => {
    return Object.entries(selectedOptions).map(([questionId, option]) => ({
      questionId,
      selectedOption: option
    }));
  };

  const submitQuiz = async (data) => {
    try {
      const { status, data: responseData } = await axios.post(`http://localhost:3000/api/student/quizzes/${QuizID}/submit`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (status === 200) {
        console.log("Quiz submitted successfully:", responseData);
      } else {
        console.warn("Error submitting quiz");
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  return (
    <div className="p-2 flex-wrap">
      {showEndFeedbackQuiz && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">Quiz Feedback</h2>
            <input
              type="text"
              value={ExamFeedback}
              onChange={(e) => setExamFeedback(e.target.value)}
              placeholder='Feedback'
              className='p-4 outline-none border-slate-400 rounded-lg w-full border'
            />
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="bg-primary text-white font-semibold py-2 px-4 rounded"
                onClick={handleConfirmSubmit}
              >
                Send
              </button>
              <button
                className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col flex-auto gap-8">
        <div className="sm:p-6 p-2 flex flex-col rounded-lg gap-4 shadow-2xl w-full justify-between">
          <div className="flex sm:flex-row flex-col gap-8 w-full justify-between">
            <h2 className="sm:w-1/3 w-full text-lg font-bold">Remaining Time:
              <span className='text-lg font-light'>{formatTime(remainingTime)}</span>
            </h2>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {QuestionList && QuestionList.map((question, qIndex) => (
            <div key={qIndex} className="gap-4 p-4">
              <h3 className="text-lg font-semibold">Question: {qIndex + 1}</h3>
              <div className="flex flex-wrap w-10/12 gap-4">
                <h3 className="text-lg text-blue-600 font-bold">{question.questionText}</h3>
                <p className="font-bold text-lg">({question.questionMark} Mark{question.questionMark > 1 ? 's' : ''})</p>
              </div>
              <div className="flex-wrap grid grid-cols-1 sm:grid-cols-2 gap-2 w-2/3">
                {['OptionA', 'OptionB', 'OptionC', 'OptionD'].map((option, index) => (
                  <div key={index} className="ml-4 w-full">
                    <label className="flex flex-row items-center justify-left w-full">
                      {String.fromCharCode(65 + index)}
                      <article className="text-wrap w-1/2">
                        <input
                          type="radio"
                          name={`question${question.questionId}`}
                          id={`option-${question.questionId}${option}`}
                          className="mr-2"
                          value={String.fromCharCode(65 + index) || ''}
                          onChange={(e) => handleOptionChange(e, question.questionId, index+1)}
                          checked={selectedOptions[question.questionId] === index+1}
                        />
                        {/* checked={selectedOptions[question.questionId] === optionIndex}
                        onChange={() => handleOptionChange(question.questionId, optionIndex)} */}
                        
                        <label htmlFor={`option-${question.questionId}${option}`}>{question.options[0][option]}</label>
                      </article>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            id='submitQuiz'
            className="min-w-32 w-1/4 self-center m-4 bg-primary text-light font-medium text-lg px-2 py-2 rounded-md shadow-xl"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartQuiz;

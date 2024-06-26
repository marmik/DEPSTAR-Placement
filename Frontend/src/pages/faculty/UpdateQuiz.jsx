import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import UpdateQuetions from './UpdateQuetions';
import { toast } from 'react-toastify';

const UpdateQuiz = () => {
  const navigate = useNavigate();
  const [QuestionList, setQuestionList] = useState([]);
  const { id } = useParams();
  const QuizID = window.atob(id);

  const [FormData, setFormData] = useState({
    ExamID: '',
    Title: '',
    Description: '',
    Subject: '',
    Number_of_Questions: '',
    Exam_Total_Marks: '',
    Status: '',
    ExamDate: '',
    StartTime: '',
    EndTime: '',
    Feedback: '',
    CreatorID: '',
    created_at: '',
    updated_at: '',
    sem: '',
    className: '',
    batch: ''
  });

  const [questionsNo, setquestionNo] = useState();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/faculty/quizDetails/${QuizID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setFormData(response.data.exam);
          // console.log(response.data.exam,"i am response.data.exam")
          setquestionNo(response.data.exam.Number_of_Questions);
          // console.log(response.data.exam.Number_of_Questions);
          setQuestionList(response.data.questions);
          // console.log(response.data.questions," this is a list of quetions");
        } else {
          toast.warn("Internal Server Error !");
        }
      } catch (error) {
        toast.error("Something Went Wrong ! Please try again Later ");
      }
    };

    fetchData();
  }, [QuizID]);

  const updateQuestion = (index, newQuestion) => {
    setQuestionList(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = newQuestion;
      return updatedQuestions;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'Number_of_Questions') {
      const newQuestionsNo = parseInt(value);
      const currentQuestionCount = QuestionList.length;
      const diff = newQuestionsNo - currentQuestionCount;
      if (diff > 0) {
        setquestionNo(newQuestionsNo);
        // Add new question inputs
        const newQuestions = Array.from({ length: diff }, () => ({
          "QuestionID": null,
          "ExamID": null,
          "QuestionText": "",
          "Mark": 1,
          "QuestionType": "Multiple Choice",
          "Correct_Option": "A",
          "created_at": null,
          "updated_at": null,
          "options": [
            {
              "OptionID": null,
              "QuestionID": null,
              "OptionA": "",
              "OptionB": "",
              "OptionC": "",
              "OptionD": "",
              "created_at": null,
              "updated_at": null
            }
          ]
        }));
        setQuestionList((prevList) => [...prevList, ...newQuestions]);
      }
      // else if (diff < 0) {
      //   // Remove excess question inputs
      //   setQuestionList((prevList) => prevList.slice(0, newQuestionsNo));
      // }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  const convertKeysToLowercase = (obj) => {
    // Create new object with lowercase keys
    const newObj = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = key.toLowerCase();
        newObj[newKey] = obj[key];
      }
    }
    return newObj;
  };

  const handleUpdate = async () => {
    // console.log(QuestionList)," i am hear";
    const lowerCaseFormData = convertKeysToLowercase(FormData);
    // console.log("lower  ",lowerCaseFormData);
    // console.log("upper  ",FormData);

    const {title,description,subject,number_of_questions,exam_total_marks,sem,status,examdate,starttime,endtime,creatorid,classname,batch} = lowerCaseFormData;
    // 
    // console.log( title," - ",description," - ",subject," - ",number_of_questions," - ",exam_total_marks," - ",sem," - ",status," - ",examdate," - ", starttime," - ", endtime," - ",creatorid," - ",classname," - ",batch);
    if ( !title || !description || !subject || !status || !exam_total_marks || !examdate || !starttime || !endtime || !creatorid || !number_of_questions || !sem || !classname || !batch) { 
      toast.error('Please fill all the fields to create Quiz.');
        return; }

        if(Number(exam_total_marks)<=0 ){
          toast.error('Marks Must be Greater than 0');
          return;
        }
        if(Number(number_of_questions)<=0 ){
          toast.error('Question Must be Greater than 0');
          return;
        }
    const UpdateData = {
      ...lowerCaseFormData,
      QuestionList
    };
    // console.log(UpdateData);
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    try {
      const response = await axios.put(`http://localhost:3000/api/faculty/updateQuiz/${QuizID}`, UpdateData, {
        headers: {
          Authorization: `Bearer ${token}` // Add the token to the Authorization header
        }
      });

      toast.success(response.data.message);
      navigate("/faculty")
    } catch (error) {

      toast.error("Error to Update Quiz !");
    }
  };


  const formateDate = (examdate) => {
    const isoString = examdate;
    const date = new Date(isoString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }

  // useEffect(() => {
  //   setQuestionList([...Array(questionsNo | 0)].map((_, i) => ({
  //     index: i,
  //     updateQuestion: updateQuestion 
  //   })));
  // }, [questionsNo]); 
  return (
    <>
      <div className=" p-4 text-secondary flex flex-col">
        <div className="flex sm:flex-row flex-col gap-2">
          <div className="sm:w-1/5 flex-row">
            <label className="flex flex-col">Select Subject
              <select name="Subject" autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={FormData.Subject} onChange={handleInputChange} required>
                <option disabled selected value="">Select Subject</option>
                <option value="Daa">Daa</option>
                <option value="Se">Se</option>
                <option value="Dbms">Dbms</option>
              </select>
            </label>
          </div>

          <div className="sm:w-2/5">
            <label className="flex flex-col">Quiz Title
              <input type="text" name="Title" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={FormData.Title} onChange={handleInputChange} required />
            </label>
          </div>

          <div className="w-full sm:w-3/5">
            <label className="flex flex-col">Quiz Description
              <input type="text" name="Description" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={FormData.Description} onChange={handleInputChange} required />
            </label>
          </div>

          <div className="sm:w-1/5">
            <label className="flex flex-col">Total Marks
              <input type="number" min={1} name="Exam_Total_Marks" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={FormData.Exam_Total_Marks} onChange={handleInputChange} required />
            </label>
          </div>
        </div>

        <div className="flex w-full sm:flex-row gap-2 my-3 flex-col">
          <div className="sm:w-1/5">
            <label className="flex flex-col">Total Questions
              <input type="number" min={1} name="Number_of_Questions" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={FormData.Number_of_Questions} onChange={handleInputChange} required />
            </label>
          </div>

          <div className="sm:w-1/5">
            <label className="flex flex-col">Status
              <select name="Status" autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={FormData.Status} onChange={handleInputChange}>
                <option disabled selected value="">Select Status</option>
                <option value="Not Started">Not Started</option>
                <option value="Started">Started</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
          </div>

          <div className="sm:w-1/5 flex-row">
            <label className="flex flex-col">Sem
              <select name="sem" required autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={FormData.sem} onChange={handleInputChange}>
                <option disabled selected value="">Select Semester</option>
                <option value="SEM 1">SEM 1</option>
                <option value="SEM 2">SEM 2</option>
                <option value="SEM 3">SEM 3</option>
                <option value="SEM 4">SEM 4</option>
                <option value="SEM 5">SEM 5</option>
                <option value="SEM 6">SEM 6</option>
                <option value="SEM 7">SEM 7</option>
                <option value="SEM 8">SEM 8</option>
              </select>
            </label>
          </div>

          <div className="sm:w-1/5 flex-row">
            <label className="flex flex-col">Class
              <select name="className" required autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={FormData.className} onChange={handleInputChange}>
                <option disabled selected value="">Select Class</option>
                <option value="1CE">1CE</option>
                <option value="2CE">2CE</option>
                <option value="3CE">3CE</option>
                <option value="4CE">4CE</option>
                <option value="5CE">5CE</option>
                <option value="6CE">6CE</option>
                <option value="7CE">7CE</option>
                <option value="8CE">8CE</option>
                <option value="1CSE">1CSE</option>
                <option value="2CSE">2CSE</option>
                <option value="3CSE">3CSE</option>
                <option value="4CSE">4CSE</option>
                <option value="5CSE">5CSE</option>
                <option value="6CSE">6CSE</option>
                <option value="7CSE">7CSE</option>
                <option value="8CSE">8CSE</option>
                <option value="1IT">1IT</option>
                <option value="2IT">2IT</option>
                <option value="3IT">3IT</option>
                <option value="4IT">4IT</option>
                <option value="5IT">5IT</option>
                <option value="6IT">6IT</option>
                <option value="7IT">7IT</option>
                <option value="8IT">8IT</option>
              </select>
            </label>
          </div>

          <div className="sm:w-1/5 flex-row">
            <label className="flex flex-col">Batch
              <select name="batch" required autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={FormData.batch} onChange={handleInputChange}>
                <option disabled selected value="">Select Batch</option>
                <option value="All">All</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </label>
          </div>
        </div>

        <div className="flex gap-2 sm:flex-row my-3 flex-col ">
          <div className="sm:w-1/4">
            <label className="flex flex-col">Date
              <input type="date" required name="ExamDate" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={formateDate(FormData.ExamDate)} onChange={handleInputChange} />
            </label>
          </div>

          <div className="sm:w-1/4">
            <label className="flex flex-col">Start Time
              <input type="time" required name="StartTime" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={FormData.StartTime} onChange={handleInputChange} />
            </label>
          </div>

          <div className="sm:w-1/4">
            <label className="flex flex-col">End Time
              <input type="time" required name="EndTime" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={FormData.EndTime} onChange={handleInputChange} />
            </label>
          </div>

          <div className=" sm:w-1/4 items-center justify-center">
            <button className={`mt-8 w-full p-4 self-center bg-primary  text-white rounded-md`} type="button" onClick={handleUpdate}>Update</button>
          </div>
        </div>

        <br />
        <hr />
        <div className="flex flex-col m-2">
          <div>
            {QuestionList.map((question, index) => (
              <UpdateQuetions
                key={index}
                i={index}
                updateQuestion={updateQuestion}
                initialQuestion={question}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateQuiz;

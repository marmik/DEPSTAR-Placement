import React, { useState, useEffect } from 'react';
import Questions from '../../components/Questions';
import axios from 'axios';
import { IoIosWarning } from "react-icons/io";
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddQuiz = () => {
  const navigate = useNavigate();
  const [QuestionsNo, setQuestionsNo] = useState(0);
  const [QuestionList, setQuestionList] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    description: '',
    totalMarks: '',
    totalQuestions: '',
    status: '',
    sem: '',
    className: '',
    batch: '',
    date: '',
    startTime: '',
    endTime: ''
  });


  useEffect(() => {
    setQuestionList(
      Array.from({ length: QuestionsNo }, () => ({
        qString: '',
        type: 'Multiple Choice',
        OptionA: '',
        OptionB: '',
        OptionC: '',
        OptionD: '',
        marks: '1',
        correctOption: ''
      }))
    );
  }, [QuestionsNo]);

  const updateQuestion = (index, newQobj) => {
    setQuestionList((prevList) =>
      prevList.map((q, i) => (i === index ? newQobj : q))
    );
  };

  const handleInputChange = (e) => {

    const { name, value } = e.target;
    if (name == 'totalQuestions') {
      setQuestionsNo(parseInt(e.target.value));
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };


  const handleSave = async () => {

    const {
      subject,
      title,
      description,
      totalMarks,
      totalQuestions,
      status,
      sem,
      className,
      batch,
      date,
      startTime,
      endTime
    } = formData;

    if (
      !subject ||
      !title ||
      !description ||
      !totalMarks ||
      !totalQuestions ||
      !status ||
      !sem ||
      !className ||
      !batch ||
      !date ||
      !startTime ||
      !endTime
    ) {
      toast.error('Please fill all the fields to create Quiz.');
      return;
    }


    const quizData = {
      ...formData,
      QuestionList
    };
    // console.log(quizData);


    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    try {
      const response = await axios.post('http://localhost:3000/api/faculty/createNewQuiz', quizData, { 
        headers: {
          Authorization: `Bearer ${token}` // Add the token to the Authorization header
        }
      });

      toast.success(response.data.message);
      navigate("/faculty");

    } catch (error) {

      toast.error("Error to Create Quiz");
      navigate("/faculty");
    }
  };

  const [Questionlist, setQuestionlist] = useState([]);
  useEffect(() => {
    setQuestionlist([...Array(QuestionsNo | 0)].map((e, i) => (
      <Questions key={i} i={i} updateQuestion={updateQuestion} />
    )));
  }, [QuestionsNo | 0]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex sm:flex-row flex-col gap-2">
          <div className="sm:w-1/5 flex-row">
            <label className="flex flex-col">Select Subject
              <select name="subject" autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange} required>
                <option disabled selected value>Select Subject</option>
                <option value="Daa">Daa</option>
                <option value="Se">Se</option>
                <option value="Dbms">Dbms</option>
              </select>
            </label>
          </div>

          <div className="sm:w-2/5">
            <label className="flex flex-col">Quiz Title
              <input type="text" name="title" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" required onChange={handleInputChange} />
            </label>
          </div>

          <div className="w-full sm:w-3/5">
            <label className="flex flex-col">Quiz Description
              <input type="text" name="description" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" required onChange={handleInputChange} />
            </label>
          </div>

          <div className="sm:w-1/5">
            <label className="flex flex-col">Total Marks
              <input type="number" name="totalMarks" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" required onChange={handleInputChange} />
            </label>
          </div>
        </div>

        <div className="flex w-full sm:flex-row gap-2 my-3 flex-col">
          <div className="sm:w-1/5">
            <label className="flex flex-col">Total Questions
              <input type="number" name="totalQuestions" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" required onChange={handleInputChange} />
            </label>
          </div>

          <div className="sm:w-1/5">
            <label className="flex flex-col">Status
              <select name="status" autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange}>
                <option disabled selected value>Select Status</option>
                <option value="Not Started">Not Started</option>
                <option value="Started">Started</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
          </div>

          <div className="sm:w-1/5 flex-row">
            <label className="flex flex-col">Sem
              <select name="sem" required autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange}>
                <option disabled selected value>Select Semester</option>
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
              <select name="className" required autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange}>
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
              <select name="batch" required autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange}>
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
              <input type="date" required name="date" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange} />
            </label>
          </div>

          <div className="sm:w-1/4">
            <label className="flex flex-col">Start Time
              <input type="time" required name="startTime" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange} />
            </label>
          </div>

          <div className="sm:w-1/4">
            <label className="flex flex-col">End Time
              <input type="time" required name="endTime" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange} />
            </label>
          </div>

          <div className=" sm:w-1/4 items-center justify-center">
            <button className={`mt-8 w-full p-4 self-center bg-primary  text-white rounded-md`} type="button" onClick={handleSave}>Create</button>
          </div>
        </div>

        <br />
        <hr />
        <div className="flex flex-col m-2">
          {Questionlist}
        </div>
      </div>
    </>
  );
};

export default AddQuiz;

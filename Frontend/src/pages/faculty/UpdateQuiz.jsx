import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import UpdateQuetions from './UpdateQuetions';
import { toast } from 'react-toastify';

const UpdateQuiz = () => {
  const [questionList,setquestionList]=useState([]);

  // const updateQuestion = (index, newQobj) => {
  //   setquestionList((prevList) =>
  //     prevList.map((q, i) => (i === index ? newQobj : q))
  //   );
  // };

  const { id } = useParams();
  const QuizID = window.atob(id);
  
  const [FormData, setFormData] = useState({
    ExamID:'',
    Title:'',
    Description:'',
    Subject:'',
    Number_of_Questions:'',
    Exam_Total_Marks:'',
    Status:'',
    ExamDate:'',
    StartTime:'',
    EndTime:'',
    Feedback:'',
    CreatorID:'',
    created_at:'',
    updated_at:'',
    sem:'',
    className:'',
    batch:''
    });

  const [questionsNo , setquestionNo ] = useState();
 

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
          setquestionNo(response.data.exam.Number_of_Questions);
          // console.log(response.data.questions);
          setquestionList(response.data.questions);
        } else {
          console.warn("Internal Server Error !");
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [QuizID]);

//   useEffect(() => {
//     setquestionList(
//       Array.from({ length: questionsNo }, () => (
//     {
//       "QuestionID": 5,
//       "ExamID": 4,
//       "QuestionText": "Final Question 1",
//       "Mark": 1,
//       "QuestionType": "Multiple Choice",
//       "Correct_Option": "B",
//       "created_at": "2024-05-30T10:49:18.000Z",
//       "updated_at": "2024-05-30T10:49:18.000Z",
//       "options": [
//           {
//               "OptionID": 17,
//               "QuestionID": 5,
//               "OptionText": "Final 1",
//               "created_at": "2024-05-30T10:49:19.000Z",
//               "updated_at": "2024-05-30T10:49:19.000Z"
//           },
//           {
//               "OptionID": 18,
//               "QuestionID": 5,
//               "OptionText": "Final 2",
//               "created_at": "2024-05-30T10:49:19.000Z",
//               "updated_at": "2024-05-30T10:49:19.000Z"
//           },
//           {
//               "OptionID": 19,
//               "QuestionID": 5,
//               "OptionText": "Final 3",
//               "created_at": "2024-05-30T10:49:19.000Z",
//               "updated_at": "2024-05-30T10:49:19.000Z"
//           },
//           {
//               "OptionID": 20,
//               "QuestionID": 5,
//               "OptionText": "Final 4",
//               "created_at": "2024-05-30T10:49:19.000Z",
//               "updated_at": "2024-05-30T10:49:19.000Z"
//           }
//       ]
//   }
// ))
//     );
//   }, [questionsNo]);

const updateQuestion = (index, newQuestion) => {
  setquestionList(prevQuestions => {
    const updatedQuestions = [...prevQuestions];
    updatedQuestions[index] = newQuestion;
    return updatedQuestions;
  });
};
const handleInputChange = (e) => {
  const { name, value } = e.target;
  if (name === 'Number_of_Questions') {
    const newQuestionsNo = parseInt(value);
    setquestionNo(newQuestionsNo);
    const currentQuestionCount = questionList.length;
    const diff = newQuestionsNo - currentQuestionCount;

    if (diff > 0) {
      // Add new question inputs
      const newQuestions = Array.from({ length: diff }, (_, i) => ({
              "QuestionID": 5,
              "ExamID": 4,
              "QuestionText": "",
              "Mark": 1,
              "QuestionType": "Multiple Choice",
              "Correct_Option": "A",
              "created_at": "2024-05-30T10:49:18.000Z",
              "updated_at": "2024-05-30T10:49:18.000Z",
              "options": [
                  {
                      "OptionID": 17,
                      "QuestionID": 5,
                      "OptionText": "",
                      "created_at": "2024-05-30T10:49:19.000Z",
                      "updated_at": "2024-05-30T10:49:19.000Z"
                  },
                  {
                      "OptionID": 18,
                      "QuestionID": 5,
                      "OptionText": "",
                      "created_at": "2024-05-30T10:49:19.000Z",
                      "updated_at": "2024-05-30T10:49:19.000Z"
                  },
                  {
                      "OptionID": 19,
                      "QuestionID": 5,
                      "OptionText": "",
                      "created_at": "2024-05-30T10:49:19.000Z",
                      "updated_at": "2024-05-30T10:49:19.000Z"
                  },
                  {
                      "OptionID": 20,
                      "QuestionID": 5,
                      "OptionText": "",
                      "created_at": "2024-05-30T10:49:19.000Z",
                      "updated_at": "2024-05-30T10:49:19.000Z"
                  }
              ]
          }));
      setquestionList((prevList) => [...prevList, ...newQuestions]);
    } else if (diff < 0) {
      // Remove excess question inputs
      setquestionList((prevList) => prevList.slice(0, newQuestionsNo));
    }
    
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
  const lowerCaseFormData = convertKeysToLowercase(FormData);
  // console.log("lower  ",lowerCaseFormData);
  // console.log("upper  ",FormData);

    const {
      title,
      description,
      subject,
      number_of_questions,
      sem,
      classname,
      batch
    } = lowerCaseFormData;
    // 
    console.log(title," - ",description," - ",subject," - ",number_of_questions," - ",sem," - ",classname," - ",batch);
    if (
    !title ||
    !description ||
    !subject ||
    !number_of_questions ||
    !sem ||
    !classname ||
    !batch
    ) {
      toast.error('Please fill all the fields to create Quiz.');
      return;
    }
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
      try {
        const response = await axios.put(`http://localhost:3000/api/faculty/updateQuiz/${QuizID}`, lowerCaseFormData, { 
          headers: {
            Authorization: `Bearer ${token}` // Add the token to the Authorization header
          }
        });
  
        toast.success(response.data.message);
      } catch (error) {
  
        toast.error("Error to Create Quiz");
      }
  };


  const formateDate =(examdate)=>{
    const isoString = examdate;
    const date = new Date(isoString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
      
    const formattedDate = `${year}-${month}-${day}`; 
    return formattedDate
  }

  // useEffect(() => {
  //   setquestionList([...Array(questionsNo | 0)].map((_, i) => ({
  //     index: i,
  //     updateQuestion: updateQuestion 
  //   })));
  // }, [questionsNo]); 
  return (
    <>
     <div className="flex flex-col">
      <div className="flex sm:flex-row flex-col gap-2">
        <div className="sm:w-1/5 flex-row">
          <label className="flex flex-col">Select Subject
            <select name="Subject" autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={FormData.Subject} onChange={handleInputChange} required>
              <option disabled value="">Select Subject</option>
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
            <input type="number" name="Exam_Total_Marks" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={FormData.Exam_Total_Marks} onChange={handleInputChange} required />
          </label>
        </div>
      </div>

      <div className="flex w-full sm:flex-row gap-2 my-3 flex-col">
        <div className="sm:w-1/5">
          <label className="flex flex-col">Total Questions
            <input type="number" name="Number_of_Questions" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={FormData.Number_of_Questions} onChange={handleInputChange} required />
          </label>
        </div>

        <div className="sm:w-1/5">
          <label className="flex flex-col">Status
            <select name="Status" autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={FormData.Status} onChange={handleInputChange}>
              <option disabled value="">Select Status</option>
              <option value="Not Started">Not Started</option>
              <option value="Started">Started</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
        </div>

        <div className="sm:w-1/5 flex-row">
          <label className="flex flex-col">Sem
            <select name="sem" required autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={FormData.sem} onChange={handleInputChange}>
              <option disabled value="">Select Semester</option>
              <option value="all">All</option>
              <option value="sem1">SEM 1</option>
              <option value="sem2">SEM 2</option>
              <option value="sem3">SEM 3</option>
              <option value="sem4">SEM 4</option>
              <option value="sem5">SEM 5</option>
              <option value="sem6">SEM 6</option>
              <option value="sem7">SEM 7</option>
              <option value="sem8">SEM 8</option>
            </select>
          </label>
        </div>

        <div className="sm:w-1/5 flex-row">
          <label className="flex flex-col">Class
            <select name="className" required autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={FormData.className} onChange={handleInputChange}>
              <option disabled value="">Select Class</option>
              <option value="4CE1">4CE1</option>
              <option value="4CE2">4CE2</option>
              <option value="All">All</option>
            </select>
          </label>
        </div>

        <div className="sm:w-1/5 flex-row">
          <label className="flex flex-col">Batch
            <select name="batch" required autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" value={FormData.batch} onChange={handleInputChange}>
              <option disabled value="">Select Batch</option>
              <option value="All">All</option>
              <option value="batchA">A</option>
              <option value="batchB">B</option>
              <option value="batchC">C</option>
              <option value="batchD">D</option>
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
      {questionList.map((question, index) => (
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

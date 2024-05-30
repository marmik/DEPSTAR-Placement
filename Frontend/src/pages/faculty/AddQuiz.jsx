// import React, { useState,useEffect } from 'react'
// import Questions from '../../components/Questions';

// const AddQuiz = () => {
//   const [QuestionsNo,setQuestionsNo]=useState(0);
//   const [QuestionList, setQuestionList] = useState([]);

//   useEffect(() => {
//     setQuestionList(
//       Array.from({ length: QuestionsNo  }, () => ({
//         "qString": '',
//         "type": "Multiple Choice",
//         "OptionA": '',
//         "OptionB": '',
//         "OptionC": '',
//         "OptionD": '',
//         "marks": '1',
//         "correctOption": 'A'
//       }))
//     );
//   }, [QuestionsNo ]);

//   const updateQuestion = (index, newQobj) => {
//     setQuestionList((prevList) =>
//       prevList.map((q, i) => (i === index ? newQobj : q))
//     );
//   };
  
//   const getQuestionJson = () => {
//     console.log(QuestionList);
//   };

//   function handlechanges(e){
//     setQuestionsNo(parseInt(e.target.value));
//   }
//   const [QetionList,setQetionList]=useState();
//     useEffect(() => {
//       setQetionList([...Array(QuestionsNo|0)].map((e, i) => (
//         <Questions key={i} i={i} updateQuestion={updateQuestion} />
//       )));
//     }, [QuestionsNo|0]);
    
//   return (
//     <>
//     <div className="flex flex-col">
//         <div className="flex sm:flex-row flex-col gap-2">
//             <div className=" sm:w-1/5 flex-row ">
//             <label className="flex flex-col ">Select Subject
//             <select name="" autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none">
//               <option>Daa</option>
//               <option>Se</option>
//               <option>Dbms</option>
//               {/* <option></option> */}
//             </select>
//             </label>
//             </div>

//             <div className="sm:w-2/5">
//             <label className="flex flex-col ">Quiz Title
//               <input type="text" name="" id="" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" />
//             </label>
//             </div>
//             <div className="w-full sm:w-3/5">
//             <label className="flex flex-col ">Quiz Description
//               <input type="text" name="" id="" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" />
//             </label>
//             </div>
//             <div className=" sm:w-1/5">
//             <label className="flex flex-col ">Total Marks
//               <input type="number" name="" id="" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" />
//             </label>
//             </div>
//         </div>
//         <div className="flex w-full sm:flex-row  gap-2 flex-col">
//             <div className=" sm:w-1/5">
//             <label className="flex flex-col ">Total Questions
//               <input type="number" name="" id="" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" onChange={handlechanges}/>
//             </label>
//             </div>
//             <div className=" sm:w-1/5">
//             <label className="flex flex-col ">Status
//             <select name="" autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none">
//             <option>Not Started</option>
//               <option>Started</option>
//               <option>Completed</option>``````
//             </select>
//             </label>
//             </div>
//             <div className=" sm:w-1/5 flex-row ">
//             <label className="flex flex-col ">Sem
//             <select name="" autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none">
//               <option>SEM 4</option>
//               {/* <option></option> */}
//             </select>
//             </label>
//             </div>
//             <div className=" sm:w-1/5 flex-row ">
//             <label className="flex flex-col ">Class
//             <select name="" autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none">
//               <option>4CE1</option>
//               <option>4CE2</option>
//               <option>All</option>
//             </select>
//             </label>
//             </div>
//             <div className=" sm:w-1/5 flex-row ">
//             <label className="flex flex-col ">Batch
//             <select name="" autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none">
//               <option>All </option>
//               <option>A</option>
//               <option>B</option>
//               <option>C</option>
//               <option>D</option>
//               {/* <option></option> */}
//             </select>
//             </label>
//             </div>
//         </div>
//         <div className="flex  gap-2 sm:flex-row flex-col border-b-2 border-gray-600 pb-10">
//             <div className=" sm:w-2/5">
//             <label className="flex flex-col ">Date
//               <input type="date" name="" id="" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" />
//             </label>
//             </div>
//             <div className=" sm:w-1/4">
//             <label className="flex flex-col ">Start Time
//               <input type="time" name="" id="" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" />
//             </label>
//             </div>
//             <div className=" sm:w-1/4">
//             <label className="flex flex-col ">End Time
//               <input type="time" name="" id="" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" />
//             </label>
//             </div>
//             <div className="w-full sm:w-1/4  items-center justify-center">
//             <button className="mt-8 w-full p-4 self-center bg-primary text-white rounded-md shadow hover:shadow-lg" type="button" >Create</button>
//             </div>
//             <div className="w-full sm:w-1/4  items-center justify-center">
//             <button className="mt-8 w-full p-4 self-center bg-green-600 text-white rounded-md shadow hover:shadow-lg" type="button" onClick={getQuestionJson}>Save</button>
//             </div>
//         </div>

//       <div className="flex flex-col m-2">
//         {QetionList}
//       </div>
//     </div>
//     </>
//   )
// }


// export default AddQuiz


import React, { useState, useEffect } from 'react';
import Questions from '../../components/Questions';
import axios from 'axios';

const AddQuiz = () => {
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
    class: '',
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
        correctOption: 'A'
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
    if(name == 'totalQuestions'){
      setQuestionsNo(parseInt(e.target.value));
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // const handleChanges = (e) => {
    
  //   handleInputChange
  // };

  const handleSave = async () => {
    const quizData = {
      ...formData,
      QuestionList
    };
    console.log(quizData);

    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    try {
      const response = await axios.post('http://localhost:3000/api/faculty/createNewQuiz', quizData, { 
        headers: {
          Authorization: `Bearer ${token}` // Add the token to the Authorization header
        }
      });
      console.log('Quiz created successfully:', response.data);
      // Handle success (e.g., show a success message, navigate to another page, etc.)
    } catch (error) {
      console.error('Error creating quiz:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const [QetionList, setQetionList] = useState([]);
  useEffect(() => {
    setQetionList([...Array(QuestionsNo | 0)].map((e, i) => (
      <Questions key={i} i={i} updateQuestion={updateQuestion} />
    )));
  }, [QuestionsNo | 0]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex sm:flex-row flex-col gap-2">
          <div className="sm:w-1/5 flex-row">
            <label className="flex flex-col">Select Subject
              <select name="subject" autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange}>
                <option value="Daa">Daa</option>
                <option value="Se">Se</option>
                <option value="Dbms">Dbms</option>
              </select>
            </label>
          </div>

          <div className="sm:w-2/5">
            <label className="flex flex-col">Quiz Title
              <input type="text" name="title" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange} />
            </label>
          </div>

          <div className="w-full sm:w-3/5">
            <label className="flex flex-col">Quiz Description
              <input type="text" name="description" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange} />
            </label>
          </div>

          <div className="sm:w-1/5">
            <label className="flex flex-col">Total Marks
              <input type="number" name="totalMarks" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange} />
            </label>
          </div>
        </div>

        <div className="flex w-full sm:flex-row gap-2 flex-col">
          <div className="sm:w-1/5">
            <label className="flex flex-col">Total Questions
              <input type="number" name="totalQuestions" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange} />
            </label>
          </div>

          <div className="sm:w-1/5">
            <label className="flex flex-col">Status
              <select name="status" autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange}>
                <option value="Not Started">Not Started</option>
                <option value="Started">Started</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
          </div>

          <div className="sm:w-1/5 flex-row">
            <label className="flex flex-col">Sem
              <select name="sem" autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange}>
                <option value="SEM 4">SEM 4</option>
                <option value="SEM 5">SEM 5</option>
              </select>
            </label>
          </div>

          <div className="sm:w-1/5 flex-row">
            <label className="flex flex-col">Class
              <select name="class" autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange}>
                <option value="4CE1">4CE1</option>
                <option value="4CE2">4CE2</option>
                <option value="All">All</option>
              </select>
            </label>
          </div>

          <div className="sm:w-1/5 flex-row">
            <label className="flex flex-col">Batch
              <select name="batch" autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange}>
                <option value="All">All</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </label>
          </div>
        </div>

        <div className="flex gap-2 sm:flex-row flex-col border-b-2 border-gray-600 pb-10">
          <div className="sm:w-2/5">
            <label className="flex flex-col">Date
              <input type="date" name="date" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange} />
            </label>
          </div>

          <div className="sm:w-1/4">
            <label className="flex flex-col">Start Time
              <input type="time" name="startTime" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange} />
            </label>
          </div>

          <div className="sm:w-1/4">
            <label className="flex flex-col">End Time
              <input type="time" name="endTime" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none" onChange={handleInputChange} />
            </label>
          </div>

          <div className="w-full sm:w-1/4 items-center justify-center">
            <button className="mt-8 w-full p-4 self-center bg-primary text-white rounded-md shadow hover:shadow-lg" type="button" onClick={handleSave}>Save</button>
          </div>
        </div>

        <div className="flex flex-col m-2">
          {QetionList}
        </div>
      </div>
    </>
  );
};

export default AddQuiz;

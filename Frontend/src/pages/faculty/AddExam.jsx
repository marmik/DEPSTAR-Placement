import React, { useState,useEffect } from 'react'
import Questions from '../../components/Questions';

const AddExam = () => {
  const [QuestionsNo,setQuestionsNo]=useState(0);
  const [QuestionList, setQuestionList] = useState([]);

  useEffect(() => {
    setQuestionList(
      Array.from({ length: QuestionsNo  }, () => ({
        "qString": '',
        "OptionA": '',
        "OptionB": '',
        "OptionC": '',
        "OptionD": '',
        "marks": '4',
        "correctOption": 'A'
      }))
    );
  }, [QuestionsNo ]);

  const updateQuestion = (index, newQobj) => {
    setQuestionList((prevList) =>
      prevList.map((q, i) => (i === index ? newQobj : q))
    );
  };
  
  const getQuestionJson = () => {
    console.log(QuestionList);
  };

  function handlechanges(e){
    setQuestionsNo(parseInt(e.target.value));
  }
  const [QetionList,setQetionList]=useState();
    useEffect(() => {
      setQetionList([...Array(QuestionsNo|0)].map((e, i) => (
        <Questions key={i} i={i} updateQuestion={updateQuestion} />
      )));
    }, [QuestionsNo|0]);
    
  return (
    <>
    <div className="flex flex-col">
        <div className="flex sm:flex-row flex-col gap-2">
            <div className=" sm:w-1/5 flex-row ">
            <label className="flex flex-col ">Select Subject
            <select name="" autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none">
              <option>Daa</option>
              <option>Se</option>
              <option>Dbms</option>
              {/* <option></option> */}
            </select>
            </label>
            </div>

            <div className="sm:w-2/5">
            <label className="flex flex-col ">Quiz Title
              <input type="text" name="" id="" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" />
            </label>
            </div>
            <div className="w-full sm:w-3/5">
            <label className="flex flex-col ">Quiz Description
              <input type="text" name="" id="" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" />
            </label>
            </div>
        </div>
        <div className="flex w-full sm:flex-row  gap-2 flex-col">
            <div className=" sm:w-1/5">
            <label className="flex flex-col ">Total Marks
              <input type="number" name="" id="" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" />
            </label>
            </div>
            <div className=" sm:w-1/5">
            <label className="flex flex-col ">Total Questions
              <input type="number" name="" id="" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" onChange={handlechanges}/>
            </label>
            </div>
            <div className=" sm:w-1/5">
            <label className="flex flex-col ">Status
            <select name="" autoComplete="name" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none">
            <option>Not Started</option>
              <option>Started</option>
              <option>Completed</option>``````
            </select>
            </label>
            </div>
            <div className=" sm:w-2/5">
            <label className="flex flex-col ">Date
              <input type="date" name="" id="" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" />
            </label>
            </div>
        </div>
        <div className="flex  gap-2 sm:flex-row flex-col border-b-2 border-gray-600 pb-10">
            <div className=" sm:w-1/4">
            <label className="flex flex-col ">Start Time
              <input type="time" name="" id="" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" />
            </label>
            </div>
            <div className=" sm:w-1/4">
            <label className="flex flex-col ">End Time
              <input type="time" name="" id="" placeholder="" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" />
            </label>
            </div>
            <div className="w-full sm:w-1/4  items-center justify-center">
            <button className="mt-8 w-full p-4 self-center bg-primary text-white rounded-md shadow hover:shadow-lg" type="button" >Create</button>
            </div>
            <div className="w-full sm:w-1/4  items-center justify-center">
            <button className="mt-8 w-full p-4 self-center bg-green-600 text-white rounded-md shadow hover:shadow-lg" type="button" onClick={getQuestionJson}>Save</button>
            </div>
        </div>

      <div className="flex flex-col m-2">
        {QetionList}
      </div>
    </div>
    </>
  )
}


export default AddExam

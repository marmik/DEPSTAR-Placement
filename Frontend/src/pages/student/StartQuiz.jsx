import React from 'react';

const questions = [
  {
    id: 1,
    text: 'What is the primary key in DBMS?',
    options: ['A: Unique identifier', 'B: Foreign key', 'C: Composite key', 'D: None of the above'],
    marks: 1
  },
  {
    id: 2,
    text: 'What does SQL stand for?',
    options: ['A: Structured Query Language', 'B: Simple Query Language', 'C: Standard Query Language', 'D: None of the above'],
    marks: 1
  },
];

const StartQuiz = () => {
  return (
    <div className="p-2 flex-wrap">
      <div className="flex flex-col flex-auto gap-8">
        <div className="sm:p-6 p-2 flex flex-col rounded-lg gap-4 shadow-2xl w-full justify-between">
        <div className="flex sm:flex-row flex-col gap-8 w-full justify-between">
          <h2 className="sm:w-1/3 w-full text-lg font-bold">Subject :<span className=' text-lg font-light'>DBMS</span></h2>
          <h2 className="sm:w-1/3 w-full text-lg font-bold">Title : <span className=' text-lg font-light'>DBMS Practical</span></h2>
          <h2 className="sm:w-1/3 w-full text-lg font-bold">Time :<span className=' text-lg font-light'>12:00PM TO 12:30PM</span></h2>
        </div><div></div>
        <div className="flex sm:flex-row flex-col gap-8 w-full justify-between">
          <h2 className="sm:w-1/3 w-full text-lg font-bold">Remaining : <span className=' text-lg font-light'>24:13</span></h2>
          <h2 className="sm:w-1/3 w-full text-lg font-bold">Total Questions : <span className=' text-lg font-light'>30</span></h2>
          <h2 className="sm:w-1/3 w-full text-lg font-bold">Total Marks : <span className=' text-lg font-light'>30</span> </h2>
        </div>
        </div>
        <div className="flex flex-col gap-2">
          {questions.map((question, index) => (
            <div key={question.id} className="flex flex-wrap  flex-col gap-4 p-4">
              <h3 className="text-lg font-bold">Question: {index + 1}</h3>
              <div className="flex flex-wrap w-10/12 flex-row gap-4">
                <h3 className="text-lg text-blue-600 font-bold">{question.text}</h3>
                <p className="font-bold text-lg">({question.marks} Mark{question.marks > 1 ? 's' : ''})</p>
              </div>
              <div className=" flex-wrap grid grid-cols-1 sm:grid-cols-2 gap-2 w-2/3 ">
                {question.options.map((option, optionIndex) => (
                  <div className="flex" key={optionIndex}>
                    <div className="flex items-center mt-2">
                      <input
                        type="radio"
                        name={`question${question.id}`}
                        id={`option-${question.id}-${optionIndex}`}
                        className="mr-2"
                      />
                      <label htmlFor={`option-${question.id}-${optionIndex}`}>{option}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartQuiz;

import React, { useEffect, useState } from 'react';

const StartQuiz = () => {
  const [timeDifference, setTimeDifference] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const hardCodedTime = new Date('2024-05-30T16:00:00'); // Hard-coded time
    const initialDifferenceInSeconds = Math.floor(((new Date()) - hardCodedTime) / 1000);
    setTimeDifference(initialDifferenceInSeconds);
    const intervalId = setInterval(() => {
      const differenceInSeconds = Math.floor(((new Date()) - hardCodedTime) / 1000);
      setTimeDifference(differenceInSeconds);}, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (seconds) => {
    return `${-Math.floor(seconds / 3600)}:${-Math.floor((seconds % 3600) / 60)}:${-(seconds % 60)} `;
  };

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
    {
      id: 3,
      text: 'What is the primary key in DBMS?',
      options: ['A: Unique identifier', 'B: Foreign key', 'C: Composite key', 'D: None of the above'],
      marks: 1
    },
    {
      id: 4,
      text: 'What does SQL stand for?',
      options: ['A: Structured Query Language', 'B: Simple Query Language', 'C: Standard Query Language', 'D: None of the above'],
      marks: 1
    }
  ];

  const handleOptionChange = (questionId, optionIndex) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    const convertedOptions = convertSelectedOptions(selectedOptions);
    console.log("Converted options:", convertedOptions);
  };

  const convertSelectedOptions = (selectedOptions) => {
    const convertedOptions = {};
    for (const [questionId, optionIndex] of Object.entries(selectedOptions)) {
      const optionLetter = String.fromCharCode(65 + optionIndex);
      convertedOptions[questionId] = optionLetter;
    }
    return convertedOptions;
  };

  return (
    <div className="p-2 flex-wrap">
      <div className="flex flex-col flex-auto gap-8">
        <div className="sm:p-6 p-2 flex flex-col rounded-lg gap-4 shadow-2xl w-full justify-between">
        <div className="flex sm:flex-row flex-col gap-8 w-full justify-between">
          <h2 className="sm:w-1/3 w-full text-lg font-bold">Remaining Time: <span className=' text-lg font-light'>{timeDifference !== null && (<p>{formatTime(timeDifference+3600)}</p>)}
      </span></h2>
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
                          checked={selectedOptions[question.id] === optionIndex}
                          onChange={() => handleOptionChange(question.id, optionIndex)}
                        />
                        <label htmlFor={`option-${question.id}-${optionIndex}`}>{option}</label>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
          <button type="submit" className="min-w-32 w-1/4 self-centerm-4 bg-primary text-light font-medium text-lg px-2 py-2 rounded-md  shadow-xl"
          onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default StartQuiz;


import React, { useState ,useEffect } from 'react';

const Questions = ({i,updateQuestion}) => {
  
  const [Questionobj, setQuestionobj] = useState({
    "qString": '',
    "OptionA": '',
    "OptionB": '',
    "OptionC": '',
    "OptionD": '',
    "marks": '0',
    "correctOption": 'A'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionobj((prevQuestionobj) => {
      const newQuestionobj = { ...prevQuestionobj, [name]: value };
      updateQuestion(i, newQuestionobj);
      return newQuestionobj;
    });
  };

  useEffect(() => {
    updateQuestion(i, Questionobj);
  }, [i, Questionobj, updateQuestion]);

  return (
    <div className='pt-10 flex flex-col'>
        <div className="w-full">
        <label className="flex flex-col">
          <span className="mb-2">Question {i + 1}:</span>
          <input
            type="text"
            name="qString"
            placeholder={'Question ' + (i + 1)}
            value={Questionobj.qString}
            onChange={handleChange}
            className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none"
          />
        </label>
      </div>

      <div className="ml-4 flex sm:flex-row flex-col mt-0">
        <div className="flex w-full sm:flex-row flex-col">
          <div className="ml-4 w-full">
            <label className="flex flex-row items-center justify-left w-full">
              A
              <article className="text-wrap w-2/3">
                <input
                  type="text"
                  name="OptionA"
                  placeholder={"OptionA"}
                  value={Questionobj.OptionA}
                  onChange={handleChange}
                  className="p-4 ml-4 w-full m-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none"
                />
              </article>
            </label>
          </div>
          <div className="ml-4 w-full">
            <label className="flex flex-row items-center justify-left w-full">
              B
              <article className="text-wrap w-2/3">
                <input
                  type="text"
                  name="OptionB"
                  placeholder={"OptionB"}
                  value={Questionobj.OptionB}
                  onChange={handleChange}
                  className="p-4 ml-4 w-full m-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none"
                />
              </article>
            </label>
          </div>
        </div>
      </div>
      <div className="ml-4 flex sm:flex-row flex-col mt-0">
        <div className="flex w-full sm:flex-row flex-col">
          <div className="ml-4 w-full">
            <label className="flex flex-row items-center justify-left w-full">
              C
              <article className="text-wrap w-2/3">
                <input
                  type="text"
                  name="OptionC"
                  placeholder={"OptionC"}
                  value={Questionobj.OptionC}
                  onChange={handleChange}
                  className="p-4 ml-4 w-full m-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none"
                />
              </article>
            </label>
          </div>
          <div className="ml-4 w-full">
            <label className="flex flex-row items-center justify-left w-full">
              D
              <article className="text-wrap w-2/3">
                <input
                  type="text"
                  name="OptionD"
                  placeholder={"OptionD"}
                  value={Questionobj.OptionD}
                  onChange={handleChange}
                  className="p-4 ml-4 w-full m-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none"
                />
              </article>
            </label>
          </div>
        </div>
      </div>
      <div className="flex sm:flex-row flex-col">
        <div className="flex w-full sm:flex-row flex-col">
          <div className="w-full">
            <article className="pt-2 w-2/3 text-wrap">
              <select
                name="correctOption"
                className="p-4 w-full border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </article>
          </div>
          <div className="w-full">
            <label className="gap-2 flex flex-col sm:flex-row sm:items-center w-full sm:mt-0 mt-4">
              Marks
              <article className="pt-2 w-2/3  text-wrap">
                <input
                  type="number"
                  name="marks"
                  value={Questionobj.marks}
                  onChange={handleChange}
                  className="p-4 w-full border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none"
                />
              </article>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;

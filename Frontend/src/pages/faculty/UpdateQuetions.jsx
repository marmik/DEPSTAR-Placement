import React, { useState, useEffect } from 'react';

const UpdateQuetions = ({ updateQuestion, i,initialQuestion}) => {
  const [Questionobj, setQuestionobj] = useState(initialQuestion);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('options[')) {
      const index = parseInt(name.match(/\d+/)[0], 10);
      setQuestionobj(prevQuestionobj => {
        const newOptions = [...prevQuestionobj.options];
        newOptions[index].OptionText = value;
        const newQuestionobj = { ...prevQuestionobj, options: newOptions };
        updateQuestion(i, newQuestionobj);
        return newQuestionobj;
      });
    } else {
      setQuestionobj(prevQuestionobj => {
        const newQuestionobj = { ...prevQuestionobj, [name]: value };
        updateQuestion(i, newQuestionobj);
        return newQuestionobj;
      });
    }
  };

  return (
    <div className='pt-10 flex flex-col'>

      <div className="w-full">
        <label className="flex flex-col">
          <span className="mb-2">Question :</span>
          <input
            type="text"
            name="QuestionText"
            placeholder="Question"
            value={Questionobj.QuestionText}
            onChange={handleChange}
            required
            className="p-4 mt-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none"
          />
        </label>
      </div>

      <div className="ml-4 flex sm:flex-row flex-col mt-0">
        <div className="grid grid-rows-2 sm:grid-flow-col gap-4 w-full">
          {Questionobj.options.slice(0, 4).map((option, index) => (
            <div key={index} className="ml-4 w-full">
              <label className="flex flex-row items-center justify-left w-full">
                {String.fromCharCode(65 + index)}
                <article className="text-wrap w-1/2">
                  <input
                    type="text"
                    name={`options[${index}]`}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    value={option.OptionText}
                    onChange={handleChange}
                    required
                    className="p-4 ml-4 w-full m-2 border-2 border-slate-300 rounded-md focus:border-primary focus:outline-none"
                  />
                </article>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex sm:flex-row flex-col">
        <div className="flex w-full sm:flex-row flex-col">
          <div className="w-full">
            <article className="pt-2 w-2/3 text-wrap">
              <select
                name="Correct_Option"
                value={Questionobj.Correct_Option}
                onChange={handleChange}
                required
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
              <article className="pt-2 w-2/3 text-wrap">
                <input
                  type="number"
                  name="Mark"
                  value={Questionobj.Mark}
                  onChange={handleChange}
                  required
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

export default UpdateQuetions;

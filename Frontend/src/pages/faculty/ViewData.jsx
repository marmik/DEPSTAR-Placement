import React, { useEffect, useState } from 'react';
import { useNavigate ,useParams } from 'react-router-dom';
import axios from 'axios';


const ViewData = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const QuizID = window.atob(id);
  const [submitioninfo, setsubmitioninfo] = useState([]);
  
  useEffect(() => {
    const fetchsubmitioninfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/faculty/quizzes/${QuizID}/allStudentResults`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setsubmitioninfo(response.data);
          console.log(response.data," this is submitioninfo");
        } else {
          toast.warn("Internal Server Error !");
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchsubmitioninfo();
  }, [QuizID]);

  return (
    <div>
     <div className="items-center justify-between  mb-8">
     <h2 className="text-xl px-6 font-bold mb-4">Search Student</h2>
        <div className="bg-white py-3 px-6 flex ">
        <label className="flex flex-col ">
              <input type="text"  placeholder="Search Quiz" className="p-4 mt-2 border-2 border-slate-300 rounded-md  focus:border-primary focus:outline-none" />
            </label>
        </div>
      </div>
      <div>
        <div className="bg-white rounded-md p-4">
          <div className="overflow-x-auto flex flex-wrap">
            <div className="w-full rounded-md p-4 mb-4">
              <div className="flex flex-wrap">
              <table className="min-w-full border rounded-lg overflow-hidden">
              <thead className="bg-primary text-light border">
                  <tr className="divide-x divide-light">
                      <th className="text-left py-3 px-4 uppercase text-sm">No</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Student Name</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">ID</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Marks</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Correct</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Wrong</th>
                      <th className="text-left py-3 px-4 uppercase text-sm">Feedback</th>
                  </tr>
                </thead>
                <tbody>

                {submitioninfo.map((element,index) => { 
                    return(<tr className="divide-x divide-light">
                    <td className="text-left py-3 px-4 text-sm">{index+1}</td>
                      <td className="text-left py-3 px-4 text-sm">{element.username}</td>
                      <td className="text-left py-3 px-4 text-sm">{element.userID}</td>
                      <td className="text-left py-3 px-4 text-sm">{element.obtain_marks}</td>
                      <td className="text-left py-3 px-4 text-sm">{element.correct_answers}</td>
                      <td className="text-left py-3 px-4 text-sm">{element.wrong}</td>
                      <td className="text-left py-3 px-4 text-sm">{element.feedback}</td>
                    </tr>);
                })}
                </tbody>
            </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewData
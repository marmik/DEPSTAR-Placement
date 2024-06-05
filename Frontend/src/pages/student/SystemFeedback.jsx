import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Systemfeedback = () => {
  const [feedback, setfeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(feedback);
    const email="hello@charusat.edu.in";

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/student/feedback',{feedback, email},{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setfeedback(''); // Clear the feedback input field
      toast.success('Thank you for your feedback!');
    }
  
   catch (error) {
      // Handle the error
      console.error('Error submitting feedback:', error);
      toast.error('Error submitting feedback. Please try again.');
    }
  };
  return (
    <div className="flex flex-col md:flex-row justify-between">
    <div className="bg-white p-6 rounded-lg  md:w-2/3">
      <label htmlFor="feedback" className="block text-gray-700 text-lg font-bold mb-2">System feedbacks</label>
      <form onSubmit={handleSubmit}>
      <textarea id="feedback" className="w-full h-full p-4 border border-gray-300 rounded-lg mb-4" placeholder="Write your feedback Here"  value={feedback}
            onChange={(e) => setfeedback(e.target.value)}/>
      <button  className="bg-blue-600 text-white py-2 px-4 rounded-lg">Submit</button></form>
    </div>
    <div className="mt-6 md:mt-0 md:ml-6 w-full md:w-1/3">
      <img src="../images/system.png" alt="Illustration" className="w-full h-auto"/>
    </div>
    <ToastContainer /> 
  </div>

  )
}

export default Systemfeedback
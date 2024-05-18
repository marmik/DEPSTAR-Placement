import React from 'react'

const SystemFeedback = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between">
    <div className="bg-white p-6 rounded-lg  md:w-2/3">
      <label htmlFor="feedback" className="block text-gray-700 text-lg font-bold mb-2">System Feedbacks</label>
      <textarea id="feedback" className="w-full h-full p-4 border border-gray-300 rounded-lg mb-4" placeholder="Write your Feedback Here"></textarea>
      <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">Submit</button>
    </div>
    <div className="mt-6 md:mt-0 md:ml-6 w-full md:w-1/3">
      <img src="../images/system.png" alt="Illustration" className="w-full h-auto"/>
    </div>
  </div>

  )
}

export default SystemFeedback
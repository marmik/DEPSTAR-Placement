import React, { useState } from 'react';
import axios from 'axios';

const SystemSettings = () => {
  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  // const [role, setRole] = useState('');

  // const handleRegister = async (e) => {
  //   e.preventDefault();
    
  //   try {
  //     await axios.post('http://localhost:3000/api/admin/add_users', { username, password,role }, {
      
  //     });
  //     alert('User registered successfully');
  //   } catch (err) {
  //     console.error(err);
  //     alert('Error registering user');
  //   }
  // };

  // return (
  //   <div className="flex items-center justify-center min-h-screen bg-gray-100">
  //     <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
  //       <h2 className="text-2xl font-bold text-center">Register</h2>
  //       <form className="space-y-6" onSubmit={handleRegister}>
  //         <div>
  //           <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
  //           <input
  //             type="text"
  //             id="username"
  //             value={username}
  //             onChange={(e) => setUsername(e.target.value)}
  //             required
  //             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  //           />
  //         </div>
  //         <div>
  //           <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
  //           <input
  //             type="password"
  //             id="password"
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //             required
  //             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  //           />
  //         </div>
  //         <div>
  //           <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
  //           <input
  //             type="text"
  //             id="role"
  //             value={role}
  //             onChange={(e) => setRole(e.target.value)}
  //             required
  //             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  //           />
  //         </div>
  //         <button
  //           type="submit"
  //           className="w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  //         >
  //           Register
  //         </button>
  //       </form>
  //     </div>
  //   </div>
  // );
  return(
    <>
    SystemSettings
    </>
  );
};

export default SystemSettings;

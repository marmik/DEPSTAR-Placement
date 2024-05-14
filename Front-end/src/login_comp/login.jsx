// import React, { useState } from 'react';
// // import charust from '../assets/login/image_charusat.png';
// // import depstar from '../assets/login/image_depstar.png';
// // import login_back from '../assets/login/login_back.png';
// import { CiUser } from "react-icons/ci";
// import { RiLockPasswordLine } from "react-icons/ri";

// function LoginStudent() {
//   const [isstudent,setstudent]=useState(true);//spacify student or faculty
//   return (
//     <>
//       <div className="flex h-screen flex-row items-center justify-center">
//           <div className="shadow-lg flex flex-row  overflow-hidden h-full lg:w-1/2">
//           <div className="relative hidden lg:block">
//             <img src={login_back} alt="" className=""/>
//             <div className="absolute top-0 left-0 w-full h-full flex  flex-col justify-center bg-blue-700  bg-opacity-80">
//               <div className="text-black text-center items-center flex-col justify-center">
//                 <h1 className="text-7xl text-white font-bold">Logo Here</h1>
//               </div>
//                 <p className="text-8xl/relaxed left-0 ml-10 text-white font-bold ">Depstar Placement Portal</p>
//             </div>
//           </div>
//           </div>

//           {/* form */}
//           <div className="bg-white lg:w-1/2 w-10/12 p-10">
//             <div className=" flex-row items-center hidden lg:flex md:flex">
//               <img src={charust} alt="charusat" className="h-20 m-5"/>
//               <img src={depstar} alt="depstar" className="h-20 m-5" />
//             </div>

//             <h1 className="font-bold text-gray-800 text-3xl md:text-4xl md:mb-8 py-2 my-2 border-b-2">Login as {(isstudent)?"Student":"Faculty"}.</h1>

//             <div className="flex flex-row mb-5 ">
//               <h2 className={(isstudent)?"text-2xl font-semibold  text-gray-700 border-b-4 border-b-black cursor-pointer":"text-2xl font-semibold  text-gray-700 cursor-pointer"} onClick={()=>setstudent(true)}>Student</h2>
//               <h2 className={(!isstudent)?"text-2xl font-semibold text-gray-  ml-10 border-b-4 border-b-black cursor-pointer":"text-2xl font-semibold text-gray-700 ml-10 cursor-pointer"} onClick={()=>setstudent(false)}>Faculty</h2>
//             </div>

//             <form action="" className="flex flex-col w-2/3">
//               <div className="flex flex-col mb-4 relative">
                
//                 <label htmlFor="email" className="mb-2 text-gray-700 flex flex-row place-items-center"><CiUser className='mr-2 size-6'/>Username</label>
//                 <input type="email" name="" id="email" placeholder="youremail@gmail.com" className="px-4 py-2 border-2 border-slate-300 rounded-md max-w-full focus:border-blue-500 focus:outline-none"/>
//               </div>

//               <div className="flex flex-col relative">
                
//                 <label htmlFor="Password" className="mb-2 text-gray-700 flex flex-row place-items-center"><RiLockPasswordLine className='mr-2 size-6'/>Password</label>
//                 <input type="password" name="" id="password" placeholder="your password" className="px-4 py-2 border-2 border-slate-300 rounded-md max-w-full focus:outline-none focus:border-blue-500"/>
//               </div>

//               <button className="my-6 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg px-4 py-2 rounded-md self-end shadow-xl" >Login</button>
//             </form>

//             <p className="text-gray-500">Don't have an account? <a href="#" className="text-blue-500 font-semibold underline">Sign up</a></p>

          
//         </div>
//       </div>
//     </>
//   );
// }

// export default LoginStudent;

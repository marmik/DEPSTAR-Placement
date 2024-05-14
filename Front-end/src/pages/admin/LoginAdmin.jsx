import React from 'react';
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";

function LoginAdmin() {
  return (
    <>
      <div className="bg-white h-full flex items-center flex-col ">
        <div className="flex-row items-center hidden lg:flex md:flex justify-between w-full">
        <img src='./images/image_charusat.png' alt="charusat" className="h-20 m-5" />
            <img src='./images/image_depstar.png' alt="depstar" className="h-20 m-5" />
        </div>
        {/* form */}
        <div className="bg-white lg:w-1/2 md:w-1/2 w-1/2 self-center p-5 ">
          <div className=" flex-row items-center hidden lg:flex md:flex">
            {/* <img src={charust} alt="charusat" className="h-20 m-5"/> */}
          </div>


          <div className="flex flex-col items-center justify-center">
            <h1 className="font-bold text-gray-800 text-3xl md:text-4xl md:mb-8 py-2 my-2 self-center ">Logo Here</h1>
            <h2 className="text-2xl font-semibold  text-gray-700 self-center">Admin Login</h2>
          </div>

          <form action="" className="flex flex-col mt-10 ">
            <div className="flex flex-col mb-4 relative self-center lg:w-1/2 ">

              <label htmlFor="email" className="mb-2 text-gray-700 flex flex-row place-items-center"><CiUser className='mr-2 size-6' />Username</label>
              <input type="email" name="" id="email" placeholder="youremail@gmail.com" className="px-4 py-2 border-2 border-slate-300 rounded-md max-w-full focus:border-blue-500 focus:outline-none" />
            </div>

            <div className="flex flex-col relative self-center lg:w-1/2 ">

              <label htmlFor="Password" className="mb-2 text-gray-700 flex flex-row place-items-center"><RiLockPasswordLine className='mr-2 size-6' />Password</label>
              <input type="password" name="" id="password" placeholder="your password" className=" px-4 py-2 border-2 border-slate-300 rounded-md max-w-full focus:outline-none focus:border-blue-500" />

              <button className="self-center my-6 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg px-4 py-2 rounded-md shadow-xl" >Login</button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
}

export default LoginAdmin;

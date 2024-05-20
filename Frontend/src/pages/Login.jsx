import React, { useState } from 'react';
import { CiUser } from 'react-icons/ci';
import { RiLockPasswordLine } from "react-icons/ri";

function Login() {
  const [isstudent, setstudent] = useState(true);//spacify student or faculty
  return (
    <>
      <div className="flex h-screen flex-row items-center justify-center">
        <div className="shadow-lg flex flex-row  overflow-hidden h-full lg:w-1/2">
          <div className="relative hidden lg:block">
            <img src='./images/login_back.png' alt="" className="" />
            <div className="absolute top-0 left-0 w-full h-full flex  flex-col justify-center bg-primary  bg-opacity-80 opacity-70">
              <div className=" text-center items-center flex-col justify-center">
                <h1 className="text-7xl text-white font-bold">Logo Here</h1>
              </div>
              <p className="text-8xl/relaxed left-0 ml-10 text-white font-bold ">Depstar Placement Portal</p>
            </div>
          </div>
        </div>


        {/* form */}
        <div className="bg-white text-secondary items-start h-full grid lg:w-1/2 w-10/12 ">
          <div className=" flex-row items-center hidden lg:flex md:flex justify-between">
            <img src='./images/image_charusat.png' alt="charusat" className="h-20 m-5" />
            <img src='./images/image_depstar.png' alt="depstar" className="h-20 m-5" />
          </div>
          <div className="sm:p-40  ">


            <h1 className="font-bold text-3xl flex lg:hidden md:hidden">Logo Here</h1>
            <h1 className="font-bold text-3xl md:text-4xl md:mb-8 py-2 my-2 border-b-2">Login as {(isstudent) ? "Student" : "Faculty"}</h1>

            <div className="flex flex-row mb-5">
              <h2 className={(isstudent) ? "text-2xl font-semibold  border-b-4 border-b-primary cursor-pointer" : "text-2xl font-semibold  cursor-pointer"} onClick={() => setstudent(true)}>Student</h2>
              <h2 className={(!isstudent) ? "text-2xl font-semibold ml-10 border-b-4 border-b-primary cursor-pointer" : "text-2xl font-semibold ml-10 cursor-pointer"} onClick={() => setstudent(false)}>Faculty</h2>
            </div>
          <br/>
            <form action="" className="flex flex-col w-full">
              <div className="flex flex-col mb-4 relative">

                <label htmlFor="email" className="mb-2 flex flex-row place-items-center"><CiUser className='mr-2 size-6' />Username</label>
                <input type="email" name="" id="email" placeholder="username" className="px-4 py-3 border-2 border-slate-300 rounded-md max-w-full focus:border-primary focus:outline-none" />
              </div>
              <br/>
              <div className="flex flex-col relative">

                <label htmlFor="Password" className="mb-2 flex flex-row place-items-center"><RiLockPasswordLine className='mr-2 size-6' />Password</label>
                <input type="password" name="" id="password" placeholder="your password" className="px-4 py-3 border-2 border-slate-300 rounded-md max-w-full focus:border-primary focus:outline-none" />
              </div>

              <button className="self-center w-3/12 my-6 bg-primary text-light font-medium text-lg px-4 py-3 rounded-md lg:self-end shadow-xl" >Login</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
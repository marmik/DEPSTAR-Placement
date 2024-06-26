import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CiUser } from 'react-icons/ci';
import { RiLockPasswordLine } from 'react-icons/ri';
import { parseJwt } from '../../model/JwtDecode';
import { toast } from 'react-toastify';

function LoginAdmin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleLoggedInUser= async () => {
    // e.preventDefault();

    if(localStorage.getItem("token")){
      const token = localStorage.getItem("token");
      const parse = parseJwt(token);
      if(parse.role=="Admin"){
        navigate("/admin/dashboard");
      } 
      else{
        navigate("/admin/login");
      }
    }
    
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    handleLoggedInUser();
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        username,
        password

      });
      // console.log(response);
      if (response.status === 200) {
        const role = response.data.role;
        if (role == 'Admin') {
          localStorage.setItem("token",response.data.token)
          toast.success("Login Successfully !");
          navigate('/admin/dashboard');
        }
        else {
          toast.error('Invalid User');
        }
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error(error.response);
    }
  };



  return (
    <>
      <div onLoad={handleLoggedInUser} className="bg-white text-secondary h-full flex items-center flex-col ">
        <div className="flex-row items-center hidden lg:flex md:flex justify-between w-full">
          <img src='../../images/image_charusat.png' alt="charusat" className="h-20 m-5" />
          <img src='../../images/image_depstar.png' alt="depstar" className="h-20 m-5" />
        </div>
        {/* form */}
        <div className="bg-white lg:w-1/2 md:w-1/2 w-1/2 self-center p-5 ">
          <div className=" flex-row items-center hidden lg:flex md:flex">
            {/* <img src={charust} alt="charusat" className="h-20 m-5"/> */}
          </div>


          <div className="flex flex-col items-center justify-center">
            <h1 className="font-bold text-3xl md:text-4xl md:mb-8 py-2 my-2 self-center ">Logo Here</h1>
            <h2 className="text-2xl font-semibold self-center">Admin Login</h2>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col mt-10 ">
            <div className="flex flex-col mb-4 relative self-center lg:w-1/2 ">

              <label htmlFor="email" className="mb-2 flex flex-row place-items-center"><CiUser className='mr-2 size-6' />Username</label>
              <input type="text" value={username}
                onChange={(e) => setUsername(e.target.value)} name="" id="email" placeholder="youremail@gmail.com" className="px-4 py-3 border-2 border-slate-300 rounded-md max-w-full focus:border-primary focus:outline-none" />
            </div>
            <br />
            <div className="flex flex-col relative self-center lg:w-1/2 ">

              <label htmlFor="Password" className="mb-2  flex flex-row place-items-center"><RiLockPasswordLine className='mr-2 size-6' />Password</label>
              <input type="password" value={password}
                onChange={(e) => setPassword(e.target.value)} name="" id="password" placeholder="your password" className="px-4 py-3 border-2 border-slate-300 rounded-md max-w-full focus:border-primary focus:outline-none" />

            </div>
            <br />
            
            <button className="self-center w-3/12 my-6 bg-primary  text-light font-medium text-lg px-4 py-3 rounded-md shadow-xl" >Login</button>
          </form>

        </div>
      </div>
    </>
  );
}

export default LoginAdmin;

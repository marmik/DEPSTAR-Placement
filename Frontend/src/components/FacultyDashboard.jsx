import React, { useState,useEffect  } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import Dashboard from '../pages/faculty/Dashboard';
import FacultySidebar from './FacultySidebar';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ManageFeedback from '../pages/faculty/ManageFeedback';
import SystemFeedback from '../pages/faculty/SystemFeedback';
import ViewQuiz from '../pages/faculty/ViewQuiz';
import ManageQuiz from '../pages/faculty/ManageQuiz';
import AddQuiz from '../pages/faculty/AddQuiz';
import ViewData from '../pages/faculty/ViewData';
import Error404 from '../pages/Error404';
import { parseJwt } from '../model/JwtDecode';
import UpdateQuiz from '../pages/faculty/UpdateQuiz';



function FacultyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [UserName, setUserName] = useState();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAuthUser = async()=>{
    
    if(localStorage.getItem("token")){
      const token = localStorage.getItem("token");
      const parse = parseJwt(token);
      setUserName(parse.username);
    
      if(parse.role=="Student"){
        navigate("/student");
      }      
      else if(parse.role=="Faculty"){
        navigate("/faculty");
      }
      else{
        navigate("/");
      }
    }
    else{
      navigate("/");
    }
  } 

  useEffect(() => {
    handleAuthUser();
  },[navigate])



  return (
    <>
      <div  className='grid grid-cols-5'>

        <div className={`sm:col-span-1 col-span-3 ${sidebarOpen ? 'block' : 'hidden'}`}>
          <FacultySidebar />
        </div>

        <div className={`${sidebarOpen ? 'sm:col-span-4 col-span-2 ' : ' sm:col-span-5 col-span-5'}  h-screen overflow-y-auto overflow-x-hidden`}>

          <div className='z-10 bg-slate-200  flex-wrap gap-10 flex justify-between items-center sticky top-0 w-full p-7'>
            <div className='flex justify-center  items-center gap-10'>
              <GiHamburgerMenu className='text-2xl cursor-pointer ' onClick={toggleSidebar} />
              <h2 className='font-bold text-2xl'>
              <Routes>
                  <Route path='/' element={'Dashboard'}></Route>
                  <Route path='/add-quiz' element={'Add Quiz'}></Route>
                  <Route path='/manage-quiz' element={'Manage Quiz'}></Route>
                  <Route exact path='/view-quiz/:id' element={'View Quiz'}></Route>
                  <Route path='/view-data/*' element={'View Data'}></Route>
                  <Route path='/manage-feedbacks' element={'Manage Feedbacks'}></Route>
                  <Route path='/system-feedbacks' element={'System Feedbacks'}></Route>
                  <Route path='/update-quiz/*' element={'Update Quiz'}></Route>
                </Routes>
              </h2>
            </div>
            <div className='flex justify-center items-center gap-4'>
              <p className='font-medium text-xl'>{UserName}</p>
              <img src="../vite.svg" alt="Image" className='rounded-full' />
            </div>
          </div>

          <div className='p-3'>
            <Routes>
              <Route path='/' element={<Dashboard />}></Route>
              <Route path='/add-quiz' element={<AddQuiz />}></Route>
              <Route path='/manage-quiz' element={<ManageQuiz />}></Route>
              <Route exact path='/view-quiz/:id' element={<ViewQuiz />}></Route>
              <Route path='/manage-feedbacks' element={<ManageFeedback />}></Route>
              <Route path='/view-data/:id' element={<ViewData />}></Route>
              <Route path='/system-feedbacks' element={<SystemFeedback />}></Route>
              <Route path='/update-quiz/:id' element={<UpdateQuiz />}></Route>
              <Route path='*' element={<Error404 />}></Route>
            </Routes>
          </div>

        </div>
      </ div>
    </>
  );
}


export default FacultyDashboard;

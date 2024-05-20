import React, { useState  } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import Dashboard from '../pages/faculty/Dashboard';
import FacultySidebar from './FacultySidebar';
import { Route, Routes } from 'react-router-dom';
import ManageFeedback from '../pages/faculty/ManageFeedback';
import SystemFeedback from '../pages/faculty/SystemFeedback';
import ViewQuiz from '../pages/faculty/ViewQuiz';
import ManageQuiz from '../pages/faculty/ManageQuiz';
import AddQuiz from '../pages/faculty/AddQuiz';
import ViewData from '../pages/faculty/ViewData';



function FacultyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div className='grid grid-cols-5'>

        <div className={`sm:col-span-1 col-span-3 ${sidebarOpen ? 'block' : 'hidden'}`}>
          <FacultySidebar />
        </div>

        <div className={`${sidebarOpen ? 'sm:col-span-4 col-span-2 ' : ' sm:col-span-5 col-span-5'}  h-screen overflow-y-auto overflow-x-hidden`}>

          <div className='bg-slate-200  flex-wrap gap-10 flex justify-between items-center sticky top-0 w-full p-7'>
            <div className='flex justify-center  items-center gap-10'>
              <GiHamburgerMenu className='text-2xl cursor-pointer ' onClick={toggleSidebar} />
              <h2 className='font-bold text-2xl'>
              <Routes>
                  <Route path='/' element={'Faculty Dashboard'}></Route>
                  <Route path='/add-quiz' element={'Add Quiz'}></Route>
                  <Route path='/manage-quiz' element={'Manage Quiz'}></Route>
                  <Route path='/view-quiz' element={'View Quiz'}></Route>
                  <Route path='/view-data' element={'View Quiz'}></Route>
                  <Route path='/manage-feedbacks' element={'Manage Feedbacks'}></Route>
                  <Route path='/system-feedbacks' element={'System Feedbacks'}></Route>
                 
                </Routes>
              </h2>
            </div>
            <div className='flex justify-center items-center gap-4'>
              <p className='font-medium text-xl'>Raj Markana</p>
              <img src="../vite.svg" alt="Image" className='rounded-full' />
            </div>
          </div>

          <div className='p-3'>
            <Routes>
              <Route path='/' element={<Dashboard />}></Route>
              <Route path='/add-quiz' element={<AddQuiz />}></Route>
              <Route path='/manage-quiz' element={<ManageQuiz />}></Route>
              <Route path='/view-quiz' element={<ViewQuiz />}></Route>
              <Route path='/manage-feedbacks' element={<ManageFeedback />}></Route>
              <Route path='/view-data' element={<ViewData />}></Route>
              <Route path='/system-feedbacks' element={<SystemFeedback />}></Route>
            
              
            </Routes>
          </div>

        </div>
      </ div>
    </>
  );
}


export default FacultyDashboard;

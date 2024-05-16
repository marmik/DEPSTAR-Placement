import React, { useState } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import StudentSidebar from './StudentSidebar'
import Dashboard from '../pages/student/Dashboard';
import { Route, Routes } from 'react-router-dom';
import ViewQuiz from '../pages/student/ViewQuiz';
import GivenFeedback from '../pages/student/GivenFeedback';
import SystemFeedback from '../pages/student/SystemFeedback';


function StudentDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            <div className='grid grid-cols-5'>

                <div className={`sm:col-span-1 col-span-3 ${sidebarOpen ? 'block' : 'hidden'}`}>
                    <StudentSidebar />
                </div>

                <div className={`${sidebarOpen ? 'sm:col-span-4 col-span-2 ' : ' sm:col-span-5 col-span-5'}  h-screen overflow-y-auto overflow-x-hidden`}>

                    <div className='bg-slate-200  flex justify-between items-center sticky top-0 w-full p-7'>
                        <div className='flex justify-center items-center gap-10'>
                            <GiHamburgerMenu className='text-2xl cursor-pointer ' onClick={toggleSidebar} />
                            <h2 className='font-bold text-2xl'>Dashboard</h2>
                        </div>
                        <div className='flex justify-center items-center gap-4'>
                            <p className='font-medium text-xl'>Harsh</p>
                            <img src="../vite.svg" alt="Image" className='rounded-full' />
                        </div>
                    </div>

                    <br />

                    <div className='p-3 '>
                        <Routes>
                            <Route path='/' element={<Dashboard />}></Route>
                            <Route path='/view-quiz' element={<ViewQuiz/>}></Route>
                            <Route path='/given-feedback' element={<GivenFeedback/>}></Route>
                            <Route path='/system-feedback' element={<SystemFeedback/>}></Route>
                           
                        </Routes>
                      
                    </div>
                    
                </div>
            </ div>

        </>
    );
}

export default StudentDashboard;

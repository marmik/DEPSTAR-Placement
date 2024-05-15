import React from 'react';
import { Link } from 'react-router-dom';
import { HiHome, HiPlusCircle, HiBookOpen, HiChatAlt, HiLogout } from 'react-icons/hi';

const FacultySidebar = () => {
    return (
        <div className=" flex flex-col bg-blue-700 text-white h-screen overflow-hidden">
            <div className="flex items-center justify-center h-20">
                <span className="text-xl font-bold">Logo</span>
            </div>
            <nav className="flex-grow  py-4 px-6">
                <ul className='flex flex-col gap-4'>
                    <li className='p-4 bg-white rounded-lg text-secondary'>
                        <Link
                            to="/faculty"

                        >
                            <div className="flex items-center space-x-2">
                                <HiHome className="w-5 h-5" />
                                <span>Dashboard</span>
                            </div>
                        </Link>
                    </li>
                    <li className='p-4'>
                        <Link
                            to="./add-exam"
                           
                        >
                            <div className="flex items-center space-x-2">
                                <HiPlusCircle className="w-5 h-5" />
                                <span>Add New Exam</span>
                            </div>
                        </Link>
                    </li>
                    <li className='p-4'>
                        <Link
                            to="./manage-exams"
                            
                        >
                            <div className="flex items-center space-x-2">
                                <HiBookOpen className="w-5 h-5" />
                                <span>Manage Exams</span>
                            </div>
                        </Link>
                    </li>
                    <li className='p-4'>
                        <Link
                            to="./manage-feedbacks"
                            
                        >
                            <div className="flex items-center space-x-2">
                                <HiChatAlt className="w-5 h-5" />
                                <span>Manage Feedbacks</span>
                            </div>
                        </Link>
                    </li>
                    <li className='p-4'>
                        <Link
                            to="./system-feedbacks"
                            
                        >
                            <div className="flex items-center space-x-2">
                                <HiChatAlt className="w-5 h-5" />
                                <span>System Feedbacks</span>
                            </div>
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="py-4 px-6 bg-blue-950">
                <Link
                    to="/"
                    className="flex items-center space-x-2  text-white"
                >
                    <HiLogout className="w-5 h-5" />
                    <span>Logout</span>
                </Link>
            </div>
        </div>
    );
};
export default FacultySidebar;

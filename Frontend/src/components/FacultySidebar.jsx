import React from 'react';
import { Link,useLocation } from 'react-router-dom';
import { HiHome, HiPlusCircle, HiBookOpen, HiChatAlt, HiLogout } from 'react-icons/hi';
import { IoMdSettings } from "react-icons/io";

const FacultySidebar = () => {
    const location = useLocation();
    const path = location.pathname;
    return (
        <div className=" flex flex-col bg-primary text-light h-screen overflow-hidden">
            <div className="flex items-center justify-center h-20">
                <span className="text-xl font-bold">Logo</span>
            </div>
            <nav className="flex-grow  py-4 px-6">
                <ul className='flex flex-col gap-4'>
                    <li className={`p-4 rounded-lg ${path == "/faculty" || path=="/faculty/" ? "bg-white shadow-2xl text-secondary":"" }  `}>
                        <Link
                            to="/faculty"
                        >
                            <div className="flex items-center space-x-2">
                                <HiHome className="w-5 h-5" />
                                <span>Dashboard</span>
                            </div>
                        </Link>
                    </li>
                    <li className={`p-4 rounded-lg ${path == "/faculty/add-exam" ? "bg-white shadow-2xl text-secondary":"" }  `}>
                        <Link
                            to="./add-exam"
                           
                        >
                            <div className="flex items-center space-x-2">
                                <HiPlusCircle className="w-5 h-5" />
                                <span>Add New Exam</span>
                            </div>
                        </Link>
                    </li>
                    <li className={`p-4 rounded-lg ${path == "/faculty/manage-exams" ? "bg-white shadow-2xl text-secondary":"" }  `}>
                        <Link
                            to="./manage-exams"
                            
                        >
                            <div className="flex items-center space-x-2">
                                <HiBookOpen className="w-5 h-5" />
                                <span>Manage Exams</span>
                            </div>
                        </Link>
                    </li>
                    <li className={`p-4 rounded-lg ${path == "/faculty/manage-feedbacks" ? "bg-white shadow-2xl text-secondary":"" }  `}>
                        <Link
                            to="./manage-feedbacks"
                            
                        >
                            <div className="flex items-center space-x-2">
                                <HiChatAlt className="w-5 h-5" />
                                <span>Manage Feedbacks</span>
                            </div>
                        </Link>
                    </li>
                    <li className={`p-4 rounded-lg ${path == "/faculty/system-feedbacks" ? "bg-white shadow-2xl text-secondary":"" }  `}>
                        <Link
                            to="./system-feedbacks"
                            
                        >
                            <div className="flex items-center space-x-2">
                                <IoMdSettings className="w-5 h-5" />
                                <span>System Feedbacks</span>
                            </div>
                        </Link>
                    </li>
                    <li className={`p-4 rounded-lg ${path == "/faculty/view-quiz" ? "bg-white shadow-2xl text-secondary":"" }  `}>
                        <Link
                            to="./view-quiz"
                            
                        >
                            <div className="flex items-center space-x-2">
                                <IoMdSettings className="w-5 h-5" />
                                <span>View Quiz</span>
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

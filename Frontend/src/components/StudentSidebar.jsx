import React from 'react';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { HiHome,HiBookOpen, HiChatAlt, HiLogout } from 'react-icons/hi';
import { PiExam } from "react-icons/pi";



const StudentSidebar = () => {
    const location = useLocation();
    const path = location.pathname;
    const navigate = useNavigate();

    const handleLogout = async()=>{
        localStorage.removeItem("token");
        localStorage.clear();
        navigate("/")
    }

    return (
        <div className=" flex flex-col bg-primary text-white h-screen overflow-hidden">
                <div className="flex items-center justify-center p-4">
                <img src="../images/PlaceStarWhite.png" width={200} alt="" />
            </div>
            <nav className="flex-grow  py-4 px-6">
                <ul className='flex flex-col gap-4'>
                    <li className={`p-4 rounded-lg ${path == "/student" || path=="/student/" ? "bg-white shadow-2xl text-secondary":"" }  `}>
                        <Link
                            to="/student"

                        >
                            <div className="flex items-center space-x-2">
                                <HiHome className="w-5 h-5" />
                                <span>Dashboard</span>
                            </div>
                        </Link>
                    </li>
                    <li className={`p-4 rounded-lg ${path == "/student/view-quiz" || path=="/student/view-given-quiz" ? "bg-white shadow-2xl text-secondary":"" }  `}>
                        <Link
                            to="./view-quiz"
                           
                        >
                            <div className="flex items-center space-x-2">
                                <PiExam className="w-5 h-5" />
                                <span>View Quiz</span>
                            </div>
                        </Link>
                    </li>
                    {/* <li className={`p-4 rounded-lg ${path == "/student/given-feedback" ? "bg-white shadow-2xl text-secondary":"" }  `}>
                        <Link
                            to="./given-feedback"
                            
                        >
                            <div className="flex items-center space-x-2">
                                <HiBookOpen className="w-5 h-5" />
                                <span>Given Feedback</span>
                            </div>
                        </Link>
                    </li> */}
                    <li className={`p-4 rounded-lg ${path == "/student/system-feedback" ? "bg-white shadow-2xl text-secondary":"" }  `}>
                        <Link
                            to="./system-feedback"
                            
                        >
                            <div className="flex items-center space-x-2">
                                <HiChatAlt className="w-5 h-5" />
                                <span>System Feedback</span>
                            </div>
                        </Link>
                   
                    </li>
                  
                  
                </ul>
            </nav>
            <div className="py-4 px-6 bg-blue-950">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2  text-white"
                >
                    <HiLogout className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};
export default StudentSidebar;

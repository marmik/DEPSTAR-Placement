import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiHome, HiUser, HiBookOpen, HiChatAlt, HiLogout } from 'react-icons/hi';
import { IoMdSettings } from "react-icons/io";

const AdminSidebar = () => {
    const location = useLocation();
    const path = location.pathname;
    return (
        <div className=" flex flex-col bg-primary text-light h-screen overflow-hidden">
            <div className="flex items-center justify-center h-20">
                <span className="text-xl font-bold">Logo</span>
            </div>
            <nav className="flex-grow  py-4 px-6">
                <ul className='flex flex-col gap-4'>
                    <li className={`p-4 rounded-lg ${path == "/admin/dashboard/" || path=="/admin/dashboard" ? "bg-white shadow-2xl text-secondary":"" }  `}>
                        <Link
                            to="./"
>
                            <div className="flex items-center space-x-2">
                                <HiHome className="w-5 h-5" />
                                <span>dashboard</span>
                            </div>
                        </Link>
                    </li>
                    <li className={`p-4 rounded-lg ${path == "/admin/dashboard/view-users" ? "bg-white shadow-2xl text-secondary":"" }  `}>
                        <Link
                            to="./view-users"
                           >
                            <div className="flex items-center space-x-2">
                                <HiUser className="w-5 h-5" />
                                <span>View Users</span>
                            </div>
                        </Link>
                    </li>
                    <li className={`p-4 rounded-lg ${path == "/admin/dashboard/view-exams" ? "bg-white shadow-2xl text-secondary":"" }  `}>
                        <Link
                            to="./view-exams"
                            >
                            <div className="flex items-center space-x-2">
                                <HiBookOpen className="w-5 h-5" />
                                <span>View Quiz</span>
                            </div>
                        </Link>
                    </li>
                    <li className={`p-4 rounded-lg ${path == "/admin/dashboard/system-feedbacks" ? "bg-white shadow-2xl text-secondary":"" }  `}>
                        <Link
                            to="./system-feedbacks"
                            >
                            <div className="flex items-center space-x-2">
                                <HiChatAlt className="w-5 h-5" />
                                <span>System Feedbacks</span>
                            </div>
                        </Link>
                    </li>
                    <li className={`p-4 rounded-lg ${path == "/admin/dashboard/system-settings" ? "bg-white shadow-2xl text-secondary":"" } `}>
                        <Link
                            to="./system-settings">
                            <div className="flex items-center space-x-2">
                                <IoMdSettings className="w-5 h-5" />
                                <span>System Settings</span>
                            </div>
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="py-4 px-6 bg-blue-950">
                <Link
                    to="/admin/login"
                    className="flex items-center space-x-2  text-white"
                >
                    <HiLogout className="w-5 h-5" />
                    <span>Logout</span>
                </Link>
            </div>
        </div>
    );
};
export default AdminSidebar;

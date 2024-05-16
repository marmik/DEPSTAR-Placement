import React from 'react';
import { Link } from 'react-router-dom';
import { HiHome, HiUser, HiBookOpen, HiChatAlt, HiLogout } from 'react-icons/hi';
import { IoMdSettings } from "react-icons/io";

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
                            to="./"
>
                            <div className="flex items-center space-x-2">
                                <HiHome className="w-5 h-5" />
                                <span>Dashboard</span>
                            </div>
                        </Link>
                    </li>
                    <li className='p-4'>
                        <Link
                            to="./View-Users"
                           >
                            <div className="flex items-center space-x-2">
                                <HiUser className="w-5 h-5" />
                                <span>View Users</span>
                            </div>
                        </Link>
                    </li>
                    <li className='p-4'>
                        <Link
                            to="./View-Exams"
                            >
                            <div className="flex items-center space-x-2">
                                <HiBookOpen className="w-5 h-5" />
                                <span>View Exams</span>
                            </div>
                        </Link>
                    </li>
                    <li className='p-4'>
                        <Link
                            to="./System-Feedbacks"
                            >
                            <div className="flex items-center space-x-2">
                                <HiChatAlt className="w-5 h-5" />
                                <span>System Feedbacks</span>
                            </div>
                        </Link>
                    </li>
                    <li className='p-4'>
                        <Link
                            to="./System-Settings">
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

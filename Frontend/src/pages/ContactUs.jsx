import React from 'react'

import { ImLinkedin2 } from "react-icons/im";
import { BiLogoGmail } from "react-icons/bi";

const ContactUs = () => {
    return (
        <div className='p-7   text-secondary'>
            <h1 className='font-semibold text-primary text-3xl'>Contact us</h1>
            <br /><br />
            <div>
                <h1 className='font-medium text-xl'>Developer Team</h1>
                <br />
                <div className='grid grid-cols-5 gap-10'>
                    <div className='sm:col-span-1 col-span-5 p-4 bg-slate-100 transition-all hover:shadow-xl rounded-2xl'>
                        <div className=' rounded-3xl flex items-center justify-center col-span-2'>
                            <img src="./images/Dev1.png" width={200} alt="" />
                        </div>
                        <div className=' mt-3'>
                            <h1 className='font-semibold  text-primary text-xl'>Raj Dilipbhai Markana</h1>
                            <p className='text-gray-600'>D23DCE143</p>
                            <p className='text-sm'>MERN Stack Developer</p>
                            <br />
                            <div className='text-2xl flex gap-4 '>
                                <a href="mailto:d23dce143@charusat.edu.in" target='_blank' className='transition-all hover:text-primary'><BiLogoGmail /></a>
                                <a href="https://www.linkedin.com/in/rajmarkana/" target='_blank' className='transition-all hover:text-primary'><ImLinkedin2 /></a>
                            </div>
                        </div>
                    </div>
                    <div className='sm:col-span-1 col-span-5 p-4 bg-slate-100  transition-all hover:shadow-xl rounded-2xl'>
                        <div className=' rounded-3xl flex items-center justify-center col-span-2'>
                            <img src="./images/Dev2.png" width={200} alt="" />
                        </div>
                        <div className=' mt-3'>
                            <h1 className='font-semibold text-primary text-xl'>Marmik Jayantibhai Patel</h1>
                            <p className='text-gray-600'>D23DCE153</p>
                            <p className='text-sm'>Backend Developer</p>
                            <br />
                            <div className='text-2xl flex gap-4'>
                                <a href="mailto:d23dce153@charusat.edu.in" target='_blank' className='transition-all hover:text-primary'><BiLogoGmail /></a>
                                <a href="https://www.linkedin.com/in/marmik-patel-84a55b1b4/" target='_blank' className='transition-all hover:text-primary'><ImLinkedin2 /></a>
                            </div>
                        </div>
                    </div>
                    <div className='sm:col-span-1 col-span-5 p-4 bg-slate-100 transition-all hover:shadow-xl rounded-2xl'>
                        <div className=' rounded-3xl flex items-center justify-center col-span-2'>
                            <img src="./images/Dev4.png" width={200} alt="" />
                        </div>
                        <div className=' mt-3'>
                            <h1 className='font-semibold text-primary text-xl'>Krish Harsukhbhai Lalani</h1>
                            <p className='text-gray-600'>D23DCE166</p>
                            <p className='text-sm'>Backend Developer</p>
                            <br />
                            <div className='text-2xl flex gap-4'>
                                <a href="mailto:d23dce166@charusat.edu.in" target='_blank' className='transition-all hover:text-primary'><BiLogoGmail /></a>
                                <a href="https://www.linkedin.com/in/krish-lalani-bb4385252/" target='_blank' className='transition-all hover:text-primary'><ImLinkedin2 /></a>
                            </div>
                        </div>
                    </div>
                    <div className='sm:col-span-1 col-span-5 p-4 bg-slate-100 transition-all hover:shadow-xl rounded-2xl'>
                        <div className=' rounded-3xl flex items-center justify-center col-span-2'>
                            <img src="./images/Dev5.png" width={200} alt="" />
                        </div>
                        <div className=' mt-3'>
                            <h1 className='font-semibold text-primary text-xl'>Prince Kiranbhai Bavishi</h1>
                            <p className='text-gray-600'>22DCE005</p>
                            <p className='text-sm'>Frontend Developer</p>
                            <br />
                            <div className='text-2xl flex items-center gap-4'>
                                <a href="mailto:22dce005@charusat.edu.in" target='_blank' className='transition-all hover:text-primary'><BiLogoGmail /></a>
                                <a href="https://www.linkedin.com/in/prince-bavishi-6a4836259/" target='_blank' className='transition-all hover:text-primary'><ImLinkedin2 /></a>
                            </div>
                        </div>
                    </div>
                    <div className='sm:col-span-1 col-span-5 p-4 bg-slate-100 transition-all hover:shadow-xl rounded-2xl'>
                        <div className=' rounded-3xl flex items-center justify-center col-span-2'>
                            <img src="./images/Dev3.png" width={200} alt="" />
                        </div>
                        <div className=' mt-3'>
                            <h1 className='font-semibold text-primary text-xl'>Harsh Hastinbhai Sanghvi</h1>
                            <p className='text-gray-600'>D23DCE148</p>
                            <p className='text-sm'>Frontend Developer</p>
                            <br />
                            <div className='text-2xl flex gap-4'>
                                <a href="mailto:d23dce148@charusat.edu.in" target='_blank' className='transition-all hover:text-primary'><BiLogoGmail /></a>
                                <a href="https://www.linkedin.com/in/harsh-sanghvi-7680ab229/" target='_blank' className='transition-all hover:text-primary'><ImLinkedin2 /></a>
                            </div>
                        </div>
                    </div>
                  
                    


                </div>
            </div>
            <br /><br/>
            <div>
                <h1 className='font-medium text-xl'>Guided By</h1>
                <br />
                <div className='grid grid-cols-5 gap-10'>
                <div className='sm:col-span-1 col-span-5 p-4 bg-slate-100 transition-all hover:shadow-xl rounded-2xl'>
                        <div className=' rounded-3xl flex items-center justify-center col-span-2'>
                            <img src="./images/guide.png" width={200} alt="" />
                        </div>
                        <div className=' mt-3'>
                            <h1 className='font-semibold text-primary text-xl'>Kashyap Patel</h1>
                            <p className='text-gray-600'>Assistant Professor</p>
                            <p className='text-sm'>DEPSATR CE</p>
                            <br />
                            <div className='text-2xl flex gap-4'>
                                <a href="mailto:kashyappatel.dce@charusat.ac.in" target='_blank' className='transition-all hover:text-primary'><BiLogoGmail /></a>
                                <a href="https://www.linkedin.com/in/kashyap-patel-73706aa1" target='_blank' className='transition-all hover:text-primary'><ImLinkedin2 /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ContactUs
import React from 'react'
import { Link } from 'react-router-dom'

const Error404 = () => {
    return (
        <div className="flex items-center justify-center ">
            <div className="text-center">
                <img src="../../images/404.png " width={400} alt="" />
                <h1 className="text-6xl font-bold text-gray-800">404</h1>
                <p className="mt-2 text-lg text-gray-600">Oops! The page you are looking for does not exist.</p>
                <Link to="/" className="inline-block px-6 py-3 mt-6 text-lg font-medium text-white bg-primary rounded-full">
                    Go Home
                </Link>
            </div>
        </div>
    )
}

export default Error404
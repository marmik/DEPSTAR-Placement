import React from 'react'
import App from './App.jsx'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import LoginAdmin from './pages/admin/LoginAdmin.jsx';
import FacultyDashboard from './components/FacultyDashboard.jsx';
import StudentDashboard from './components/StudentDashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';


const router = createBrowserRouter([
  {
    path: "/admin/login",
    element: <LoginAdmin/>
  },
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/Faculty/*",
    element: <FacultyDashboard/>
  },
  {
    path: "/Student/*",
    element: <StudentDashboard/>
  },
  {
    path: "/admin/dashboard/*",
    element: <AdminDashboard/>
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

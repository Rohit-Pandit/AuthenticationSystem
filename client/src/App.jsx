
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/home/Home.jsx';
import Login from './pages/login/Login.jsx';
import { ResetPassword } from './pages/resetPassword/ResetPassword.jsx';
import  EmailVerify  from './pages/emailVerify/EmailVerify.jsx';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/dashboard/Dashboard.jsx';
import Navbar from './components/navbar/Navbar.jsx';
import AddExpense from './components/AddExpense/AddExpense.jsx';



function App() {
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/email-verify" element={<EmailVerify/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/add-expense" element={<AddExpense/>} />
      </Routes>
    </div>
  )
}

export default App

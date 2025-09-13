import React from 'react';
import { FcGoogle } from "react-icons/fc";
import login from '../assets/login.png';

const Login = () => {
  const handleGoogleLogin = () => {
    // Redirect user to backend Google OAuth route
    window.location.href = 'https://crm-backend-bhuu.onrender.com/auth/google';
  };

  return (
    <div className = 'flex w-full h-screen  items-center'>
      <div className='flex flex-col items-center w-1/2 justify-center p-10 '>
      <div className=' mb-10 w-1/2 font-bold'>
        <h1>Log in to launch campaigns and track growth.
          Easily upload customer and order data, create smart segments,
          and run targeted campaigns that drive results.
          Stay in control with clear insights into past performance.
        </h1>
      </div>
      <button
        onClick={handleGoogleLogin}
        className='px-10 py-3 text-xl w-1/2 flex items-center justify-center space-x-3 cursor-pointer bg-slate-800 text-white rounded-3xl'
      >
        <FcGoogle className='w-7 h-7'/> <p>Login with Google</p>
      </button>
    </div>
    <div className='flex flex-col items-center w-1/2  justify-center '>
      <img src={login} alt="Login Illustration" className='w-full h-full'/>
    </div>
    </div>
  );
};

export default Login;

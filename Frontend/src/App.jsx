import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './Store/auth';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import CampaignHistory from './Pages/CampaignHistory';
import logo from './assets/logo.png';
import background from './assets/Background.svg';
import background1 from './assets/background1.svg';
import './App.css';
import { History, LogOut } from 'lucide-react';

const App = () => {
  const { isAuthenticated, loading, checkAuth ,logout} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) return <div className='flex items-center justify-center h-screen w-full'>
    <div class = "spinner"></div>
  </div>;

  return (
    <div >
      {
        isAuthenticated &&
        <div>
        <img
        src={background1}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
        />
        <div className='w-full h-20 bg-slate-800 flex items-center px-52 text-white justify-between'>
        <img src={logo} alt="Logo" className='h-full' />
        <button onClick={() => window.location.href = '/dashboard'} style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>CRM APP</button>
        <div className='flex items-center'>
          <button onClick={() => window.location.href = '/campaigns-history'} className='mr-10 flex flex-col items-center justify-center'>
            <History/>
            <p className='text-sm'>History</p>
          </button>
          <button onClick={logout} className='mr-10 flex flex-col items-center justify-center'>
            <LogOut/>
            <p className='text-sm'>Logout</p>
          </button>
        </div>
        </div>
      </div>
      }
      <Routes>
        <Route
          path="/"
          element={loading ? (
        <div className='flex items-center justify-center h-screen w-full'>
    <div class = "spinner"></div>
  </div>
      ) : isAuthenticated ? (
        <Navigate to="/dashboard" />
      ) : (
        <Login />
      )}
        />
        <Route
          path="/dashboard"
          element={loading ? (
        <div className='flex items-center justify-center h-screen w-full'>
    <div class = "spinner"></div>
  </div>
      ) : isAuthenticated ? (
        <Dashboard />
      ) : (
        <Navigate to="/" />
      )}
        />
        <Route
          path="/campaigns-history"
          element={loading ? (
        <div className='flex items-center justify-center h-screen w-full'>
    <div class = "spinner"></div>
  </div>
      ) : isAuthenticated ? (
        <CampaignHistory />
      ) : (
        <Navigate to="/" />
      )}
        />
      </Routes>
    </div>
  );
};

export default App;

import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import ResetPassword from '../components/ResetPassword';
import UserDetails from '../components/UserDetails';
import './App.css';
import React, { createContext, useEffect, useState } from 'react'
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { addUserDetails } from './slices/userslices';
import Home from '../components/Pages/Home';

const serverUrl = import.meta.env.VITE_SERVER_URL;
export const AppContext = createContext();

export default function App() {
    
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem('isAuthenticated') === 'true'
    );
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    
    useEffect(() => {
        axios
            .get(`${serverUrl}`, { withCredentials: true })
            .then(res => {
                setIsAuthenticated(true)
                
            })
            .catch(err => {
                // setIsAuthenticated(false)
                dispatch(addUserDetails(null));
            })
            .finally(() => setLoading(false));
    }, []);

    console.log(isAuthenticated)

    if (loading) {
    return <div className="text-center mt-10 font-semibold text-gray-600">Loading...</div>;
  }

    const allCookies = document.cookie;
    console.log(allCookies)

  return (
    <Provider store={store}>
      <AppContext.Provider value={{ setIsAuthenticated }}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
          <Route path="/login" element={isAuthenticated ? <Home /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Home /> : <SignUp />} />
          <Route path="/user" element={isAuthenticated ? <Home /> : <Login />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </AppContext.Provider>
    </Provider>
  );
}

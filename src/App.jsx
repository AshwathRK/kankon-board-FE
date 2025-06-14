import { useEffect, useState, createContext } from 'react';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import ResetPassword from '../components/ResetPassword';
import UserDetails from '../components/UserDetails';
import './App.css';

export const AppContext = createContext();

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);
    const [serverUrl] = useState('https://password-reset-qx8n.onrender.com/api');

    useEffect(() => {
        axios.get(serverUrl, {
            withCredentials: true,
        })
            .then(response => {
                if (response.data) {
                    setIsAuthenticated(true);
                    // console.log(response.data)
                    setUserData(response.data);
                } else {
                    setIsAuthenticated(false);
                    setUserData(null);
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    setIsAuthenticated(false);
                    setUserData(null);
                } else {
                    console.error("Something went wrong:", error.message);
                }
            });
    }, [serverUrl]);

    return (
        <AppContext.Provider value={{ userData, setUserData, setIsAuthenticated }}>
            <Routes>
                <Route path="/" element={isAuthenticated ? <UserDetails UserDetails={userData} /> : <Login />} />
                <Route path="/login" element={isAuthenticated ? <UserDetails UserDetails={userData} /> : <Login />} />
                <Route path="/signup" element={isAuthenticated ? <UserDetails UserDetails={userData} /> : <SignUp />} />
                <Route path="/user" element={isAuthenticated ? <UserDetails UserDetails={userData} /> : <Login />} />
                <Route path="/resetpassword" element={<ResetPassword />} />
            </Routes>
        </AppContext.Provider>
    );
}

export default App;

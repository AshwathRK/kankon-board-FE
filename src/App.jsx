import { useEffect, useState, createContext } from 'react';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import ResetPassword from '../components/ResetPassword';
import UserDetails from '../components/UserDetails';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './store';
import { addUserDetails } from './slices/userslices';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export const AppContext = createContext();

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${serverUrl}/user`, {
            withCredentials: true,
        })
            .then(response => {
                setIsAuthenticated(true);
                addUserDetails(response.data);
            })
            .catch(error => {
                setIsAuthenticated(false);
                addUserDetails(null);
                if (error.response && error.response.status !== 401) {
                    console.error("Something went wrong:", error.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="text-center mt-10 font-semibold text-gray-600">Loading...</div>;
    }

    return (
        <Provider store={store}>
            <AppContext.Provider value={{ setIsAuthenticated }}>
                <Routes>
                    <Route path="/" element={isAuthenticated ? <UserDetails /> : <Login />} />
                    <Route path="/login" element={isAuthenticated ? <UserDetails/> : <Login />} />
                    <Route path="/signup" element={isAuthenticated ? <UserDetails /> : <SignUp />} />
                    <Route path="/user" element={isAuthenticated ? <UserDetails /> : <Login />} />
                    <Route path="/resetpassword" element={<ResetPassword />} />
                    <Route path="*" element={<div>Page not found</div>} />
                </Routes>
            </AppContext.Provider>
        </Provider>
    );
}

export default App;
